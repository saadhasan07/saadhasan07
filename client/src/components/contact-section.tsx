import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api";
import type { Profile } from "@shared/schema";

export default function ContactSection() {
  const { t } = useLanguage();

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/profile");
      return response.json();
    },
  });

  const socialLinks = [
    {
      icon: Github,
      href: profile?.github,
      label: "GitHub",
      color: "hover:text-gray-600 dark:hover:text-gray-400"
    },
    {
      icon: Linkedin,
      href: profile?.linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-600 dark:hover:text-blue-400"
    },
    {
      icon: Twitter,
      href: profile?.twitter,
      label: "Twitter",
      color: "hover:text-blue-500 dark:hover:text-blue-400"
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: t("contact.email"),
      value: profile?.email,
      href: profile?.email ? `mailto:${profile.email}` : undefined,
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      value: profile?.phone,
      href: profile?.phone ? `tel:${profile.phone}` : undefined,
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      value: profile?.location,
      href: undefined,
    },
  ];

  if (isLoading) {
    return (
      <section id="contact" className="section-padding bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-10 bg-muted rounded w-48 mx-auto mb-8 animate-pulse"></div>
          <div className="h-24 bg-muted rounded mb-12 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-5 bg-muted rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section id="contact" className="section-padding bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-green-600 dark:text-green-400">Unable to load contact information.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-400 mb-8">
          {t("contact.title")}
        </h2>
        <p className="text-lg text-green-600 dark:text-green-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t("contact.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div key={method.title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">{method.title}</h3>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium"
                  >
                    {method.value}
                  </a>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-medium">{method.value}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return social.href ? (
              <Button
                key={social.label}
                variant="ghost"
                size="sm"
                asChild
                className={`w-12 h-12 p-0 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 transition-all duration-200 ${social.color}`}
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              </Button>
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}
