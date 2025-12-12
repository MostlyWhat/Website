import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

/**
 * Database Connection for Cloudflare Workers
 * 
 * Cloudflare Workers have strict request isolation - each request runs in
 * its own context and cannot share I/O objects (like database connections)
 * with other requests.
 * 
 * IMPORTANT: Always use `createDb()` to get a database instance within
 * request handlers. Do NOT use the `db` export in Cloudflare Workers as
 * it may cause "Cannot perform I/O on behalf of a different request" errors.
 */

export type DbSchema = typeof schema;
export type Database = PostgresJsDatabase<DbSchema>;

/**
 * Creates a new database connection.
 * 
 * Call this function within your request handler (load functions, actions,
 * API routes) to get a database connection that's safe for Cloudflare Workers.
 * 
 * @example
 * ```ts
 * export const load: PageServerLoad = async ({ locals }) => {
 *   const db = createDb();
 *   const users = await db.query.users.findMany();
 *   return { users };
 * };
 * ```
 */
export function createDb(): Database {
    if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }

    const client = postgres(env.DATABASE_URL, {
        // Connection settings optimized for serverless/Workers
        max: 1, // Single connection per instance
        idle_timeout: 20, // Close idle connections after 20s
        connect_timeout: 10, // Connection timeout
        prepare: false, // Disable prepared statements for connection poolers like Supavisor
    });

    return drizzle(client, { schema });
}

/**
 * Legacy database export for backwards compatibility.
 * 
 * WARNING: This export creates a connection at module load time.
 * In Cloudflare Workers, this may cause I/O context errors.
 * 
 * For Workers deployments, use `createDb()` instead, or access
 * the database via `event.locals.db` (set up in hooks.server.ts).
 * 
 * @deprecated Use `createDb()` or `event.locals.db` for Workers compatibility
 */
export const db = createDb();
