import { db } from '$lib/server/db';
import { organizations, organizationMembers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    return {};
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const website = formData.get('website') as string;

        if (!name?.trim()) {
            return fail(400, { error: 'Organization name is required' });
        }

        // Generate unique slug
        let slug = generateSlug(name);
        let slugCounter = 0;
        let slugExists = true;

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
            // Create the organization
            const [newOrg] = await db
                .insert(organizations)
                .values({
                    name: name.trim(),
                    slug,
                    email: email?.trim() || null,
                    phone: phone?.trim() || null,
                    website: website?.trim() || null
                })
                .returning({ id: organizations.id });

            // Add the creator as owner
            await db.insert(organizationMembers).values({
                organizationId: newOrg.id,
                profileId: locals.profile.id,
                role: 'owner'
            });
        } catch (error) {
            console.error('Error creating organization:', error);
            return fail(500, { error: 'Failed to create organization' });
        }

        // Redirect after successful creation (outside try-catch)
        redirect(302, '/app/settings/organizations');
    }
};
