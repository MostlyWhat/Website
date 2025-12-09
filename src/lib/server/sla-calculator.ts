/**
 * SLA Calculator
 * 
 * Calculates SLA deadlines and breach status for tickets based on SLA policies.
 */

import type { TicketPriority } from './db/schema';

export interface SLAPolicy {
    urgentResponseHours: number;
    urgentResolutionHours: number;
    highResponseHours: number;
    highResolutionHours: number;
    mediumResponseHours: number;
    mediumResolutionHours: number;
    lowResponseHours: number;
    lowResolutionHours: number;
    businessHoursOnly: boolean;
    businessHoursStart: number;
    businessHoursEnd: number;
    businessDays: number[];
}

export interface SLAStatus {
    responseDueAt: Date;
    resolutionDueAt: Date;
    responseBreached: boolean;
    resolutionBreached: boolean;
    responseTimeRemaining: number; // in hours
    resolutionTimeRemaining: number; // in hours
    responsePercentUsed: number; // 0-100
    resolutionPercentUsed: number; // 0-100
    urgencyLevel: 'normal' | 'warning' | 'critical'; // based on time remaining
}

/**
 * Calculate business hours between two dates
 */
function calculateBusinessHours(
    start: Date,
    end: Date,
    businessStart: number,
    businessEnd: number,
    businessDays: number[]
): number {
    let hours = 0;
    const current = new Date(start);

    while (current < end) {
        const dayOfWeek = current.getDay();
        const hour = current.getHours();

        // Check if it's a business day and business hour
        if (businessDays.includes(dayOfWeek) && hour >= businessStart && hour < businessEnd) {
            hours++;
        }

        current.setHours(current.getHours() + 1);
    }

    return hours;
}

/**
 * Add hours to a date, considering business hours only if specified
 */
export function addHours(
    startDate: Date,
    hoursToAdd: number,
    businessHoursOnly: boolean,
    businessStart: number,
    businessEnd: number,
    businessDays: number[]
): Date {
    if (!businessHoursOnly) {
        // Calendar hours - just add the hours
        const result = new Date(startDate);
        result.setHours(result.getHours() + hoursToAdd);
        return result;
    }

    // Business hours calculation
    let hoursAdded = 0;
    const result = new Date(startDate);

    while (hoursAdded < hoursToAdd) {
        result.setHours(result.getHours() + 1);

        const dayOfWeek = result.getDay();
        const hour = result.getHours();

        // Count only if it's a business hour
        if (businessDays.includes(dayOfWeek) && hour >= businessStart && hour < businessEnd) {
            hoursAdded++;
        }
    }

    return result;
}

/**
 * Calculate SLA deadlines for a ticket
 */
export function calculateSLADeadlines(
    createdAt: Date,
    priority: TicketPriority,
    policy: SLAPolicy
): { responseDueAt: Date; resolutionDueAt: Date } {
    let responseHours: number;
    let resolutionHours: number;

    // Get hours based on priority
    switch (priority) {
        case 'urgent':
            responseHours = policy.urgentResponseHours;
            resolutionHours = policy.urgentResolutionHours;
            break;
        case 'high':
            responseHours = policy.highResponseHours;
            resolutionHours = policy.highResolutionHours;
            break;
        case 'medium':
            responseHours = policy.mediumResponseHours;
            resolutionHours = policy.mediumResolutionHours;
            break;
        case 'low':
        default:
            responseHours = policy.lowResponseHours;
            resolutionHours = policy.lowResolutionHours;
            break;
    }

    const responseDueAt = addHours(
        createdAt,
        responseHours,
        policy.businessHoursOnly,
        policy.businessHoursStart,
        policy.businessHoursEnd,
        policy.businessDays
    );

    const resolutionDueAt = addHours(
        createdAt,
        resolutionHours,
        policy.businessHoursOnly,
        policy.businessHoursStart,
        policy.businessHoursEnd,
        policy.businessDays
    );

    return { responseDueAt, resolutionDueAt };
}

/**
 * Calculate current SLA status for a ticket
 */
export function calculateSLAStatus(
    createdAt: Date,
    responseDueAt: Date,
    resolutionDueAt: Date,
    firstResponseAt: Date | null,
    resolvedAt: Date | null,
    policy: SLAPolicy
): SLAStatus {
    const now = new Date();

    // Calculate response status
    const responseBreached = !firstResponseAt && now > responseDueAt;
    const responseTimeRemaining = firstResponseAt
        ? 0
        : Math.max(0, (responseDueAt.getTime() - now.getTime()) / (1000 * 60 * 60));

    const totalResponseTime = policy.businessHoursOnly
        ? calculateBusinessHours(createdAt, responseDueAt, policy.businessHoursStart, policy.businessHoursEnd, policy.businessDays)
        : (responseDueAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const responseTimeUsed = totalResponseTime - responseTimeRemaining;
    const responsePercentUsed = Math.min(100, (responseTimeUsed / totalResponseTime) * 100);

    // Calculate resolution status
    const resolutionBreached = !resolvedAt && now > resolutionDueAt;
    const resolutionTimeRemaining = resolvedAt
        ? 0
        : Math.max(0, (resolutionDueAt.getTime() - now.getTime()) / (1000 * 60 * 60));

    const totalResolutionTime = policy.businessHoursOnly
        ? calculateBusinessHours(createdAt, resolutionDueAt, policy.businessHoursStart, policy.businessHoursEnd, policy.businessDays)
        : (resolutionDueAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const resolutionTimeUsed = totalResolutionTime - resolutionTimeRemaining;
    const resolutionPercentUsed = Math.min(100, (resolutionTimeUsed / totalResolutionTime) * 100);

    // Determine urgency level based on time remaining
    let urgencyLevel: 'normal' | 'warning' | 'critical' = 'normal';

    if (!resolvedAt) {
        // Use the more urgent of response or resolution
        const criticalPercent = Math.max(responsePercentUsed, resolutionPercentUsed);

        if (responseBreached || resolutionBreached || criticalPercent >= 100) {
            urgencyLevel = 'critical';
        } else if (criticalPercent >= 75) {
            urgencyLevel = 'warning';
        }
    }

    return {
        responseDueAt,
        resolutionDueAt,
        responseBreached,
        resolutionBreached,
        responseTimeRemaining,
        resolutionTimeRemaining,
        responsePercentUsed,
        resolutionPercentUsed,
        urgencyLevel
    };
}

/**
 * Format time remaining in human-readable format
 */
export function formatTimeRemaining(hours: number): string {
    if (hours <= 0) return 'Overdue';

    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes}m`;
    }

    if (hours < 24) {
        return `${Math.round(hours)}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);

    if (remainingHours === 0) {
        return `${days}d`;
    }

    return `${days}d ${remainingHours}h`;
}
