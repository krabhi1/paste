import { type Paste, pastes, tags, pasteTags } from "./schema";
import { db } from ".";
import { pasteId } from "~/lib/utils";
import {
  eq,
  desc,
  sql,
  or,
  isNull,
  gt,
  and,
  gte,
  lte,
  inArray,
  exists,
} from "drizzle-orm";

/**
 * Calculates the expiration date based on the user's selection.
 */
function getExpiryDate(expiry: string): Date | null {
  const now = new Date();
  switch (expiry) {
    case "1hr":
      return new Date(now.getTime() + 60 * 60 * 1000);
    case "24hr":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case "7days":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "30days":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case "never":
    default:
      return null;
  }
}

/**
 * Helper to filter out expired pastes in queries.
 */
const notExpired = () =>
  or(isNull(pastes.expiresAt), gt(pastes.expiresAt, new Date()));

export async function createPaste(args: {
  text: string;
  title: string;
  syntax?: string;
  expiry?: string;
  tags?: string[];
}) {
  let success = false;
  const expiresAt = args.expiry ? getExpiryDate(args.expiry) : null;

  while (!success) {
    const id = pasteId();
    try {
      return await db().transaction(async (tx) => {
        const paste = await tx
          .insert(pastes)
          .values({
            id,
            text: args.text,
            title: args.title,
            syntax: args.syntax || "plaintext",
            expiresAt: expiresAt,
          })
          .returning();

        const createdPaste = paste[0];

        if (args.tags && args.tags.length > 0) {
          for (const tagName of args.tags) {
            const normalized = tagName.toLowerCase();
            // Upsert tag
            const tagResults = await tx
              .insert(tags)
              .values({ name: tagName, normalized })
              .onConflictDoUpdate({
                target: tags.normalized,
                set: { name: tagName },
              })
              .returning();

            const tag = tagResults[0];

            // Link tag
            await tx.insert(pasteTags).values({
              pasteId: createdPaste.id,
              tagId: tag.id,
            });
          }
        }

        return createdPaste;
      });
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes("Unique constraint failed")
      ) {
        continue;
      }
      throw e;
    }
  }
  throw new Error("Failed to create paste");
}

export async function getPasteById(id: string) {
  const paste = await db().query.pastes.findFirst({
    where: and(eq(pastes.id, id), notExpired()),
    with: {
      pasteTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  if (!paste) return null;

  return {
    ...paste,
    tags: paste.pasteTags.map((pt) => pt.tag),
  };
}

export async function getLatestPastes(limit: number) {
  const results = await db().query.pastes.findMany({
    where: notExpired(),
    orderBy: desc(pastes.createdAt),
    limit: limit,
    with: {
      pasteTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  return results.map((p) => ({
    ...p,
    tags: p.pasteTags.map((pt) => pt.tag),
  }));
}

export async function getLatestPastesByPage(page: number, limit: number) {
  const results = await db().query.pastes.findMany({
    where: notExpired(),
    orderBy: desc(pastes.createdAt),
    limit: limit,
    offset: (page - 1) * limit,
    with: {
      pasteTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  return results.map((p) => ({
    ...p,
    tags: p.pasteTags.map((pt) => pt.tag),
  }));
}

export interface SearchFilters {
  query?: string;
  syntax?: string;
  tags?: string[];
  from?: Date;
  to?: Date;
}

/**
 * Advanced search with pagination and filters.
 */
export async function searchPastes(
  filters: SearchFilters,
  page: number = 1,
  limit: number = 10,
) {
  const conditions = [notExpired()];

  if (filters.tags && filters.tags.length > 0) {
    const normalizedTags = filters.tags.map((t) => t.toLowerCase());
    const tagSubquery = db()
      .select({ id: pasteTags.pasteId })
      .from(pasteTags)
      .innerJoin(tags, eq(pasteTags.tagId, tags.id))
      .where(inArray(tags.normalized, normalizedTags))
      .groupBy(pasteTags.pasteId)
      .having(sql`count(${pasteTags.tagId}) = ${normalizedTags.length}`);

    conditions.push(inArray(pastes.id, tagSubquery));
  }

  if (filters.query?.trim()) {
    const pattern = `%${filters.query.trim()}%`;
    conditions.push(
      or(
        sql`LOWER(${pastes.title}) LIKE LOWER(${pattern})`,
        sql`LOWER(${pastes.text}) LIKE LOWER(${pattern})`,
      )!,
    );
  }

  if (
    filters.syntax &&
    filters.syntax !== "all" &&
    filters.syntax !== "plaintext"
  ) {
    conditions.push(eq(pastes.syntax, filters.syntax));
  }

  if (filters.from) {
    conditions.push(gte(pastes.createdAt, filters.from));
  }

  if (filters.to) {
    conditions.push(lte(pastes.createdAt, filters.to));
  }

  const whereClause = and(...conditions);

  const [results, total] = await Promise.all([
    db().query.pastes.findMany({
      where: whereClause,
      orderBy: desc(pastes.createdAt),
      limit: limit,
      offset: (page - 1) * limit,
      with: {
        pasteTags: {
          with: {
            tag: true,
          },
        },
      },
    }),
    db()
      .select({ count: sql<number>`count(*)` })
      .from(pastes)
      .where(whereClause),
  ]);

  const count = total[0]?.count || 0;

  return {
    results: results.map((p) => ({
      ...p,
      tags: p.pasteTags.map((pt) => pt.tag),
    })),
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Quick search for suggestions, matching title and content.
 */
export async function getSearchSuggestions(query: string, limit: number = 5) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];
  const pattern = `%${trimmedQuery}%`;

  const results = await db()
    .select({
      id: pastes.id,
      title: pastes.title,
      syntax: pastes.syntax,
      text: pastes.text,
    })
    .from(pastes)
    .where(
      and(
        notExpired(),
        or(
          sql`LOWER(${pastes.title}) LIKE LOWER(${pattern})`,
          sql`LOWER(${pastes.text}) LIKE LOWER(${pattern})`,
        ),
      ),
    )
    .limit(limit);

  return results.map((item) => {
    const isTitleMatch = item.title
      .toLowerCase()
      .includes(trimmedQuery.toLowerCase());
    let snippet = null;

    if (!isTitleMatch) {
      const cleanText = item.text.replace(/\s+/g, " ");
      const index = cleanText.toLowerCase().indexOf(trimmedQuery.toLowerCase());
      if (index !== -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(
          cleanText.length,
          index + trimmedQuery.length + 30,
        );
        snippet =
          (start > 0 ? "..." : "") +
          cleanText.substring(start, end) +
          (end < cleanText.length ? "..." : "");
      }
    }

    return {
      id: item.id,
      title: item.title,
      syntax: item.syntax,
      matchType: isTitleMatch ? ("title" as const) : ("content" as const),
      snippet,
    };
  });
}

/**
 * Fetches popular tags matching a query string for autocomplete.
 */
export async function getSuggestedTags(query: string, limit: number = 8) {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) return [];

  const pattern = `%${trimmedQuery}%`;

  return db()
    .select({
      id: tags.id,
      name: tags.name,
      normalized: tags.normalized,
      count: sql<number>`count(${pasteTags.pasteId})`,
    })
    .from(tags)
    .leftJoin(pasteTags, eq(tags.id, pasteTags.tagId))
    .where(sql`LOWER(${tags.name}) LIKE LOWER(${pattern})`)
    .groupBy(tags.id)
    .orderBy(desc(sql`count(${pasteTags.pasteId})`))
    .limit(limit);
}
