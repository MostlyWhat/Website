import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ActivityLogger, getClientIp } from '$lib/server/activity-logger';
import { createDb } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const email = url.searchParams.get('email');
    const sent = url.searchParams.get('sent') === 'true';
    const redirectTo = url.searchParams.get('redirectTo') ?? '/app';

    return {
        email,
        sent,
        redirectTo
    };
};

export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const supabase = locals.supabase;
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const redirectTo = formData.get('redirectTo') as string || '/app';
        const ipAddress = getClientIp(request);
        const userAgent = request.headers.get('user-agent') ?? undefined;

        if (!email) {
            return fail(400, { error: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return fail(400, { error: 'Please enter a valid email address' });
        }

        // Check if user exists and has magic link enabled
        const db = createDb();
        const [userProfile] = await db
            .select({
                id: profiles.id,
                preferences: profiles.preferences
            })
            .from(profiles)
            .where(eq(profiles.email, email));

        // If user exists and has disabled magic links, reject
        if (userProfile && userProfile.preferences?.magicLinkEnabled === false) {
            return fail(403, {
                error: 'Magic link authentication is disabled for this account. Please sign in with your password or contact support.'
            });
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
                }
            });

            if (error) {
                console.error('Magic link error:', error);

                // Log the failed attempt
                await ActivityLogger.log({
                    type: 'auth.magic_link',
                    action: 'create',
                    description: `Magic link failed for ${email}: ${error.message}`,
                    metadata: { email, error: error.message, ipAddress, userAgent, success: false }
                });

                return fail(500, { error: error.message });
            }

            // Log the successful magic link send
            await ActivityLogger.log({
                type: 'auth.magic_link',
                action: 'create',
                description: `Magic link sent to ${email}`,
                metadata: { email, ipAddress, userAgent, success: true }
            });

            // Redirect to same page with sent=true to show confirmation
            redirect(303, `/auth/magic-link?sent=true&email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}`);
        } catch (err) {
            // Check if it's a redirect (which throws in SvelteKit)
            if (err instanceof Response || (err as any)?.status === 303) {
                throw err;
            }
            console.error('Magic link error:', err);
            return fail(500, { error: 'An unexpected error occurred. Please try again.' });
        }
    }
};
