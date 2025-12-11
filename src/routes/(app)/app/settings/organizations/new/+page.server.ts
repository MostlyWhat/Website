/**
 * Create Organization Page Server
 * 
 * Handles organization creation for users
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db';
import { organizations, organizationMembers } from '$lib/server/db/schema';
import { generateOrgNumber } from '$lib/server/utils/id-generator';
import crypto from 'node:crypto';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session || !locals.profile) {
        redirect(303, '/auth/login');
    }

    return {};
};

function generateSlug(name: string): string {
    const base = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
    const random = crypto.randomBytes(3).toString('hex');
    return `${base}-${random}`;
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const website = formData.get('website') as string;

        // Validation
        if (!name?.trim()) {
            return fail(400, { error: 'Organization name is required', name, email, phone, website });
        }

        if (name.trim().length < 2) {
            return fail(400, { error: 'Organization name must be at least 2 characters', name, email, phone, website });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return fail(400, { error: 'Invalid email address', name, email, phone, website });
        }

        try {
            // Generate organization number and slug
            const orgNumber = await generateOrgNumber();
            const slug = generateSlug(name.trim());

            // Create the organization
            const [newOrg] = await db
                .insert(organizations)
                .values({
                    name: name.trim(),
                    orgNumber,
                    slug,
                    email: email?.trim() || null,
                    phone: phone?.trim() || null,
                    website: website?.trim() || null
                })
                .returning({ id: organizations.id });

            // Add user as owner
            await db.insert(organizationMembers).values({
                organizationId: newOrg.id,
                profileId: locals.profile.id,
                role: 'owner'
            });

            return redirect(303, '/app/settings/organizations');
        } catch (err) {
            // Re-redirect errors
            if (err && typeof err === 'object' && 'status' in err && 'location' in err) throw err;

            console.error('Create organization error:', err);
            return fail(500, { error: 'Failed to create organization', name, email, phone, website });
        }
    }
};
