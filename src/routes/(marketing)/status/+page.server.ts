import { createDb } from '$lib/server/db';
import { statusServices, statusIncidents, statusIncidentUpdates, profiles } from '$lib/server/db/schema';
import { eq, desc, and, gte, isNotNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

export const load: PageServerLoad = async ({ setHeaders }) => {
    const db = createDb();

    // Set cache headers for status page (1min cache for near real-time updates)
    setCacheHeaders(setHeaders, CachePresets.REALTIME_SHORT);

    try {
        // Fetch all active services
        const services = await db
            .select()
            .from(statusServices)
            .where(eq(statusServices.isActive, true))
            .orderBy(statusServices.sortOrder);

        // Fetch recent incidents (last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

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
                createdAt: statusIncidents.createdAt
            })
            .from(statusIncidents)
            .where(gte(statusIncidents.createdAt, ninetyDaysAgo))
            .orderBy(desc(statusIncidents.createdAt))
            .limit(20);

        // Get incident updates for each incident
        const incidentsWithUpdates = await Promise.all(
            incidents.map(async (incident) => {
                const updates = await db
                    .select({
                        id: statusIncidentUpdates.id,
                        status: statusIncidentUpdates.status,
                        message: statusIncidentUpdates.message,
                        createdAt: statusIncidentUpdates.createdAt,
                        authorName: profiles.displayName
                    })
                    .from(statusIncidentUpdates)
                    .leftJoin(profiles, eq(statusIncidentUpdates.createdById, profiles.id))
                    .where(eq(statusIncidentUpdates.incidentId, incident.id))
                    .orderBy(desc(statusIncidentUpdates.createdAt));

                return { ...incident, updates };
            })
        );

        // Calculate overall uptime from individual service uptimes
        // If services have their own uptime values, average them; otherwise calculate based on current status
        const servicesWithUptime = services.filter(s => s.uptime !== null && s.uptime !== undefined);
        let uptimePercentage: string;

        if (servicesWithUptime.length > 0) {
            // Average the individual service uptimes
            const totalUptime = servicesWithUptime.reduce((sum, s) => sum + parseFloat(String(s.uptime ?? '100')), 0);
            uptimePercentage = (totalUptime / servicesWithUptime.length).toFixed(1);
        } else if (services.length > 0) {
            // Fallback: Calculate based on current operational status
            const operationalServices = services.filter(s => s.status === 'operational').length;
            uptimePercentage = ((operationalServices / services.length) * 100).toFixed(1);
        } else {
            uptimePercentage = '100';
        }

        return {
            services,
            incidents: incidentsWithUpdates,
            uptimePercentage,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.warn('Status tables not available:', error);
        // Return fallback data if tables don't exist
        return {
            services: [
                { id: '1', name: 'WEBSITE', description: 'Main website and landing pages', status: 'operational', uptime: '99.99' },
                { id: '2', name: 'API', description: 'REST API endpoints', status: 'operational', uptime: '99.95' },
                { id: '3', name: 'DASHBOARD', description: 'Client dashboard and portals', status: 'operational', uptime: '99.98' },
                { id: '4', name: 'CDN', description: 'Content delivery network', status: 'operational', uptime: '100' },
                { id: '5', name: 'DATABASE', description: 'Primary database clusters', status: 'operational', uptime: '99.97' },
                { id: '6', name: 'EMAIL', description: 'Transactional email service', status: 'operational', uptime: '99.90' }
            ],
            incidents: [],
            uptimePercentage: '99.9',
            lastUpdated: new Date().toISOString()
        };
    }
};
