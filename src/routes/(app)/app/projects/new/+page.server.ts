import { createDb } from '$lib/server/db';
import { projectRequests, organizationMembers, organizations, profiles } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { generateOrgNumber } from '$lib/server/id-generator';
import type { PageServerLoad, Actions } from './$types';
import { projectRequestActivity, getClientIp } from '$lib/server/activity-logger';

// Generate request number like REQ-YYYY-XXXXX
async function generateRequestNumber(): Promise<string> {
    const db = createDb();
    const year = new Date().getFullYear();
    const prefix = `REQ-${year}-`;

    // Get the latest request number for this year
    const latest = await db
        .select({ requestNumber: projectRequests.requestNumber })
        .from(projectRequests)
        .where(sql`${projectRequests.requestNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(projectRequests.requestNumber))
        .limit(1);

    let nextNum = 1;
    if (latest.length > 0 && latest[0].requestNumber) {
        const lastNum = parseInt(latest[0].requestNumber.replace(prefix, ''), 10);
        if (!isNaN(lastNum)) {
            nextNum = lastNum + 1;
        }
    }

    return `${prefix}${String(nextNum).padStart(5, '0')}`;
}

// Create a personal organization for the user
async function createPersonalOrganization(profileId: string, userEmail: string, displayName: string): Promise<string> {
    const db = createDb();
    const orgNumber = await generateOrgNumber();
    const personalOrgName = `${displayName}'s Organization`;
    const slug = `personal-${profileId.slice(0, 8)}-${Date.now().toString(36)}`;

    const [newOrg] = await db
        .insert(organizations)
        .values({
            orgNumber,
            name: personalOrgName,
            slug,
            description: 'Personal organization for individual projects',
            customerType: 'personal',
            email: userEmail
        })
        .returning();

    // Add user as owner
    await db.insert(organizationMembers).values({
        organizationId: newOrg.id,
        profileId,
        role: 'owner'
    });

    return newOrg.id;
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login?redirectTo=/app/projects/new');
    }

    // Create per-request database connection
    const db = createDb();

    // Get user's organizations
    let userOrgs = await db
        .select({
            id: organizations.id,
            name: organizations.name
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
        .where(eq(organizationMembers.profileId, locals.profile.id));

    // For personal accounts with no organization, auto-create one
    const isPersonalAccount = locals.profile.preferences?.accountType === 'personal';

    if (userOrgs.length === 0 && isPersonalAccount) {
        const displayName = locals.profile.displayName || `${locals.profile.firstName} ${locals.profile.lastName}`.trim() || 'User';
        const newOrgId = await createPersonalOrganization(locals.profile.id, locals.user.email ?? '', displayName);

        // Refetch organizations
        userOrgs = await db
            .select({
                id: organizations.id,
                name: organizations.name
            })
            .from(organizationMembers)
            .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
            .where(eq(organizationMembers.profileId, locals.profile.id));
    }

    return {
        organizations: userOrgs,
        isPersonalAccount
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'You must be logged in to submit a project request.' });
        }

        const formData = await request.formData();
        const organizationId = formData.get('organizationId') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const projectType = formData.get('projectType') as string;
        const budgetRange = formData.get('budgetRange') as string;
        const timeline = formData.get('timeline') as string;
        const goals = formData.get('goals') as string;
        const requirements = formData.get('requirements') as string;
        const references = formData.get('references') as string;

        // Validation
        if (!organizationId) {
            return fail(400, { error: 'Please select an organization.' });
        }
        if (!title || title.trim().length < 5) {
            return fail(400, { error: 'Please provide a project title (at least 5 characters).' });
        }
        if (!description || description.trim().length < 20) {
            return fail(400, { error: 'Please provide a detailed description (at least 20 characters).' });
        }
        if (!projectType) {
            return fail(400, { error: 'Please select a project type.' });
        }

        // Create per-request database connection
        const db = createDb();

        // Verify user belongs to the organization
        const membership = await db
            .select()
            .from(organizationMembers)
            .where(eq(organizationMembers.profileId, locals.profile.id))
            .then(members => members.find(m => m.organizationId === organizationId));

        if (!membership) {
            return fail(403, { error: 'You do not have access to this organization.' });
        }

        try {
            const requestNumber = await generateRequestNumber();

            const [newRequest] = await db
                .insert(projectRequests)
                .values({
                    requestNumber,
                    organizationId,
                    requestedById: locals.profile.id,
                    title: title.trim(),
                    description: description.trim(),
                    projectType,
                    budgetRange: budgetRange || null,
                    timeline: timeline || null,
                    goals: goals?.trim() || null,
                    requirements: requirements?.trim() || null,
                    references: references?.trim() || null,
                    status: 'pending'
                })
                .returning({ id: projectRequests.id });

            // Log activity
            await projectRequestActivity.created(
                newRequest.id,
                title.trim(),
                locals.profile.id,
                getClientIp(request)
            );

            return redirect(303, `/app/projects/requests/${newRequest.id}?success=true`);
        } catch (error) {
            // Re-throw redirect errors
            if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
                throw error;
            }
            console.error('Failed to create project request:', error);
            return fail(500, { error: 'Failed to submit project request. Please try again.' });
        }
    }
};
