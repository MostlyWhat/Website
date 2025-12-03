import { db } from '$lib/server/db';
import { projects, organizations, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Require admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        throw redirect(302, '/admin');
    }

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

        try {
            const [newProject] = await db.insert(projects).values({
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

            throw redirect(302, `/admin/projects/${newProject.id}`);
        } catch (err) {
            if (err instanceof Response) throw err;
            console.error('Failed to create project:', err);
            return fail(500, { error: 'Failed to create project' });
        }
    }
};
