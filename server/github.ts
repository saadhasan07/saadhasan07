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

const DEFAULT_GITHUB_USERNAME = "saadhasan07";
const AUTO_SYNC_INTERVAL_MS = 1000 * 60 * 30;
const HIDDEN_TOPICS = new Set(["hidden", "draft", "hide-from-portfolio"]);
let lastGitHubSyncAt = 0;

export function resolveGitHubUsername() {
  return process.env.GITHUB_USERNAME || DEFAULT_GITHUB_USERNAME;
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
      throw new Error(`GitHub API error: ${response.status} ${message || response.statusText}`);
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

export async function syncGitHubProjects(username: string = resolveGitHubUsername()) {
  try {
    const repos = await fetchGitHubRepositories(username);
    const existingProjects = await storage.getAllProjects();
    const existingByGitHubUrl = new Map(
      existingProjects
        .filter((project) => !!project.githubUrl)
        .map((project) => [project.githubUrl as string, project]),
    );

    const syncedProjects: Project[] = [];
    let nextOrder = existingProjects.reduce((max, project) => Math.max(max, project.order ?? 0), 0) + 1;

    for (const repo of repos) {
      const existingProject = existingByGitHubUrl.get(repo.html_url);
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
        image: repo.open_graph_image_url || existingProject?.image || getProjectImage(repo.language, repo.topics),
        technologies: technologies.length > 0 ? technologies : ["Software Development"],
        githubUrl: repo.html_url,
        demoUrl: sanitizeHomepage(repo.homepage) || existingProject?.demoUrl || null,
        featured: existingProject ? existingProject.featured : shouldBeFeatured(repo),
        order: existingProject?.order ?? nextOrder++,
        createdAt: existingProject?.createdAt || repo.pushed_at.split("T")[0],
      };

      if (existingProject) {
        const updatedProject = await storage.updateProject(existingProject.id, projectData);
        syncedProjects.push(updatedProject);
      } else {
        const createdProject = await storage.createProject(projectData);
        syncedProjects.push(createdProject);
      }
    }

    lastGitHubSyncAt = Date.now();
    return syncedProjects;
  } catch (error) {
    console.error("Error syncing GitHub projects:", error);
    throw error;
  }
}

export async function syncGitHubProjectsIfNeeded(username: string = resolveGitHubUsername()) {
  if (Date.now() - lastGitHubSyncAt < AUTO_SYNC_INTERVAL_MS) {
    return false;
  }

  await syncGitHubProjects(username);
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
