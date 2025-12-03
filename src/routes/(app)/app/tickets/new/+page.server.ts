/**
 * Ticket Creation Server Actions
 * 
 * Creates new support tickets with organization association.
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { tickets, organizationMembers, organizations, projects } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'node:crypto';

export const load: PageServerLoad = async ({ locals }) => {
    // Verify user is authenticated
    if (!locals.session || !locals.profile) {
        throw redirect(303, '/auth/login');
    }

    // Get user's organizations
    const userOrgs = await db
        .select({
            id: organizations.id,
            name: organizations.name
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
        .where(eq(organizationMembers.profileId, locals.profile.id));

    // Get user's projects (for optional linking)
    const userProjects = await db
        .select({
            id: projects.id,
            name: projects.name,
            organizationId: projects.organizationId
        })
        .from(projects)
        .innerJoin(organizations, eq(projects.organizationId, organizations.id))
        .innerJoin(organizationMembers, eq(organizationMembers.organizationId, organizations.id))
        .where(
            and(
                eq(organizationMembers.profileId, locals.profile.id),
                // Only show active projects
                eq(projects.status, 'in_progress')
            )
        );

    return {
        organizations: userOrgs,
        projects: userProjects
    };
};

// Generate unique ticket number
function generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `TKT-${year}-${random}`;
}

// Generate unique slug for organization
function generateSlug(): string {
    return `org-${crypto.randomBytes(4).toString('hex').toLowerCase()}`;
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // Verify user is authenticated
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in to create a ticket' });
        }

        const formData = await request.formData();
        const subject = formData.get('subject') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent';
        const category = formData.get('category') as string;
        const projectId = formData.get('projectId') as string | null;

        // Validation
        if (!subject?.trim()) {
            return fail(400, {
                error: 'Subject is required',
                subject, description, priority, category
            });
        }

        if (subject.trim().length < 5) {
            return fail(400, {
                error: 'Subject must be at least 5 characters',
                subject, description, priority, category
            });
        }

        if (!description?.trim()) {
            return fail(400, {
                error: 'Description is required',
                subject, description, priority, category
            });
        }

        if (description.trim().length < 20) {
            return fail(400, {
                error: 'Please provide more details (at least 20 characters)',
                subject, description, priority, category
            });
        }

        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!validPriorities.includes(priority)) {
            return fail(400, {
                error: 'Invalid priority level',
                subject, description, priority, category
            });
        }

        try {
            // Get user's first organization (or use project's organization)
            let organizationId: string | null = null;

            if (projectId) {
                // If project specified, verify user has access and get its organization
                const project = await db
                    .select({ organizationId: projects.organizationId })
                    .from(projects)
                    .innerJoin(organizationMembers, eq(organizationMembers.organizationId, projects.organizationId))
                    .where(
                        and(
                            eq(projects.id, projectId),
                            eq(organizationMembers.profileId, locals.profile.id)
                        )
                    )
                    .limit(1);

                if (project.length > 0) {
                    organizationId = project[0].organizationId;
                }
            }

            // If no organization from project, get user's first organization
            if (!organizationId) {
                const userOrg = await db
                    .select({ organizationId: organizationMembers.organizationId })
                    .from(organizationMembers)
                    .where(eq(organizationMembers.profileId, locals.profile.id))
                    .limit(1);

                if (userOrg.length > 0) {
                    organizationId = userOrg[0].organizationId;
                }
            }

            // If still no organization, create a personal one
            if (!organizationId) {
                const [newOrg] = await db.insert(organizations).values({
                    name: `${locals.profile.firstName || 'User'}'s Organization`,
                    slug: generateSlug(),
                    email: locals.profile.email
                }).returning({ id: organizations.id });

                organizationId = newOrg.id;

                // Add user as owner
                await db.insert(organizationMembers).values({
                    organizationId: newOrg.id,
                    profileId: locals.profile.id,
                    role: 'owner'
                });
            }

            // Calculate due date based on priority
            const dueDate = new Date();
            switch (priority) {
                case 'urgent':
                    dueDate.setHours(dueDate.getHours() + 2);
                    break;
                case 'high':
                    dueDate.setHours(dueDate.getHours() + 4);
                    break;
                case 'medium':
                    dueDate.setHours(dueDate.getHours() + 24);
                    break;
                case 'low':
                    dueDate.setHours(dueDate.getHours() + 48);
                    break;
            }

            // Create the ticket
            const [newTicket] = await db.insert(tickets).values({
                organizationId,
                projectId: projectId || null,
                ticketNumber: generateTicketNumber(),
                subject: subject.trim(),
                description: description.trim(),
                status: 'open',
                priority,
                category: category || 'general',
                createdById: locals.profile.id,
                dueAt: dueDate
            }).returning({ id: tickets.id, ticketNumber: tickets.ticketNumber });

            // Redirect to the new ticket
            redirect(303, `/app/tickets/${newTicket.id}`);
        } catch (err) {
            // Handle redirect - use isRedirect pattern
            const { isRedirect } = await import('@sveltejs/kit');
            if (isRedirect(err)) {
                throw err;
            }

            console.error('Ticket creation exception:', err);
            return fail(500, {
                error: 'An unexpected error occurred while creating your ticket',
                subject, description, priority, category
            });
        }
    }
};
