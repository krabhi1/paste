import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

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

export const pastesRelations = relations(pastes, ({ many }) => ({
  pasteTags: many(pasteTags),
}));

export const tags = sqliteTable(
  "tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    normalized: text("normalized").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch()*1000)`),
  },
  (table) => ({
    normalizedIndex: uniqueIndex("tags_normalized_unique").on(table.normalized),
  }),
);

export const tagsRelations = relations(tags, ({ many }) => ({
  pasteTags: many(pasteTags),
}));

export const pasteTags = sqliteTable(
  "paste_tags",
  {
    pasteId: text("paste_id")
      .notNull()
      .references(() => pastes.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch()*1000)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.pasteId, table.tagId] }),
  }),
);

export const pasteTagsRelations = relations(pasteTags, ({ one }) => ({
  paste: one(pastes, {
    fields: [pasteTags.pasteId],
    references: [pastes.id],
  }),
  tag: one(tags, {
    fields: [pasteTags.tagId],
    references: [tags.id],
  }),
}));

// export type
export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type PasteTag = typeof pasteTags.$inferSelect;
export type NewPasteTag = typeof pasteTags.$inferInsert;
