import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

// Create a configuration object based on the environment
const config = !process.env.DATABASE_URL 
  ? { 
      // Empty placeholder config when DATABASE_URL is not set
      schema: "./shared/schema.ts",
    }
  : {
      out: "./migrations",
      schema: "./shared/schema.ts",
      dialect: "postgresql",
      dbCredentials: {
        url: process.env.DATABASE_URL,
      },
    };

// Always export a configuration
export default defineConfig(config);
