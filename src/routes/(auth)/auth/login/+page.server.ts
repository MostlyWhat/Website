import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getOrCreateProfile } from '$lib/server/auth';
import { env } from '$env/dynamic/public';
import { logLoginEvent, getClientIp } from '$lib/server/activity-logger';

export const actions: Actions = {
    /**
     * Email/Password Login
     */
    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const redirectTo = formData.get('redirectTo') as string ?? '/app';

        const ipAddress = getClientIp(request);
        const userAgent = request.headers.get('user-agent') ?? undefined;

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error.message);

            // Log failed login attempt if we can identify the user
            // Note: We'd need to look up the user by email, but for now just log the attempt
            return fail(400, { error: 'Invalid email or password' });
        }

        // Get or create profile for the user
        if (data.user) {
            const profile = await getOrCreateProfile(data.user);

            // Log successful login
            await logLoginEvent({
                profileId: data.user.id,
                eventType: 'login',
                ipAddress,
                userAgent,
                loginMethod: 'password',
                success: true,
                sessionId: data.session?.access_token?.slice(-16)
            });

            // If user hasn't completed onboarding, redirect there
            if (!profile.onboardingCompleted) {
                return redirect(303, '/onboarding');
            }
        }

        return redirect(303, redirectTo);
    },

    /**
     * Magic Link Login
     */
    magicLink: async ({ request, locals: { supabase }, url }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const redirectTo = formData.get('redirectTo') as string ?? '/app';

        if (!email) {
            return fail(400, { error: 'Email is required' });
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
            }
        });

        if (error) {
            console.error('Magic link error:', error.message);
            return fail(400, { error: 'Failed to send magic link. Please try again.' });
        }

        return {
            success: true,
            message: 'Check your email for a magic link to sign in.'
        };
    }
};
