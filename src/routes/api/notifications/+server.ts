import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserNotifications, getUnreadCount, markNotificationAsRead, markAllNotificationsAsRead } from '$lib/server/notifications';
import { rateLimiters, getClientIP } from '$lib/server/utils/rate-limiter';

/**
 * GET /api/notifications
 * Fetch user notifications
 */
export const GET: RequestHandler = async ({ locals, url, request }) => {
    if (!locals.user || !locals.profile) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting - 100 API requests per minute per user
    const clientIP = getClientIP(request, request.headers);
    const rateLimitKey = `${clientIP}:${locals.user.id}`;
    const rateLimitResult = await rateLimiters.api.check(rateLimitKey);

    if (!rateLimitResult.success) {
        const resetInSeconds = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
        return json({ error: `Too many requests. Please try again in ${resetInSeconds} seconds.` }, { status: 429 });
    }

    const limit = parseInt(url.searchParams.get('limit') || '20');

    try {
        const [notifications, unreadCount] = await Promise.all([
            getUserNotifications(locals.profile.id, limit),
            getUnreadCount(locals.profile.id)
        ]);

        return json({
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
};

/**
 * PATCH /api/notifications/:id
 * Mark notification as read
 */
export const PATCH: RequestHandler = async ({ locals, url, request }) => {
    if (!locals.user || !locals.profile) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting - 100 API requests per minute per user
    const clientIP = getClientIP(request, request.headers);
    const rateLimitKey = `${clientIP}:${locals.user.id}`;
    const rateLimitResult = await rateLimiters.api.check(rateLimitKey);

    if (!rateLimitResult.success) {
        const resetInSeconds = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
        return json({ error: `Too many requests. Please try again in ${resetInSeconds} seconds.` }, { status: 429 });
    }

    const notificationId = url.searchParams.get('id');
    const action = url.searchParams.get('action');

    try {
        if (action === 'mark-all-read') {
            await markAllNotificationsAsRead(locals.profile.id);
            return json({ success: true, message: 'All notifications marked as read' });
        }

        if (!notificationId) {
            return json({ error: 'Notification ID required' }, { status: 400 });
        }

        await markNotificationAsRead(notificationId, locals.profile.id);
        return json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error updating notification:', error);
        return json({ error: 'Failed to update notification' }, { status: 500 });
    }
};
