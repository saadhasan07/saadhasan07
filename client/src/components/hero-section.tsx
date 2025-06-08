import { Button } from "@/components/ui/button";
import { Download, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { SiXing } from "react-icons/si";
import { useLanguage } from "@/hooks/use-language";
import { useProfile } from "@/hooks/useStaticData";
import { apiRequest } from "@/lib/api";
import avatarImage from "@assets/Saad Hasan avatar.jpg";
import zenBackground from "@assets/zen header.webp";

export default function HeroSection() {
  const { t, language } = useLanguage();
  const { data: profile, isLoading } = useProfile();

  const handleDownloadCV = async () => {
    try {
      const response = await apiRequest("GET", `/api/cv/${language}`);
      const data = await response.json();
      if (data.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.download = language === 'de' ? "Saad-Hasan-CV-German.docx" : "Saad-Hasan-CV-English.docx";
        link.click();
      }
    } catch (error) {
      console.error("Failed to download CV:", error);
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialLinks = [
    { icon: Github, href: profile?.github, label: "GitHub" },
    { icon: Linkedin, href: profile?.linkedin, label: "LinkedIn" },
    { icon: SiXing, href: profile?.xing, label: "XING" },
  ];

  if (isLoading) {
    return (
      <section id="about" className="section-padding academic-gradient">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-12 bg-muted rounded mb-6"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-20 bg-muted rounded mb-8"></div>
                <div className="flex gap-4">
                  <div className="h-12 w-32 bg-muted rounded"></div>
                  <div className="h-12 w-32 bg-muted rounded"></div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-muted rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section id="about" className="section-padding academic-gradient">
        <div className="container-width text-center">
          <p className="text-muted-foreground">Unable to load profile information.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Zen bamboo background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${zenBackground})`,
        }}
      ></div>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent dark:from-black/60 dark:via-black/40 dark:to-transparent"></div>
      
      <div className="container-width relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Content */}
          <div className="order-2 lg:order-1 slide-up">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white/90">{t("hero.greeting")}</span>
              <br />
              <span className="text-white font-bold">{profile.name}</span>
            </h1>

            <h2 className="text-xl lg:text-2xl text-white/80 mb-6 font-light">
              {profile.title}
            </h2>

            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              {profile.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button onClick={handleDownloadCV} className="secondary-button">
                <Download className="w-5 h-5" />
                {t("hero.downloadCV")}
              </Button>

              <Button onClick={scrollToContact} className="prominent-button">
                <Mail className="w-5 h-5" />
                {t("hero.contact")}
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return social.href ? (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-10 h-10 p-0 bg-muted hover:bg-accent hover:text-academic-blue transition-all duration-200"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  </Button>
                ) : null;
              })}
            </div>
          </div>

          {/* Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end fade-in">
            <div className="relative mt-32 lg:mt-40">
              <img
                src={avatarImage}
                alt={`${profile.name} - Professional Profile Photo`}
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl object-cover shadow-2xl border-4 border-card"
                style={{ objectPosition: "center 40%" }}
              />

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
