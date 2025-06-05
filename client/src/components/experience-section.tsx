import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api";
import type { Experience } from "@shared/schema";

export default function ExperienceSection() {
  const { t } = useLanguage();

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/experiences");
      return response.json();
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "education":
        return "bg-blue-500";
      case "work":
        return "bg-green-500";
      case "project":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "education":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "work":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "project":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <section id="experience" className="section-padding bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 skeleton rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 skeleton rounded w-96 mx-auto"></div>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative flex items-center md:justify-center">
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 skeleton rounded-full" style={{animationDelay: `${i * 0.2}s`}}></div>
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-1/2'}`}>
                    <Card className="skeleton-wave relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-6 w-16 skeleton rounded-full" style={{animationDelay: `${i * 0.2 + 0.1}s`}}></div>
                        </div>
                        <div className="h-6 skeleton rounded mb-2" style={{animationDelay: `${i * 0.2 + 0.2}s`}}></div>
                        <div className="h-5 skeleton rounded w-3/4 mb-2" style={{animationDelay: `${i * 0.2 + 0.3}s`}}></div>
                        <div className="h-4 skeleton rounded w-1/2 mb-3" style={{animationDelay: `${i * 0.2 + 0.4}s`}}></div>
                        <div className="space-y-2">
                          <div className="h-4 skeleton rounded" style={{animationDelay: `${i * 0.2 + 0.5}s`}}></div>
                          <div className="h-4 skeleton rounded w-5/6" style={{animationDelay: `${i * 0.2 + 0.6}s`}}></div>
                          <div className="h-4 skeleton rounded w-4/5" style={{animationDelay: `${i * 0.2 + 0.7}s`}}></div>
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
    <section id="experience" className="section-padding bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
            {t("experience.title")}
          </h2>
          <p className="text-lg text-green-600 dark:text-green-400 max-w-2xl mx-auto">
            {t("experience.description")}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className={`relative flex items-center md:justify-center ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 ${getTypeColor(experience.type)} rounded-full border-4 border-background z-10`}></div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="mb-2">
                        <Badge className={`text-xs font-medium ${getTypeBadgeColor(experience.type)}`}>
                          {experience.current ? t("experience.current") : t(`experience.${experience.type}`)}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                        {experience.organization}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                        {experience.startDate}
                        {experience.endDate && ` - ${experience.endDate}`}
                        {experience.current && ` - ${t("experience.present")}`}
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-sm leading-relaxed">
                        {experience.description}
                      </p>
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
