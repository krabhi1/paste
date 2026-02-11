import { createRequestHandler } from "react-router";
import { drizzle } from "drizzle-orm/libsql";
import { type Db, setDb } from "~/db";
import * as schema from "~/db/schema";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: Db;
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const _db = drizzle({
      connection: {
        url: env.TURSO_CONNECTION_URL!,
        authToken: env.TURSO_AUTH_TOKEN!,
      },
      schema,
    });
    setDb(_db);
    return requestHandler(request, {
      cloudflare: { env, ctx },
      db: _db,
    });
  },
} satisfies ExportedHandler<Env>;
