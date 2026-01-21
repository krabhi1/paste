# Todo

## Security & Validation

- [ ] **Input Validation**: Use Zod to validate all incoming data in `home.tsx` and `api` routes (limit title length, max text size, valid syntax, etc.).
- [ ] **Rate Limiting**: Implement rate limiting for paste creation and search suggestions to prevent abuse (utilizing Cloudflare KV or D1).
- [ ] **Bot Protection**: Integrate Cloudflare Turnstile or a similar CAPTCHA on the creation form.
- [ ] **SQL Injection Prevention**: Ensure all raw SQL fragments (if any) are properly parameterized (Drizzle handles most of this).

## Core Features

- [ ] **Syntax Highlighting**: Replace the plain `<pre>` tag with a robust syntax highlighter like `shiki` or `prismjs` for better code viewing.
- [ ] **Expiration Cleanup**: Set up a Cloudflare Worker Cron Trigger to physically delete expired pastes from the database to save space.
- [ ] **Visibility Controls**: Add "Public" vs "Unlisted" options. Unlisted pastes should not appear in search results or "Latest" lists.
- [ ] **Password Protection**: Allow optional password protection for sensitive pastes.
- [ ] **Reporting System**: Move beyond `console.log` for reports. Store reports in the database and create a basic admin view for moderation.

## UI/UX Improvements

- [ ] **Dark Mode**: Implement a theme switcher using Tailwind's dark mode capabilities.
- [ ] **Toast Notifications**: Replace simple state-based feedback with a toast library (like `sonner`) for actions like "Copied" or "Reported".
- [ ] **Line Numbers**: Add line numbering to the code view for easier reference.
- [ ] **Raw View Enhancements**: Ensure the `/raw` route sets the correct `Content-Type` and `Content-Disposition` headers.

## Technical Tasks

- [ ] **Settings Page**: Implement the placeholder `/setting` route (e.g., default syntax preference, theme).
- [ ] **Search Optimization**: Consider adding an index on `createdAt` and `title` to speed up searches as the database grows.
- [ ] **Error Handling**: Add `ErrorBoundary` components to handle 404s and unexpected server errors gracefully.
- [ ] **Testing**: Expand `vitest` coverage for edge cases in `getExpiryDate` and search filters.
