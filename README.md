# Paste
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/a37d9a81-5270-41ee-aeda-c5c4c3afcbfd" />


This is paste app for sharing text and code snippets quickly and easily.
I built this because I wanted a simple, clean place to share text and code without any extra noise or bloat. It's designed to be fast, minimal with modern looks.

### Why use this?

- **Speed**: Built on the edge (Cloudflare Workers) so it loads instantly.
- **Search**: A quick search that actually works across titles and content.
- **Privacy**: Set your pastes to expire automatically whenever you want.
- **Clean**: No tracking, no ads, just your text.
- **Open Source**: Fully open source so you can see exactly how it works.

### Getting it running

If you want to run this locally, you'll just need `pnpm`:

```bash
#setup the .env see .env.example for reference
#then install deps and run
pnpm install
pnpm dev
```

The database uses Turso (SQLite), so make sure you have your environment variables set up if you're planning to deploy it yourself.

### Tech

- React Router 7
- Cloudflare Workers
- Turso (Drizzle ORM)
- Tailwind CSS 4
