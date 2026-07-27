import "./shared/lib/load-env";
import { defineConfig } from "drizzle-kit";
import { env } from "./shared/lib/env";

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
