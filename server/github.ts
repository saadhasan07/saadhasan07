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

export async function fetchGitHubRepositories(username: string): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is required");
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Filter out forks and archived repos, focus on original projects
    return repos.filter(repo => !repo.fork && !repo.archived);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}

export async function syncGitHubProjects(username: string) {
  try {
    console.log(`Fetching repositories for ${username}...`);
    const repos = await fetchGitHubRepositories(username);
    
    console.log(`Found ${repos.length} repositories`);

    // Clear existing projects to resync
    await db.delete(projects);

    // Convert GitHub repos to our project format
    const projectsData = repos.map((repo, index) => {
      // Determine technologies based on language and topics
      const technologies = [
        repo.language && repo.language !== 'null' ? repo.language : null,
        ...repo.topics
      ].filter(Boolean) as string[];

      return {
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || `A ${repo.language || 'software'} project showcasing development skills and best practices.`,
        image: getProjectImage(repo.language, repo.topics),
        technologies: technologies.length > 0 ? technologies : ['Software Development'],
        githubUrl: repo.html_url,
        demoUrl: repo.homepage || null,
        featured: shouldBeFeatured(repo),
        order: index + 1,
      };
    });

    // Insert projects into database
    if (projectsData.length > 0) {
      await db.insert(projects).values(projectsData);
      console.log(`Synced ${projectsData.length} projects to database`);
    }

    return projectsData;
  } catch (error) {
    console.error("Error syncing GitHub projects:", error);
    throw error;
  }
}

function shouldBeFeatured(repo: GitHubRepo): boolean {
  // Feature projects that have stars, recent activity, or specific keywords
  const importantKeywords = ['portfolio', 'ci-cd', 'devops', 'aws', 'automation', 'monitor'];
  const hasImportantKeywords = importantKeywords.some(keyword => 
    repo.name.toLowerCase().includes(keyword) || 
    repo.description?.toLowerCase().includes(keyword) ||
    repo.topics.some(topic => topic.includes(keyword))
  );
  
  return hasImportantKeywords || repo.stargazers_count > 0;
}

function getProjectImage(language: string | null, topics: string[]): string {
  // Return appropriate unsplash images based on technology
  if (language === 'TypeScript' || topics.includes('typescript')) {
    return 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  }
  if (language === 'Python' || topics.includes('python')) {
    return 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  }
  if (language === 'JavaScript' || topics.includes('javascript')) {
    return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  }
  if (topics.includes('devops') || topics.includes('ci-cd')) {
    return 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  }
  if (topics.includes('documentation') || language === 'TeX') {
    return 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  }
  
  // Default tech image
  return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
}