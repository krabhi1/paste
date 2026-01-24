import { z } from "zod";

export const syntaxOptions = [
  "plaintext",
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
    .max(100, "Title must be less than 100 characters"),
  text: z
    .string()
    .min(1, "Content is required")
    .max(1000000, "Content is too large (max 1MB)"),
  syntax: z.enum(syntaxOptions).default("plaintext"),
  expiry: z.enum(expiryOptions).default("never"),
});

export const SearchSchema = z.object({
  q: z.string().max(50, "Search query is too long").optional(),
});

export type PasteInput = z.infer<typeof PasteSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
