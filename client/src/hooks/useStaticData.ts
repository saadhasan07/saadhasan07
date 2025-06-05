import { useQuery } from "@tanstack/react-query";
import { staticProfile, staticProjects, staticExperiences, staticBlogPosts, staticTalks } from "../data/staticData";
import type { Profile, Project, Experience, BlogPost, Talk } from "@shared/schema";

// Hook to use static data when running on GitHub Pages  
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["/api/profile"],
    queryFn: async () => {
      if (isGitHubPages) {
        return staticProfile;
      }
      // Original API call for Replit deployment
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error('Failed to fetch profile');
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
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    retry: false,
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ["/api/projects/featured"],
    queryFn: () => {
      if (isGitHubPages) {
        return Promise.resolve(staticProjects.filter(p => p.featured));
      }
      return fetch("/api/projects/featured").then(res => res.json());
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
      return fetch("/api/experiences").then(res => res.json());
    },
    retry: false,
  });
}

export function useFeaturedBlogPosts() {
  return useQuery({
    queryKey: ["/api/blog/featured"],
    queryFn: () => {
      if (isGitHubPages) {
        return Promise.resolve(staticBlogPosts.filter(p => p.featured));
      }
      return fetch("/api/blog/featured").then(res => res.json());
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
      return fetch("/api/talks").then(res => res.json());
    },
    retry: false,
  });
}