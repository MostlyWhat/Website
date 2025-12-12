/**
 * Notifications System
 * 
 * Centralized notification delivery for users and admins.
 * Handles in-app notifications and email delivery.
 */

import { createDb } from '../db';
import { userNotifications, profiles } from '../db/schema';
import type { NotificationType } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export interface NotificationPayload {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    entityType?: string;
    entityId?: string;
}

/**
 * Create a new notification for a user
 */
export async function createNotification(payload: NotificationPayload): Promise<string> {
    const db = createDb();

    const [notification] = await db
        .insert(userNotifications)
        .values({
            userId: payload.userId,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            link: payload.link,
            entityType: payload.entityType,
            entityId: payload.entityId,
            isRead: false
        })
        .returning({ id: userNotifications.id });

    // Send email notification if user has email notifications enabled
    try {
        const profile = await db.query.profiles.findFirst({
            where: eq(profiles.id, payload.userId)
        });

        if (profile?.email && profile?.preferences?.emailNotifications) {
            const { sendNotificationEmail } = await import('$lib/server/email');
            await sendNotificationEmail({
                userEmail: profile.email,
                userName: profile.displayName || profile.firstName || 'User',
                notificationTitle: payload.title,
                notificationMessage: payload.message,
                actionUrl: payload.link ? `https://mostlywhat.com${payload.link}` : undefined
            });
        }
    } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the notification if email fails
    }

    return notification.id;
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    entityType?: string,
    entityId?: string
): Promise<void> {
    const db = createDb();

    const notifications = userIds.map((userId) => ({
        userId,
        type,
        title,
        message,
        link,
        entityType,
        entityId,
        isRead: false
    }));

    await db.insert(userNotifications).values(notifications);
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    const db = createDb();

    await db
        .update(userNotifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(userNotifications.id, notificationId), eq(userNotifications.userId, userId)));
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    const db = createDb();

    await db
        .update(userNotifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(userNotifications.userId, userId), eq(userNotifications.isRead, false)));
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
    const db = createDb();

    const notifications = await db
        .select()
        .from(userNotifications)
        .where(and(eq(userNotifications.userId, userId), eq(userNotifications.isRead, false)));

    return notifications.length;
}

/**
 * Get recent notifications for a user
 */
export async function getUserNotifications(userId: string, limit = 20) {
    const db = createDb();

    return await db
        .select()
        .from(userNotifications)
        .where(eq(userNotifications.userId, userId))
        .orderBy(desc(userNotifications.createdAt))
        .limit(limit);
}

/**
 * Delete old read notifications (cleanup task)
 */
export async function deleteOldNotifications(daysOld = 30): Promise<void> {
    const db = createDb();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // This would need a direct SQL query or a where clause with comparison
    // For now, leaving as placeholder for future implementation
    console.log(`Cleanup notifications older than ${cutoffDate}`);
}

// =============================================================================
// NOTIFICATION TEMPLATES
// =============================================================================

/**
 * Ticket notification helpers
 */
export const ticketNotifications = {
    /**
     * Notify user when ticket status changes
     */
    statusChanged: async (
        userId: string,
        ticketNumber: string,
        ticketId: string,
        newStatus: string
    ) => {
        const statusMap: Record<string, string> = {
            open: 'opened',
            in_progress: 'being worked on',
            resolved: 'resolved',
            closed: 'closed'
        };

        await createNotification({
            userId,
            type: 'ticket_update',
            title: `Ticket #${ticketNumber} ${statusMap[newStatus] || 'updated'}`,
            message: `Your support ticket has been ${statusMap[newStatus] || 'updated'}.`,
            link: `/app/tickets/${ticketId}`,
            entityType: 'ticket',
            entityId: ticketId
        });
    },

    /**
     * Notify user when ticket is assigned
     */
    assigned: async (userId: string, ticketNumber: string, ticketId: string, assigneeName: string) => {
        await createNotification({
            userId,
            type: 'ticket_update',
            title: `Ticket #${ticketNumber} assigned`,
            message: `Your ticket has been assigned to ${assigneeName}.`,
            link: `/app/tickets/${ticketId}`,
            entityType: 'ticket',
            entityId: ticketId
        });
    },

    /**
     * Notify user when new comment is added
     */
    commentAdded: async (userId: string, ticketNumber: string, ticketId: string) => {
        await createNotification({
            userId,
            type: 'ticket_update',
            title: `New comment on ticket #${ticketNumber}`,
            message: 'A staff member has replied to your ticket.',
            link: `/app/tickets/${ticketId}`,
            entityType: 'ticket',
            entityId: ticketId
        });
    },

    /**
     * Notify staff when new ticket is created
     */
    newTicket: async (
        staffUserIds: string[],
        ticketNumber: string,
        ticketId: string,
        subject: string
    ) => {
        await createBulkNotifications(
            staffUserIds,
            'ticket_update',
            `New Ticket #${ticketNumber}`,
            subject,
            `/admin/tickets/${ticketId}`,
            'ticket',
            ticketId
        );
    }
};

