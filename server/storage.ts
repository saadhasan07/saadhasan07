import { 
  profiles, 
  projects, 
  experiences, 
  blogPosts, 
  talks, 
  translations,
  type Profile, 
  type InsertProfile,
  type Project, 
  type InsertProject,
  type Experience, 
  type InsertExperience,
  type BlogPost, 
  type InsertBlogPost,
  type Talk, 
  type InsertTalk,
  type Translation, 
  type InsertTranslation
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Add a logger for database errors
const logDbError = (method: string, error: any) => {
  console.error(`Database error in ${method}:`, error);
};

export interface IStorage {
  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<boolean>;

  // Experience methods
  getAllExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: number): Promise<boolean>;

  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Talk methods
  getAllTalks(): Promise<Talk[]>;
  getTalk(id: number): Promise<Talk | undefined>;
  createTalk(talk: InsertTalk): Promise<Talk>;
  updateTalk(id: number, talk: Partial<InsertTalk>): Promise<Talk>;
  deleteTalk(id: number): Promise<boolean>;

  // Translation methods
  getAllTranslations(): Promise<Translation[]>;
  getTranslation(key: string): Promise<Translation | undefined>;
  updateTranslation(key: string, translation: Partial<InsertTranslation>): Promise<Translation>;
}

export class DatabaseStorage implements IStorage {
  private fallbackStorage: MemStorage;
  
  constructor() {
    this.fallbackStorage = new MemStorage();
  }
  
  async getProfile(): Promise<Profile | undefined> {
    try {
      const [profile] = await db.select().from(profiles).limit(1);
      return profile || undefined;
    } catch (error) {
      logDbError("getProfile", error);
      return this.fallbackStorage.getProfile();
    }
  }

