# Architecture: Paste

A high-performance, edge-native pastebin built for the modern web.

## 1. System Philosophy

- **Edge-First**: Compute is distributed across Cloudflare’s global network to ensure sub-100ms response times and 0ms cold starts.
- **Type-Safe Persistence**: Drizzle ORM acts as the single source of truth between the application logic and the Turso (libSQL) database.
- **Minimal Client Footprint**: Heavy logic (like syntax highlighting) is offloaded to the edge to keep the browser bundle small and fast.

## 2. Infrastructure Stack

| Layer          | Technology               | Senior Rationale                                                                                        |
| :------------- | :----------------------- | :------------------------------------------------------------------------------------------------------ |
| **Compute**    | Cloudflare Workers (RR7) | Full-stack SSR at the edge; eliminates server management and scales automatically.                      |
| **Database**   | Turso (libSQL)           | Distributed SQLite; perfect for edge environments where traditional connection pooling is a bottleneck. |
| **Caching**    | Cloudflare KV            | High-speed, eventually consistent key-value store used to offload DB reads for "hot" pastes.            |
| **Validation** | Zod                      | Runtime schema validation to ensure data integrity before it reaches the persistence layer.             |

## 3. Data Flow (Request Lifecycle)

### Write Path (Creation)

`User -> Zod Validation -> Turso DB -> KV Invalidation -> Success Response`

### Read Path (Consumption)

`User -> Worker -> KV Cache Check -> (If Miss) Turso DB -> Shiki Highlighting -> KV Cache Warmup -> SSR Render`

## 4. Architectural Decision Records (ADR)

### ADR 001: Server-Side Syntax Highlighting (Shiki)

- **Status**: Accepted
- **Context**: Client-side highlighting (Prism/Highlight.js) increases JS bundle size and causes "layout shift" during hydration.
- **Decision**: Perform highlighting on the Worker using Shiki and cache the resulting HTML in KV.
- **Rationale**: Maximizes performance for the end-user. While it increases Worker CPU usage, this is mitigated by caching the output in Cloudflare KV.

### ADR 002: Visibility Controls (Public vs. Unlisted)

- **Status**: Accepted
- **Context**: Users need privacy without requiring full authentication.
- **Decision**: Implement "Unlisted" status via a `visibility` column.
- **Rationale**: Unlisted pastes are excluded from `Latest` and `Search` queries but remain accessible via direct UUID link.

## 5. Future Scalability

- As the database grows, we will implement **Turso Read Replicas** in regions with high traffic.
- **Cloudflare R2** may be introduced if we allow file uploads or extremely large text snippets that exceed Turso's row limits.
