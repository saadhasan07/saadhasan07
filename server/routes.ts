import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProjectSchema,
  insertExperienceSchema,
  insertBlogPostSchema,
  insertTalkSchema,
} from "@shared/schema";
import {
  resolveGitHubUsername,
  syncGitHubProjects,
  syncGitHubProjectsIfNeeded,
} from "./github";
import {
  requireAdminAuth,
  adminLogin,
  adminLogout,
  checkAdminAuth,
} from "./auth-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  const githubUsername = resolveGitHubUsername();

  const tryAutoSyncProjects = async () => {
    try {
      await syncGitHubProjectsIfNeeded(githubUsername);
    } catch (error) {
      console.error("Background GitHub sync error:", error);
    }
  };

  const handleGitHubSync = async (_req: Request, res: Response) => {
    try {
      const result = await syncGitHubProjects(githubUsername);
      res.json({ message: "GitHub projects synced successfully", result });
    } catch (error) {
      console.error("GitHub sync error:", error);
      res.status(500).json({
        message: "Failed to sync GitHub projects",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleProjectUpdate = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateProject(id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  };

  app.post("/api/admin/login", adminLogin);
  app.post("/api/admin/logout", adminLogout);
  app.get("/api/admin/auth", checkAdminAuth);

  app.use("/api/admin", requireAdminAuth);
  app.use("/admin", requireAdminAuth);

  app.get("/api/profile", async (_req, res) => {
    try {
      const profile = await storage.getProfile();
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", requireAdminAuth, async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/projects", async (_req, res) => {
    try {
      await tryAutoSyncProjects();
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (_req, res) => {
    try {
      await tryAutoSyncProjects();
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", requireAdminAuth, handleProjectUpdate);
  app.patch("/api/projects/:id", requireAdminAuth, handleProjectUpdate);

  app.delete("/api/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.get("/api/experiences", async (_req, res) => {
    try {
      const experiences = await storage.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.get("/api/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.getExperience(id);
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.post("/api/experiences", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.put("/api/experiences/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.updateExperience(id, req.body);
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to update experience" });
    }
  });

  app.delete("/api/experiences/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteExperience(id);
      if (!deleted) {
        return res.status(404).json({ message: "Experience not found" });
      }
      res.json({ message: "Experience deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  app.post("/api/admin/sync-github", handleGitHubSync);

  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/featured", async (_req, res) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.put("/api/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.get("/api/talks", async (_req, res) => {
    try {
      const talks = await storage.getAllTalks();
      res.json(talks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch talks" });
    }
  });

  app.get("/api/talks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const talk = await storage.getTalk(id);
      if (!talk) {
        return res.status(404).json({ message: "Talk not found" });
      }
      res.json(talk);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch talk" });
    }
  });

  app.post("/api/talks", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertTalkSchema.parse(req.body);
      const talk = await storage.createTalk(validatedData);
      res.status(201).json(talk);
    } catch (error) {
      res.status(400).json({ message: "Invalid talk data" });
    }
  });

  app.put("/api/talks/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const talk = await storage.updateTalk(id, req.body);
      res.json(talk);
    } catch (error) {
      res.status(500).json({ message: "Failed to update talk" });
    }
  });

  app.delete("/api/talks/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTalk(id);
      if (!deleted) {
        return res.status(404).json({ message: "Talk not found" });
      }
      res.json({ message: "Talk deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete talk" });
    }
  });

  app.get("/api/translations", async (_req, res) => {
    try {
      const translations = await storage.getAllTranslations();
      res.json(translations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.get("/api/translations/:key", async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const translation = await storage.getTranslation(key);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translation" });
    }
  });

  app.put("/api/translations/:key", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const translation = await storage.updateTranslation(key, req.body);
      res.json(translation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update translation" });
    }
  });

  app.get("/api/cv/:language", async (req: Request, res: Response) => {
    try {
      const language = req.params.language;
      const profile = await storage.getProfile();
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      const cvUrl = language === "de" ? profile.cvGerman : profile.cvEnglish;
      if (!cvUrl) {
        return res.status(404).json({ message: "CV not found for this language" });
      }
      res.json({ url: cvUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV" });
    }
  });

  app.post("/api/sync-github", requireAdminAuth, handleGitHubSync);

  const httpServer = createServer(app);
  return httpServer;
}
