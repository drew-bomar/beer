import postgres from "postgres";

// Single shared connection pool; survives Next.js dev-server hot reloads.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

export const sql =
  globalForDb.sql ??
  postgres(process.env.DATABASE_URL ?? "postgresql://beer:beer@localhost:54322/beer", {
    max: 10,
    // Supabase's transaction pooler (production) doesn't support prepared statements.
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;
