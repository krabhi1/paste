import { type Paste, pastes } from "./schema";
import { db } from ".";
import { pasteId } from "~/lib/utils";
import { eq, desc, sql, or, isNull, gt, and, gte, lte } from "drizzle-orm";

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
}) {
  let success = false;
  const expiresAt = args.expiry ? getExpiryDate(args.expiry) : null;

  while (!success) {
    const id = pasteId();
    try {
      const paste = await db()
        .insert(pastes)
        .values({
          id,
          text: args.text,
          title: args.title,
          syntax: args.syntax || "plaintext",
          expiresAt: expiresAt,
        })
        .returning();
      return paste[0];
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
  const pasteList = await db()
    .select()
    .from(pastes)
    .where(and(eq(pastes.id, id), notExpired()))
    .limit(1);

  if (pasteList.length === 0) return null;
  return pasteList[0];
}

export async function getLatestPastes(limit: number) {
  return db()
    .select()
    .from(pastes)
    .where(notExpired())
    .orderBy(desc(pastes.createdAt))
    .limit(limit);
}

export async function getLatestPastesByPage(page: number, limit: number) {
  return db()
    .select()
    .from(pastes)
    .where(notExpired())
    .orderBy(desc(pastes.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}

export interface SearchFilters {
  query?: string;
  syntax?: string;
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
    db()
      .select()
      .from(pastes)
      .where(whereClause)
      .orderBy(desc(pastes.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db()
      .select({ count: sql<number>`count(*)` })
      .from(pastes)
      .where(whereClause),
  ]);

  const count = total[0]?.count || 0;

  return {
    results,
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
