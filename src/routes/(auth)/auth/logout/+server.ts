import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logLoginEvent, getClientIp } from '$lib/server/activity-logger';

/**
 * Logout Handler
 * 
 * Signs out the user and redirects to home page.
 */
export const GET: RequestHandler = async ({ request, locals: { supabase, session } }) => {
    // Log logout event before signing out
    if (session?.user) {
        await logLoginEvent({
            profileId: session.user.id,
            eventType: 'logout',
            ipAddress: getClientIp(request),
            userAgent: request.headers.get('user-agent') ?? undefined,
            loginMethod: 'session',
            success: true
        });
    }
    
    await supabase.auth.signOut();
    redirect(303, '/');
};

export const POST: RequestHandler = async ({ request, locals: { supabase, session } }) => {
    // Log logout event before signing out
    if (session?.user) {
        await logLoginEvent({
            profileId: session.user.id,
            eventType: 'logout',
            ipAddress: getClientIp(request),
            userAgent: request.headers.get('user-agent') ?? undefined,
            loginMethod: 'session',
            success: true
        });
    }
    
    await supabase.auth.signOut();
    redirect(303, '/');
};
