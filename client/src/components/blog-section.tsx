import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api";
import type { BlogPost, Talk } from "@shared/schema";

export default function BlogSection() {
  const { t } = useLanguage();

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/featured"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/blog/featured");
      return response.json();
    },
  });

  const { data: talks = [], isLoading: talksLoading } = useQuery<Talk[]>({
    queryKey: ["/api/talks"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/talks");
      return response.json();
    },
  });

  const isLoading = blogLoading || talksLoading;

  if (isLoading) {
    return (
      <section id="blog" className="section-padding bg-card">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Blog Posts Loading */}
            <div>
              <div className="h-8 skeleton rounded w-48 mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-border pb-6">
                    <div className="h-6 skeleton rounded mb-2" style={{animationDelay: `${i * 0.15}s`}}></div>
                    <div className="space-y-2 mb-3">
                      <div className="h-4 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.1}s`}}></div>
                      <div className="h-4 skeleton rounded w-5/6" style={{animationDelay: `${i * 0.15 + 0.2}s`}}></div>
                      <div className="h-4 skeleton rounded w-4/5" style={{animationDelay: `${i * 0.15 + 0.3}s`}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 skeleton rounded w-32" style={{animationDelay: `${i * 0.15 + 0.4}s`}}></div>
                      <div className="h-8 w-20 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.5}s`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Talks Loading */}
            <div>
              <div className="h-8 skeleton rounded w-48 mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="skeleton-wave relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 skeleton rounded" style={{animationDelay: `${i * 0.15}s`}}></div>
                        <div className="h-6 skeleton rounded flex-1" style={{animationDelay: `${i * 0.15 + 0.1}s`}}></div>
                      </div>
                      <div className="h-5 skeleton rounded w-3/4 mb-2" style={{animationDelay: `${i * 0.15 + 0.2}s`}}></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.3}s`}}></div>
                        <div className="h-4 skeleton rounded w-4/5" style={{animationDelay: `${i * 0.15 + 0.4}s`}}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 skeleton rounded w-20" style={{animationDelay: `${i * 0.15 + 0.5}s`}}></div>
                        <div className="h-8 w-24 skeleton rounded" style={{animationDelay: `${i * 0.15 + 0.6}s`}}></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="section-padding bg-card">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Blog Posts */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-green-800 dark:text-green-400 mb-8">
              {t("blog.recentPosts")}
            </h2>

            <div className="space-y-6">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <article key={post.id} className="border-b border-border pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                      <a href={post.url || "#"} className="flex items-center group">
                        {post.title}
                        <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </h3>
                    <p className="text-green-600 dark:text-green-400 text-sm mb-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                      <span>{post.publishedAt}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-green-600 dark:text-green-400">No blog posts available.</p>
              )}
            </div>

            <div className="mt-8">
              <Button variant="ghost" className="group text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300">
                {t("blog.viewAll")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Talks Section */}
          <div id="talks">
            <h2 className="text-2xl lg:text-3xl font-bold text-green-800 dark:text-green-400 mb-8">
              {t("talks.title")}
            </h2>

            <div className="space-y-6">
              {talks.length > 0 ? (
                talks.map((talk) => (
                  <Card key={talk.id} className="card-hover">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                        {talk.title}
                      </h3>
                      <p className="text-green-600 dark:text-green-400 font-medium text-sm mb-2">
                        {talk.event}
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-sm mb-3 leading-relaxed">
                        {talk.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {talk.date}
                        </span>
                        <div className="flex items-center space-x-2">
                          {talk.slidesUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={talk.slidesUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                <span className="text-xs">{t("talks.viewSlides")}</span>
                              </a>
                            </Button>
                          )}
                          {talk.videoUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={talk.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                <span className="text-xs">{t("talks.watchVideo")}</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-green-600 dark:text-green-400">No talks available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
