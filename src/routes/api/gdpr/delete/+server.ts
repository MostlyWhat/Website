import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteUserData } from '$lib/server/gdpr';
import { logActivity } from '$lib/server/utils/activity-logger';

/**
 * POST /api/gdpr/delete
 * Delete all user data (Right to be Forgotten)
 * 
 * Requires confirmation in request body
 */
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const session = await locals.safeGetSession();

        if (!session?.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json() as { confirm?: boolean; confirmText?: string };

        // Require explicit confirmation
        if (body.confirm !== true || body.confirmText !== 'DELETE MY DATA') {
            return json({
                error: 'Confirmation required. Please confirm by setting confirm=true and confirmText="DELETE MY DATA"'
            }, { status: 400 });
        }

        // Log the deletion request
        await logActivity({
            entityType: 'user',
            entityId: session.user.id,
            activityType: 'deleted',
            description: 'User requested account and data deletion (GDPR)'
        });

        // Delete all user data
        const result = await deleteUserData(session.user.id);

        // Sign out the user
        await locals.supabase.auth.signOut();

        return json({
            success: true,
            message: 'Your data has been permanently deleted',
            details: result
        });
    } catch (error) {
        console.error('Error deleting user data:', error);
        return json({ error: 'Failed to delete data' }, { status: 500 });
    }
};
