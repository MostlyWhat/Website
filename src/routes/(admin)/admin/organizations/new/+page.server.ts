import { createDb } from '$lib/server/db';
import { organizations, organizationMembers, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { organizationActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';
import { generateOrgNumber } from '$lib/server/id-generator';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Verify admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        redirect(302, '/admin');
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch all users who could be set as owner
    const users = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email,
            role: profiles.role
        })
        .from(profiles)
        .orderBy(profiles.displayName);

    return { users };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const website = formData.get('website') as string;
        const billingAddressLine1 = formData.get('billingAddressLine1') as string;
        const billingCity = formData.get('billingCity') as string;
        const billingCountry = formData.get('billingCountry') as string;
        const ownerId = formData.get('ownerId') as string;

        if (!name?.trim()) {
            return fail(400, { error: 'Organization name is required' });
        }

        // Generate unique slug
        let slug = generateSlug(name);
        let slugCounter = 0;
        let slugExists = true;

        // Create per-request database connection
        const db = createDb();

        while (slugExists) {
            const checkSlug = slugCounter > 0 ? `${slug}-${slugCounter}` : slug;
            const [existing] = await db
                .select({ id: organizations.id })
                .from(organizations)
                .where(eq(organizations.slug, checkSlug))
                .limit(1);

            if (!existing) {
                slug = checkSlug;
                slugExists = false;
            } else {
                slugCounter++;
            }
        }

        try {
            // Generate unique org number
            const orgNumber = await generateOrgNumber();

            // Create the organization
            const [newOrg] = await db
                .insert(organizations)
                .values({
                    name: name.trim(),
                    orgNumber,
                    slug,
                    email: email?.trim() || null,
                    phone: phone?.trim() || null,
                    website: website?.trim() || null,
                    billingAddressLine1: billingAddressLine1?.trim() || null,
                    billingCity: billingCity?.trim() || null,
                    billingCountry: billingCountry?.trim() || null
                })
                .returning({ id: organizations.id });

            // If owner specified, add them as owner
            if (ownerId) {
                await db.insert(organizationMembers).values({
                    organizationId: newOrg.id,
                    profileId: ownerId,
                    role: 'owner'
                });
            }

            // Log activity
            await organizationActivity.created(
                newOrg.id,
                name.trim(),
                locals.profile.id,
                getClientIp(request)
            );

            redirect(302, `/admin/organizations/${newOrg.id}`);
        } catch (err) {
            if ((err as any)?.status === 302) throw err; // Re-redirect
            console.error('Error creating organization:', err);
            return fail(500, { error: 'Failed to create organization' });
        }
    }
};
