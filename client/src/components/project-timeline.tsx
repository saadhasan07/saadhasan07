import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Code, ExternalLink, Github, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useProjects } from "@/hooks/useStaticData";
import type { Project } from "@shared/schema";
import { useState } from "react";

export default function ProjectTimeline() {
  const { t, language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: projects = [], isLoading } = useProjects();

  // Group projects by year (using order field as fallback for dates)
  const projectsByYear = projects.reduce((acc: Record<number, Project[]>, project: Project) => {
    // Use createdAt if available, otherwise use current year
    const year = project.createdAt ? new Date(project.createdAt).getFullYear() : 2024;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(project);
    return acc;
  }, {});

  // Get years in descending order
  const years = Object.keys(projectsByYear).map(Number).sort((a: number, b: number) => b - a);

  // Filter projects by selected year
  const filteredProjects = selectedYear
    ? projectsByYear[selectedYear] || []
    : projects.sort((a: Project, b: Project) => b.order - a.order);

  if (isLoading) {
    return (
      <section id="projects" className="section-padding bg-card">
        <div className="container-width">
          <div className="text-center mb-16">
            <div className="h-10 bg-muted rounded skeleton mx-auto mb-4 max-w-md"></div>
            <div className="h-6 bg-muted rounded skeleton mx-auto max-w-2xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded skeleton"></div>
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("projects.title", "Projects")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("projects.description", "A selection of projects I've worked on, showcasing different skills and technologies.")}
          </p>
        </div>

        {years.length > 1 && (
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button
              variant={selectedYear === null ? "default" : "outline"}
              onClick={() => setSelectedYear(null)}
            >
              All Projects
            </Button>
            {years.map((year: number) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: Project, index: number) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-300 border border-border/20 bg-card/50 backdrop-blur-sm">
              {project.image && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge variant="default" className="bg-primary/bg-primary text-primary-foreground">
                      <Star size={12} className="mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Github size={16} />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  ;
}