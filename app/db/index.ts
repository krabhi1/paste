import { drizzle } from "drizzle-orm/libsql";

export type Db = ReturnType<typeof drizzle>;
let _db: Db;
function setDb(database: Db) {
  _db = database;
}
function db(): Db {
  if (!_db) {
    throw new Error("Database not initialized");
  }
  return _db;
}
export { db, setDb };
