# Contributing to Paste

First off, thank you for considering contributing to Paste! It’s people like you that make this a great tool for the developer community.

As a project running on the **Cloudflare Edge**, there are specific workflows and standards we follow to ensure the app remains fast, secure, and maintainable.

---

## Local Development Setup

To get a local development environment running, follow these steps:

### 1. Prerequisites

- **pnpm**: Our preferred package manager.
- **Turso CLI**: If you plan on modifying the database schema.

### 2. Environment Configuration

Copy the example environment file and fill in your local or development credentials:

```bash
cp .env.example .env
```

_Note: Ensure you have your Turso `DATABASE_URL` and `DATABASE_AUTH_TOKEN` ready._

### 3. Installation & Database

```bash
pnpm install
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Apply migrations to your database
```

### 4. Running the App

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

---

## Engineering Standards

To maintain a high-quality codebase, we adhere to the following principles:

### 1. Type Safety

- **No `any`**: Use proper TypeScript interfaces.
- **Zod**: All external data (API payloads, form submissions) **must** be validated with Zod.
- **Typecheck**: Run `pnpm typecheck` before submitting any PR.

### 2. Architecture Patterns

- **Edge Compatibility**: Avoid Node.js built-ins. Use Web Standard APIs (Fetch, Request, Response).
- **Database Access**: All database logic should reside in `app/db/queries.ts`. Do not write raw SQL in your components.
- **Component Library**: Use `shadcn/ui` components located in `app/components/ui`. Ensure they are Tailwind 4 compatible.

### 3. Performance

- **WaitUntil**: For non-blocking tasks (like analytics or cache warming), use `context.cloudflare.ctx.waitUntil`.
- **Bundle Size**: Be mindful of large dependencies. If a library is heavy, consider if the logic can be moved to the server/worker.

---

## Pull Request Process

1.  **Branching**: Create a branch with a descriptive name: `feat/syntax-highlighting` or `fix/expiry-bug`.
2.  **Atomic Commits**: We prefer [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add dark mode support`).
3.  **Documentation**: If you change the data flow or add a major feature, please update `ARCHITECTURE.md`.
4.  **Self-Review**: Before marking a PR as ready, verify:
    - [ ] `pnpm typecheck` passes.
    - [ ] `pnpm test` coverage is sufficient for new code.
    - [ ] The UI looks correct in both Light and Dark modes.
    - [ ] You haven't introduced any console logs in production code.

---

## Communication

If you're unsure about a certain architectural direction, please open an **Issue** for discussion before writing the code. This saves everyone time and ensures alignment with the project's [Architecture](./ARCHITECTURE.md).
