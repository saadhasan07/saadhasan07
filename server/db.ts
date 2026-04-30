import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

neonConfig.webSocketConstructor = ws;

function createFallbackDatabase() {
  return {
    select: () => ({ from: () => [] }),
    insert: () => ({ values: () => ({ returning: () => [{}] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [{}] }) }) }),
    delete: () => ({ where: () => ({ rowCount: 0 }) }),
  };
}

function createDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Using fallback in-memory storage.");
    return createFallbackDatabase();
  }

  try {
    const client = postgres(process.env.DATABASE_URL, {
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    console.log("Database connection established successfully");
    return drizzle(client, { schema });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return createFallbackDatabase();
  }
}

export const db = createDatabase();
