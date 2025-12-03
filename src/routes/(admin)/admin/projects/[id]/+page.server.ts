import { db } from '$lib/server/db';
import { projects, profiles, organizations, proposals, tickets, invoices } from '$lib/server/db/schema';
import { eq, desc, and, or, count } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import { projectActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        throw error(403, 'Access denied');
    }

    const projectId = params.id;

    // Aliases for joined tables
    const assignedProfile = alias(profiles, 'assigned_profile');

    // Fetch the project
    const projectData = await db
        .select({
            id: projects.id,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            status: projects.status,
            startDate: projects.startDate,
            endDate: projects.endDate,
            completedAt: projects.completedAt,
            estimatedBudget: projects.estimatedBudget,
            actualBudget: projects.actualBudget,
            currency: projects.currency,
            assignedToId: projects.assignedToId,
            assignedToName: assignedProfile.displayName,
            assignedToEmail: assignedProfile.email,
            organizationId: projects.organizationId,
            organizationName: organizations.name,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt
        })
        .from(projects)
        .leftJoin(assignedProfile, eq(projects.assignedToId, assignedProfile.id))
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .where(eq(projects.id, projectId))
        .limit(1);

    if (!projectData.length) {
        throw error(404, 'Project not found');
    }

    const project = projectData[0];

    // Fetch related proposals
    const projectProposals = await db
        .select({
            id: proposals.id,
            title: proposals.title,
            status: proposals.status,
            total: proposals.total,
            currency: proposals.currency,
            createdAt: proposals.createdAt,
            sentAt: proposals.sentAt
        })
        .from(proposals)
        .where(eq(proposals.projectId, projectId))
        .orderBy(desc(proposals.createdAt));

    // Fetch related tickets
    const projectTickets = await db
        .select({
            id: tickets.id,
            ticketNumber: tickets.ticketNumber,
            subject: tickets.subject,
            status: tickets.status,
            priority: tickets.priority,
            createdAt: tickets.createdAt
        })
        .from(tickets)
        .where(eq(tickets.projectId, projectId))
        .orderBy(desc(tickets.createdAt));

    // Fetch related invoices
    const projectInvoices = await db
        .select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            status: invoices.status,
            total: invoices.total,
            currency: invoices.currency,
            dueDate: invoices.dueDate,
            createdAt: invoices.createdAt
        })
        .from(invoices)
        .where(eq(invoices.projectId, projectId))
        .orderBy(desc(invoices.createdAt));

    // Fetch available staff for assignment
    const staffMembers = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email,
            role: profiles.role
        })
        .from(profiles)
        .where(
            or(
                eq(profiles.role, 'super_admin'),
                eq(profiles.role, 'admin'),
                eq(profiles.role, 'staff')
            )
        )
        .orderBy(profiles.displayName);

    return {
        project: {
            ...project,
            organization: project.organizationName ?? 'Unknown',
            assignedTo: project.assignedToId ? {
                id: project.assignedToId,
                name: project.assignedToName ?? 'Unknown',
                email: project.assignedToEmail
            } : null
        },
        proposals: projectProposals,
        tickets: projectTickets,
        invoices: projectInvoices,
        staffMembers
    };
};

export const actions: Actions = {
    assign: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const assignedToId = formData.get('assignedToId') as string;

        // Get project name and assigned user name for activity log
        const [project] = await db.select({ name: projects.name }).from(projects).where(eq(projects.id, params.id));
        let assigneeName: string | null = null;
        if (assignedToId) {
            const [assignee] = await db.select({ displayName: profiles.displayName }).from(profiles).where(eq(profiles.id, assignedToId));
            assigneeName = assignee?.displayName ?? null;
        }

        await db
            .update(projects)
            .set({
                assignedToId: assignedToId || null,
                updatedAt: new Date()
            })
            .where(eq(projects.id, params.id));

        // Log activity
        await projectActivity.assigned(params.id, project?.name ?? 'Unknown', assigneeName, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Project assigned successfully' };
    },

    updateStatus: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const status = formData.get('status') as string;

        // Get current project for activity log
        const [project] = await db.select({ name: projects.name, status: projects.status }).from(projects).where(eq(projects.id, params.id));
        const oldStatus = project?.status ?? 'unknown';

        const updateData: Record<string, unknown> = {
            status,
            updatedAt: new Date()
        };

        // Set completedAt if status is completed
        if (status === 'completed') {
            updateData.completedAt = new Date();
        } else {
            updateData.completedAt = null;
        }

        await db
            .update(projects)
            .set(updateData)
            .where(eq(projects.id, params.id));

        // Log activity
        await projectActivity.statusChanged(params.id, project?.name ?? 'Unknown', oldStatus, status, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Status updated successfully' };
    },

    updateDetails: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const estimatedBudget = formData.get('estimatedBudget') as string;
        const actualBudget = formData.get('actualBudget') as string;

        await db
            .update(projects)
            .set({
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                estimatedBudget: estimatedBudget || null,
                actualBudget: actualBudget || null,
                updatedAt: new Date()
            })
            .where(eq(projects.id, params.id));

        return { success: true, message: 'Details updated successfully' };
    },

    updateDescription: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const description = formData.get('description') as string;

        await db
            .update(projects)
            .set({
                description: description || null,
                updatedAt: new Date()
            })
            .where(eq(projects.id, params.id));

        return { success: true, message: 'Description updated successfully' };
    }
};
