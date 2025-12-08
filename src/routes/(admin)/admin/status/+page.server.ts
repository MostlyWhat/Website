import { createDb } from '$lib/server/db';
import { statusServices, statusIncidents, statusIncidentUpdates, profiles } from '$lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
    const db = createDb();
    if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
        return { services: [], incidents: [], filters: {} };
    }

    const tab = url.searchParams.get('tab') ?? 'services';

    try {
        // Fetch all services
        const services = await db
            .select()
            .from(statusServices)
            .orderBy(statusServices.sortOrder);

        // Fetch recent incidents with their updates
        const incidents = await db
            .select({
                id: statusIncidents.id,
                title: statusIncidents.title,
                slug: statusIncidents.slug,
                description: statusIncidents.description,
                status: statusIncidents.status,
                severity: statusIncidents.severity,
                affectedServices: statusIncidents.affectedServices,
                startedAt: statusIncidents.startedAt,
                resolvedAt: statusIncidents.resolvedAt,
                isScheduled: statusIncidents.isScheduled,
                scheduledFor: statusIncidents.scheduledFor,
                scheduledUntil: statusIncidents.scheduledUntil,
                createdAt: statusIncidents.createdAt,
                createdByName: profiles.displayName
            })
            .from(statusIncidents)
            .leftJoin(profiles, eq(statusIncidents.createdById, profiles.id))
            .orderBy(desc(statusIncidents.createdAt))
            .limit(50);

        return {
            services,
            incidents,
            filters: { tab }
        };
    } catch (error) {
        console.warn('Status tables not available:', error);
        return { services: [], incidents: [], filters: { tab } };
    }
};

export const actions: Actions = {
    // Create new service
    createService: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!name?.trim()) {
            return fail(400, { error: 'Service name is required' });
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        try {
            await db.insert(statusServices).values({
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                status: 'operational',
                isActive: true
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to create service:', error);
            return fail(500, { error: 'Failed to create service' });
        }
    },

    // Update service status
    updateServiceStatus: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const status = formData.get('status') as 'operational' | 'degraded' | 'outage' | 'maintenance';

        if (!id || !status) {
            return fail(400, { error: 'Service ID and status are required' });
        }

        try {
            await db.update(statusServices)
                .set({ status, updatedAt: new Date() })
                .where(eq(statusServices.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to update service status:', error);
            return fail(500, { error: 'Failed to update service status' });
        }
    },

    // Delete service
    deleteService: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Service ID is required' });
        }

        try {
            await db.delete(statusServices).where(eq(statusServices.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to delete service:', error);
            return fail(500, { error: 'Failed to delete service' });
        }
    },

    // Create incident
    createIncident: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const severity = formData.get('severity') as 'minor' | 'major' | 'critical';
        const affectedServices = formData.getAll('affectedServices') as string[];
        const isScheduled = formData.get('isScheduled') === 'true';
        const scheduledFor = formData.get('scheduledFor') as string;
        const scheduledUntil = formData.get('scheduledUntil') as string;

        if (!title?.trim()) {
            return fail(400, { error: 'Incident title is required' });
        }

        const slug = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50)}`;

        try {
            // Create incident
            const [incident] = await db.insert(statusIncidents).values({
                title: title.trim(),
                slug,
                description: description?.trim() || null,
                status: 'investigating',
                severity: severity || 'minor',
                affectedServices: affectedServices.length > 0 ? affectedServices : [],
                isScheduled,
                scheduledFor: isScheduled && scheduledFor ? new Date(scheduledFor) : null,
                scheduledUntil: isScheduled && scheduledUntil ? new Date(scheduledUntil) : null,
                startedAt: new Date(),
                createdById: locals.profile.id
            }).returning();

            // Create initial update
            await db.insert(statusIncidentUpdates).values({
                incidentId: incident.id,
                status: 'investigating',
                message: isScheduled ? 'Scheduled maintenance announced.' : 'We are investigating this issue.',
                createdById: locals.profile.id
            });

            // Update affected services status
            if (affectedServices.length > 0 && !isScheduled) {
                const newStatus = severity === 'critical' ? 'outage' : severity === 'major' ? 'degraded' : 'degraded';
                for (const serviceId of affectedServices) {
                    await db.update(statusServices)
                        .set({ status: newStatus, updatedAt: new Date() })
                        .where(eq(statusServices.id, serviceId));
                }
            } else if (isScheduled && affectedServices.length > 0) {
                for (const serviceId of affectedServices) {
                    await db.update(statusServices)
                        .set({ status: 'maintenance', updatedAt: new Date() })
                        .where(eq(statusServices.id, serviceId));
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to create incident:', error);
            return fail(500, { error: 'Failed to create incident' });
        }
    },

    // Update incident status
    updateIncidentStatus: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const status = formData.get('status') as 'investigating' | 'identified' | 'monitoring' | 'resolved';
        const message = formData.get('message') as string;

        if (!id || !status) {
            return fail(400, { error: 'Incident ID and status are required' });
        }

        try {
            // Update incident
            const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
            if (status === 'resolved') {
                updateData.resolvedAt = new Date();
            }

            const [incident] = await db.update(statusIncidents)
                .set(updateData)
                .where(eq(statusIncidents.id, id))
                .returning();

            // Create update entry
            await db.insert(statusIncidentUpdates).values({
                incidentId: id,
                status,
                message: message?.trim() || `Status changed to ${status}.`,
                createdById: locals.profile.id
            });

            // If resolved, restore affected services to operational
            if (status === 'resolved' && incident?.affectedServices) {
                for (const serviceId of incident.affectedServices as string[]) {
                    await db.update(statusServices)
                        .set({ status: 'operational', updatedAt: new Date() })
                        .where(eq(statusServices.id, serviceId));
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to update incident:', error);
            return fail(500, { error: 'Failed to update incident' });
        }
    },

    // Delete incident
    deleteIncident: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Incident ID is required' });
        }

        try {
            // Delete updates first
            await db.delete(statusIncidentUpdates).where(eq(statusIncidentUpdates.incidentId, id));
            // Delete incident
            await db.delete(statusIncidents).where(eq(statusIncidents.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to delete incident:', error);
            return fail(500, { error: 'Failed to delete incident' });
        }
    }
};
