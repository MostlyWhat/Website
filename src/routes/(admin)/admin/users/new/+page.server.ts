/**
 * Admin User Creation Server Actions
 * 
 * Creates new users with Supabase Auth and associated profile records.
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { createSupabaseAdminClient } from '$lib/server/supabase';

export const load: PageServerLoad = async ({ locals }) => {
    // Verify admin access
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        throw redirect(303, '/admin');
    }

    return {};
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // Verify admin access
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string | null;
        const role = formData.get('role') as 'super_admin' | 'admin' | 'staff' | 'customer';
        const sendInvite = formData.get('sendInvite') === 'true';

        // Validation
        if (!firstName?.trim()) {
            return fail(400, { error: 'First name is required', firstName, lastName, email, phone, role });
        }

        if (!lastName?.trim()) {
            return fail(400, { error: 'Last name is required', firstName, lastName, email, phone, role });
        }

        if (!email?.trim()) {
            return fail(400, { error: 'Email is required', firstName, lastName, email, phone, role });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return fail(400, { error: 'Invalid email format', firstName, lastName, email, phone, role });
        }

        // Only super_admin can create admin/super_admin users
        if (['super_admin', 'admin'].includes(role) && locals.profile.role !== 'super_admin') {
            return fail(403, {
                error: 'Only super admins can create admin users',
                firstName, lastName, email, phone, role
            });
        }

        try {
            const supabaseAdmin = createSupabaseAdminClient();

            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    first_name: firstName.trim(),
                    last_name: lastName.trim()
                }
            });

            if (authError) {
                console.error('Auth user creation error:', authError);
                return fail(400, {
                    error: authError.message || 'Failed to create user account',
                    firstName, lastName, email, phone, role
                });
            }

            if (!authData.user) {
                return fail(500, {
                    error: 'User creation failed - no user returned',
                    firstName, lastName, email, phone, role
                });
            }

            // Create profile in database
            await db.insert(profiles).values({
                id: authData.user.id,
                email: email.toLowerCase().trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                displayName: `${firstName.trim()} ${lastName.trim()}`,
                phone: phone?.trim() || null,
                role: role,
                onboardingCompleted: false,
                preferences: {
                    emailNotifications: true,
                    smsNotifications: false,
                    theme: 'system',
                    language: 'en',
                    timezone: 'UTC',
                    magicLinkEnabled: true
                }
            });

            // Send password reset email as invite
            if (sendInvite) {
                const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
                    type: 'magiclink',
                    email: email,
                    options: {
                        redirectTo: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/auth/callback`
                    }
                });

                if (resetError) {
                    console.error('Failed to send invite email:', resetError);
                    // Don't fail the request, user was still created
                }
            }

            return { success: true, message: `User ${email} created successfully` };
        } catch (err) {
            console.error('User creation exception:', err);
            return fail(500, {
                error: 'An unexpected error occurred while creating user',
                firstName, lastName, email, phone, role
            });
        }
    }
};
