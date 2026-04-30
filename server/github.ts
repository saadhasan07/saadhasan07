import type { InsertProject, Project } from "@shared/schema";
import { storage } from "./storage";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  open_graph_image_url?: string | null;
}

export interface GitHubConnectionStatus {
  username: string;
  source: "stored" | "single" | "multi" | "default";
  hasToken: boolean;
}

export type GitHubSyncMode = "all" | "portfolio-only";

const DEFAULT_GITHUB_USERNAME = "saadhasan07";
const GITHUB_ACCOUNTS_CONFIG_KEY = "config.github.accounts";
const GITHUB_SYNC_MODE_CONFIG_KEY = "config.github.syncMode";
const DEFAULT_GITHUB_SYNC_MODE: GitHubSyncMode = "all";
const AUTO_SYNC_INTERVAL_MS = 1000 * 60 * 30;
const HIDDEN_TOPICS = new Set(["hidden", "draft", "hide-from-portfolio"]);
const PORTFOLIO_TOPICS = new Set(["portfolio", "featured", "portfolio-featured"]);
let lastGitHubSyncAt = 0;

export function resolveGitHubUsername() {
  return resolveGitHubUsernames()[0] || DEFAULT_GITHUB_USERNAME;
}

export function resolveGitHubUsernames() {
  const configuredList = process.env.GITHUB_USERNAMES
    ?.split(",")
    .map((username) => username.trim())
    .filter(Boolean);

  if (configuredList && configuredList.length > 0) {
    return Array.from(new Set(configuredList));
  }

  const singleUsername = process.env.GITHUB_USERNAME?.trim();
  if (singleUsername) {
    return [singleUsername];
  }

  return [DEFAULT_GITHUB_USERNAME];
}

function normalizeGitHubUsernames(usernames: string[]) {
  return Array.from(
    new Set(
      usernames
        .map((username) => username.trim().replace(/^@/, ""))
        .filter(Boolean),
    ),
  );
}

function parseStoredGitHubAccounts(rawValue: string | null | undefined) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return normalizeGitHubUsernames(parsed.map(String));
    }
  } catch {
    return normalizeGitHubUsernames(rawValue.split(","));
  }

  return [];
}

function normalizeGitHubSyncMode(rawValue: string | null | undefined): GitHubSyncMode {
  return rawValue === "portfolio-only" ? "portfolio-only" : DEFAULT_GITHUB_SYNC_MODE;
}

export async function getManagedGitHubUsernames() {
  const configured = await storage.getTranslation(GITHUB_ACCOUNTS_CONFIG_KEY);
  const storedAccounts = parseStoredGitHubAccounts(configured?.en || configured?.de || "");

  if (storedAccounts.length > 0) {
    return {
      usernames: storedAccounts,
      source: "stored" as const,
    };
  }

  if (process.env.GITHUB_USERNAMES) {
    return {
      usernames: resolveGitHubUsernames(),
      source: "multi" as const,
    };
  }

  if (process.env.GITHUB_USERNAME) {
    return {
      usernames: resolveGitHubUsernames(),
      source: "single" as const,
    };
  }

  return {
    usernames: [DEFAULT_GITHUB_USERNAME],
    source: "default" as const,
  };
}

export async function setManagedGitHubUsernames(usernames: string[]) {
  const normalized = normalizeGitHubUsernames(usernames);
  await storage.updateTranslation(GITHUB_ACCOUNTS_CONFIG_KEY, {
    key: GITHUB_ACCOUNTS_CONFIG_KEY,
    en: JSON.stringify(normalized),
    de: JSON.stringify(normalized),
  });
  lastGitHubSyncAt = 0;
  return getManagedGitHubUsernames();
}

export async function getGitHubSyncMode() {
  const configured = await storage.getTranslation(GITHUB_SYNC_MODE_CONFIG_KEY);
  return normalizeGitHubSyncMode(configured?.en || configured?.de || "");
}

export async function setGitHubSyncMode(mode: string) {
  const normalized = normalizeGitHubSyncMode(mode);
  await storage.updateTranslation(GITHUB_SYNC_MODE_CONFIG_KEY, {
    key: GITHUB_SYNC_MODE_CONFIG_KEY,
    en: normalized,
    de: normalized,
  });
  lastGitHubSyncAt = 0;
  return normalized;
}

export async function getGitHubConnectionStatus(): Promise<GitHubConnectionStatus[]> {
  const managed = await getManagedGitHubUsernames();

  return managed.usernames.map((username) => ({
    username,
    source: managed.source,
    hasToken: Boolean(process.env.GITHUB_TOKEN),
  }));
}

