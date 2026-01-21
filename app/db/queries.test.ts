import { expect, test, describe, beforeAll } from "vitest";
import { drizzle } from "drizzle-orm/libsql";
import { type Db, setDb } from "~/db";
import {
  createPaste,
  getLatestPastes,
  getPasteById,
  searchPastes,
} from "./queries";
import { env } from "cloudflare:test";
function initDb() {
  const _db = drizzle({
    connection: {
      url: env.TURSO_CONNECTION_URL!,
      authToken: env.TURSO_AUTH_TOKEN!,
    },
  });
  setDb(_db);
}

describe("Database Queries", () => {
  beforeAll(() => {
    initDb();
  });
  // create paste
  test("Create Paste", async () => {
    const paste = await createPaste({
      text: "Hello, World!",
      title: "Test Paste",
    });
    expect(paste).toHaveProperty("id");
    expect(paste.text).toBe("Hello, World!");
    expect(paste.title).toBe("Test Paste");
  });
  test("Get Paste by ID", async () => {
    const newPaste = await createPaste({
      text: "Hello, World!",
      title: "Test Paste",
    });
    const fetchedPaste = await getPasteById(newPaste.id);
    expect(fetchedPaste).not.toBeNull();
    expect(fetchedPaste?.id).toBe(newPaste.id);
    expect(fetchedPaste?.text).toBe("Hello, World!");
    expect(fetchedPaste?.title).toBe("Test Paste");
  });
  test("Get Paste by Invalid ID", async () => {
    const fetchedPaste = await getPasteById("invalid-id");
    expect(fetchedPaste).toBeNull();
  });
  // get latest pastes
  test("Get Latest 5 Pastes", async () => {
    const pastes = await getLatestPastes(5);
    expect(pastes.length).toBe(5);
    // check if they are in descending order
    for (let i = 0; i < pastes.length - 1; i++) {
      expect(new Date(pastes[i].createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(pastes[i + 1].createdAt).getTime(),
      );
    }
  });
  // search pastes
  test("Search Pastes", async () => {
    const searchTerm = "Hello";
    // create some pastes to search
    await createPaste({ text: "Hello, World!", title: "Greeting" });
    await createPaste({ text: "Hello, Universe!", title: "Cosmos" });
    await createPaste({ text: "Goodbye, World!", title: "Farewell" });
    const { results } = await searchPastes({ query: searchTerm }, 1, 10);
    expect(results.length).toBeGreaterThan(0);
    for (const paste of results) {
      expect(
        paste.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paste.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ).toBe(true);
    }
  });
  test("Search Pastes Case-Insensitive", async () => {
    // Create pastes with mixed case
    await createPaste({ text: "UPPERCASE text", title: "Case Test 1" });
    await createPaste({ text: "lowercase text", title: "Case Test 2" });
    await createPaste({ text: "MiXeD cAsE tExT", title: "Case Test 3" });

    // Search with lowercase
    const { results: lowerResults } = await searchPastes(
      { query: "text" },
      1,
      10,
    );

    // Search with uppercase
    const { results: upperResults } = await searchPastes(
      { query: "TEXT" },
      1,
      10,
    );

    // Verify both searches return the same results
    expect(lowerResults.length).toBeGreaterThan(0);
    expect(upperResults.length).toBeGreaterThan(0);
    expect(lowerResults.length).toBe(upperResults.length);

    // Verify all variations of "text" are found regardless of case
    const allResults = [...lowerResults, ...upperResults];
    for (const paste of allResults) {
      expect(
        paste.text.toLowerCase().includes("text") ||
          paste.title.toLowerCase().includes("text"),
      ).toBe(true);
    }
  });

  test("Complex Search with Multiple Terms and Case Insensitivity", async () => {
    // Create test pastes
    await createPaste({ text: "The quick brown fox", title: "Animals" });
    await createPaste({ text: "Lazy dogs sleep", title: "More Animals" });
    await createPaste({ text: "FOXES are clever", title: "Wildlife" });
    await createPaste({ text: "Dogs and cats", title: "Pets" });

    // Test multiple search terms with different cases
    const searchTerms = ["Fox", "DOG"];

    let results: any[] = [];
    for (const term of searchTerms) {
      const { results: termResults } = await searchPastes(
        { query: term },
        1,
        10,
      );
      results = [...results, ...termResults];
    }

    // Remove duplicates (pastes that match multiple terms)
    const uniqueResults = Array.from(
      new Map(results.map((item) => [item.id, item])).values(),
    );

    // Verify we found matches for both terms, case-insensitive
    expect(uniqueResults.length).toBeGreaterThan(0);

    // Check that each result contains at least one of the search terms (case insensitive)
    for (const paste of uniqueResults) {
      const lowerText = paste.text.toLowerCase();
      const lowerTitle = paste.title.toLowerCase();

      expect(
        searchTerms.some(
          (term) =>
            lowerText.includes(term.toLowerCase()) ||
            lowerTitle.includes(term.toLowerCase()),
        ),
      ).toBe(true);
    }
  });
});
