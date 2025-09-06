declare module "cloudflare:test" {
  // ProvidedEnv controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv extends Env {
    TURSO_CONNECTION_URL: string;
    TURSO_AUTH_TOKEN: string;
  }
}
