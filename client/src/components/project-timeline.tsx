import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Code, ExternalLink, Github, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api";
import type { Project } from "@shared/schema";
import { useState } from "react";

export default function ProjectTimeline() {
  const { t, language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/projects");
      return response.json();
    },
  });

  // Group projects by year (using order field as fallback for dates)
  const projectsByYear = projects.reduce((acc, project) => {
    // Use createdAt if available, otherwise use current year
    const year = (project as any).createdAt ? new Date((project as any).createdAt).getFullYear() : 2024;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(project);
    return acc;
  }, {} as Record<number, Project[]>);

  const years = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const filteredProjects = selectedYear 
    ? projectsByYear[selectedYear] || []
    : projects.sort((a, b) => {
        const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
        const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
        return dateB - dateA;
      });

  if (isLoading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-width">
          <div className="text-center mb-16">
            <div className="h-10 skeleton rounded w-80 mx-auto mb-4"></div>
            <div className="h-6 skeleton rounded w-96 mx-auto"></div>
          </div>
          
          {/* Year filters skeleton */}
          <div className="flex justify-center gap-2 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-16 skeleton rounded" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>

          {/* Timeline skeleton */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 skeleton rounded-full z-10" style={{animationDelay: `${i * 0.15}s`}}></div>
                  <div className={`w-1/2 ${i % 2 === 0 ? 'pr-8' : 'pl-8 ml-1/2'}`}>
                    <Card className="skeleton-wave relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className="h-6 skeleton rounded mb-2" style={{animationDelay: `${i * 0.15 + 0.1}s`}}></div>
                        <div className="h-4 skeleton rounded w-2/3 mb-4" style={{animationDelay: `${i * 0.15 + 0.2}s`}}></div>
                        <div className="space-y-2 mb-4">
                          <div className="h-4 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.3}s`}}></div>
                          <div className="h-4 skeleton rounded w-4/5" style={{animationDelay: `${i * 0.15 + 0.4}s`}}></div>
                        </div>
                        <div className="flex gap-2 mb-4">
                          <div className="h-6 w-16 skeleton rounded-full" style={{animationDelay: `${i * 0.15 + 0.5}s`}}></div>
                          <div className="h-6 w-20 skeleton rounded-full" style={{animationDelay: `${i * 0.15 + 0.6}s`}}></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-24 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.7}s`}}></div>
                          <div className="h-8 w-20 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.8}s`}}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
            {t("timeline.title")}
          </h2>
          <p className="text-lg text-green-600 dark:text-green-300 max-w-2xl mx-auto">
            {t("timeline.description")}
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          <Button
            variant={selectedYear === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedYear(null)}
            className={selectedYear === null ? "prominent-button" : "secondary-button"}
          >
            {t("timeline.allYears")}
          </Button>
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className={selectedYear === year ? "prominent-button" : "secondary-button"}
            >
              {year}
            </Button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
          
          <div className="space-y-12">
            {filteredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              const projectDate = (project as any).createdAt ? new Date((project as any).createdAt) : new Date();
              const year = projectDate.getFullYear();

              return (
                <div key={project.id} className="relative timeline-item" style={{animationDelay: `${index * 0.1}s`}}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10 timeline-dot"></div>
                  
                  {/* Project card */}
                  <div className={`w-1/2 ${isEven ? 'pr-8' : 'pl-8 ml-1/2'}`}>
                    <Card className="timeline-card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6">
                        {/* Date badge */}
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{year}</span>
                          {project.featured && (
                            <Badge variant="secondary" className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Project title */}
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                          {project.title}
                        </h3>

                        {/* Project description */}
                        <p className="text-green-600 dark:text-green-400 mb-4 text-sm leading-relaxed">
                          {language === 'de' && (project as any).descriptionDe ? (project as any).descriptionDe : project.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs border-green-600 text-green-700 dark:border-green-400 dark:text-green-300 bg-green-50 dark:bg-green-950/50">
                              <Code className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="outline" className="text-xs border-green-600 text-green-700 dark:border-green-400 dark:text-green-300 bg-green-50 dark:bg-green-950/50">
                              +{project.technologies.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {project.demoUrl && (
                            <Button asChild size="sm" className="flex-1 text-xs prominent-button">
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Demo
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button asChild size="sm" className="flex-1 text-xs secondary-button">
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="w-3 h-3 mr-1" />
                                Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found for the selected year.</p>
          </div>
        )}
      </div>
    </section>
  );
}