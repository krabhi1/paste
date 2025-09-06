import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { reset, seed } from "drizzle-seed";

config({ path: ".dev.vars" });
import { drizzle } from "drizzle-orm/libsql";
import { pastes } from "./schema";
console.log("Using database URL:", process.env.TURSO_CONNECTION_URL);

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.TURSO_CONNECTION_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });
  await reset(db, { pastes });
  await seed(db, { pastes }).refine((f) => ({
    pastes: {
      columns: {
        createdAt: f.timestamp(),
        title: f.string(),
        text: f.loremIpsum(),
      },
    },
  }));
}

main();
