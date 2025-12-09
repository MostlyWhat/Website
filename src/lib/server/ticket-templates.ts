/**
 * Ticket Templates & Macro Expansion Helper
 * 
 * Provides functionality for:
 * - Listing and retrieving ticket templates
 * - Variable substitution in templates and canned responses
 * - Macro expansion with context data
 */

import { createDb } from '$lib/server/db';
import { ticketTemplates, tickets, profiles, ticketCategories, organizations } from '$lib/server/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export interface TicketTemplateData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categoryId: string | null;
    categoryName: string | null;
    defaultPriority: string;
    subjectTemplate: string;
    descriptionTemplate: string;
    defaultAssigneeId: string | null;
    defaultStaffGroupId: string | null;
    tags: string[] | null;
    isActive: boolean;
    isPublic: boolean;
    usageCount: number;
}

export interface MacroContext {
    ticket?: {
        id?: string;
        number?: string;
        subject?: string;
        category?: string;
        priority?: string;
        status?: string;
    };
    customer?: {
        id?: string;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    };
    assignee?: {
        id?: string;
        name?: string;
        email?: string;
    };
    organization?: {
        id?: string;
        name?: string;
    };
    project?: {
        id?: string;
        name?: string;
    };
}

/**
 * Get all active ticket templates
 */
export async function getTicketTemplates(includePrivate = false): Promise<TicketTemplateData[]> {
    const db = createDb();

    const templates = await db
        .select({
            id: ticketTemplates.id,
            name: ticketTemplates.name,
            slug: ticketTemplates.slug,
            description: ticketTemplates.description,
            categoryId: ticketTemplates.categoryId,
            categoryName: ticketCategories.name,
            defaultPriority: ticketTemplates.defaultPriority,
            subjectTemplate: ticketTemplates.subjectTemplate,
            descriptionTemplate: ticketTemplates.descriptionTemplate,
            defaultAssigneeId: ticketTemplates.defaultAssigneeId,
            defaultStaffGroupId: ticketTemplates.defaultStaffGroupId,
            tags: ticketTemplates.tags,
            isActive: ticketTemplates.isActive,
            isPublic: ticketTemplates.isPublic,
            usageCount: ticketTemplates.usageCount
        })
        .from(ticketTemplates)
        .leftJoin(ticketCategories, eq(ticketTemplates.categoryId, ticketCategories.id))
        .where(
            and(
                eq(ticketTemplates.isActive, true),
                includePrivate ? undefined : eq(ticketTemplates.isPublic, true)
            )
        )
        .orderBy(desc(ticketTemplates.usageCount));

    return templates;
}

/**
 * Get a single template by slug
 */
