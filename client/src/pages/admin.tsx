import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Github, RefreshCw, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { apiRequest } from "@/lib/api";
import type { Project, BlogPost, Talk, InsertProject, InsertBlogPost, InsertTalk } from "@shared/schema";

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGitHubSyncing, setIsGitHubSyncing] = useState(false);
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Fetch data - always called, but only fetches when authenticated
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    enabled: isAuthenticated,
  });

  const { data: talks = [] } = useQuery<Talk[]>({
    queryKey: ["/api/talks"],
    enabled: isAuthenticated,
  });

  // All mutations must be declared before any conditional returns
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      window.location.href = "/admin/login";
    },
  });

  // GitHub sync mutation
  const syncGitHubMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/sync-github");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "GitHub Sync Complete",
        description: "Projects have been synced from your GitHub repositories.",
      });
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync GitHub repositories. Please check your GitHub token.",
        variant: "destructive",
      });
    },
  });

  // All other mutations and handlers must be declared here too
  const handleGitHubSync = async () => {
    setIsGitHubSyncing(true);
    try {
      await syncGitHubMutation.mutateAsync();
    } finally {
      setIsGitHubSyncing(false);
    }
  };

  // Conditional returns AFTER all hooks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-green-600 dark:text-green-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAdminAuth will handle redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-green-600 dark:text-green-300">
              Manage your portfolio content, sync GitHub projects, and update blog posts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="talks">Talks</TabsTrigger>
            <TabsTrigger value="github">GitHub Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsManager projects={projects} />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager blogPosts={blogPosts} />
          </TabsContent>

          <TabsContent value="talks">
            <TalksManager talks={talks} />
          </TabsContent>

          <TabsContent value="github">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sync your latest GitHub repositories to automatically update your projects section.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={handleGitHubSync}
                    disabled={isGitHubSyncing}
                    className="prominent-button"
                  >
                    {isGitHubSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync GitHub Projects
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
                    How GitHub Sync Works:
                  </h4>
                  <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
                    <li>• Fetches your public repositories from GitHub</li>
                    <li>• Automatically creates project entries for new repositories</li>
                    <li>• Updates existing projects with latest information</li>
                    <li>• Marks featured projects based on stars and activity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProjectsManager({ projects }: { projects: Project[] }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">
          Manage Projects
        </h2>
        <Button onClick={() => setShowAddForm(true)} className="prominent-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showAddForm && (
        <ProjectForm
          onClose={() => setShowAddForm(false)}
          onSave={() => setShowAddForm(false)}
        />
      )}

      {editingProject && (
        <ProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={() => setEditingProject(null)}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-green-800 dark:text-green-400">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-green-600 dark:text-green-300 mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingProject(project)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
  onSave,
}: {
  project?: Project;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    technologies: project?.technologies.join(", ") || "",
    githubUrl: project?.githubUrl || "",
    demoUrl: project?.demoUrl || "",
    featured: project?.featured || false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully" });
      onSave();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertProject>) => {
      const response = await apiRequest("PATCH", `/api/projects/${project!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully" });
      onSave();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (project) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              type="url"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="prominent-button">
              {project ? "Update" : "Create"} Project
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function BlogManager({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">
          Manage Blog Posts
        </h2>
        <Button className="prominent-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Blog Post
        </Button>
      </div>
      <div className="text-center py-8 text-green-600 dark:text-green-400">
        Blog management features coming soon...
      </div>
    </div>
  );
}

function TalksManager({ talks }: { talks: Talk[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">
          Manage Talks
        </h2>
        <Button className="prominent-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Talk
        </Button>
      </div>
      <div className="text-center py-8 text-green-600 dark:text-green-400">
        Talks management features coming soon...
      </div>
    </div>
  );
}