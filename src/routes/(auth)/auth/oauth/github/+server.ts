import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GitHub OAuth handler
 * 
 * Initiates the OAuth flow with GitHub
 */
export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
    const redirectTo = url.searchParams.get('redirectTo') ?? '/app';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
        }
    });

    if (error) {
        console.error('GitHub OAuth error:', error.message);
        redirect(303, '/auth/login?error=oauth_error');
    }

    if (data.url) {
        redirect(303, data.url);
    }

    redirect(303, '/auth/login?error=oauth_error');
};
