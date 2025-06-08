import { Button } from "@/components/ui/button";
import { Download, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { SiXing } from "react-icons/si";
import { useLanguage } from "@/hooks/use-language";
import { useProfile } from "@/hooks/useStaticData";
import avatarImage from "@assets/Saad Hasan avatar.jpg";
import zenBackground from "@assets/zen header.webp";

export default function HeroSection() {
  const { t, language } = useLanguage();
  const { data: profile, isLoading } = useProfile();

  const handleDownloadCV = async () => {
    // For GitHub Pages, download fallback
    const isGitHubPages = window.location.hostname.includes('github.io');
    if (isGitHubPages) {
      const link = document.createElement("a");
      link.href = language === 'de' ? 
        "/attached_assets/Saad-Hasan-CV-German.docx" : 
        "/attached_assets/Saad-Hasan-CV-English.docx";
      link.download = language === 'de' ? "Saad-Hasan-CV-German.docx" : "Saad-Hasan-CV-English.docx";
      link.click();
      return;
    }
    
    // For Replit, use API
    try {
      const response = await fetch(`/api/cv/${language}`);
      const data = await response.json();
      if (data.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.download = language === 'de' ? "Saad-Hasan-CV-German.docx" : "Saad-Hasan-CV-English.docx";
        link.click();
      }
    } catch (error) {
      console.error("Failed to download CV", error);
    }
  ;

  if (isLoading) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-card">
        <div className="container-width relative z-10 flex flex-col items-center text-center py-24 px-8 sm:px-16 lg:px-24">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-muted rounded-full skeleton mx-auto mb-4"></div>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-10 bg-muted rounded skeleton mb-4"></div>
            <div className="h-6 bg-muted rounded skeleton mb-4"></div>
            <div className="h-4 bg-muted rounded skeleton mb-6"></div>
            <div className="flex flex-wrap gap-3 justify-center">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 w-16 bg-muted rounded skeleton"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-card">
      <div className="container-width relative z-10 flex flex-col items-center text-center py-24 px-8 sm:px-16 lg:px-24">
        <div className="relative mb-8">
          <img
            src={avatarImage}
            alt={profile.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-primary mx-auto mb-4 shadow-lg"
          />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium uppercase letter-spacing-wide tracking-wide mb-2">
              {t("hero.greeting", "Hello, I'm")}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
              {profile.name}
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-primary mb-6">
              {profile.title}
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
            {profile.bio}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {profile.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-foreground bg-primary/10 rounded-full border border-primary/20"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Button onClick={handleDownloadCV} className="flex items-center gap-2">
              <Download size={16} />
              {t("cv.download", "Download CV")}
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:contact@saadhasan.dev" className="flex items-center gap-2">
                <Mail size={16} />
                {t("contact.mail", "Contact me")}
              </a>
            </Button>
          </div>
          <div className="flex gap-4 justify-center">
            {profile.github && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={20} />
                </a>
              </Button>
            )}
            {profile.linkedin && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
}