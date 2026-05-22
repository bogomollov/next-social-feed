import "server-only";

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const isProduction = process.env.NODE_ENV === "production";
const pool = new Pool({
  connectionString,
});

export const db = isProduction
  ? neonDrizzle(neon(connectionString))
  : pgDrizzle(pool);
