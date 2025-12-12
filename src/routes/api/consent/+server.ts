import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logConsent } from '$lib/server/gdpr';

interface ConsentData {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
    try {
        const body = await request.json() as ConsentData;
        const session = await locals.safeGetSession();

        // If user is logged in, save consent to database
        if (session?.user) {
            const ipAddress = getClientAddress();
            const userAgent = request.headers.get('user-agent');

            // Log each consent type
            for (const [type, granted] of Object.entries(body)) {
                if (type !== 'necessary') { // Necessary is always true
                    await logConsent({
                        userId: session.user.id,
                        consentType: type as 'marketing' | 'analytics' | 'functional',
                        granted: granted as boolean,
                        timestamp: new Date(),
                        ipAddress,
                        userAgent: userAgent || undefined
                    });
                }
            }
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error saving consent:', error);
        return json({ error: 'Failed to save consent' }, { status: 500 });
    }
};
