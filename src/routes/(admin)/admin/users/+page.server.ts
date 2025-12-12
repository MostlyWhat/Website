import { createDb } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Async function to load users data
async function loadUsersData() {
    const db = createDb();

    const allUsers = await db
        .select({
            id: profiles.id,
            email: profiles.email,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
            displayName: profiles.displayName,
            role: profiles.role,
            onboardingCompleted: profiles.onboardingCompleted,
            createdAt: profiles.createdAt,
            updatedAt: profiles.updatedAt
        })
        .from(profiles)
        .orderBy(desc(profiles.createdAt));

    return allUsers.map((u) => ({
        ...u,
        status: u.onboardingCompleted ? 'active' : 'pending',
        lastLogin: u.updatedAt // Using updatedAt as proxy for last activity
    }));
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { streamed: { users: Promise.resolve([]) } };
    }

    // Verify admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        return { streamed: { users: Promise.resolve([]) } };
    }

    // Return streamed data for progressive loading
    return {
        streamed: {
            users: loadUsersData()
        }
    };
};
