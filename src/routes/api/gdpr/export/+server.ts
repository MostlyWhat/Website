import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exportUserData, formatDataExport } from '$lib/server/gdpr';

/**
 * GET /api/gdpr/export
 * Export all user data in GDPR-compliant format
 */
export const GET: RequestHandler = async ({ locals }) => {
    try {
        const session = await locals.safeGetSession();

        if (!session?.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Export all user data
        const userData = await exportUserData(session.user.id);
        const exportJson = formatDataExport(userData);

        // Return as downloadable JSON file
        return new Response(exportJson, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="data-export-${session.user.id}-${Date.now()}.json"`
            }
        });
    } catch (error) {
        console.error('Error exporting user data:', error);
        return json({ error: 'Failed to export data' }, { status: 500 });
    }
};
