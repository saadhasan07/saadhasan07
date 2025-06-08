import { defineConfig } from "drizzle-kit";

const config = process.env.DATABASE_URL
  ? defineConfig({
      out: "./migrations",
      schema: "./shared/schema.ts",
      dialect: "postgresql",
      dbCredentials: {
        url: process.env.DATABASE_URL,
      },
    })
  : null;

if (!config) {
  console.warn("DATABASE_URL is not set. Skipping database configuration...");
}

export default config;
