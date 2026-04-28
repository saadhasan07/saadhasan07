import { eq } from "drizzle-orm";
import { db } from "./db";
import { projects } from "@shared/schema";

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
}

const DEFAULT_GITHUB_USERNAME = "saadhasan07";
const AUTO_SYNC_INTERVAL_MS = 1000 * 60 * 60;
let lastGitHubSyncAt = 0;

export function resolveGitHubUsername() {
  return process.env.GITHUB_USERNAME || DEFAULT_GITHUB_USERNAME;
}

export async function fetchGitHubRepositories(username: string = resolveGitHubUsername()): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is required");
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();
    return repos.filter((repo) => !repo.fork && !repo.archived);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}

export async function syncGitHubProjects(username: string = resolveGitHubUsername()) {
  try {
    const repos = await fetchGitHubRepositories(username);
    const existingProjects = await db.select().from(projects);
    const existingByGitHubUrl = new Map(
      existingProjects
        .filter((project) => !!project.githubUrl)
        .map((project) => [project.githubUrl as string, project]),
    );

    const syncedProjects = [];
    let nextOrder = existingProjects.reduce((max, project) => Math.max(max, project.order ?? 0), 0) + 1;

    for (const repo of repos) {
      const existingProject = existingByGitHubUrl.get(repo.html_url);
      const technologies = [
        repo.language && repo.language !== "null" ? repo.language : null,
        ...repo.topics,
      ].filter(Boolean) as string[];

      const projectData = {
        title: formatRepositoryName(repo.name),
        description:
          repo.description ||
          `A ${repo.language || "software"} project showcasing development skills and best practices.`,
        descriptionDe: existingProject?.descriptionDe || null,
        image: existingProject?.image || getProjectImage(repo.language, repo.topics),
        technologies: technologies.length > 0 ? technologies : ["Software Development"],
        githubUrl: repo.html_url,
        demoUrl: repo.homepage || existingProject?.demoUrl || null,
        featured: existingProject ? existingProject.featured : shouldBeFeatured(repo),
        order: existingProject?.order ?? nextOrder++,
        createdAt: existingProject?.createdAt || repo.pushed_at.split("T")[0],
      };

      if (existingProject) {
        const [updatedProject] = await db
          .update(projects)
          .set(projectData)
          .where(eq(projects.id, existingProject.id))
          .returning();
        syncedProjects.push(updatedProject);
      } else {
        const [createdProject] = await db.insert(projects).values(projectData).returning();
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
  if (!process.env.GITHUB_TOKEN) {
    return false;
  }

  if (Date.now() - lastGitHubSyncAt < AUTO_SYNC_INTERVAL_MS) {
    return false;
  }

  await syncGitHubProjects(username);
  return true;
}

function shouldBeFeatured(repo: GitHubRepo): boolean {
  const importantKeywords = ["portfolio", "ci-cd", "devops", "aws", "automation", "monitor"];
  const hasImportantKeywords = importantKeywords.some(
    (keyword) =>
      repo.name.toLowerCase().includes(keyword) ||
      repo.description?.toLowerCase().includes(keyword) ||
      repo.topics.some((topic) => topic.includes(keyword)),
  );

  return hasImportantKeywords || repo.stargazers_count > 0;
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
