import { useQuery } from "@tanstack/react-query";
import { staticProfile, staticProjects, staticExperiences, staticBlogPosts, staticTalks } from "../data/staticData";
import type { Profile, Project, Experience, BlogPost, Talk } from "@shared/schema";

const GITHUB_USERNAME = "saadhasan07";

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

// Hook to use static data when running on GitHub Pages
const isGitHubPages = typeof window !== "undefined" && window.location.hostname.includes("github.io");

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["/api/profile"],
    queryFn: async () => {
      if (isGitHubPages) {
        return staticProfile;
      }
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    retry: false,
  });
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      if (isGitHubPages) {
        return staticProjects;
      }

      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const baseProjects = (await res.json()) as Project[];

      try {
        const githubRepos = await fetchGitHubRepositories();
        return mergeProjectsWithGitHub(baseProjects, githubRepos);
      } catch {
        return filterValidProjects(baseProjects);
      }
    },
    retry: false,
  });
}

export function useFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
    queryFn: async () => {
      if (isGitHubPages) {
        return staticProjects.filter((project) => project.featured);
      }

      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const baseProjects = (await res.json()) as Project[];

      try {
        const githubRepos = await fetchGitHubRepositories();
        return mergeProjectsWithGitHub(baseProjects, githubRepos).filter((project) => project.featured);
      } catch {
        return filterValidProjects(baseProjects).filter((project) => project.featured);
      }
    },
    retry: false,
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ["/api/experiences"],
    queryFn: () => {
      if (isGitHubPages) {
        return Promise.resolve(staticExperiences);
      }
      return fetch("/api/experiences").then((res) => res.json());
    },
    retry: false,
  });
}

export function useFeaturedBlogPosts() {
  return useQuery({
    queryKey: ["/api/blog/featured"],
    queryFn: () => {
      if (isGitHubPages) {
        return Promise.resolve(staticBlogPosts.filter((post) => post.featured));
      }
      return fetch("/api/blog/featured").then((res) => res.json());
    },
    retry: false,
  });
}

export function useTalks() {
  return useQuery({
    queryKey: ["/api/talks"],
    queryFn: () => {
      if (isGitHubPages) {
        return Promise.resolve(staticTalks);
      }
      return fetch("/api/talks").then((res) => res.json());
    },
    retry: false,
  });
}

async function fetchGitHubRepositories(): Promise<GitHubRepo[]> {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`);
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  const repos = (await response.json()) as GitHubRepo[];
  return repos.filter((repo) => !repo.fork && !repo.archived);
}

function mergeProjectsWithGitHub(baseProjects: Project[], repos: GitHubRepo[]) {
  const validBaseProjects = filterValidProjects(baseProjects);
  const byRepoKey = new Map(
    validBaseProjects
      .map((project) => [normalizeRepoKey(project.githubUrl), project] as const)
      .filter((entry): entry is [string, Project] => !!entry[0]),
  );
  const byTitleKey = new Map(
    validBaseProjects
      .map((project) => [normalizeTitleKey(project.title), project] as const)
      .filter((entry): entry is [string, Project] => !!entry[0]),
  );

  const mergedProjects = [...validBaseProjects];
  let nextId = validBaseProjects.reduce((max, project) => Math.max(max, project.id), 0) + 1;
  let nextOrder = validBaseProjects.reduce((max, project) => Math.max(max, project.order ?? 0), 0) + 1;

  for (const repo of repos) {
    const repoKey = normalizeRepoKey(repo.html_url);
    const title = formatRepositoryName(repo.name);
    const titleKey = normalizeTitleKey(title);
    const existingProject =
      (repoKey ? byRepoKey.get(repoKey) : undefined) ||
      byTitleKey.get(titleKey);

    const mergedProject = buildProjectFromRepo(repo, existingProject, existingProject?.id ?? nextId++, existingProject?.order ?? nextOrder++);

    if (existingProject) {
      const index = mergedProjects.findIndex((project) => project.id === existingProject.id);
      if (index >= 0) {
        mergedProjects[index] = mergedProject;
      }
    } else {
      mergedProjects.push(mergedProject);
    }

    if (repoKey) {
      byRepoKey.set(repoKey, mergedProject);
    }
    byTitleKey.set(titleKey, mergedProject);
  }

  return mergedProjects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function buildProjectFromRepo(repo: GitHubRepo, existingProject: Project | undefined, id: number, order: number): Project {
  const technologies = [repo.language, ...repo.topics].filter(Boolean) as string[];
  return {
    id,
    title: formatRepositoryName(repo.name),
    description:
      existingProject?.description ||
      repo.description ||
      `A ${repo.language || "software"} project showcasing development skills and best practices.`,
    descriptionDe: existingProject?.descriptionDe ?? null,
    image: existingProject?.image || getProjectImage(repo.language, repo.topics),
    technologies: technologies.length > 0 ? technologies : ["Software Development"],
    githubUrl: repo.html_url,
    demoUrl: sanitizeHomepage(repo.homepage) || existingProject?.demoUrl || null,
    featured: existingProject?.featured ?? shouldBeFeatured(repo),
    order,
    createdAt: existingProject?.createdAt || repo.pushed_at.split("T")[0],
  };
}

function filterValidProjects(projects: Project[]) {
  return projects.filter((project) => Boolean(project.title && project.description && project.githubUrl));
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

function sanitizeHomepage(homepage: string | null) {
  if (!homepage) {
    return null;
  }

  const trimmed = homepage.trim();
  return trimmed || null;
}

function formatRepositoryName(name: string) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function getProjectImage(language: string | null, topics: string[]) {
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
  if (language === "HTML" || topics.includes("html") || topics.includes("github-pages")) {
    return "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
  }

  return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
}
