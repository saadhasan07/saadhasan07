import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Container, 
  Database, 
  GitBranch, 
  Monitor, 
  Shield, 
  Terminal, 
  Zap,
  Award,
  Code,
  Server,
  Settings
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function SkillsSection() {
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t("skills.cloudInfra"),
      icon: Cloud,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      skills: [
        "AWS Cloud Practitioner Certified",
        "Microsoft Azure",
        "Cloud Computing Architecture",
        "Infrastructure as Code (IaC)",
        "Terraform",
        "Ansible"
      ]
    },
    {
      title: t("skills.devopsCicd"),
      icon: GitBranch,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      skills: [
        "Jenkins",
        "GitHub Actions",
        "CI/CD Pipelines",
        "DevOps Methodology",
        "Agile Development with Scrum",
        "Version Control with Git"
      ]
    },
    {
      title: t("skills.containerization"),
      icon: Container,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      skills: [
        "Docker",
        "Kubernetes",
        "Container Orchestration",
        "Microservices Architecture",
        "Container Security",
        "Pod Management"
      ]
    },
    {
      title: t("skills.programming"),
      icon: Code,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      skills: [
        "Python Programming",
        "JavaScript (Node.js)",
        "React Development",
        "HTML5 & CSS3",
        "API Design with Postman",
        "Web Application Development"
      ]
    },
    {
      title: t("skills.monitoring"),
      icon: Monitor,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      skills: [
        "Grafana",
        "Prometheus",
        "Observability & Analysis",
        "Unit Testing with Jest",
        "Test Automation with Selenium",
        "ISTQB CTFL Certified"
      ]
    },
    {
      title: t("skills.databases"),
      icon: Terminal,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      skills: [
        "Linux Administration",
        "Network Configuration",
        "Database Management",
        "Cybersecurity",
        "HTTP Server Management",
        "System Optimization"
      ]
    }
  ];

  const certifications = [
    {
      title: "Expert Cloud & Web Development",
      issuer: "Techstarter GmbH",
      date: "October 2024",
      hours: "1700+ Hours",
      icon: Award
    },
    {
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
      icon: Cloud
    },
    {
      title: "ISTQB CTFL",
      issuer: "International Software Testing Qualifications Board",
      date: "2024",
      icon: Shield
    }
  ];

  return (
    <section id="skills" className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
            {t("skills.title")}
          </h2>
          <p className="text-lg text-green-600 dark:text-green-300 max-w-2xl mx-auto">
            {t("skills.description")}
          </p>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-8 text-center">
            {t("skills.certification")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">{cert.title}</h4>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">{cert.issuer}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{cert.date}</p>
                    {cert.hours && (
                      <Badge variant="secondary" className="mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                        {cert.hours}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="text-sm text-green-600 dark:text-green-400">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Training Summary */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Settings className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-400">{t("skills.trainingTitle")}</h3>
              </div>
              <p className="text-green-600 dark:text-green-400 max-w-3xl mx-auto leading-relaxed">
                {t("skills.trainingDescription")}
              </p>
              <div className="flex justify-center gap-4 mt-6 flex-wrap">
                <Badge variant="outline" className="px-4 py-2 text-green-700 dark:text-green-400 border-green-700 dark:border-green-400">
                  <Server className="w-4 h-4 mr-2 text-green-700 dark:text-green-400" />
                  {t("skills.foundations")}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-green-700 dark:text-green-400 border-green-700 dark:border-green-400">
                  <Code className="w-4 h-4 mr-2 text-green-700 dark:text-green-400" />
                  {t("skills.development")}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-green-700 dark:text-green-400 border-green-700 dark:border-green-400">
                  <Cloud className="w-4 h-4 mr-2 text-green-700 dark:text-green-400" />
                  {t("skills.devopsSpec")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}