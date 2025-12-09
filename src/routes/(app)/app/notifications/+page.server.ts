import type { PageServerLoad, Actions } from './$types';
import { getUserNotifications, markAllNotificationsAsRead, getUnreadCount } from '$lib/server/notifications';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    const [notifications, unreadCount] = await Promise.all([
        getUserNotifications(locals.profile.id, 50),
        getUnreadCount(locals.profile.id)
    ]);

    return {
        notifications,
        unreadCount
    };
};

export const actions: Actions = {
    markAllRead: async ({ locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        try {
            await markAllNotificationsAsRead(locals.profile.id);
            return { success: true, message: 'All notifications marked as read' };
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            return fail(500, { error: 'Failed to mark notifications as read' });
        }
    }
};
