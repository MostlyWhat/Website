import { db } from '$lib/server/db';
import { organizations, organizationMembers, profiles, projects, invoices } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { organizations: [] };
    }

    // Verify admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        return { organizations: [] };
    }

    // Fetch all organizations with computed counts
    const allOrgs = await db
        .select({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            email: organizations.email,
            phone: organizations.phone,
            website: organizations.website,
            createdAt: organizations.createdAt,
            memberCount: sql<number>`(SELECT count(*) FROM organization_members WHERE organization_id = ${organizations.id})::int`,
            projectCount: sql<number>`(SELECT count(*) FROM projects WHERE organization_id = ${organizations.id})::int`,
            totalRevenue: sql<number>`COALESCE((SELECT sum(amount_paid::numeric) FROM invoices WHERE organization_id = ${organizations.id} AND status = 'paid'), 0)::numeric`
        })
        .from(organizations)
        .orderBy(desc(organizations.createdAt));

    return {
        organizations: allOrgs.map(org => ({
            ...org,
            totalRevenue: Number(org.totalRevenue) || 0
        }))
    };
};
