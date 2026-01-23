## Tech Stack

- **Framework**: React Router 7 (Framework Mode)
- **Runtime**: Cloudflare Workers
- **Database**: Turso (LibSQL) with Drizzle ORM
- **Package Manager**: pnpm, with pnpx for one-offs
- **CSS**: Tailwind CSS 4 (CSS-first configuration)
- **UI Components**: shadcn/ui (Radix-based)
- **Icons**: Lucide React

## Critical Workflow Commands

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start development server.
- `pnpm db:generate`: Generate SQL migrations from schema.ts.
- `pnpm db:migrate`: Apply migrations to Turso database.
- `pnpm db:seed`: Seed database with initial data.
- `pnpm cf-typegen`: Update Cloudflare types in worker-configuration.d.ts.
- `pnpm typecheck`: Run TypeScript checks.

## Architecture & Conventions

### Directory Structure

- `/app/db`: Schema (schema.ts), client (index.ts), queries (queries.ts).
- `/app/routes`: Page routes and API endpoints.
- `/app/components/ui`: shadcn/ui components.
- `/workers/app.ts`: Cloudflare Worker entry point.
- `/wrangler.jsonc`: Cloudflare config and bindings.

### Coding Standards

- **React Router 7**: Use Route types for loaders/actions. Prefer fetcher for non-reload actions.
- **Database (Drizzle)**: Access data via app/db/queries.ts. Handle ID collisions for random IDs.
- **Environment Variables**: Access via AppLoadContext (context.cloudflare.env).
- **Styling**: Use Tailwind CSS 4. Customize via CSS variables or @theme in app/app.css.
- **UI Components**: Add with pnpx shadcn@latest add <component>. Ensure Tailwind 4 compatibility.

## AI Agent Instructions

- **Code Block Formatting**: Use path/to/file.ext#Lstart-end.
- **Incremental Exploration**: Read sections by line numbers for large files.
- **Roadmap Alignment**: Check todo.md for features.
- **Complex Tasks**: Break into phases in todo.md, complete phase 1, update.
- **Security First**: Validate inputs with zod, protect sensitive ops.
- **Type Safety**: Maintain TypeScript. Run pnpm typecheck if types change.
