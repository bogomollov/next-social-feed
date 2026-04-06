import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { Pool } from "pg";
import { post } from "./schema";

config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

const db = drizzle(pool);

async function main() {
  await reset(db, { post });

  await seed(db, { post }, { seed: 42 }).refine((funcs) => ({
    post: {
      count: 6,
      columns: {
        slug: funcs.valuesFromArray({
          values: [
            "urban-garden",
            "build-in-public",
            "nina-labs",
            "sofia-studio",
            "design-systems",
            "product-signals",
          ],
          isUnique: true,
        }),
        authorName: funcs.valuesFromArray({
          values: ["Maya Torres", "Anton Volkov", "Nina Belova", "Sofia Lee"],
        }),
        authorHandle: funcs.valuesFromArray({
          values: ["@mayatorres", "@antonv", "@ninalabs", "@sofiawrites"],
        }),
        authorRole: funcs.valuesFromArray({
          values: [
            "Community builder",
            "Product engineer",
            "Materials researcher",
            "Product storyteller",
          ],
        }),
        topic: funcs.valuesFromArray({
          values: [
            "Urban gardens",
            "Build in public",
            "Systems",
            "Editorial",
            "Design systems",
            "Product strategy",
          ],
        }),
        content: funcs.valuesFromArray({
          values: [
            "Neighborhood products win when they make the next useful action obvious. Clear discovery plus calm hierarchy keeps participation high.",
            "Good feeds feel editorial, not noisy. You trust them faster when metadata, identity, and actions stay in the same place on every card.",
            "The strongest feed layouts put identity and intent first. When username search is central, the rest of the interface becomes easier to trust.",
            "Soft contrast works when layers are clear: calm surfaces, concise metadata, and enough depth to guide the eye without visual noise.",
            "Consistent card anatomy reduces decision cost. Users learn where to scan, what to trust, and when to act.",
            "A feed becomes more useful when ranking reflects intent instead of volume. Clarity beats churn.",
          ],
        }),
        likes: funcs.int({ minValue: 80, maxValue: 260 }),
        comments: funcs.int({ minValue: 8, maxValue: 36 }),
        reposts: funcs.int({ minValue: 4, maxValue: 18 }),
      },
    },
  }));
}

main()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
