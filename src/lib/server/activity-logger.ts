/**
 * Activity Logger
 * 
 * Centralized activity logging for audit trails and activity feeds.
 */
import { db } from '$lib/server/db';
import { activityLog } from '$lib/server/db/schema';
import type { ActivityType } from '$lib/server/db/schema';

export interface LogActivityOptions {
    entityType: 'ticket' | 'project' | 'proposal' | 'invoice' | 'organization' | 'user' | 'announcement';
    entityId: string;
    activityType: ActivityType;
    description: string;
    previousValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    performedById?: string;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Log an activity to the activity log table
 */
export async function logActivity(options: LogActivityOptions): Promise<void> {
    try {
        await db.insert(activityLog).values({
            entityType: options.entityType,
            entityId: options.entityId,
            activityType: options.activityType,
            description: options.description,
            previousValues: options.previousValues,
            newValues: options.newValues,
            performedById: options.performedById,
            ipAddress: options.ipAddress,
            userAgent: options.userAgent
        });
    } catch (error) {
        // Log error but don't throw - activity logging should not break main flow
        console.error('Failed to log activity:', error);
    }
}

/**
 * Log ticket-related activities
 */
export const ticketActivity = {
    async created(ticketId: string, ticketNumber: string, performedById: string, ipAddress?: string) {
        await logActivity({
            entityType: 'ticket',
            entityId: ticketId,
            activityType: 'created',
            description: `Ticket #${ticketNumber} was created`,
            performedById,
            ipAddress
        });
    },

    async statusChanged(
        ticketId: string,
        ticketNumber: string,
        oldStatus: string,
        newStatus: string,
        performedById: string,
        ipAddress?: string
    ) {
        await logActivity({
            entityType: 'ticket',
            entityId: ticketId,
            activityType: 'status_changed',
            description: `Ticket #${ticketNumber} status changed from ${oldStatus} to ${newStatus}`,
            previousValues: { status: oldStatus },
            newValues: { status: newStatus },
            performedById,
            ipAddress
        });
    },

    async assigned(
        ticketId: string,
        ticketNumber: string,
        assigneeName: string | null,
        performedById: string,
        ipAddress?: string
    ) {
        const description = assigneeName
            ? `Ticket #${ticketNumber} was assigned to ${assigneeName}`
            : `Ticket #${ticketNumber} was unassigned`;
        await logActivity({
            entityType: 'ticket',
            entityId: ticketId,
            activityType: 'assigned',
            description,
            newValues: { assignee: assigneeName },
            performedById,
            ipAddress
        });
    },

    async commentAdded(
        ticketId: string,
        ticketNumber: string,
        isInternal: boolean,
        performedById: string,
        ipAddress?: string
    ) {
        await logActivity({
            entityType: 'ticket',
            entityId: ticketId,
            activityType: 'comment_added',
            description: `${isInternal ? 'Internal note' : 'Reply'} added to ticket #${ticketNumber}`,
            newValues: { isInternal },
            performedById,
            ipAddress
        });
    },

    async updated(
        ticketId: string,
        ticketNumber: string,
        changes: Record<string, { old: unknown; new: unknown }>,
        performedById: string,
        ipAddress?: string
    ) {
        const changedFields = Object.keys(changes).join(', ');
        await logActivity({
            entityType: 'ticket',
            entityId: ticketId,
            activityType: 'updated',
            description: `Ticket #${ticketNumber} updated: ${changedFields}`,
            previousValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.old])),
            newValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.new])),
            performedById,
            ipAddress
        });
    },

    async fileUploaded(
        ticketId: string,
        ticketNumber: string,
        fileName: string,
        performedById: string,
        ipAddress?: string
    ) {
        await logActivity({
            entityType: 'ticket',
            entityId: ticketId,
            activityType: 'file_uploaded',
            description: `File "${fileName}" uploaded to ticket #${ticketNumber}`,
            newValues: { fileName },
            performedById,
            ipAddress
        });
    }
};

/**
 * Log user-related activities
 */
export const userActivity = {
    async created(userId: string, email: string, performedById?: string, ipAddress?: string) {
        await logActivity({
            entityType: 'user',
            entityId: userId,
            activityType: 'created',
            description: `User account created for ${email}`,
            performedById,
            ipAddress
        });
    },

    async updated(
        userId: string,
        email: string,
        changes: Record<string, { old: unknown; new: unknown }>,
        performedById: string,
        ipAddress?: string
    ) {
        const changedFields = Object.keys(changes).join(', ');
        await logActivity({
            entityType: 'user',
            entityId: userId,
            activityType: 'updated',
            description: `User ${email} updated: ${changedFields}`,
            previousValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.old])),
            newValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.new])),
            performedById,
            ipAddress
        });
    }
};

/**
 * Log announcement-related activities
 */
export const announcementActivity = {
    async created(announcementId: string, title: string, performedById: string, ipAddress?: string) {
        await logActivity({
            entityType: 'announcement',
            entityId: announcementId,
            activityType: 'created',
            description: `Announcement "${title}" was created`,
            performedById,
            ipAddress
        });
    },

    async updated(
        announcementId: string,
        title: string,
        changes: Record<string, { old: unknown; new: unknown }>,
        performedById: string,
        ipAddress?: string
    ) {
        await logActivity({
            entityType: 'announcement',
            entityId: announcementId,
            activityType: 'updated',
            description: `Announcement "${title}" was updated`,
            previousValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.old])),
            newValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.new])),
            performedById,
            ipAddress
        });
    }
};

/**
 * Log organization-related activities
 */
export const organizationActivity = {
    async created(orgId: string, name: string, performedById: string, ipAddress?: string) {
        await logActivity({
            entityType: 'organization',
            entityId: orgId,
            activityType: 'created',
            description: `Organization "${name}" was created`,
            performedById,
            ipAddress
        });
    },

    async memberAdded(orgId: string, orgName: string, memberEmail: string, performedById: string, ipAddress?: string) {
        await logActivity({
            entityType: 'organization',
            entityId: orgId,
            activityType: 'updated',
            description: `${memberEmail} was added to organization "${orgName}"`,
            newValues: { addedMember: memberEmail },
            performedById,
            ipAddress
        });
    },

    async memberRemoved(orgId: string, orgName: string, memberEmail: string, performedById: string, ipAddress?: string) {
        await logActivity({
            entityType: 'organization',
            entityId: orgId,
            activityType: 'updated',
            description: `${memberEmail} was removed from organization "${orgName}"`,
            previousValues: { removedMember: memberEmail },
            performedById,
            ipAddress
        });
    }
};

/**
 * Get the client IP address from request headers
 */
export function getClientIp(request: Request): string | undefined {
    // Check common proxy headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    
    // CF specific
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }
    
    return undefined;
}
