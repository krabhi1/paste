import { z } from "zod";

export const syntaxOptions = [
  "plaintext",
  "markdown",
  "cpp",
  "java",
  "javascript",
  "typescript",
  "python",
  "yaml",
  "json",
  "css",
  "html",
] as const;

export const expiryOptions = [
  "never",
  "1hr",
  "24hr",
  "7days",
  "30days",
] as const;

export const PasteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  text: z
    .string()
    .min(1, "Content is required")
    .max(1000000, "Content is too large (max 1MB)"),
  syntax: z.enum(syntaxOptions).default("plaintext"),
  expiry: z.enum(expiryOptions).default("never"),
  tags: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          if (!val.trim()) return [];
          return val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
        return val;
      },
      z.array(
        z
          .string()
          .trim()
          .min(1, "Tag too short")
          .max(50, "Tag too long")
          .regex(
            /^[a-z0-9-]+$/,
            "Tags can only contain letters, numbers, and hyphens",
          )
          .toLowerCase(),
      ),
    )
    .default([])
    .transform((tags) => Array.from(new Set(tags)).slice(0, 10)),
});

export const SearchSchema = z.object({
  q: z.string().max(200, "Search query is too long").optional(),
});

export type PasteInput = z.infer<typeof PasteSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
