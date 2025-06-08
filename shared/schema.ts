import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  xing: text("xing"),
  cvEnglish: text("cv_english"),
  cvGerman: text("cv_german"),
  skills: text("skills").array(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  descriptionDe: text("description_de"),
  image: text("image"),
  technologies: text("technologies").array().notNull(),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: text("created_at").notNull().default("2024-01-01"),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  type: text("type").notNull(), // 'education', 'work', 'project'
  current: boolean("current").default(false),
  order: integer("order").default(0),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  publishedAt: text("published_at").notNull(),
  readTime: text("read_time").notNull(),
  url: text("url"),
  featured: boolean("featured").default(false),
});

export const talks = pgTable("talks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  event: text("event").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  slidesUrl: text("slides_url"),
  videoUrl: text("video_url"),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  en: text("en").notNull(),
  de: text("de").notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export const insertTalkSchema = createInsertSchema(talks).omit({
  id: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Talk = typeof talks.$inferSelect;
export type InsertTalk = z.infer<typeof insertTalkSchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