  async updateProfile(insertProfile: InsertProfile): Promise<Profile> {
    try {
      const existingProfile = await this.getProfile();
      
      if (existingProfile) {
        const [updated] = await db
          .update(profiles)
          .set(insertProfile)
          .where(eq(profiles.id, existingProfile.id))
          .returning();
        return updated;
      } else {
        const [created] = await db
          .insert(profiles)
          .values(insertProfile)
          .returning();
        return created;
      }
    } catch (error) {
      logDbError("updateProfile", error);
      return this.fallbackStorage.updateProfile(insertProfile);
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects).orderBy(projects.order);
    } catch (error) {
      logDbError("getAllProjects", error);
      return this.fallbackStorage.getAllProjects();
    }
  }

  async getFeaturedProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.order);
    } catch (error) {
      logDbError("getFeaturedProjects", error);
      return this.fallbackStorage.getFeaturedProjects();
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project || undefined;
    } catch (error) {
      logDbError("getProject", error);
      return this.fallbackStorage.getProject(id);
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const [created] = await db.insert(projects).values(project).returning();
      return created;
    } catch (error) {
      logDbError("createProject", error);
      return this.fallbackStorage.createProject(project);
    }
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    try {
      const [updated] = await db
        .update(projects)
        .set(project)
        .where(eq(projects.id, id))
        .returning();
      if (!updated) throw new Error("Project not found");
      return updated;
    } catch (error) {
      logDbError("updateProject", error);
      return this.fallbackStorage.updateProject(id, project);
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      const result = await db.delete(projects).where(eq(projects.id, id));
      return result.rowCount > 0;
    } catch (error) {
      logDbError("deleteProject", error);
      return this.fallbackStorage.deleteProject(id);
    }
  }

  async getAllExperiences(): Promise<Experience[]> {
    try {
      return await db.select().from(experiences).orderBy(experiences.order);
    } catch (error) {
      logDbError("getAllExperiences", error);
      return this.fallbackStorage.getAllExperiences();
    }
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    try {
      const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
      return experience || undefined;
    } catch (error) {
      logDbError("getExperience", error);
      return this.fallbackStorage.getExperience(id);
    }
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    try {
      const [created] = await db.insert(experiences).values(experience).returning();
      return created;
    } catch (error) {
      logDbError("createExperience", error);
      return this.fallbackStorage.createExperience(experience);
    }
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience> {
    try {
      const [updated] = await db
        .update(experiences)
        .set(experience)
        .where(eq(experiences.id, id))
        .returning();
      if (!updated) throw new Error("Experience not found");
      return updated;
    } catch (error) {
      logDbError("updateExperience", error);
      return this.fallbackStorage.updateExperience(id, experience);
    }
  }

  async deleteExperience(id: number): Promise<boolean> {
    try {
      const result = await db.delete(experiences).where(eq(experiences.id, id));
      return result.rowCount > 0;
    } catch (error) {
      logDbError("deleteExperience", error);
      return this.fallbackStorage.deleteExperience(id);
    }
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).orderBy(blogPosts.publishedAt);
    } catch (error) {
      logDbError("getAllBlogPosts", error);
      return this.fallbackStorage.getAllBlogPosts();
    }
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).where(eq(blogPosts.featured, true)).orderBy(blogPosts.publishedAt);
    } catch (error) {
      logDbError("getFeaturedBlogPosts", error);
      return this.fallbackStorage.getFeaturedBlogPosts();
    }
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post || undefined;
    } catch (error) {
      logDbError("getBlogPost", error);
      return this.fallbackStorage.getBlogPost(id);
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const [created] = await db.insert(blogPosts).values(post).returning();
      return created;
    } catch (error) {
      logDbError("createBlogPost", error);
      return this.fallbackStorage.createBlogPost(post);
    }
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    try {
      const [updated] = await db
        .update(blogPosts)
        .set(post)
        .where(eq(blogPosts.id, id))
        .returning();
      if (!updated) throw new Error("Blog post not found");
      return updated;
    } catch (error) {
      logDbError("updateBlogPost", error);
      return this.fallbackStorage.updateBlogPost(id, post);
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return result.rowCount > 0;
    } catch (error) {
      logDbError("deleteBlogPost", error);
      return this.fallbackStorage.deleteBlogPost(id);
    }
  }

  async getAllTalks(): Promise<Talk[]> {
    try {
      return await db.select().from(talks).orderBy(talks.date);
    } catch (error) {
      logDbError("getAllTalks", error);
      return this.fallbackStorage.getAllTalks();
    }
  }

  async getTalk(id: number): Promise<Talk | undefined> {
    try {
      const [talk] = await db.select().from(talks).where(eq(talks.id, id));
      return talk || undefined;
    } catch (error) {
      logDbError("getTalk", error);
      return this.fallbackStorage.getTalk(id);
    }
  }

  async createTalk(talk: InsertTalk): Promise<Talk> {
    try {
      const [created] = await db.insert(talks).values(talk).returning();
      return created;
    } catch (error) {
      logDbError("createTalk", error);
      return this.fallbackStorage.createTalk(talk);
    }
  }

  async updateTalk(id: number, talk: Partial<InsertTalk>): Promise<Talk> {
    try {
      const [updated] = await db
        .update(talks)
        .set(talk)
        .where(eq(talks.id, id))
        .returning();
      if (!updated) throw new Error("Talk not found");
      return updated;
    } catch (error) {
      logDbError("updateTalk", error);
      return this.fallbackStorage.updateTalk(id, talk);
    }
  }

  async deleteTalk(id: number): Promise<boolean> {
    try {
      const result = await db.delete(talks).where(eq(talks.id, id));
      return result.rowCount > 0;
    } catch (error) {
      logDbError("deleteTalk", error);
      return this.fallbackStorage.deleteTalk(id);
    }
  }

  async getAllTranslations(): Promise<Translation[]> {
    try {
      return await db.select().from(translations);
    } catch (error) {
      logDbError("getAllTranslations", error);
      return this.fallbackStorage.getAllTranslations();
    }
  }

  async getTranslation(key: string): Promise<Translation | undefined> {
    try {
      const [translation] = await db.select().from(translations).where(eq(translations.key, key));
      return translation || undefined;
    } catch (error) {
      logDbError("getTranslation", error);
      return this.fallbackStorage.getTranslation(key);
    }
  }

  async updateTranslation(key: string, translation: Partial<InsertTranslation>): Promise<Translation> {
    try {
      const existing = await this.getTranslation(key);
      
      if (existing) {
        const [updated] = await db
          .update(translations)
          .set(translation)
          .where(eq(translations.key, key))
          .returning();
        return updated;
      } else {
        const [created] = await db
          .insert(translations)
          .values({ key, ...translation } as InsertTranslation)
          .returning();
        return created;
      }
    } catch (error) {
      logDbError("updateTranslation", error);
      return this.fallbackStorage.updateTranslation(key, translation);
    }
  }
}

