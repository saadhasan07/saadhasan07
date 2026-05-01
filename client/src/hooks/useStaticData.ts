import { useQuery } from "@tanstack/react-query";
import { staticProfile, staticProjects, staticExperiences, staticBlogPosts, staticTalks } from "../data/staticData";
import type { Profile, Project, Experience, BlogPost, Talk } from "@shared/schema";

const isGitHubPages = typeof window !== "undefined" && window.location.hostname.includes("github.io");

async function fetchPortfolioResource<T>(path: string, fallback: T, errorMessage: string): Promise<T> {
  if (isGitHubPages) {
    return fallback;
  }

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["/api/profile"],
    queryFn: () => fetchPortfolioResource("/api/profile", staticProfile, "Failed to fetch profile"),
    retry: false,
  });
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetchPortfolioResource("/api/projects", staticProjects, "Failed to fetch projects"),
    retry: false,
  });
}

export function useFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
    queryFn: () =>
      fetchPortfolioResource(
        "/api/projects/featured",
        staticProjects.filter((project) => project.featured),
        "Failed to fetch featured projects",
      ),
    retry: false,
  });
}

export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
    queryFn: () =>
      fetchPortfolioResource("/api/experiences", staticExperiences, "Failed to fetch experiences"),
    retry: false,
  });
}

export function useFeaturedBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ["/api/blog/featured"],
    queryFn: () =>
      fetchPortfolioResource(
        "/api/blog/featured",
        staticBlogPosts.filter((post) => post.featured),
        "Failed to fetch featured blog posts",
      ),
    retry: false,
  });
}

export function useTalks() {
  return useQuery<Talk[]>({
    queryKey: ["/api/talks"],
    queryFn: () => fetchPortfolioResource("/api/talks", staticTalks, "Failed to fetch talks"),
    retry: false,
  });
}
