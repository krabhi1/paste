# Roadmap: Paste Project

## Phase 1: Foundation & Stability (Completed)

_Goal: Establish a secure, functional MVP with solid core mechanics._

- [x] **Persistence**: Drizzle + Turso integration with schema migrations.
- [x] **Validation**: Comprehensive Zod implementation for all ingestion points (Home/API).
- [x] **UX Refinement**: Relative timestamps (shorthand), responsive code blocks (no-scroll), and UI state polish.
- [x] **Discovery**: Basic search implementation and public paste lists.
- [x] **SEO/Branding**: Meta tags, favicon, and initial branding.
- [x] **Infrastructure**: Cloudflare Workers deployment and initial KV caching for public feeds.
- [x] **Content**: Initial /about page and search deferral for performance.

## Phase 2: Enhanced Viewing Experience

_Goal: Provide professional-grade code reading and sharing tools._

- [ ] **[P0] Syntax Highlighting**: Transition to Shiki (Server-side) with KV caching of HTML output to minimize Worker compute costs.
- [ ] **[P1] Line Numbers**: Add CSS-based line numbering to code views for better referencing.
- [x] **[P1] Tags**: Allow users to add optional tags to pastes for categorization and improved searchability.
- [ ] **[P2] View Count**: Implementation of a view counter

## Phase 3: Privacy & Security

_Goal: Protect the platform from abuse and provide user privacy._

- [ ] **[P0] Rate Limiting**: Implement IP-based rate limiting for creation and search via Cloudflare KV/D1.
- [ ] **[P1] Visibility Controls**: Add "Unlisted" status—pastes remain accessible via direct link but excluded from global search and "Recent Pastes" lists.
- [ ] **[P1] Expiration Cleanup**: Automated Cloudflare Worker Cron Trigger to physically purge expired rows from Turso to manage storage.
- [ ] **[P2] Bot Protection**: Integrate Cloudflare Turnstile on the creation form to mitigate automated spam.
- [ ] **[P2] Password Protection**: Argon2id hashing for optional password-protected snippets.

## Phase 4: Discovery & User Interaction

_Goal: Improve how users navigate and manage content._

- [ ] **[P1] Pagination**: Offset or cursor-based pagination for global search and the public pastes feed.
- [ ] **[P1] Search v2**: Replace custom search UI with a `shadcn` Command/Combobox component for better accessibility and UX.
- [ ] **[P2] Refresh Interaction**: Add refresh triggers with loading indicators for real-time feed updates.
- [ ] **[P2] Theme Switcher**: First-class System/Light/Dark mode support utilizing Tailwind CSS 4 variables.
- [ ] **[P2] Reporting System**: Move beyond console logs; store user reports in the database with a basic admin view for moderation.

## Phase 5: Observability & Hardening

_Goal: Prepare for production-scale traffic and long-term maintenance._

- [ ] **[P1] Error Boundaries**: Granular error handling for 404s, DB timeouts, and unexpected edge failures.
- [ ] **[P1] Feedback Systems**: Integrate `sonner` for non-intrusive "Copied to Clipboard" or error notifications.
- [ ] **[P2] Testing**: Expand Vitest coverage for core business logic (expiry logic, slug generation, search filters).
- [ ] **[P2] Performance Profiling**: Indexing optimizations for `createdAt` and `title` as the dataset grows.
- [ ] **[P2] Monitoring**: Structured logging and dashboards for monitoring error rates and paste creation trends.

---

_Legend: [P0] Critical | [P1] Important | [P2] Polish_