export async function getTicketTemplate(slug: string): Promise<TicketTemplateData | null> {
    const db = createDb();

    const [template] = await db
        .select({
            id: ticketTemplates.id,
            name: ticketTemplates.name,
            slug: ticketTemplates.slug,
            description: ticketTemplates.description,
            categoryId: ticketTemplates.categoryId,
            categoryName: ticketCategories.name,
            defaultPriority: ticketTemplates.defaultPriority,
            subjectTemplate: ticketTemplates.subjectTemplate,
            descriptionTemplate: ticketTemplates.descriptionTemplate,
            defaultAssigneeId: ticketTemplates.defaultAssigneeId,
            defaultStaffGroupId: ticketTemplates.defaultStaffGroupId,
            tags: ticketTemplates.tags,
            isActive: ticketTemplates.isActive,
            isPublic: ticketTemplates.isPublic,
            usageCount: ticketTemplates.usageCount
        })
        .from(ticketTemplates)
        .leftJoin(ticketCategories, eq(ticketTemplates.categoryId, ticketCategories.id))
        .where(eq(ticketTemplates.slug, slug))
        .limit(1);

    return template || null;
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(templateId: string): Promise<void> {
    const db = createDb();

    // Use SQL increment to avoid type issues
    await db
        .update(ticketTemplates)
        .set({
            usageCount: sql`${ticketTemplates.usageCount} + 1`,
            updatedAt: new Date()
        })
        .where(eq(ticketTemplates.id, templateId));
}

/**
 * Expand macro variables in text
 * 
 * Supports variables like:
 * - {{ticket.number}} - Ticket number
 * - {{customer.name}} - Customer full name
 * - {{customer.firstName}} - Customer first name
 * - {{customer.email}} - Customer email
 * - {{assignee.name}} - Assigned staff member name
 * - {{ticket.subject}} - Ticket subject
 * - {{ticket.category}} - Ticket category
 * - {{ticket.priority}} - Ticket priority
 * - {{ticket.status}} - Ticket status
 * - {{organization.name}} - Organization name
 * - {{project.name}} - Project name
 */
export function expandMacros(text: string, context: MacroContext): string {
    let expanded = text;

    // Ticket variables
    if (context.ticket) {
        if (context.ticket.number) {
            expanded = expanded.replace(/\{\{ticket\.number\}\}/g, context.ticket.number);
        }
        if (context.ticket.subject) {
            expanded = expanded.replace(/\{\{ticket\.subject\}\}/g, context.ticket.subject);
        }
        if (context.ticket.category) {
            expanded = expanded.replace(/\{\{ticket\.category\}\}/g, context.ticket.category);
        }
        if (context.ticket.priority) {
            expanded = expanded.replace(/\{\{ticket\.priority\}\}/g, context.ticket.priority);
        }
        if (context.ticket.status) {
            expanded = expanded.replace(/\{\{ticket\.status\}\}/g, context.ticket.status);
        }
    }

    // Customer variables
    if (context.customer) {
        if (context.customer.name) {
            expanded = expanded.replace(/\{\{customer\.name\}\}/g, context.customer.name);
        }
        if (context.customer.firstName) {
            expanded = expanded.replace(/\{\{customer\.firstName\}\}/g, context.customer.firstName);
        }
        if (context.customer.lastName) {
            expanded = expanded.replace(/\{\{customer\.lastName\}\}/g, context.customer.lastName);
        }
        if (context.customer.email) {
            expanded = expanded.replace(/\{\{customer\.email\}\}/g, context.customer.email);
        }
    }

    // Assignee variables
    if (context.assignee) {
        if (context.assignee.name) {
            expanded = expanded.replace(/\{\{assignee\.name\}\}/g, context.assignee.name);
        }
        if (context.assignee.email) {
            expanded = expanded.replace(/\{\{assignee\.email\}\}/g, context.assignee.email);
        }
    }

    // Organization variables
    if (context.organization) {
        if (context.organization.name) {
            expanded = expanded.replace(/\{\{organization\.name\}\}/g, context.organization.name);
        }
    }

    // Project variables
    if (context.project) {
        if (context.project.name) {
            expanded = expanded.replace(/\{\{project\.name\}\}/g, context.project.name);
        }
    }

    return expanded;
}

/**
 * Get macro context from a ticket ID
 * Fetches all related data needed for macro expansion
 */
export async function getMacroContextFromTicket(ticketId: string): Promise<MacroContext> {
    const db = createDb();

    // Fetch ticket with related data
    const [ticketData] = await db
        .select({
            id: tickets.id,
            ticketNumber: tickets.ticketNumber,
            subject: tickets.subject,
            category: tickets.category,
            priority: tickets.priority,
            status: tickets.status,
            createdById: tickets.createdById,
            creatorName: profiles.displayName,
            creatorFirstName: profiles.firstName,
            creatorLastName: profiles.lastName,
            creatorEmail: profiles.email,
            assignedToId: tickets.assignedToId,
            organizationId: tickets.organizationId,
            organizationName: organizations.name,
            projectId: tickets.projectId
        })
        .from(tickets)
        .leftJoin(profiles, eq(tickets.createdById, profiles.id))
        .leftJoin(organizations, eq(tickets.organizationId, organizations.id))
        .where(eq(tickets.id, ticketId))
        .limit(1);

    if (!ticketData) {
        return {};
    }

    const context: MacroContext = {
        ticket: {
            id: ticketData.id,
            number: ticketData.ticketNumber,
            subject: ticketData.subject,
            category: ticketData.category ?? undefined,
            priority: ticketData.priority,
            status: ticketData.status
        },
        customer: {
            id: ticketData.createdById,
            name: ticketData.creatorName ?? undefined,
            firstName: ticketData.creatorFirstName ?? undefined,
            lastName: ticketData.creatorLastName ?? undefined,
            email: ticketData.creatorEmail ?? undefined
        },
        organization: ticketData.organizationId ? {
            id: ticketData.organizationId,
            name: ticketData.organizationName ?? undefined
        } : undefined
    };

    // Fetch assignee if assigned
    if (ticketData.assignedToId) {
        const [assignee] = await db
            .select({
                id: profiles.id,
                name: profiles.displayName,
                email: profiles.email
            })
            .from(profiles)
            .where(eq(profiles.id, ticketData.assignedToId))
            .limit(1);

        if (assignee) {
            context.assignee = {
                id: assignee.id,
                name: assignee.name ?? undefined,
                email: assignee.email ?? undefined
            };
        }
    }

    return context;
}

/**
 * Expand macros in canned response content using ticket context
 */
export async function expandCannedResponse(
    content: string,
    ticketId: string
): Promise<string> {
    const context = await getMacroContextFromTicket(ticketId);
    return expandMacros(content, context);
}
