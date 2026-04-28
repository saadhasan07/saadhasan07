import type { Project } from "@shared/schema";

function normalizeGitHubRepo(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    return {
      owner: segments[0],
      repo: segments[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export function getProjectPreviewImage(project: Project) {
  const repo = project.githubUrl ? normalizeGitHubRepo(project.githubUrl) : null;

  if (repo) {
    return `https://opengraph.githubassets.com/1/${repo.owner}/${repo.repo}`;
  }

  return project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
}
