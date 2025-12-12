import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getOrCreateProfile } from '$lib/server/auth';
import { logActivity, getClientIp } from '$lib/server/utils/activity-logger';
import { rateLimiters, getClientIP } from '$lib/server/utils/rate-limiter';

export const actions: Actions = {
    default: async ({ request, locals: { supabase }, url }) => {
		// Rate limiting - 5 registration attempts per 15 minutes per IP
		const clientIP = getClientIP(request, request.headers);
		const rateLimitResult = await rateLimiters.auth.check(clientIP);

		if (!rateLimitResult.success) {
			const resetInMinutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
			return fail(429, { error: `Too many registration attempts. Please try again in ${resetInMinutes} minute${resetInMinutes > 1 ? 's' : ''}.` });
		}

        const formData = await request.formData();
        const ipAddress = getClientIp(request);
        const userAgent = request.headers.get('user-agent') ?? undefined;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const redirectTo = formData.get('redirectTo') as string ?? '/onboarding';

        // Validation
        if (!email || !password || !confirmPassword) {
            return fail(400, { error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match' });
        }

        if (password.length < 8) {
            return fail(400, { error: 'Password must be at least 8 characters' });
        }

        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
            }
        });

        if (error) {
            console.error('Registration error:', error.message);

            if (error.message.includes('already registered')) {
                return fail(400, { error: 'An account with this email already exists' });
            }

            return fail(400, { error: 'Failed to create account. Please try again.' });
        }

        // If email confirmation is required, show message
        if (data.user && !data.session) {
            return {
                success: true,
                message: 'Check your email to confirm your account before signing in.'
            };
        }

        // If auto-confirmed (development mode), create profile and redirect
        if (data.user && data.session) {
            try {
                await getOrCreateProfile(data.user);

                // Log registration activity
                await logActivity({
                    entityType: 'user',
                    entityId: data.user.id,
                    activityType: 'created',
                    description: `User account registered: ${email}`,
                    newValues: { email },
                    performedById: data.user.id,
                    ipAddress,
                    userAgent
                });
            } catch (profileError) {
                console.error('Failed to create profile:', profileError);
                return fail(500, { error: 'Account created but profile setup failed. Please try logging in.' });
            }
            return redirect(303, '/onboarding');
        }

        return {
            success: true,
            message: 'Account created successfully. Please check your email to verify your account.'
        };
    }
};
