import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".dev.vars" });

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
