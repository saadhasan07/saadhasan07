import { useLanguage } from "@/hooks/use-language";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { id: "about", label: t("nav.about") },
    { id: "projects", label: t("nav.projects") },
    { id: "experience", label: t("nav.experience") },
    { id: "blog", label: t("nav.blog") },
    { id: "talks", label: t("nav.talks") },
    { id: "contact", label: t("nav.contact") },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container-width">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Saad Hasan. {t("footer.rights")}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              {quickLinks.slice(0, 3).map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-muted-foreground hover:text-academic-blue text-sm transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/admin"
                className="text-muted-foreground hover:text-academic-blue text-sm transition-colors duration-200"
                title="Admin Dashboard"
              >
                Admin
              </a>
            </div>
            
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-academic-blue"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
