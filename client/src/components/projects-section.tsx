import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useProjects } from "@/hooks/useStaticData";
import { getProjectPreviewImage } from "@/lib/project-preview";
import type { Project } from "@shared/schema";
import ProjectTooltip from "@/components/project-tooltip";
import { useState } from "react";

export default function ProjectsSection() {
  const { t, language } = useLanguage();
  const [tooltip, setTooltip] = useState<{
    project: Project;
    position: { x: number; y: number };
  } | null>(null);

  const { data: projects = [], isLoading } = useProjects();

  const handleMouseEnter = (project: Project, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      project,
      position: {
        x: rect.right,
        y: rect.top,
      },
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const scrollToProjectJourney = () => {
    const element = document.getElementById("project-journey");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="section-padding bg-card">
        <div className="container-width">
          <div className="text-center mb-16">
            <div className="h-10 skeleton rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 skeleton rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="relative flex h-full flex-col overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden skeleton-card skeleton-wave"></div>
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-3 h-6 rounded skeleton" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  <div className="mb-4 space-y-2">
                    <div className="h-4 rounded skeleton" style={{ animationDelay: `${i * 0.1 + 0.1}s` }}></div>
                    <div className="h-4 w-4/5 rounded skeleton" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}></div>
                    <div className="h-4 w-3/5 rounded skeleton" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}></div>
                  </div>
                  <div className="mb-4 flex gap-2">
                    <div className="h-6 w-16 rounded-full skeleton" style={{ animationDelay: `${i * 0.1 + 0.4}s` }}></div>
                    <div className="h-6 w-20 rounded-full skeleton" style={{ animationDelay: `${i * 0.1 + 0.5}s` }}></div>
                    <div className="h-6 w-14 rounded-full skeleton" style={{ animationDelay: `${i * 0.1 + 0.6}s` }}></div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="h-10 w-full rounded skeleton" style={{ animationDelay: `${i * 0.1 + 0.7}s` }}></div>
                    <div className="h-10 w-full rounded skeleton" style={{ animationDelay: `${i * 0.1 + 0.8}s` }}></div>
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
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-green-800 dark:text-green-400 lg:text-4xl">
            {t("projects.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-green-600 dark:text-green-300">
            {t("projects.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="card-hover group flex h-full flex-col overflow-hidden cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(project, e)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getProjectPreviewImage(project)}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {project.githubUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="absolute right-4 top-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 text-xl font-bold text-green-800 transition-colors group-hover:text-green-600 dark:text-green-400 dark:group-hover:text-green-300">
                  {project.title}
                </h3>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-green-600 dark:text-green-400">
                  {language === "de" && (project as any).descriptionDe ? (project as any).descriptionDe : project.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="badge bg-green-100 text-xs text-green-700 transition-all duration-300 dark:bg-green-900/30 dark:text-green-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  {project.demoUrl && (
                    <Button asChild size="sm" className="project-card-button prominent-button">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 shrink-0 transition-transform group-hover:scale-110" />
                        {t("projects.liveDemo")}
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild variant="secondary" size="sm" className="project-card-button secondary-button">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 shrink-0 transition-transform group-hover:scale-110" />
                        {t("projects.viewCode")}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            className="group text-green-700 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
            onClick={scrollToProjectJourney}
          >
            {t("projects.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <ProjectTooltip
        project={tooltip?.project as Project}
        isVisible={!!tooltip}
        position={tooltip?.position || { x: 0, y: 0 }}
      />
    </section>
  );
}
