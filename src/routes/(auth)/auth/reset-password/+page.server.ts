import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { logActivity, getClientIp } from '$lib/server/activity-logger';

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        const ipAddress = getClientIp(request);
        const userAgent = request.headers.get('user-agent') ?? undefined;

        // Validation
        if (!password || !confirmPassword) {
            return fail(400, { error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match' });
        }

        if (password.length < 8) {
            return fail(400, { error: 'Password must be at least 8 characters' });
        }

        const { data, error } = await supabase.auth.updateUser({
            password
        });

        if (error) {
            console.error('Password update error:', error.message);
            return fail(400, { error: 'Failed to update password. Please try again.' });
        }

        // Log password reset
        if (data.user) {
            await logActivity({
                entityType: 'user',
                entityId: data.user.id,
                activityType: 'updated',
                description: 'Password was reset via recovery link',
                performedById: data.user.id,
                ipAddress,
                userAgent
            });
        }

        return { success: true };
    }
};
