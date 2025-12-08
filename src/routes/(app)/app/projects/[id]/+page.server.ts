import { createDb } from '$lib/server/db';
import { projects, organizations, profiles, organizationMembers, activityLog, projectMilestones, proposals, invoices, projectRequests } from '$lib/server/db/schema';
import { eq, and, inArray, desc, asc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        error(401, 'Unauthorized');
    }

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        error(403, 'Not authorized to view this project');
    }

    // Fetch the project
    const [project] = await db
        .select({
            id: projects.id,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            status: projects.status,
            phase: projects.phase,
            startDate: projects.startDate,
            endDate: projects.endDate,
            completedAt: projects.completedAt,
            estimatedBudget: projects.estimatedBudget,
            actualBudget: projects.actualBudget,
            currency: projects.currency,
            organizationId: projects.organizationId,
            organizationName: organizations.name,
            assignedToId: projects.assignedToId,
            assignedToName: profiles.displayName,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt
        })
        .from(projects)
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .leftJoin(profiles, eq(projects.assignedToId, profiles.id))
        .where(
            and(
                eq(projects.id, params.id),
                inArray(projects.organizationId, orgIds)
            )
        )
        .limit(1);

    if (!project) {
        error(404, 'Project not found');
    }

    // Get recent activity for this project
    const recentActivity = await db
        .select({
            id: activityLog.id,
            activityType: activityLog.activityType,
            description: activityLog.description,
            createdAt: activityLog.createdAt,
            userName: profiles.displayName
        })
        .from(activityLog)
        .leftJoin(profiles, eq(activityLog.performedById, profiles.id))
        .where(
            and(
                eq(activityLog.entityType, 'project'),
                eq(activityLog.entityId, params.id)
            )
        )
        .orderBy(desc(activityLog.createdAt))
        .limit(10);

    // Get project milestones
    const milestones = await db
        .select({
            id: projectMilestones.id,
            title: projectMilestones.title,
            description: projectMilestones.description,
            status: projectMilestones.status,
            dueDate: projectMilestones.dueDate,
            completedAt: projectMilestones.completedAt,
            weight: projectMilestones.weight,
            sortOrder: projectMilestones.sortOrder,
            deliverables: projectMilestones.deliverables
        })
        .from(projectMilestones)
        .where(eq(projectMilestones.projectId, params.id))
        .orderBy(asc(projectMilestones.sortOrder), asc(projectMilestones.createdAt));

    // Calculate progress
    const completedWeight = milestones
        .filter((m) => m.status === 'completed')
        .reduce((sum, m) => sum + m.weight, 0);
    const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
    const progressPercent = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

    // Get proposals for this project
    const projectProposals = await db
        .select({
            id: proposals.id,
            proposalNumber: proposals.proposalNumber,
            title: proposals.title,
            status: proposals.status,
            total: proposals.total,
            createdAt: proposals.createdAt,
            sentAt: proposals.sentAt,
            expiresAt: proposals.expiresAt
        })
        .from(proposals)
        .where(eq(proposals.projectId, params.id))
        .orderBy(desc(proposals.createdAt));

    // Get invoices for this project
    const projectInvoices = await db
        .select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            title: invoices.title,
            status: invoices.status,
            total: invoices.total,
            amountPaid: invoices.amountPaid,
            amountDue: invoices.amountDue,
            dueDate: invoices.dueDate,
            createdAt: invoices.createdAt
        })
        .from(invoices)
        .where(eq(invoices.projectId, params.id))
        .orderBy(desc(invoices.createdAt));

    // Get original project request if it exists (linked via metadata or converted project)
    const [originalRequest] = await db
        .select({
            id: projectRequests.id,
            requestNumber: projectRequests.requestNumber,
            title: projectRequests.title,
            description: projectRequests.description,
            projectType: projectRequests.projectType,
            budgetRange: projectRequests.budgetRange,
            timeline: projectRequests.timeline,
            status: projectRequests.status,
            createdAt: projectRequests.createdAt,
            convertedAt: projectRequests.convertedAt
        })
        .from(projectRequests)
        .where(eq(projectRequests.projectId, params.id))
        .limit(1);

    return {
        project: {
            ...project,
            organization: project.organizationName ?? 'Unknown',
            assignedTo: project.assignedToName ?? 'Unassigned',
            estimatedBudget: project.estimatedBudget ? parseFloat(project.estimatedBudget) : 0,
            actualBudget: project.actualBudget ? parseFloat(project.actualBudget) : 0
        },
        recentActivity: recentActivity.map((a) => ({
            ...a,
            user: a.userName ?? 'System'
        })),
        milestones,
        progress: {
            completedWeight,
            totalWeight,
            percent: progressPercent
        },
        proposals: projectProposals.map((p) => ({
            ...p,
            total: p.total ? parseFloat(p.total) : 0
        })),
        invoices: projectInvoices.map((i) => ({
            ...i,
            total: i.total ? parseFloat(i.total) : 0,
            amountPaid: i.amountPaid ? parseFloat(i.amountPaid) : 0,
            amountDue: i.amountDue ? parseFloat(i.amountDue) : 0
        })),
        originalRequest
    };
};
