import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import ProjectTimeline from "@/components/project-timeline";
import SkillsSection from "@/components/skills-section";
import ExperienceSection from "@/components/experience-section";
import BlogSection from "@/components/blog-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import AdminFab from "@/components/admin-fab";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24">
        <HeroSection />
        <ProjectsSection />
        <ProjectTimeline />
        <SkillsSection />
        <ExperienceSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <AdminFab />
    </div>
  );
}
