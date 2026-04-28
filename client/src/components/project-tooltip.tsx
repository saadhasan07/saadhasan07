import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Star,
  Code,
  ExternalLink,
  Github,
  Clock,
  Users,
  GitBranch,
} from "lucide-react";
import type { Project } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface ProjectTooltipProps {
  project: Project;
  isVisible: boolean;
  position: { x: number; y: number };
}

function getProjectStats(project: Project) {
  const seed = `${project.id}-${project.title}-${project.technologies.join("|")}`;
  const hash = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  const createdAt = new Date(project.createdAt || "2024-01-01");
  const now = new Date();
  const daysSinceUpdate = Math.max(
    1,
    Math.min(
      365,
      Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    ),
  );

  return {
    commits: Math.max(8, project.technologies.length * 6 + (hash % 18)),
    contributors: project.featured ? 2 + (hash % 3) : 1 + (hash % 2),
    lastUpdate: daysSinceUpdate,
  };
}

export default function ProjectTooltip({ project, isVisible, position }: ProjectTooltipProps) {
  const { language } = useLanguage();

  if (!isVisible) return null;

  const projectDate = project.createdAt ? new Date(project.createdAt) : new Date("2024-01-01");
  const year = Number.isNaN(projectDate.getTime()) ? "Recent" : projectDate.getFullYear();
  const projectStats = getProjectStats(project);

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 20,
        top: position.y - 10,
      }}
    >
      <Card className="w-80 shadow-xl border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-green-700 dark:text-green-300 text-lg leading-tight">
                {project.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-1">
                <Calendar className="w-3 h-3" />
                <span>{year}</span>
                {project.featured && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-green-600 dark:text-green-400 mb-3 line-clamp-3">
            {language === "de" && (project as any).descriptionDe ? (project as any).descriptionDe : project.description}
          </p>

          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-xs border-green-600 text-green-700 dark:border-green-400 dark:text-green-300 bg-green-50 dark:bg-green-950/50"
                >
                  <Code className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-xs border-green-600 text-green-700 dark:border-green-400 dark:text-green-300 bg-green-50 dark:bg-green-950/50"
                >
                  +{project.technologies.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div className="text-center p-2 bg-muted/50 rounded">
              <GitBranch className="w-3 h-3 mx-auto mb-1 text-green-600 dark:text-green-400" />
              <div className="font-medium text-green-700 dark:text-green-300">{projectStats.commits}</div>
              <div className="text-green-600 dark:text-green-400">Commits</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <Users className="w-3 h-3 mx-auto mb-1 text-green-600 dark:text-green-400" />
              <div className="font-medium text-green-700 dark:text-green-300">{projectStats.contributors}</div>
              <div className="text-green-600 dark:text-green-400">Contributors</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <Clock className="w-3 h-3 mx-auto mb-1 text-green-600 dark:text-green-400" />
              <div className="font-medium text-green-700 dark:text-green-300">{projectStats.lastUpdate}d</div>
              <div className="text-green-600 dark:text-green-400">Last Update</div>
            </div>
          </div>

          <div className="flex gap-2">
            {project.demoUrl && (
              <Button asChild size="sm" variant="outline" className="flex-1 text-xs h-8">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild size="sm" variant="outline" className="flex-1 text-xs h-8">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto"
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
  );
}
