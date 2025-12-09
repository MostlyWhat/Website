import { createDb } from '$lib/server/db';
import { projects, organizations, profiles } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { projectActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

// Generate project number (e.g., PRJ-2024-00001)
async function generateProjectNumber(): Promise<string> {
    const db = createDb();
    const year = new Date().getFullYear();
    const prefix = `PRJ-${year}-`;

    const [lastProject] = await db
        .select({ projectNumber: projects.projectNumber })
        .from(projects)
        .where(sql`${projects.projectNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(projects.projectNumber))
        .limit(1);

    let nextNum = 1;
    if (lastProject) {
        const match = lastProject.projectNumber.match(/PRJ-\d{4}-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `${prefix}${nextNum.toString().padStart(5, '0')}`;
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Require admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        redirect(302, '/admin');
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch organizations for dropdown
    const orgs = await db
        .select({
            id: organizations.id,
            name: organizations.name
        })
        .from(organizations)
        .orderBy(organizations.name);

    // Fetch staff members for assignment
    const staff = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
            role: profiles.role
        })
        .from(profiles)
        .where(eq(profiles.role, 'staff'));

    // Also include admins
    const admins = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
            role: profiles.role
        })
        .from(profiles)
        .where(eq(profiles.role, 'admin'));

    const superAdmins = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
            role: profiles.role
        })
        .from(profiles)
        .where(eq(profiles.role, 'super_admin'));

    const allStaff = [...superAdmins, ...admins, ...staff];

    return { organizations: orgs, staff: allStaff };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const organizationId = formData.get('organizationId') as string;
        const assignedToId = formData.get('assignedToId') as string;
        const status = formData.get('status') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const estimatedBudget = formData.get('estimatedBudget') as string;
        const currency = formData.get('currency') as string || 'USD';

        // Validation
        if (!name || name.trim().length === 0) {
            return fail(400, { error: 'Project name is required' });
        }

        if (!organizationId) {
            return fail(400, { error: 'Organization is required' });
        }

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            + '-' + Date.now().toString(36);

        // Create per-request database connection
        const db = createDb();

        try {
            const projectNumber = await generateProjectNumber();

            const [newProject] = await db.insert(projects).values({
                projectNumber,
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                organizationId,
                assignedToId: assignedToId || null,
                status: (status as 'draft' | 'proposal_sent' | 'proposal_accepted' | 'proposal_rejected' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled') || 'draft',
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                estimatedBudget: estimatedBudget ? estimatedBudget : null,
                currency
            }).returning();

            // Log activity
            await projectActivity.created(newProject.id, newProject.name, locals.profile.id, getClientIp(request));

            return { success: true, message: 'Project created successfully!' };
        } catch (err) {
            if (err instanceof Response) throw err;
            console.error('Failed to create project:', err);
            return fail(500, { error: 'Failed to create project' });
        }
    }
};
