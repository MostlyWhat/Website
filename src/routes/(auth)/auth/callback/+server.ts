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

                // SECURITY: Always redirect to onboarding if not completed
                // This ensures users complete their profile before accessing the app
                if (!profile.onboardingCompleted) {
                    redirect(303, '/onboarding');
                }

                // Profile exists and onboarding complete - safe to redirect
                redirect(303, redirectTo);
            } catch (profileError) {
                console.error('Profile creation error:', profileError);
                // SECURITY: On profile error, redirect to onboarding
                // It will attempt to create the profile again
                redirect(303, '/onboarding');
            }
        }

        // No user data - something went wrong
        redirect(303, '/auth/login?error=no_user_data');
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

                // SECURITY: Always redirect to onboarding if not completed
                if (!profile.onboardingCompleted) {
                    redirect(303, '/onboarding');
                }

                // Profile exists and onboarding complete - safe to redirect
                redirect(303, redirectTo);
            } catch (profileError) {
                console.error('Profile creation error:', profileError);
                // For password reset, still redirect there
                if (type === 'recovery') {
                    redirect(303, '/auth/reset-password');
                }
                // SECURITY: On profile error, redirect to onboarding
                redirect(303, '/onboarding');
            }
        }

        // No user data - something went wrong
        redirect(303, '/auth/login?error=no_user_data');
    }

    // No code or token_hash provided
    redirect(303, '/auth/login?error=missing_auth_params');
};