/**
 * Project notification helpers
 */
export const projectNotifications = {
    /**
     * Notify user when project status changes
     */
    statusChanged: async (
        userId: string,
        projectName: string,
        projectId: string,
        newStatus: string
    ) => {
        await createNotification({
            userId,
            type: 'project_update',
            title: `Project "${projectName}" ${newStatus}`,
            message: `Your project status has been updated to ${newStatus}.`,
            link: `/app/projects/${projectId}`,
            entityType: 'project',
            entityId: projectId
        });
    },

    /**
     * Notify user when project milestone is reached
     */
    milestoneReached: async (
        userId: string,
        projectName: string,
        projectId: string,
        milestone: string
    ) => {
        await createNotification({
            userId,
            type: 'project_update',
            title: `Milestone reached: ${milestone}`,
            message: `Your project "${projectName}" has reached a new milestone.`,
            link: `/app/projects/${projectId}`,
            entityType: 'project',
            entityId: projectId
        });
    }
};

/**
 * Invoice notification helpers
 */
export const invoiceNotifications = {
    /**
     * Notify user when new invoice is created
     */
    created: async (userId: string, invoiceNumber: string, invoiceId: string, amount: number) => {
        await createNotification({
            userId,
            type: 'invoice_update',
            title: `New invoice #${invoiceNumber}`,
            message: `You have a new invoice for $${amount.toFixed(2)}.`,
            link: `/app/invoices/${invoiceId}`,
            entityType: 'invoice',
            entityId: invoiceId
        });
    },

    /**
     * Notify user when invoice is due soon
     */
    dueSoon: async (userId: string, invoiceNumber: string, invoiceId: string, daysUntilDue: number) => {
        await createNotification({
            userId,
            type: 'invoice_update',
            title: `Invoice #${invoiceNumber} due in ${daysUntilDue} days`,
            message: 'Please review and pay your invoice before the due date.',
            link: `/app/invoices/${invoiceId}`,
            entityType: 'invoice',
            entityId: invoiceId
        });
    },

    /**
     * Notify user when invoice is paid
     */
    paid: async (userId: string, invoiceNumber: string, invoiceId: string) => {
        await createNotification({
            userId,
            type: 'invoice_update',
            title: `Payment confirmed for invoice #${invoiceNumber}`,
            message: 'Thank you for your payment.',
            link: `/app/invoices/${invoiceId}`,
            entityType: 'invoice',
            entityId: invoiceId
        });
    }
};

/**
 * Announcement notification helpers
 */
export const announcementNotifications = {
    /**
     * Notify users about new announcement
     */
    created: async (userIds: string[], title: string, announcementId: string) => {
        await createBulkNotifications(
            userIds,
            'announcement',
            'New Announcement',
            title,
            '/app/announcements',
            'announcement',
            announcementId
        );
    }
};

/**
 * System notification helpers
 */
export const systemNotifications = {
    /**
     * Send welcome notification to new users
     */
    welcome: async (userId: string) => {
        await createNotification({
            userId,
            type: 'system',
            title: 'Welcome to MostlyWhat Systems!',
            message: 'Get started by exploring your dashboard and submitting your first project request.',
            link: '/app'
        });
    },

    /**
     * Notify user about account verification
     */
    verificationComplete: async (userId: string) => {
        await createNotification({
            userId,
            type: 'system',
            title: 'Account verified',
            message: 'Your account has been successfully verified. You now have full access.',
            link: '/app'
        });
    }
};
