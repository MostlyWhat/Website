import { createDb } from '$lib/server/db';
import { slaPolicies, slaOrganizationAssignments, ticketCategories, organizations, profiles } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { slaActivity, getClientIp } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Require admin/super_admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        throw redirect(302, '/admin');
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch all SLA policies
    const policies = await db
        .select({
            id: slaPolicies.id,
            name: slaPolicies.name,
            description: slaPolicies.description,
            urgentResponseHours: slaPolicies.urgentResponseHours,
            urgentResolutionHours: slaPolicies.urgentResolutionHours,
            highResponseHours: slaPolicies.highResponseHours,
            highResolutionHours: slaPolicies.highResolutionHours,
            mediumResponseHours: slaPolicies.mediumResponseHours,
            mediumResolutionHours: slaPolicies.mediumResolutionHours,
            lowResponseHours: slaPolicies.lowResponseHours,
            lowResolutionHours: slaPolicies.lowResolutionHours,
            businessHoursOnly: slaPolicies.businessHoursOnly,
            businessHoursStart: slaPolicies.businessHoursStart,
            businessHoursEnd: slaPolicies.businessHoursEnd,
            businessDays: slaPolicies.businessDays,
            appliesToCustomerTypes: slaPolicies.appliesToCustomerTypes,
            appliesToCategories: slaPolicies.appliesToCategories,
            priorityOrder: slaPolicies.priorityOrder,
            escalationEnabled: slaPolicies.escalationEnabled,
            escalationAfterHours: slaPolicies.escalationAfterHours,
            escalationNotifyEmails: slaPolicies.escalationNotifyEmails,
            isDefault: slaPolicies.isDefault,
            isActive: slaPolicies.isActive,
            createdAt: slaPolicies.createdAt,
            createdById: slaPolicies.createdById,
            createdByName: profiles.displayName
        })
        .from(slaPolicies)
        .leftJoin(profiles, eq(slaPolicies.createdById, profiles.id))
        .orderBy(desc(slaPolicies.isDefault), desc(slaPolicies.priorityOrder), slaPolicies.name);

    // Fetch ticket categories
    const categories = await db
        .select()
        .from(ticketCategories)
        .orderBy(asc(ticketCategories.sortOrder));

    // Fetch organization assignments with org and policy names
    const assignments = await db
        .select({
            id: slaOrganizationAssignments.id,
            slaPolicyId: slaOrganizationAssignments.slaPolicyId,
            organizationId: slaOrganizationAssignments.organizationId,
            notes: slaOrganizationAssignments.notes,
            createdAt: slaOrganizationAssignments.createdAt,
            organizationName: organizations.name,
            policyName: slaPolicies.name
        })
        .from(slaOrganizationAssignments)
        .leftJoin(organizations, eq(slaOrganizationAssignments.organizationId, organizations.id))
        .leftJoin(slaPolicies, eq(slaOrganizationAssignments.slaPolicyId, slaPolicies.id))
        .orderBy(asc(organizations.name));

    // Fetch all organizations for the assignment dropdown
    const allOrganizations = await db
        .select({
            id: organizations.id,
            name: organizations.name,
            customerType: organizations.customerType
        })
        .from(organizations)
        .orderBy(asc(organizations.name));

    return { policies, categories, assignments, organizations: allOrganizations };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const isDefault = formData.get('isDefault') === 'true';

        // Response times
        const urgentResponseHours = parseInt(formData.get('urgentResponseHours') as string) || 1;
        const highResponseHours = parseInt(formData.get('highResponseHours') as string) || 4;
        const mediumResponseHours = parseInt(formData.get('mediumResponseHours') as string) || 8;
        const lowResponseHours = parseInt(formData.get('lowResponseHours') as string) || 24;

        // Resolution times
        const urgentResolutionHours = parseInt(formData.get('urgentResolutionHours') as string) || 4;
        const highResolutionHours = parseInt(formData.get('highResolutionHours') as string) || 8;
        const mediumResolutionHours = parseInt(formData.get('mediumResolutionHours') as string) || 24;
        const lowResolutionHours = parseInt(formData.get('lowResolutionHours') as string) || 72;

        // Business hours
        const businessHoursOnly = formData.get('businessHoursOnly') === 'true';
        const businessHoursStart = parseInt(formData.get('businessHoursStart') as string) || 9;
        const businessHoursEnd = parseInt(formData.get('businessHoursEnd') as string) || 17;

        // Business days
        let businessDays = [1, 2, 3, 4, 5];
        try {
            const businessDaysRaw = formData.get('businessDays') as string;
            if (businessDaysRaw) {
                businessDays = JSON.parse(businessDaysRaw);
            }
        } catch { /* use default */ }

        // Applicability rules
        let appliesToCustomerTypes: string[] = [];
        let appliesToCategories: string[] = [];
        try {
            const customerTypesRaw = formData.get('appliesToCustomerTypes') as string;
            if (customerTypesRaw) {
                appliesToCustomerTypes = JSON.parse(customerTypesRaw);
            }
            const categoriesRaw = formData.get('appliesToCategories') as string;
            if (categoriesRaw) {
                appliesToCategories = JSON.parse(categoriesRaw);
            }
        } catch { /* use defaults */ }

        const priorityOrder = parseInt(formData.get('priorityOrder') as string) || 0;

        // Escalation settings
        const escalationEnabled = formData.get('escalationEnabled') === 'true';
        const escalationAfterHours = parseInt(formData.get('escalationAfterHours') as string) || 24;

        if (!name?.trim()) {
            return fail(400, { error: 'Policy name is required' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await db
                .update(slaPolicies)
                .set({ isDefault: false, updatedAt: new Date() })
                .where(eq(slaPolicies.isDefault, true));
        }

        const [created] = await db.insert(slaPolicies).values({
            name: name.trim(),
            description: description?.trim() || null,
            urgentResponseHours,
            urgentResolutionHours,
            highResponseHours,
            highResolutionHours,
            mediumResponseHours,
            mediumResolutionHours,
            lowResponseHours,
            lowResolutionHours,
            businessHoursOnly,
            businessHoursStart,
            businessHoursEnd,
            businessDays,
            appliesToCustomerTypes,
            appliesToCategories,
            priorityOrder,
            escalationEnabled,
            escalationAfterHours,
            isDefault,
            createdById: locals.profile.id
        }).returning({ id: slaPolicies.id });

        // Log activity
        await slaActivity.created(created.id, name.trim(), locals.profile.id, getClientIp(request));

        return { success: true, message: 'SLA policy created' };
    },

    update: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const isDefault = formData.get('isDefault') === 'true';
        const isActive = formData.get('isActive') === 'true';

        // Response times
        const urgentResponseHours = parseInt(formData.get('urgentResponseHours') as string) || 1;
        const highResponseHours = parseInt(formData.get('highResponseHours') as string) || 4;
        const mediumResponseHours = parseInt(formData.get('mediumResponseHours') as string) || 8;
        const lowResponseHours = parseInt(formData.get('lowResponseHours') as string) || 24;

        // Resolution times
        const urgentResolutionHours = parseInt(formData.get('urgentResolutionHours') as string) || 4;
        const highResolutionHours = parseInt(formData.get('highResolutionHours') as string) || 8;
        const mediumResolutionHours = parseInt(formData.get('mediumResolutionHours') as string) || 24;
        const lowResolutionHours = parseInt(formData.get('lowResolutionHours') as string) || 72;

        // Business hours
        const businessHoursOnly = formData.get('businessHoursOnly') === 'true';
        const businessHoursStart = parseInt(formData.get('businessHoursStart') as string) || 9;
        const businessHoursEnd = parseInt(formData.get('businessHoursEnd') as string) || 17;

        // Business days
        let businessDays = [1, 2, 3, 4, 5];
        try {
            const businessDaysRaw = formData.get('businessDays') as string;
            if (businessDaysRaw) {
                businessDays = JSON.parse(businessDaysRaw);
            }
        } catch { /* use default */ }

        // Applicability rules
        let appliesToCustomerTypes: string[] = [];
        let appliesToCategories: string[] = [];
        try {
            const customerTypesRaw = formData.get('appliesToCustomerTypes') as string;
            if (customerTypesRaw) {
                appliesToCustomerTypes = JSON.parse(customerTypesRaw);
            }
            const categoriesRaw = formData.get('appliesToCategories') as string;
            if (categoriesRaw) {
                appliesToCategories = JSON.parse(categoriesRaw);
            }
        } catch { /* use defaults */ }

        const priorityOrder = parseInt(formData.get('priorityOrder') as string) || 0;

        // Escalation settings
        const escalationEnabled = formData.get('escalationEnabled') === 'true';
        const escalationAfterHours = parseInt(formData.get('escalationAfterHours') as string) || 24;

        if (!id || !name?.trim()) {
            return fail(400, { error: 'Policy ID and name are required' });
        }

        // Get old values for logging
        const [oldPolicy] = await db.select().from(slaPolicies).where(eq(slaPolicies.id, id));

        // If setting as default, unset other defaults
        if (isDefault) {
            await db
                .update(slaPolicies)
                .set({ isDefault: false, updatedAt: new Date() })
                .where(eq(slaPolicies.isDefault, true));
        }

        await db
            .update(slaPolicies)
            .set({
                name: name.trim(),
                description: description?.trim() || null,
                urgentResponseHours,
                urgentResolutionHours,
                highResponseHours,
                highResolutionHours,
                mediumResponseHours,
                mediumResolutionHours,
                lowResponseHours,
                lowResolutionHours,
                businessHoursOnly,
                businessHoursStart,
                businessHoursEnd,
                businessDays,
                appliesToCustomerTypes,
                appliesToCategories,
                priorityOrder,
                escalationEnabled,
                escalationAfterHours,
                isDefault,
                isActive,
                updatedAt: new Date()
            })
            .where(eq(slaPolicies.id, id));

        // Build changes object for meaningful logging
        const changes: Record<string, { old: unknown; new: unknown }> = {};
        if (oldPolicy?.name !== name.trim()) changes.name = { old: oldPolicy?.name, new: name.trim() };
        if (oldPolicy?.isDefault !== isDefault) changes.isDefault = { old: oldPolicy?.isDefault, new: isDefault };
        if (oldPolicy?.isActive !== isActive) changes.isActive = { old: oldPolicy?.isActive, new: isActive };
        if (Object.keys(changes).length > 0) {
            await slaActivity.updated(id, name.trim(), changes, locals.profile.id, getClientIp(request));
        }

        return { success: true, message: 'SLA policy updated' };
    },


    delete: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Policy ID is required' });
        }

        // Get policy name for logging
        const [policy] = await db.select({ name: slaPolicies.name }).from(slaPolicies).where(eq(slaPolicies.id, id));

        await db.delete(slaPolicies).where(eq(slaPolicies.id, id));

        // Log activity
        await slaActivity.deleted(id, policy?.name ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'SLA policy deleted' };
    },

    setDefault: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Policy ID is required' });
        }

        // Get policy name for logging
        const [policy] = await db.select({ name: slaPolicies.name }).from(slaPolicies).where(eq(slaPolicies.id, id));

        // Unset current default
        await db
            .update(slaPolicies)
            .set({ isDefault: false, updatedAt: new Date() })
            .where(eq(slaPolicies.isDefault, true));

        // Set new default
        await db
            .update(slaPolicies)
            .set({ isDefault: true, updatedAt: new Date() })
            .where(eq(slaPolicies.id, id));

        // Log activity
        await slaActivity.setDefault(id, policy?.name ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'Default SLA policy updated' };
    },

    assignOrganization: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const slaPolicyId = formData.get('slaPolicyId') as string;
        const organizationId = formData.get('organizationId') as string;
        const notes = formData.get('notes') as string;

        if (!slaPolicyId || !organizationId) {
            return fail(400, { error: 'Policy ID and Organization ID are required' });
        }

        // Check if assignment already exists
        const existing = await db
            .select()
            .from(slaOrganizationAssignments)
            .where(eq(slaOrganizationAssignments.organizationId, organizationId));

        if (existing.length > 0) {
            // Update existing assignment
            await db
                .update(slaOrganizationAssignments)
                .set({
                    slaPolicyId,
                    notes: notes?.trim() || null,
                    updatedAt: new Date()
                })
                .where(eq(slaOrganizationAssignments.organizationId, organizationId));
        } else {
            // Create new assignment
            await db.insert(slaOrganizationAssignments).values({
                slaPolicyId,
                organizationId,
                notes: notes?.trim() || null,
                createdById: locals.profile.id
            });
        }

        return { success: true, message: 'Organization assigned to SLA policy' };
    },

    removeAssignment: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Assignment ID is required' });
        }

        await db.delete(slaOrganizationAssignments).where(eq(slaOrganizationAssignments.id, id));

        return { success: true, message: 'Organization assignment removed' };
    },

    createCategory: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const color = formData.get('color') as string || '#6b7280';
        const icon = formData.get('icon') as string;
        const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

        if (!name?.trim()) {
            return fail(400, { error: 'Category name is required' });
        }

        // Generate slug from name
        const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        await db.insert(ticketCategories).values({
            name: name.trim(),
            slug,
            description: description?.trim() || null,
            color,
            icon: icon?.trim() || null,
            sortOrder
        });

        return { success: true, message: 'Category created' };
    },

    updateCategory: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const color = formData.get('color') as string || '#6b7280';
        const icon = formData.get('icon') as string;
        const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
        const isActive = formData.get('isActive') === 'true';

        if (!id || !name?.trim()) {
            return fail(400, { error: 'Category ID and name are required' });
        }

        const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        await db
            .update(ticketCategories)
            .set({
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                color,
                icon: icon?.trim() || null,
                sortOrder,
                isActive,
                updatedAt: new Date()
            })
            .where(eq(ticketCategories.id, id));

        return { success: true, message: 'Category updated' };
    },

    deleteCategory: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Category ID is required' });
        }

        await db.delete(ticketCategories).where(eq(ticketCategories.id, id));

        return { success: true, message: 'Category deleted' };
    },

    initializeDefaults: async ({ locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        // Check if policies already exist
        const existingPolicies = await db.select({ id: slaPolicies.id }).from(slaPolicies).limit(1);
        if (existingPolicies.length > 0) {
            return fail(400, { error: 'SLA policies already exist. Delete them first to reinitialize.' });
        }

        // Create default policies
        const defaultPolicies = [
            {
                name: 'Standard Support',
                description: 'Default SLA policy for personal and business customers. Response and resolution times are measured in business hours (Mon-Fri, 9AM-5PM).',
                urgentResponseHours: 2,
                urgentResolutionHours: 8,
                highResponseHours: 4,
                highResolutionHours: 16,
                mediumResponseHours: 8,
                mediumResolutionHours: 24,
                lowResponseHours: 24,
                lowResolutionHours: 72,
                businessHoursOnly: true,
                businessHoursStart: 9,
                businessHoursEnd: 17,
                businessDays: [1, 2, 3, 4, 5],
                appliesToCustomerTypes: ['personal', 'business'],
                appliesToCategories: [] as string[],
                priorityOrder: 10,
                escalationEnabled: false,
                escalationAfterHours: 24,
                isDefault: true,
                isActive: true,
                createdById: locals.profile.id
            },
            {
                name: 'Priority Support',
                description: 'Enhanced SLA policy with faster response times. Extended hours (Mon-Sat, 8AM-8PM). Recommended for business customers with active projects.',
                urgentResponseHours: 1,
                urgentResolutionHours: 4,
                highResponseHours: 2,
                highResolutionHours: 8,
                mediumResponseHours: 4,
                mediumResolutionHours: 16,
                lowResponseHours: 8,
                lowResolutionHours: 48,
                businessHoursOnly: true,
                businessHoursStart: 8,
                businessHoursEnd: 20,
                businessDays: [1, 2, 3, 4, 5, 6],
                appliesToCustomerTypes: ['business'],
                appliesToCategories: [] as string[],
                priorityOrder: 20,
                escalationEnabled: true,
                escalationAfterHours: 12,
                isDefault: false,
                isActive: true,
                createdById: locals.profile.id
            },
            {
                name: 'Enterprise Support',
                description: 'Premium 24/7 SLA policy for enterprise customers. Fastest response times with automatic escalation for urgent issues.',
                urgentResponseHours: 1,
                urgentResolutionHours: 2,
                highResponseHours: 1,
                highResolutionHours: 4,
                mediumResponseHours: 2,
                mediumResolutionHours: 8,
                lowResponseHours: 4,
                lowResolutionHours: 24,
                businessHoursOnly: false,
                businessHoursStart: 0,
                businessHoursEnd: 23,
                businessDays: [0, 1, 2, 3, 4, 5, 6],
                appliesToCustomerTypes: ['enterprise'],
                appliesToCategories: [] as string[],
                priorityOrder: 30,
                escalationEnabled: true,
                escalationAfterHours: 6,
                isDefault: false,
                isActive: true,
                createdById: locals.profile.id
            }
        ];

        for (const policy of defaultPolicies) {
            await db.insert(slaPolicies).values(policy);
        }

        return { success: true, message: 'Default SLA policies initialized successfully' };
    }
};