export async function fetchGitHubRepositories(username: string = resolveGitHubUsername()): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-App",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`, {
      headers,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`GitHub API error for ${username}: ${response.status} ${message || response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();
    return repos.filter((repo) => {
      if (repo.fork || repo.archived) {
        return false;
      }

      return !repo.topics.some((topic) => HIDDEN_TOPICS.has(topic.toLowerCase()));
    });
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}

function shouldIncludeRepoInSync(repo: GitHubRepo, mode: GitHubSyncMode) {
  if (mode === "all") {
    return true;
  }

  const normalizedTopics = repo.topics.map((topic) => topic.toLowerCase());
  if (normalizedTopics.some((topic) => PORTFOLIO_TOPICS.has(topic))) {
    return true;
  }

  return shouldBeFeatured(repo);
}

export async function syncGitHubProjects(usernames?: string[]) {
  try {
    const managed = usernames && usernames.length > 0 ? { usernames, source: "stored" as const } : await getManagedGitHubUsernames();
    const syncMode = await getGitHubSyncMode();
    const uniqueUsernames = Array.from(new Set(managed.usernames.filter(Boolean)));
    const repoGroups = await Promise.all(uniqueUsernames.map((username) => fetchGitHubRepositories(username)));
    const repos = repoGroups.flat().filter((repo) => shouldIncludeRepoInSync(repo, syncMode));
    const existingProjects = await storage.getAllProjects();
    const existingByRepoKey = new Map(
      existingProjects
        .map((project) => [normalizeProjectRepoKey(project), project] as const)
        .filter((entry): entry is [string, Project] => !!entry[0]),
    );
    const existingByTitleKey = new Map(
      existingProjects
        .map((project) => [normalizeTitleKey(project.title), project] as const)
        .filter((entry): entry is [string, Project] => !!entry[0]),
    );
    const reusablePlaceholders = existingProjects.filter(isBlankProjectPlaceholder);

    const syncedProjects: Project[] = [];
    let nextOrder = existingProjects.reduce((max, project) => Math.max(max, project.order ?? 0), 0) + 1;

    for (const repo of repos) {
      const repoKey = normalizeRepoKey(repo.html_url);
      const titleKey = normalizeTitleKey(formatRepositoryName(repo.name));
      const existingProject =
        (repoKey ? existingByRepoKey.get(repoKey) : undefined) ||
        existingByTitleKey.get(titleKey) ||
        reusablePlaceholders.shift();

      const technologies = [
        repo.language && repo.language !== "null" ? repo.language : null,
        ...repo.topics,
      ].filter(Boolean) as string[];

      const projectData: InsertProject = {
        title: formatRepositoryName(repo.name),
        description:
          repo.description ||
          `A ${repo.language || "software"} project showcasing development skills and best practices.`,
        descriptionDe: existingProject?.descriptionDe || null,
        image: existingProject?.image || repo.open_graph_image_url || getProjectImage(repo.language, repo.topics),
        technologies: technologies.length > 0 ? technologies : ["Software Development"],
        githubUrl: repo.html_url,
        demoUrl: sanitizeHomepage(repo.homepage) || existingProject?.demoUrl || null,
        featured: existingProject ? existingProject.featured : shouldBeFeatured(repo),
        order: existingProject?.order ?? nextOrder++,
        createdAt: existingProject?.createdAt || repo.pushed_at.split("T")[0],
      };

      const syncedProject = existingProject
        ? await storage.updateProject(existingProject.id, projectData)
        : await storage.createProject(projectData);

      if (repoKey) {
        existingByRepoKey.set(repoKey, syncedProject);
      }
      existingByTitleKey.set(titleKey, syncedProject);
      syncedProjects.push(syncedProject);
    }

    lastGitHubSyncAt = Date.now();
    return syncedProjects;
  } catch (error) {
    console.error("Error syncing GitHub projects:", error);
    throw error;
  }
}

export async function syncGitHubProjectsIfNeeded(usernames?: string[]) {
  if (Date.now() - lastGitHubSyncAt < AUTO_SYNC_INTERVAL_MS) {
    return false;
  }

  await syncGitHubProjects(usernames);
  return true;
}

function shouldBeFeatured(repo: GitHubRepo): boolean {
  const importantKeywords = ["portfolio", "ci-cd", "devops", "aws", "automation", "monitor", "hash", "security"];
  const normalizedName = repo.name.toLowerCase();
  const normalizedDescription = repo.description?.toLowerCase() || "";
  const normalizedTopics = repo.topics.map((topic) => topic.toLowerCase());
  const hasImportantKeywords = importantKeywords.some(
    (keyword) =>
      normalizedName.includes(keyword) ||
      normalizedDescription.includes(keyword) ||
      normalizedTopics.some((topic) => topic.includes(keyword)),
  );

  const hasHomepage = Boolean(sanitizeHomepage(repo.homepage));
  const wasUpdatedRecently = Date.now() - new Date(repo.updated_at).getTime() < 1000 * 60 * 60 * 24 * 120;

  return hasImportantKeywords || hasHomepage || repo.stargazers_count > 0 || wasUpdatedRecently;
}

function sanitizeHomepage(homepage: string | null) {
  if (!homepage) {
    return null;
  }

  const trimmed = homepage.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed === "https://github.com" || trimmed === "http://github.com") {
    return null;
  }

  return trimmed;
}

function formatRepositoryName(name: string) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeRepoKey(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    return `${segments[0].toLowerCase()}/${segments[1].replace(/\.git$/, "").toLowerCase()}`;
  } catch {
    return null;
  }
}

function normalizeTitleKey(title: string | null | undefined) {
  if (!title) {
    return null;
  }

  const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized || null;
}

function normalizeProjectRepoKey(project: Project) {
  return normalizeRepoKey(project.githubUrl);
}

function isBlankProjectPlaceholder(project: Project) {
  return !project.title && !project.description && !project.githubUrl;
}

function getProjectImage(language: string | null, topics: string[]): string {
  if (language === "TypeScript" || topics.includes("typescript")) {
    return "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
  }
  if (language === "Python" || topics.includes("python")) {
    return "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
  }
  if (language === "JavaScript" || topics.includes("javascript")) {
    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
  }
  if (topics.includes("devops") || topics.includes("ci-cd")) {
    return "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
  }
  if (topics.includes("documentation") || language === "TeX") {
    return "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
  }

  return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
}
