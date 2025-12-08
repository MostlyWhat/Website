/**
 * Admin Ticket Creation Server Actions
 * 
 * Creates new support tickets on behalf of users.
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db';
import { tickets, organizations, profiles, projects } from '$lib/server/db/schema';
import { eq, desc, ilike, or, and } from 'drizzle-orm';
import crypto from 'node:crypto';
import { ticketActivity, getClientIp } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        return error(403, 'Access denied');
    }

    // Get organizations for selection
    const orgs = await db
        .select({
            id: organizations.id,
            name: organizations.name
        })
        .from(organizations)
        .orderBy(organizations.name);

    // Get all users for selection
    const users = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email,
            role: profiles.role
        })
        .from(profiles)
        .orderBy(profiles.displayName);

    // Get all projects for selection (we'll filter client-side based on org)
    const allProjects = await db
        .select({
            id: projects.id,
            name: projects.name,
            organizationId: projects.organizationId
        })
        .from(projects)
        .orderBy(projects.name);

    return {
        organizations: orgs,
        users,
        allProjects,
        profile: locals.profile
    };
};

// Generate unique ticket number
function generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `TKT-${year}-${random}`;
}

export const actions: Actions = {
    createTicket: async ({ request, locals }) => {
        if (!locals.user || !locals.profile) {
            return redirect(302, '/auth/login');
        }

        if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const subject = formData.get('subject')?.toString().trim();
        const description = formData.get('description')?.toString().trim();
        const priority = formData.get('priority')?.toString() as 'low' | 'medium' | 'high' | 'urgent' || 'medium';
        const category = formData.get('category')?.toString() || 'general';
        const organizationId = formData.get('organizationId')?.toString() || null;
        const createdById = formData.get('createdById')?.toString() || locals.profile.id;
        const assignedToId = formData.get('assignedToId')?.toString() || null;
        const projectId = formData.get('projectId')?.toString() || null;

        // Validation
        if (!subject || subject.length < 5) {
            return fail(400, {
                error: 'Subject must be at least 5 characters',
                subject,
                description,
                priority,
                category
            });
        }

        if (!description || description.length < 10) {
            return fail(400, {
                error: 'Description must be at least 10 characters',
                subject,
                description,
                priority,
                category
            });
        }

        if (!organizationId) {
            return fail(400, {
                error: 'An organization must be selected',
                subject,
                description,
                priority,
                category
            });
        }

        try {
            const ticketNumber = generateTicketNumber();

            const [newTicket] = await db
                .insert(tickets)
                .values({
                    ticketNumber,
                    subject,
                    description,
                    priority,
                    category,
                    status: 'open',
                    organizationId,
                    createdById,
                    assignedToId: assignedToId || null,
                    projectId: projectId || null
                })
                .returning({ id: tickets.id });

            // Log activity
            await ticketActivity.created(
                newTicket.id,
                ticketNumber,
                createdById,
                getClientIp(request)
            );

            return redirect(303, `/admin/tickets/${newTicket.id}`);
        } catch (err) {
            console.error('Error creating ticket:', err);
            return fail(500, {
                error: 'Failed to create ticket. Please try again.',
                subject,
                description,
                priority,
                category
            });
        }
    }
};
