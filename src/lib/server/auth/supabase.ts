/**
 * Server-side Supabase Client
 * 
 * This module provides utilities for creating Supabase clients on the server.
 * We use the @supabase/ssr package for proper cookie handling in SvelteKit.
 * 
 * IMPORTANT: All database operations should go through Drizzle ORM, not the Supabase client.
 * The Supabase client is only used for authentication.
 */

import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/**
 * Creates a Supabase client for server-side use with cookie handling.
 * This client respects RLS policies and uses the user's session.
 */
export function createSupabaseServerClient(event: RequestEvent) {
    const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = publicEnv.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookiesToSet) => {
                for (const { name, value, options } of cookiesToSet) {
                    event.cookies.set(name, value, { ...options, path: '/' });
                }
            }
        }
    });
}

/**
 * Creates a Supabase admin client with service role key.
 * This bypasses RLS - use with caution and only for admin operations.
 * 
 * NEVER expose this to the client or use in client-accessible code paths.
 */
export function createSupabaseAdminClient() {
    const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return createServerClient(supabaseUrl, serviceRoleKey, {
        cookies: {
            getAll: () => [],
            setAll: () => { }
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

/**
 * Creates a service role client for administrative operations.
 * Alias for createSupabaseAdminClient for clearer naming.
 */
export const createServiceRoleClient = createSupabaseAdminClient;
