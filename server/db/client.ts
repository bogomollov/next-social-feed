import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/shared/lib/env";

const isProduction = env.NODE_ENV === "production";
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = isProduction
  ? neonDrizzle(neon(env.DATABASE_URL))
  : pgDrizzle(pool);
