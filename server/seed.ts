import { db } from "./db";
import { profiles, projects, experiences, blogPosts, talks } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database with initial data...");

  try {
    // Insert profile data
    await db.insert(profiles).values({
      name: "Saad Hasan",
      title: "DevOps & Cloud Computing Professional",
      bio: "Motivated DevOps and Cloud Computing professional with a strong foundation in CI/CD pipelines, automation scripting, and infrastructure monitoring. AWS Certified Cloud Practitioner and Scrum Fundamentals Certified. Passionate about building scalable solutions, enhancing system reliability, and driving agile project execution.",
      image: "/attached_assets/Saad%20Hasan%20avatar.jpg",
      email: "saadhasan077@gmail.com",
      phone: "+4917622359115",
      location: "Oststraße 17, 09212 Limbach-Oberfrohna, Germany",
      github: "https://github.com/saadhasan07",
      linkedin: null,
      twitter: null,
      cvEnglish: "/assets/cv/Saad_Hasan_CV_Final_English.pdf",
      cvGerman: "/assets/cv/Saad_Hasan_CV_Final_Deutsch.pdf",
    }).onConflictDoUpdate({
      target: profiles.id,
      set: {
        email: "saadhasan077@gmail.com",
        phone: "+4917622359115",
        location: "Oststraße 17, 09212 Limbach-Oberfrohna, Germany",
        github: "https://github.com/saadhasan07",
      }
    });

    // Insert DevOps projects
    await db.insert(projects).values([
      {
        title: "CI/CD Pipeline Monitor",
        description: "Full-stack application to monitor CI/CD pipeline builds and deployments in real time. Built with TypeScript for enhanced type safety and better development experience.",
        image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["TypeScript", "CI/CD", "DevOps", "Monitoring"],
        githubUrl: "https://github.com/saadhasan07/CICD_Pipeline_Monitor",
        demoUrl: null,
        featured: true,
        order: 1,
      },
      {
        title: "Total Battle Scanner",
        description: "Automation tool to scan in-game resources with customizable filters and thresholds. Demonstrates automation scripting capabilities with Python.",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["Python", "Automation", "Scripting", "Image Processing"],
        githubUrl: "https://github.com/saadhasan07/total-battle-scanner",
        demoUrl: null,
        featured: true,
        order: 2,
      },
      {
        title: "Gaming Profile App",
        description: "Responsive web application for managing and showcasing dynamic gaming profiles. Built with modern JavaScript and responsive design principles.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["JavaScript", "HTML", "CSS", "Web Development"],
        githubUrl: "https://github.com/saadhasan07/Gaming-Profile-App",
        demoUrl: null,
        featured: true,
        order: 3,
      },
      {
        title: "Resume and Portfolio",
        description: "Professional CV and portfolio template optimized for technical job applications. Created with LaTeX for precise formatting and professional presentation.",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["LaTeX", "Documentation", "Professional Templates"],
        githubUrl: "https://github.com/saadhasan07/Resume-and-Porfolio",
        demoUrl: null,
        featured: false,
        order: 4,
      },
    ]).onConflictDoNothing();

    // Insert professional experiences (only relevant technical/educational background)
    await db.insert(experiences).values([
      {
        title: "DevOps and Cloud Computing Training",
        organization: "Techstarter GmbH München",
        description: "Intensive courses focusing on DevOps practices, CI/CD pipelines, automation scripting, AWS cloud fundamentals, and infrastructure monitoring concepts.",
        startDate: "September 2023",
        endDate: null,
        type: "education",
        current: true,
        order: 1,
      },
      {
        title: "Bachelor of Commerce (B.Com)",
        organization: "Dhadabhoy University, Karachi",
        description: "Completed Bachelor's degree with GPA 1.7, specializing in Management and Economics with focus on Logistics. Strong foundation in business processes and organizational management.",
        startDate: "March 2012",
        endDate: "July 2014",
        type: "education",
        current: false,
        order: 2,
      },
    ]).onConflictDoNothing();

    // Insert DevOps-focused blog posts
    await db.insert(blogPosts).values([
      {
        title: "Implementing CI/CD Pipelines with Best Practices",
        excerpt: "A comprehensive guide to setting up robust CI/CD pipelines focusing on automation, testing, and deployment strategies for modern DevOps workflows.",
        content: null,
        publishedAt: "December 15, 2024",
        readTime: "8 min read",
        url: null,
        featured: true,
      },
      {
        title: "AWS Cloud Infrastructure Monitoring and Optimization",
        excerpt: "Learn effective strategies for monitoring cloud infrastructure, implementing cost optimization, and ensuring system reliability in AWS environments.",
        content: null,
        publishedAt: "November 28, 2024",
        readTime: "6 min read",
        url: null,
        featured: true,
      },
    ]).onConflictDoNothing();

    // Insert professional talks
    await db.insert(talks).values([
      {
        title: "DevOps Fundamentals and Best Practices",
        event: "Techstarter GmbH Training Session",
        description: "Presented core DevOps concepts including CI/CD implementation, infrastructure automation, and monitoring strategies to fellow trainees.",
        date: "November 2024",
        slidesUrl: null,
        videoUrl: null,
      },
      {
        title: "AWS Cloud Services Overview",
        event: "Internal Training Workshop",
        description: "Delivered comprehensive overview of AWS cloud services, focusing on practical applications for DevOps and infrastructure management.",
        date: "October 2024",
        slidesUrl: null,
        videoUrl: null,
      },
    ]).onConflictDoNothing();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seedDatabase().catch(console.error);