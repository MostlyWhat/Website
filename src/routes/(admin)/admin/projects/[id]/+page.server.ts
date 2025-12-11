import { createDb } from '$lib/server/db';
import {
    projects,
    profiles,
    organizations,
    proposals,
    tickets,
    invoices,
    projectRevisions,
    projectMilestones,
    activityLog,
    type RevisionStatus,
    type TicketPriority,
    type MilestoneStatus
} from '$lib/server/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import { projectActivity, getClientIp } from '$lib/server/utils/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        error(403, 'Access denied');
    }

    const projectId = params.id;

    // Aliases for joined tables
    const assignedProfile = alias(profiles, 'assigned_profile');
    const requestedByProfile = alias(profiles, 'requested_by');
    const revisionAssignedProfile = alias(profiles, 'revision_assigned');

    // Create per-request database connection
    const db = createDb();

    // Fetch the project with phase data
    const projectData = await db
        .select({
            id: projects.id,
            projectNumber: projects.projectNumber,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            phase: projects.phase,
            status: projects.status,
            proposalStatus: projects.proposalStatus,
            clientAcceptedAt: projects.clientAcceptedAt,
            adminConfirmedAt: projects.adminConfirmedAt,
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
            orgNumber: organizations.orgNumber,
            supportTierId: projects.supportTierId,
            supportStartedAt: projects.supportStartedAt,
            supportEndsAt: projects.supportEndsAt,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt
        })
        .from(projects)
        .leftJoin(assignedProfile, eq(projects.assignedToId, assignedProfile.id))
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .where(eq(projects.id, projectId))
        .limit(1);

    if (!projectData.length) {
        error(404, 'Project not found');
    }

    const project = projectData[0];

    // Fetch related proposals
    const projectProposals = await db
        .select({
            id: proposals.id,
            proposalNumber: proposals.proposalNumber,
            title: proposals.title,
            status: proposals.status,
            total: proposals.total,
            currency: proposals.currency,
            createdAt: proposals.createdAt,
            sentAt: proposals.sentAt,
            viewedAt: proposals.viewedAt,
            respondedAt: proposals.respondedAt
        })
        .from(proposals)
        .where(eq(proposals.projectId, projectId))
        .orderBy(desc(proposals.createdAt));

    // Fetch related tickets
    let projectTickets: Array<{
        id: string;
        ticketNumber: string;
        subject: string;
        status: string;
        priority: string;
        createdAt: Date;
    }> = [];
    try {
        projectTickets = await db
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
    } catch (error) {
        console.warn('Error fetching tickets:', error);
    }

    // Fetch related invoices
    let projectInvoices: Array<{
        id: string;
        invoiceNumber: string;
        status: string;
        total: string;
        currency: string;
        dueDate: Date | null;
        paidAt: Date | null;
        createdAt: Date;
    }> = [];
    try {
        projectInvoices = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                status: invoices.status,
                total: invoices.total,
                currency: invoices.currency,
                dueDate: invoices.dueDate,
                paidAt: invoices.paidAt,
                createdAt: invoices.createdAt
            })
            .from(invoices)
            .where(eq(invoices.projectId, projectId))
            .orderBy(desc(invoices.createdAt));
    } catch (error) {
        console.warn('Error fetching invoices:', error);
    }

    // Fetch project revisions
    let revisions: Array<{
        id: string;
        version: string | null;
        title: string;
        description: string | null;
        status: RevisionStatus;
        priority: TicketPriority;
        requestedById: string | null;
        requestedByName: string | null;
        assignedToId: string | null;
        assignedToName: string | null;
        createdAt: Date;
        resolvedAt: Date | null;
        resolutionNotes: string | null;
    }> = [];
    try {
        revisions = await db
            .select({
                id: projectRevisions.id,
                version: projectRevisions.version,
                title: projectRevisions.title,
                description: projectRevisions.description,
                status: projectRevisions.status,
                priority: projectRevisions.priority,
                requestedById: projectRevisions.requestedById,
                requestedByName: requestedByProfile.displayName,
                assignedToId: projectRevisions.assignedToId,
                assignedToName: revisionAssignedProfile.displayName,
                createdAt: projectRevisions.createdAt,
                resolvedAt: projectRevisions.resolvedAt,
                resolutionNotes: projectRevisions.resolutionNotes
            })
            .from(projectRevisions)
            .leftJoin(requestedByProfile, eq(projectRevisions.requestedById, requestedByProfile.id))
            .leftJoin(revisionAssignedProfile, eq(projectRevisions.assignedToId, revisionAssignedProfile.id))
            .where(eq(projectRevisions.projectId, projectId))
            .orderBy(desc(projectRevisions.createdAt));
    } catch (error) {
        console.warn('Error fetching revisions:', error);
    }

    // Fetch project milestones
    const milestoneCreatorProfile = alias(profiles, 'milestone_creator');
    const milestoneCompleterProfile = alias(profiles, 'milestone_completer');
    let milestones: Array<{
        id: string;
        title: string;
        description: string | null;
        sortOrder: number;
        status: MilestoneStatus;
        dueDate: Date | null;
        completedAt: Date | null;
        weight: number;
        invoiceId: string | null;
        createdById: string | null;
        createdByName: string | null;
        completedById: string | null;
        completedByName: string | null;
        deliverables: Array<{ name: string; type: 'file' | 'link'; url: string; addedAt: string }> | null;
        createdAt: Date;
    }> = [];
    try {
        milestones = await db
            .select({
                id: projectMilestones.id,
                title: projectMilestones.title,
                description: projectMilestones.description,
                sortOrder: projectMilestones.sortOrder,
                status: projectMilestones.status,
                dueDate: projectMilestones.dueDate,
                completedAt: projectMilestones.completedAt,
                weight: projectMilestones.weight,
                invoiceId: projectMilestones.invoiceId,
                createdById: projectMilestones.createdById,
                createdByName: milestoneCreatorProfile.displayName,
                completedById: projectMilestones.completedById,
                completedByName: milestoneCompleterProfile.displayName,
                deliverables: projectMilestones.deliverables,
                createdAt: projectMilestones.createdAt
            })
            .from(projectMilestones)
            .leftJoin(milestoneCreatorProfile, eq(projectMilestones.createdById, milestoneCreatorProfile.id))
            .leftJoin(milestoneCompleterProfile, eq(projectMilestones.completedById, milestoneCompleterProfile.id))
            .where(eq(projectMilestones.projectId, projectId))
            .orderBy(projectMilestones.sortOrder);
    } catch (error) {
        console.warn('Error fetching milestones:', error);
    }

    // Fetch recent activity for this project
    let recentActivity: Array<{
        id: string;
        activityType: string;
        description: string | null;
        previousValues: unknown;
        newValues: unknown;
        createdAt: Date;
        actorName: string | null;
    }> = [];
    try {
        recentActivity = await db
            .select({
                id: activityLog.id,
                activityType: activityLog.activityType,
                description: activityLog.description,
                previousValues: activityLog.previousValues,
                newValues: activityLog.newValues,
                createdAt: activityLog.createdAt,
                actorName: profiles.displayName
            })
            .from(activityLog)
            .leftJoin(profiles, eq(activityLog.performedById, profiles.id))
            .where(eq(activityLog.entityId, projectId))
            .orderBy(desc(activityLog.createdAt))
            .limit(20);
    } catch (error) {
        console.warn('Error fetching activity log:', error);
    }

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
            assignedTo: project.assignedToId
                ? {
                    id: project.assignedToId,
                    name: project.assignedToName ?? 'Unknown',
                    email: project.assignedToEmail
                }
                : null
        },
        proposals: projectProposals,
        tickets: projectTickets,
        invoices: projectInvoices,
        revisions: revisions.map((r) => ({
            ...r,
            requestedBy: r.requestedById ? { name: r.requestedByName ?? 'Unknown' } : null,
            assignedTo: r.assignedToId ? { name: r.assignedToName ?? 'Unknown' } : null
        })),
        milestones: milestones.map((m) => ({
            ...m,
            createdBy: m.createdById ? { id: m.createdById, name: m.createdByName ?? 'Unknown' } : null,
            completedBy: m.completedById ? { id: m.completedById, name: m.completedByName ?? 'Unknown' } : null
        })),
        activity: recentActivity,
        staffMembers
    };
};

