import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getOrCreateProfile } from '$lib/server/auth';
import { logLoginEvent, getClientIp } from '$lib/server/activity-logger';

/**
 * Auth Callback Handler
 * 
 * Handles the redirect from OAuth providers and magic links.
 * Exchanges the code for a session and redirects to the appropriate page.
 */
export const GET = async ({ url, request, locals: { supabase } }: RequestEvent) => {
    const code = url.searchParams.get('code');
    const token_hash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    const redirectTo = url.searchParams.get('redirectTo') ?? '/app';
    
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') ?? undefined;

    // Handle code exchange (OAuth)
    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Code exchange error:', error.message);
            redirect(303, '/auth/login?error=auth_callback_error');
        }

        if (data.user) {
            try {
                const profile = await getOrCreateProfile(data.user);

                // Log successful login
                await logLoginEvent({
                    profileId: data.user.id,
                    eventType: 'login',
                    ipAddress,
                    userAgent,
                    loginMethod: 'oauth',
                    success: true,
                    sessionId: data.session?.access_token?.slice(-16)
                });

                // Redirect to onboarding if not completed
                if (!profile.onboardingCompleted) {
                    redirect(303, '/onboarding');
                }
            } catch (profileError) {
                console.error('Profile creation error:', profileError);
                // Still redirect - profile will be created on next login
            }
        }

        redirect(303, redirectTo);
    }

    // Handle token hash (magic link, email verification, password reset)
    if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'email' | 'recovery' | 'signup'
        });

        if (error) {
            console.error('OTP verification error:', error.message);
            redirect(303, '/auth/login?error=verification_error');
        }

        if (data.user) {
            try {
                const profile = await getOrCreateProfile(data.user);

                // Log successful login/verification
                await logLoginEvent({
                    profileId: data.user.id,
                    eventType: type === 'recovery' ? 'password_reset' : 'login',
                    ipAddress,
                    userAgent,
                    loginMethod: 'magic_link',
                    success: true,
                    sessionId: data.session?.access_token?.slice(-16)
                });

                // For password reset, redirect to reset page
                if (type === 'recovery') {
                    redirect(303, '/auth/reset-password');
                }

                // For email verification or magic link
                if (!profile.onboardingCompleted) {
                    redirect(303, '/onboarding');
                }
            } catch (profileError) {
                console.error('Profile creation error:', profileError);
                // For password reset, still redirect
                if (type === 'recovery') {
                    redirect(303, '/auth/reset-password');
                }
            }
        }

        redirect(303, redirectTo);
    }

    // No code or token_hash provided
    redirect(303, '/auth/login?error=missing_auth_params');
};
