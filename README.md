# Paste

A high-performance, edge-native pastebin built on Cloudflare Workers and Turso.

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/a37d9a81-5270-41ee-aeda-c5c4c3afcbfd" />

Paste is a minimalist code sharing platform designed for the modern web. It prioritizes speed, developer experience, and privacy by leveraging a globally distributed architecture. By shifting compute and data to the edge, Paste ensures 0ms cold starts and instant content delivery.

## Key Features

- **Edge-First Performance**: Built on Cloudflare Workers for sub-100ms global response times.
- **Type-Safe Persistence**: Powered by Turso (libSQL) and Drizzle ORM for reliable, distributed data.
- **Minimalist UX**: Fast search, automatic expiration, and a clean, ad-free interface.
- **Modern DX**: Leverages React Router 7's framework mode and Tailwind CSS 4.

## Documentation

To understand the engineering behind the project or to get involved, please refer to our internal documentation:

- **[Architecture](./ARCHITECTURE.md)**: System design, data lifecycle, and Architectural Decision Records (ADRs).
- **[Roadmap](./todo.md)**: Current progress, feature phases, and technical priorities.
- **[Contributing](./CONTRIBUTING.md)**: Local setup guide, engineering standards, and PR workflows.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: React Router 7 (Framework Mode)
- **Database**: Turso (libSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Validation**: Zod

## Getting Started

Ensure you have `pnpm` and the `Wrangler` CLI installed.

```bash
# Install dependencies
pnpm install

# Setup environment variables (refer to .env.example)
cp .env.example .env

# Synchronize database schema
pnpm db:generate
pnpm db:migrate

# Start the development environment
pnpm dev
```

## Useful commands

```bash
# create new drizzle migration file
drizzle-kit generate --custom --name=<name>

```

For detailed contribution guidelines and setup troubleshooting, see **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## License

MIT License. See [LICENSE](./LICENSE) for details.
