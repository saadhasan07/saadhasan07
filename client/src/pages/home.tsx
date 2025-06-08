import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import ProjectTimeline from "@/components/project-timeline";
import SkillsSection from "@/components/skills-section";
import ExperienceSection from "@/components/experience-section";
import BlogSection from "@/components/blog-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-[65px]">
        <HeroSection />
        <ProjectsSection />
        <ProjectTimeline />
        <SkillsSection />
        <ExperienceSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