export class MemStorage implements IStorage {
  private profile: Profile | null = null;
  private projects: Map<number, Project> = new Map();
  private experiences: Map<number, Experience> = new Map();
  private blogPosts: Map<number, BlogPost> = new Map();
  private talks: Map<number, Talk> = new Map();
  private translations: Map<string, Translation> = new Map();
  private currentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with actual profile data
    this.profile = {
      id: 1,
      name: "Saad Hasan",
      title: "DevOps & Cloud Computing Professional",
      bio: "Motivated DevOps and Cloud Computing professional with a strong foundation in CI/CD pipelines, automation scripting, and infrastructure monitoring. AWS Certified Cloud Practitioner and Scrum Fundamentals Certified. Passionate about building scalable solutions, enhancing system reliability, and driving agile project execution.",
      image: "/attached_assets/Saad%20Hasan%20avatar.jpg",
      email: "saadhasan077@gmail.com",
      phone: "+49 1575 6692684",
      location: "Limbach-Oberfrohna, Germany",
      github: "https://github.com/saadhasan07",
      linkedin: null,
      twitter: null,
      xing: null,
      cvEnglish: "/attached_assets/Saad_Hasan_CV_Final_English.docx",
      cvGerman: "/attached_assets/Saad_Hasan_CV_Final_Deutsch[1].docx",
    };

    // DevOps and automation projects
    const devOpsProjects: Project[] = [
      {
        id: 1,
        title: "CI/CD Pipeline Monitor",
        description: "Full-stack application to monitor CI/CD pipeline builds and deployments in real time. Built with TypeScript for enhanced type safety and better development experience.",
        image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["TypeScript", "CI/CD", "DevOps", "Monitoring"],
        githubUrl: "https://github.com/saadhasan07/CICD_Pipeline_Monitor",
        demoUrl: null,
        featured: true,
        order: 1,
        descriptionDe: "",
        createdAt: ""
      },
      {
        id: 2,
        title: "Total Battle Scanner",
        description: "Automation tool to scan in-game resources with customizable filters and thresholds. Demonstrates automation scripting capabilities with Python.",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["Python", "Automation", "Scripting", "Image Processing"],
        githubUrl: "https://github.com/saadhasan07/total-battle-scanner",
        demoUrl: null,
        featured: true,
        order: 2,
        descriptionDe: "",
        createdAt: ""
      },
      {
        id: 3,
        title: "Gaming Profile App",
        description: "Responsive web application for managing and showcasing dynamic gaming profiles. Built with modern JavaScript and responsive design principles.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["JavaScript", "HTML", "CSS", "Web Development"],
        githubUrl: "https://github.com/saadhasan07/Gaming-Profile-App",
        demoUrl: null,
        featured: true,
        order: 3,
        descriptionDe: "",
        createdAt: ""
      },
      {
        id: 4,
        title: "Resume and Portfolio",
        description: "Professional CV and portfolio template optimized for technical job applications. Created with LaTeX for precise formatting and professional presentation.",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["LaTeX", "Documentation", "Professional Templates"],
        githubUrl: "https://github.com/saadhasan07/Resume-and-Porfolio",
        demoUrl: null,
        featured: false,
        order: 4,
        descriptionDe: "",
        createdAt: ""
      },
    ];

    devOpsProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    // Professional experiences and education
    const actualExperiences: Experience[] = [
      {
        id: 1,
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
        id: 2,
        title: "Bachelor of Commerce (B.Com)",
        organization: "Dhadabhoy University, Karachi",
        description: "Completed Bachelor's degree with GPA 1.7, specializing in Management and Economics with focus on Logistics. Strong foundation in business processes and organizational management.",
        startDate: "March 2012",
        endDate: "July 2014",
        type: "education",
        current: false,
        order: 2,
      },
      {
        id: 3,
        title: "Communication Manager",
        organization: "Belarus & Co, Karachi",
        description: "Managed international client correspondence, contract negotiations, and export documentation. Created logistics statistics, coordinated payment processing, and optimized communication workflows.",
        startDate: "February 2011",
        endDate: "August 2013",
        type: "work",
        current: false,
        order: 3,
      },
      {
        id: 4,
        title: "Shift Supervisor",
        organization: "Starbucks GmbH, München",
        description: "Responsible for shift planning, customer service, and organizational tasks. Led team operations and managed sales activities in fast-paced retail environment.",
        startDate: "February 2017",
        endDate: "March 2019",
        type: "work",
        current: false,
        order: 4,
      },
    ];

    actualExperiences.forEach(exp => {
      this.experiences.set(exp.id, exp);
    });

    // DevOps-focused blog posts
    const techBlogPosts: BlogPost[] = [
      {
        id: 1,
        title: "Implementing CI/CD Pipelines with Best Practices",
        excerpt: "A comprehensive guide to setting up robust CI/CD pipelines focusing on automation, testing, and deployment strategies for modern DevOps workflows.",
        content: null,
        publishedAt: "December 15, 2024",
        readTime: "8 min read",
        url: null,
        featured: true,
      },
      {
        id: 2,
        title: "AWS Cloud Infrastructure Monitoring and Optimization",
        excerpt: "Learn effective strategies for monitoring cloud infrastructure, implementing cost optimization, and ensuring system reliability in AWS environments.",
        content: null,
        publishedAt: "November 28, 2024",
        readTime: "6 min read",
        url: null,
        featured: true,
      },
    ];

    techBlogPosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });

    // Professional talks and presentations
    const professionalTalks: Talk[] = [
      {
        id: 1,
        title: "DevOps Fundamentals and Best Practices",
        event: "Techstarter GmbH Training Session",
        description: "Presented core DevOps concepts including CI/CD implementation, infrastructure automation, and monitoring strategies to fellow trainees.",
        date: "November 2024",
        slidesUrl: null,
        videoUrl: null,
      },
      {
        id: 2,
        title: "AWS Cloud Services Overview",
        event: "Internal Training Workshop",
        description: "Delivered comprehensive overview of AWS cloud services, focusing on practical applications for DevOps and infrastructure management.",
        date: "October 2024",
        slidesUrl: null,
        videoUrl: null,
      },
    ];

    professionalTalks.forEach(talk => {
      this.talks.set(talk.id, talk);
    });

    this.currentId = 10; // Start from 10 for new entries
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    return this.profile || undefined;
  }

  async updateProfile(profile: InsertProfile): Promise<Profile> {
    const updated: Profile = {
      ...profile,
      id: this.profile?.id || 1,
      name: "",
      title: "",
      bio: "",
      image: "",
      email: "",
      phone: "",
      location: "",
      github: "",
      linkedin: "",
      twitter: "",
      xing: "",
      cvEnglish: "",
      cvGerman: "",
      skills: []
    };
    this.profile = updated;
    return updated;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => a.order - b.order);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.featured)
      .sort((a, b) => a.order - b.order);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const newProject: Project = {
      ...project, id,
      title: "",
      image: "",
      description: "",
      descriptionDe: "",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      featured: false,
      order: 0,
      createdAt: ""
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error("Project not found");
    }
    const updated: Project = { ...existing, ...project };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Experience methods
  async getAllExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).sort((a, b) => a.order - b.order);
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const newExperience: Experience = {
      ...experience, id,
      title: "",
      type: "",
      description: "",
      order: 0,
      organization: "",
      startDate: "",
      endDate: "",
      current: false
    };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience> {
    const existing = this.experiences.get(id);
    if (!existing) {
      throw new Error("Experience not found");
    }
    const updated: Experience = { ...existing, ...experience };
    this.experiences.set(id, updated);
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(p => p.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const newPost: BlogPost = {
      ...post, id,
      url: "",
      title: "",
      featured: false,
      excerpt: "",
      content: "",
      publishedAt: "",
      readTime: ""
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    if (!existing) {
      throw new Error("Blog post not found");
    }
    const updated: BlogPost = { ...existing, ...post };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Talk methods
  async getAllTalks(): Promise<Talk[]> {
    return Array.from(this.talks.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTalk(id: number): Promise<Talk | undefined> {
    return this.talks.get(id);
  }

  async createTalk(talk: InsertTalk): Promise<Talk> {
    const id = this.currentId++;
    const newTalk: Talk = {
      ...talk, id,
      date: "",
      title: "",
      description: "",
      event: "",
      slidesUrl: "",
      videoUrl: ""
    };
    this.talks.set(id, newTalk);
    return newTalk;
  }

  async updateTalk(id: number, talk: Partial<InsertTalk>): Promise<Talk> {
    const existing = this.talks.get(id);
    if (!existing) {
      throw new Error("Talk not found");
    }
    const updated: Talk = { ...existing, ...talk };
    this.talks.set(id, updated);
    return updated;
  }

  async deleteTalk(id: number): Promise<boolean> {
    return this.talks.delete(id);
  }

  // Translation methods
  async getAllTranslations(): Promise<Translation[]> {
    return Array.from(this.translations.values());
  }

  async getTranslation(key: string): Promise<Translation | undefined> {
    return this.translations.get(key);
  }

  async updateTranslation(key: string, translation: Partial<InsertTranslation>): Promise<Translation> {
    const existing = this.translations.get(key) || { id: this.currentId++, key, en: "", de: "" };
    const updated: Translation = { ...existing, ...translation };
    this.translations.set(key, updated);
    return updated;
  }
}

// Update the storage export to potentially use MemStorage if needed
// You could also add an environment variable to control which storage to use
export const storage = process.env.USE_MEM_STORAGE === 'true' 
  ? new MemStorage() 
  : new DatabaseStorage();
