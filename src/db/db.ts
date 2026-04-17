// src/db/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prevent multiple instances of Postgres connections in development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// Create the connection
const conn = globalForDb.conn ?? postgres(connectionString, { prepare: false });
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

// Export the Drizzle instance with our schema
export const db = drizzle(conn, { schema });