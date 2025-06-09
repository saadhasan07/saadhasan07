import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

// Always export a configuration with the required dialect field
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql", // This is required and now always present
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
