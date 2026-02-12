import { marked } from "marked";
import { transform } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

/**
 * Converts Markdown text into sanitized HTML.
 * This runs on the server (Worker) to ensure fast initial page loads
 * and consistent rendering.
 *
 * We use 'marked' for parsing and 'ultrahtml' for sanitization because
 * 'ultrahtml' is lightweight and fully compatible with Cloudflare Workers.
 */
export async function renderMarkdown(content: string): Promise<string> {
  // 1. Parse Markdown to HTML
  const rawHtml = await marked.parse(content, {
    async: true,
    breaks: true,
  });

  // 2. Sanitize the HTML using ultrahtml's transform API
  // The sanitize transformer removes dangerous tags (like <script>) by default.
  const sanitizedHtml = await transform(rawHtml, [
    sanitize({
      // You can add custom configuration here if needed,
      // e.g., allow certain attributes or tags
      dropElements: ["script", "style", "iframe", "object", "embed"],
    }),
  ]);

  return sanitizedHtml;
}
