import { createDb } from '$lib/server/db';
import { activityLog, profiles } from '$lib/server/db/schema';
import { desc, eq, and, ilike, or, gte, lte, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Only super_admin and admin can view activity logs
    if (!['super_admin', 'admin'].includes(locals.profile.role ?? '')) {
        redirect(302, '/admin');
    }

    // Create per-request database connection
    const db = createDb();

    // Get filter parameters
    const entityType = url.searchParams.get('entityType') || '';
    const activityType = url.searchParams.get('activityType') || '';
    const search = url.searchParams.get('search') || '';
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';
    const performerId = url.searchParams.get('performerId') || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = 50;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (entityType) {
        conditions.push(eq(activityLog.entityType, entityType));
    }

    if (activityType) {
        conditions.push(eq(activityLog.activityType, activityType as any));
    }

    if (search) {
        conditions.push(ilike(activityLog.description, `%${search}%`));
    }

    if (startDate) {
        conditions.push(gte(activityLog.createdAt, new Date(startDate)));
    }

    if (endDate) {
        // Add 1 day to include the end date
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        conditions.push(lte(activityLog.createdAt, end));
    }

    if (performerId) {
        conditions.push(eq(activityLog.performedById, performerId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch activity logs with performer info
    const activities = await db
        .select({
            id: activityLog.id,
            entityType: activityLog.entityType,
            entityId: activityLog.entityId,
            activityType: activityLog.activityType,
            description: activityLog.description,
            previousValues: activityLog.previousValues,
            newValues: activityLog.newValues,
            ipAddress: activityLog.ipAddress,
            createdAt: activityLog.createdAt,
            performerName: profiles.displayName,
            performerEmail: profiles.email
        })
        .from(activityLog)
        .leftJoin(profiles, eq(activityLog.performedById, profiles.id))
        .where(whereClause)
        .orderBy(desc(activityLog.createdAt))
        .limit(limit)
        .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(activityLog)
        .where(whereClause);

    // Get unique entity types for filter dropdown
    const entityTypes = await db
        .selectDistinct({ entityType: activityLog.entityType })
        .from(activityLog)
        .orderBy(activityLog.entityType);

    // Get all staff/admin users for performer filter
    const performers = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email
        })
        .from(profiles)
        .where(
            or(
                eq(profiles.role, 'admin'),
                eq(profiles.role, 'super_admin'),
                eq(profiles.role, 'staff')
            )
        )
        .orderBy(profiles.displayName);

    return {
        activities,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        },
        filters: {
            entityType,
            activityType,
            search,
            startDate,
            endDate,
            performerId
        },
        entityTypes: entityTypes.map(e => e.entityType),
        performers
    };
};