export const actions: Actions = {
    assign: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const assignedToId = formData.get('assignedToId') as string;

        const [project] = await db
            .select({ name: projects.name })
            .from(projects)
            .where(eq(projects.id, params.id));
        let assigneeName: string | null = null;
        if (assignedToId) {
            const [assignee] = await db
                .select({ displayName: profiles.displayName })
                .from(profiles)
                .where(eq(profiles.id, assignedToId));
            assigneeName = assignee?.displayName ?? null;
        }

        await db
            .update(projects)
            .set({
                assignedToId: assignedToId || null,
                updatedAt: new Date()
            })
            .where(eq(projects.id, params.id));

        await projectActivity.assigned(
            params.id,
            project?.name ?? 'Unknown',
            assigneeName,
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Project assigned successfully' };
    },

    updatePhase: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const action = formData.get('action') as string;

        const [project] = await db
            .select({ name: projects.name, phase: projects.phase })
            .from(projects)
            .where(eq(projects.id, params.id));
        const oldPhase = project?.phase ?? 'request';

        let newPhase = oldPhase;
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        switch (action) {
            case 'start_review':
                newPhase = 'review';
                break;
            case 'unreview':
                // Move back to request phase
                newPhase = 'request';
                updateData.proposalStatus = null;
                break;
            case 'create_proposal':
                newPhase = 'proposal';
                updateData.proposalStatus = 'draft';
                break;
            case 'back_to_review':
                // Move back from proposal to review
                newPhase = 'review';
                updateData.proposalStatus = null;
                break;
            case 'send_proposal':
                updateData.proposalStatus = 'sent';
                break;
            case 'confirm_start':
                newPhase = 'confirmed';
                updateData.proposalStatus = 'admin_confirmed';
                updateData.adminConfirmedAt = new Date();
                break;
            case 'back_to_proposal':
                // Move back from confirmed to proposal
                newPhase = 'proposal';
                updateData.adminConfirmedAt = null;
                break;
            case 'start_building':
                newPhase = 'building';
                updateData.startDate = new Date();
                break;
            case 'back_to_confirmed':
                // Move back from building to confirmed
                newPhase = 'confirmed';
                updateData.startDate = null;
                break;
            case 'mark_complete':
                newPhase = 'completed';
                updateData.completedAt = new Date();
                break;
            case 'back_to_building':
                // Reopen project to building phase
                newPhase = 'building';
                updateData.completedAt = null;
                break;
            case 'enable_support':
                newPhase = 'support';
                updateData.supportStartedAt = new Date();
                break;
            case 'end_support':
                newPhase = 'completed';
                updateData.supportEndsAt = new Date();
                break;
            case 'decline':
                updateData.status = 'cancelled';
                break;
            case 'reactivate':
                updateData.status = 'active';
                break;
            case 'put_on_hold':
                updateData.status = 'on_hold';
                break;
            case 'resume':
                updateData.status = 'active';
                break;
        }

        if (newPhase !== oldPhase) {
            updateData.phase = newPhase;
        }

        await db.update(projects).set(updateData).where(eq(projects.id, params.id));

        await projectActivity.statusChanged(
            params.id,
            project?.name ?? 'Unknown',
            oldPhase,
            newPhase,
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Phase updated successfully' };
    },

    updateDetails: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
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
        // Create per-request database connection
        const db = createDb();
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
    },

    createRevision: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const version = formData.get('version') as string;
        const priority = (formData.get('priority') as string) || 'medium';

        if (!title) {
            return fail(400, { error: 'Title is required' });
        }

        await db.insert(projectRevisions).values({
            projectId: params.id,
            title,
            description: description || null,
            version: version || null,
            priority: priority as 'low' | 'medium' | 'high' | 'urgent',
            requestedById: locals.profile.id,
            status: 'pending'
        });

        return { success: true, message: 'Revision created successfully' };
    },

    updateRevision: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const revisionId = formData.get('revisionId') as string;
        const status = formData.get('status') as string;
        const resolutionNotes = formData.get('resolutionNotes') as string;
        const assignedToId = formData.get('assignedToId') as string;

        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        if (status) {
            updateData.status = status;
            if (status === 'resolved' || status === 'declined') {
                updateData.resolvedAt = new Date();
            }
        }
        if (resolutionNotes !== undefined) {
            updateData.resolutionNotes = resolutionNotes || null;
        }
        if (assignedToId !== undefined) {
            updateData.assignedToId = assignedToId || null;
        }

        await db.update(projectRevisions).set(updateData).where(eq(projectRevisions.id, revisionId));

        return { success: true, message: 'Revision updated successfully' };
    },

    // Milestone actions
    createMilestone: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dueDate = formData.get('dueDate') as string;
        const weight = parseInt(formData.get('weight') as string) || 10;
        const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

        if (!title?.trim()) {
            return fail(400, { error: 'Milestone title is required' });
        }

        const projectId = params.id;

        await db.insert(projectMilestones).values({
            projectId,
            title: title.trim(),
            description: description?.trim() || null,
            dueDate: dueDate ? new Date(dueDate) : null,
            weight,
            sortOrder,
            status: 'pending',
            createdById: locals.profile.id
        });

        return { success: true, message: 'Milestone created successfully' };
    },

    updateMilestone: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const milestoneId = formData.get('milestoneId') as string;
        const status = formData.get('status') as MilestoneStatus | undefined;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dueDate = formData.get('dueDate') as string;
        const weight = formData.get('weight') as string;

        if (!milestoneId) {
            return fail(400, { error: 'Milestone ID is required' });
        }

        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        if (status) {
            updateData.status = status;
            if (status === 'completed') {
                updateData.completedAt = new Date();
                updateData.completedById = locals.profile.id;
            }
        }
        if (title !== undefined) {
            updateData.title = title.trim();
        }
        if (description !== undefined) {
            updateData.description = description?.trim() || null;
        }
        if (dueDate !== undefined) {
            updateData.dueDate = dueDate ? new Date(dueDate) : null;
        }
        if (weight !== undefined) {
            updateData.weight = parseInt(weight) || 10;
        }

        await db.update(projectMilestones).set(updateData).where(eq(projectMilestones.id, milestoneId));

        return { success: true, message: 'Milestone updated successfully' };
    },

    deleteMilestone: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const milestoneId = formData.get('milestoneId') as string;

        if (!milestoneId) {
            return fail(400, { error: 'Milestone ID is required' });
        }

        await db.delete(projectMilestones).where(eq(projectMilestones.id, milestoneId));

        return { success: true, message: 'Milestone deleted successfully' };
    }
};
