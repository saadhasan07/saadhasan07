import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api";
import type { Project } from "@shared/schema";
import ProjectTooltip from "@/components/project-tooltip";
import { useState, useRef } from "react";

export default function ProjectsSection() {
  const { t, language } = useLanguage();
  const [tooltip, setTooltip] = useState<{
    project: Project;
    position: { x: number; y: number };
  } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/projects");
      return response.json();
    },
  });

  const handleMouseEnter = (project: Project, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      project,
      position: {
        x: rect.right,
        y: rect.top
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  if (isLoading) {
    return (
      <section id="projects" className="section-padding bg-card">
        <div className="container-width">
          <div className="text-center mb-16">
            <div className="h-10 skeleton rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 skeleton rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden relative">
                <div className="w-full h-48 skeleton-card skeleton-wave relative overflow-hidden"></div>
                <CardContent className="p-6">
                  <div className="h-6 skeleton rounded mb-3" style={{animationDelay: `${i * 0.1}s`}}></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 skeleton rounded" style={{animationDelay: `${i * 0.1 + 0.1}s`}}></div>
                    <div className="h-4 skeleton rounded w-4/5" style={{animationDelay: `${i * 0.1 + 0.2}s`}}></div>
                    <div className="h-4 skeleton rounded w-3/5" style={{animationDelay: `${i * 0.1 + 0.3}s`}}></div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 skeleton rounded-full" style={{animationDelay: `${i * 0.1 + 0.4}s`}}></div>
                    <div className="h-6 w-20 skeleton rounded-full" style={{animationDelay: `${i * 0.1 + 0.5}s`}}></div>
                    <div className="h-6 w-14 skeleton rounded-full" style={{animationDelay: `${i * 0.1 + 0.6}s`}}></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 flex-1 skeleton rounded" style={{animationDelay: `${i * 0.1 + 0.7}s`}}></div>
                    <div className="h-10 flex-1 skeleton rounded" style={{animationDelay: `${i * 0.1 + 0.8}s`}}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-card">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
            {t("projects.title")}
          </h2>
          <p className="text-lg text-green-600 dark:text-green-300 max-w-2xl mx-auto">
            {t("projects.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden card-hover group cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(project, e)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                <img
                  src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.githubUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-green-600 dark:text-green-400 mb-4 text-sm leading-relaxed">
                  {language === 'de' && (project as any).descriptionDe ? (project as any).descriptionDe : project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge key={tech} variant="secondary" className="text-xs badge transition-all duration-300 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" style={{animationDelay: `${index * 0.1}s`}}>
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-3">
                  {project.demoUrl && (
                    <Button asChild size="sm" className="flex-1 text-xs prominent-button">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 mr-1 transition-transform group-hover:scale-110" />
                        {t("projects.liveDemo")}
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild variant="secondary" size="sm" className="flex-1 text-xs secondary-button">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-3 h-3 mr-1 transition-transform group-hover:scale-110" />
                        {t("projects.viewCode")}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Button variant="ghost" className="group text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300">
            {t("projects.viewAll")}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Project Tooltip */}
      <ProjectTooltip
        project={tooltip?.project as Project}
        isVisible={!!tooltip}
        position={tooltip?.position || { x: 0, y: 0 }}
      />
    </section>
  );
}
