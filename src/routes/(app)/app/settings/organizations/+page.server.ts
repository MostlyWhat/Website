/**
 * Organizations Settings Server
 * 
 * Loads user's organizations and membership info
 */

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { organizations, organizationMembers, projects, tickets } from '$lib/server/db/schema';
import { eq, and, count, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session || !locals.profile) {
        redirect(303, '/auth/login');
    }

    // Get user's organizations with their role
    const userOrgs = await db
        .select({
            id: organizations.id,
            name: organizations.name,
            orgNumber: organizations.orgNumber,
            slug: organizations.slug,
            email: organizations.email,
            phone: organizations.phone,
            logoUrl: organizations.logoUrl,
            createdAt: organizations.createdAt,
            memberRole: organizationMembers.role,
            joinedAt: organizationMembers.createdAt
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
        .where(eq(organizationMembers.profileId, locals.profile.id));

    // Get stats for each organization
    const orgsWithStats = await Promise.all(
        userOrgs.map(async (org) => {
            // Get member count
            const [memberCount] = await db
                .select({ count: count() })
                .from(organizationMembers)
                .where(eq(organizationMembers.organizationId, org.id));

            // Get project count
            const [projectCount] = await db
                .select({ count: count() })
                .from(projects)
                .where(eq(projects.organizationId, org.id));

            // Get open ticket count
            const [ticketCount] = await db
                .select({ count: count() })
                .from(tickets)
                .where(
                    and(
                        eq(tickets.organizationId, org.id),
                        inArray(tickets.status, ['open', 'in_progress', 'awaiting_customer'])
                    )
                );

            return {
                ...org,
                memberCount: memberCount?.count ?? 0,
                projectCount: projectCount?.count ?? 0,
                openTickets: ticketCount?.count ?? 0
            };
        })
    );

    return {
        organizations: orgsWithStats
    };
};
