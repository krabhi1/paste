import { type Paste, pastes } from "./schema";
import { db } from ".";
import { pasteId } from "~/utils";
import { eq, desc, sql, or } from "drizzle-orm";
export async function createPaste(args: Pick<Paste, "text" | "title">) {
  let success = false;
  while (!success) {
    const id = pasteId();
    try {
      const paste = await db()
        .insert(pastes)
        .values({
          ...args,
          id,
        })
        .returning();
      return paste[0];
      success = true;
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

export async function getPaste(id: string) {
  const paste = await db()
    .select()
    .from(pastes)
    .where(eq(pastes.id, id))
    .limit(1);
  if (paste.length === 0) return null;
  return paste[0];
}

export async function getLatestPastes(limit: number) {
  const pastesList = await db()
    .select()
    .from(pastes)
    .orderBy(desc(pastes.createdAt))
    .limit(limit);
  return pastesList;
}

export async function getLatestPastesByPage(page: number, limit: number) {
  const pastesList = await db()
    .select()
    .from(pastes)
    .orderBy(desc(pastes.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
  return pastesList;
}

export async function searchPastes(query: string, page: number, limit: number) {
  if (!query.trim()) return [];

  const pattern = `%${query}%`;

  return db()
    .select()
    .from(pastes)
    .where(
      or(
        sql`LOWER(${pastes.title}) LIKE LOWER(${pattern})`,
        sql`LOWER(${pastes.text}) LIKE LOWER(${pattern})`,
      ),
    )
    .limit(limit)
    .offset((page - 1) * limit);
}
