// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Profile } from '$lib/server/db/schema';

declare global {
    namespace App {
        interface Locals {
            /**
             * Supabase client for this request - respects RLS
             */
            supabase: SupabaseClient;

            /**
             * Safely get the session with JWT validation.
             * Unlike getSession(), this validates the JWT before returning.
             */
            safeGetSession: () => Promise<{
                session: Session | null;
                user: User | null;
            }>;

            /**
             * The current session (may be null if not authenticated)
             */
            session: Session | null;

            /**
             * The authenticated user from Supabase Auth (may be null)
             */
            user: User | null;

            /**
             * The user's profile from our database (may be null)
             * Includes role, preferences, and onboarding status
             */
            profile: Profile | null;
        }

        interface PageData {
            session: Session | null;
            user: User | null;
            profile: Profile | null;
        }

        interface Platform {
            env: Env;
            cf: CfProperties;
            ctx: ExecutionContext;
        }

        // interface Error {}
        // interface PageState {}
    }
}

export { };
