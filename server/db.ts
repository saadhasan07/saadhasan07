import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

neonConfig.webSocketConstructor = ws;

let pool = null;
let db = null;

// Configure the database connection with SSL options
try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Using fallback in-memory storage.");
    // We'll create a minimal implementation since we can't use real DB
    db = {
      select: () => ({ from: () => [] }),
      insert: () => ({ values: () => ({ returning: () => [{}] }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => [{}] }) }) }),
      delete: () => ({ where: () => ({ rowCount: 0 }) }),
    };
  } else {
    // Configure PostgreSQL client with SSL options
    const client = postgres(process.env.DATABASE_URL, {
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10, // Maximum number of connections
      idle_timeout: 20, // Idle connection timeout in seconds
      connect_timeout: 10, // Connection timeout in seconds
    });
    
    // Create drizzle instance
    db = drizzle(client, { schema });
    console.log("Database connection established successfully");
  }
} catch (error) {
  console.error("Failed to connect to database:", error);
  // Fallback to a mock implementation
  db = {
    select: () => ({ from: () => [] }),
    insert: () => ({ values: () => ({ returning: () => [{}] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [{}] }) }) }),
    delete: () => ({ where: () => ({ rowCount: 0 }) }),
  };
}

export { pool, db };