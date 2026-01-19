import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const pastes = sqliteTable("pastes", {
  id: text("id").primaryKey().notNull(), // short random ID for public URL

  text: text("text").notNull(),

  title: text("title").notNull(),
  syntax: text("syntax").notNull().default("plaintext"),

  expiresAt: integer("expires_at", { mode: "timestamp_ms" }),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
});

// export type
export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
