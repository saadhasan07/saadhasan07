import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Skipping database configuration...");
  process.exit(1); // Exit with error code if no database URL
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    // Add SSL configuration to handle certificate issues
    ssl: {
      rejectUnauthorized: false, // Helps with self-signed certificates
    }
  },
});
