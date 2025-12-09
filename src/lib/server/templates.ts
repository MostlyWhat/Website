/**
 * Template Library Service
 * 
 * Manages reusable templates for tickets and projects
 */

import { createDb } from '$lib/server/db';
import { ticketTemplates, projectTemplates, tickets, projects } from '$lib/server/db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';

// ============================================================================
// Ticket Templates
// ============================================================================

/**
 * Create a ticket template
 */
export async function createTicketTemplate(options: {
    name: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
    organizationId?: string;
    createdById: string;
    title: string;
    content: string;
    priority?: string;
    scope?: string;
    tags?: string[];
    estimatedHours?: number;
}) {
    const db = createDb();

    const [template] = await db
        .insert(ticketTemplates)
        .values({
            ...options,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    return template;
}

/**
 * Get ticket templates
 */
export async function getTicketTemplates(filters?: {
    organizationId?: string;
    category?: string;
    isPublic?: boolean;
    searchQuery?: string;
}) {
    const db = createDb();

    const conditions = [];

    if (filters?.organizationId) {
        conditions.push(
            or(
                eq(ticketTemplates.organizationId, filters.organizationId),
                eq(ticketTemplates.isPublic, true)
            ) as any
        );
    } else if (filters?.isPublic !== undefined) {
        conditions.push(eq(ticketTemplates.isPublic, filters.isPublic));
    }

    if (filters?.category) {
        conditions.push(eq(ticketTemplates.category, filters.category));
    }

    if (filters?.searchQuery) {
        conditions.push(
            or(
                ilike(ticketTemplates.name, `%${filters.searchQuery}%`),
                ilike(ticketTemplates.description, `%${filters.searchQuery}%`)
            ) as any
        );
    }

    const templates = await db
        .select()
        .from(ticketTemplates)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(ticketTemplates.usageCount));

    return templates;
}

/**
 * Get a single ticket template
 */
export async function getTicketTemplate(templateId: string) {
    const db = createDb();

    const [template] = await db
        .select()
        .from(ticketTemplates)
        .where(eq(ticketTemplates.id, templateId))
        .limit(1);

    return template;
}

/**
 * Update a ticket template
 */
export async function updateTicketTemplate(
    templateId: string,
    updates: Partial<{
        name: string;
        description: string;
        category: string;
        isPublic: boolean;
        title: string;
        content: string;
        priority: string;
        scope: string;
        tags: string[];
        estimatedHours: number;
    }>
) {
    const db = createDb();

    const [template] = await db
        .update(ticketTemplates)
        .set({
            ...updates,
            updatedAt: new Date()
        })
        .where(eq(ticketTemplates.id, templateId))
        .returning();

    return template;
}

/**
 * Delete a ticket template
 */
export async function deleteTicketTemplate(templateId: string) {
    const db = createDb();

    await db.delete(ticketTemplates).where(eq(ticketTemplates.id, templateId));
}

/**
 * Create a ticket from a template
 */
export async function createTicketFromTemplate(
    templateId: string,
    overrides: {
        organizationId: string;
        createdById: string;
        customerId?: string;
        projectId?: string;
        assignedToId?: string;
    }
) {
    const db = createDb();

    const template = await getTicketTemplate(templateId);

    if (!template) {
        throw new Error('Template not found');
    }

    // Create the ticket using template values
    const [ticket] = await db
        .insert(tickets)
        .values({
            title: template.title,
            description: template.content,
            priority: template.priority as any,
            scope: template.scope as any,
            organizationId: overrides.organizationId,
            createdById: overrides.createdById,
            customerId: overrides.customerId,
            projectId: overrides.projectId,
            assignedToId: overrides.assignedToId,
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    // Increment usage count
    await db
        .update(ticketTemplates)
        .set({
            usageCount: template.usageCount + 1
        })
        .where(eq(ticketTemplates.id, templateId));

    return ticket;
}

// ============================================================================
// Project Templates
// ============================================================================

/**
 * Create a project template
 */
export async function createProjectTemplate(options: {
    name: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
    organizationId?: string;
    createdById: string;
    projectName: string;
    projectDescription: string;
    phase?: string;
    estimatedBudget?: number;
    estimatedDuration?: number;
    milestones?: any[];
    deliverables?: any[];
    tags?: string[];
}) {
    const db = createDb();

    const [template] = await db
        .insert(projectTemplates)
        .values({
            ...options,
            estimatedBudget: options.estimatedBudget?.toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    return template;
}

/**
 * Get project templates
 */
export async function getProjectTemplates(filters?: {
    organizationId?: string;
    category?: string;
    isPublic?: boolean;
    searchQuery?: string;
}) {
    const db = createDb();

    const conditions = [];

    if (filters?.organizationId) {
        conditions.push(
            or(
                eq(projectTemplates.organizationId, filters.organizationId),
                eq(projectTemplates.isPublic, true)
            ) as any
        );
    } else if (filters?.isPublic !== undefined) {
        conditions.push(eq(projectTemplates.isPublic, filters.isPublic));
    }

    if (filters?.category) {
        conditions.push(eq(projectTemplates.category, filters.category));
    }

    if (filters?.searchQuery) {
        conditions.push(
            or(
                ilike(projectTemplates.name, `%${filters.searchQuery}%`),
                ilike(projectTemplates.description, `%${filters.searchQuery}%`)
            ) as any
        );
    }

    const templates = await db
        .select()
        .from(projectTemplates)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(projectTemplates.usageCount));

    return templates;
}

/**
 * Get a single project template
 */
export async function getProjectTemplate(templateId: string) {
    const db = createDb();

    const [template] = await db
        .select()
        .from(projectTemplates)
        .where(eq(projectTemplates.id, templateId))
        .limit(1);

    return template;
}

/**
 * Update a project template
 */
export async function updateProjectTemplate(
    templateId: string,
    updates: Partial<{
        name: string;
        description: string;
        category: string;
        isPublic: boolean;
        projectName: string;
        projectDescription: string;
        phase: string;
        estimatedBudget: number;
        estimatedDuration: number;
        milestones: any[];
        deliverables: any[];
        tags: string[];
    }>
) {
    const db = createDb();

    const [template] = await db
        .update(projectTemplates)
        .set({
            ...updates,
            estimatedBudget: updates.estimatedBudget?.toString(),
            updatedAt: new Date()
        })
        .where(eq(projectTemplates.id, templateId))
        .returning();

    return template;
}

/**
 * Delete a project template
 */
export async function deleteProjectTemplate(templateId: string) {
    const db = createDb();

    await db.delete(projectTemplates).where(eq(projectTemplates.id, templateId));
}

/**
 * Create a project from a template
 */
export async function createProjectFromTemplate(
    templateId: string,
    overrides: {
        organizationId: string;
        createdById: string;
        customerId?: string;
        startDate?: Date;
        endDate?: Date;
    }
) {
    const db = createDb();

    const template = await getProjectTemplate(templateId);

    if (!template) {
        throw new Error('Template not found');
    }

    // Create the project using template values
    const [project] = await db
        .insert(projects)
        .values({
            name: template.projectName,
            description: template.projectDescription,
            phase: template.phase as any,
            estimatedBudget: template.estimatedBudget,
            organizationId: overrides.organizationId,
            createdById: overrides.createdById,
            customerId: overrides.customerId,
            startDate: overrides.startDate,
            endDate: overrides.endDate,
            status: 'planning',
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    // TODO: Create milestones and deliverables from template

    // Increment usage count
    await db
        .update(projectTemplates)
        .set({
            usageCount: template.usageCount + 1
        })
        .where(eq(projectTemplates.id, templateId));

    return project;
}

/**
 * Get popular templates
 */
export async function getPopularTemplates(type: 'ticket' | 'project', limit = 10) {
    const db = createDb();

    if (type === 'ticket') {
        return await db
            .select()
            .from(ticketTemplates)
            .where(eq(ticketTemplates.isPublic, true))
            .orderBy(desc(ticketTemplates.usageCount))
            .limit(limit);
    } else {
        return await db
            .select()
            .from(projectTemplates)
            .where(eq(projectTemplates.isPublic, true))
            .orderBy(desc(projectTemplates.usageCount))
            .limit(limit);
    }
}
