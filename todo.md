# Project Roadmap of Paste

## In Progress

## Completed Tasks

- [x] UI: remove language chip from search item
- [x] No horizontal scroll on plain text paste in paste page. Also add wrap toggle icon button.

- [x] Input Validation: Use Zod to validate all incoming data in `home.tsx` and `api` routes (limit title length, max text size, valid syntax, etc.).

- [x] Use light color for active, hover state of UI elements
- [x] Recent paste list items should be smaller in height
- [x] Change Recent Activity name to Recent Pastes
- [x] Fix CreatedAt relative time (except paste page): display shorthand units (m, h, d, mo, y).
- [x] Remove animation from New Paste button
- [x] Search Input height should be smaller
- [x] Add content to /about page
- [x] Defer loading of data for public pastes and search page
- [x] Favicon & Branding: Design a simple favicon and update site branding.
- [x] Meta Tags: Add SEO-friendly meta tags for better search engine indexing.
- [x] Documentation: Create a README with setup instructions, features, and contribution guidelines.
- [x] Deployment Checklist: Finalize Cloudflare Workers deployment settings, including environment variables and KV/D1 configurations.

## UI/UX Enhancements

- [ ] Pagination for search
- [ ] For search dropdown suggestions instead of custom use shadcn alternative
- [ ] Add refresh Icon button to public pastes next to Title with loading spinner when clicked
- [ ] Dark Mode: Implement a theme switcher using Tailwind's dark mode capabilities.
- [ ] Toast Notifications: Replace simple state-based feedback with a toast library (like `sonner`) for actions like "Copied" or "Reported".
- [ ] Line Numbers: Add line numbering to the code view for easier reference.
- [ ] Raw View Enhancements: Ensure the `/raw` route sets the correct `Content-Type` and `Content-Disposition` headers.

## Security & Validation

- [ ] Rate Limiting: Implement rate limiting for paste creation and search suggestions to prevent abuse (utilizing Cloudflare KV or D1).
- [ ] Bot Protection: Integrate Cloudflare Turnstile or a similar CAPTCHA on the creation form.
- [ ] SQL Injection Prevention: Ensure all raw SQL fragments (if any) are properly parameterized (Drizzle handles most of this).

## Core Features

- [ ] Syntax Highlighting: Replace the plain `<pre>` tag with a robust syntax highlighter like `shiki` or `prismjs` for better code viewing.
- [ ] Expiration Cleanup: Set up a Cloudflare Worker Cron Trigger to physically delete expired pastes from the database to save space.
- [ ] Visibility Controls: Add "Public" vs "Unlisted" options. Unlisted pastes should not appear in search results or "Latest" lists.
- [ ] Password Protection: Allow optional password protection for sensitive pastes.
- [ ] Reporting System: Move beyond `console.log` for reports. Store reports in the database and create a basic admin view for moderation.

## Technical Improvements

- [ ] Search Optimization: Consider adding an index on `createdAt` and `title` to speed up searches as the database grows.
- [ ] Error Handling: Add `ErrorBoundary` components to handle 404s and unexpected server errors gracefully.
- [ ] Testing: Expand `vitest` coverage for edge cases in `getExpiryDate` and search filters.
- [ ] Cache the public pastes page using Cloudflare KV or Workers Cache API for faster load times.

## Final Touches

## Observability

- [ ] Implement logging for critical operations (paste creation, deletion, reporting) using Cloudflare Logs or a third-party service.
- [ ] Set up monitoring and alerting for application errors and performance issues.
- [ ] Create dashboards to visualize key metrics like paste creation rates, search usage, and error rates.
