import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const pastes = sqliteTable("pastes", {
  id: text("id").primaryKey().notNull(), // short random ID for public URL

  text: text("text").notNull(),

  title: text("title").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// export type
export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
