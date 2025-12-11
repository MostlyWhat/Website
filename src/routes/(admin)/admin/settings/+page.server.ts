import { createDb } from '$lib/server/db';
import { systemSettings, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ActivityLogger } from '$lib/server/utils/activity-logger';

// Default settings if none exist
const defaultSettings = [
    // General Settings
    { key: 'site_name', value: 'MostlyWhat Systems', category: 'general', label: 'Site Name', description: 'The name of your site shown in the header and emails', valueType: 'string' },
    { key: 'support_email', value: 'support@mostlywhat.com', category: 'general', label: 'Support Email', description: 'Default email for support inquiries', valueType: 'string' },
    { key: 'timezone', value: 'America/New_York', category: 'general', label: 'Default Timezone', description: 'Default timezone for date/time display', valueType: 'string' },

    // Ticket Settings
    { key: 'ticket_auto_close_days', value: 7, category: 'tickets', label: 'Auto-Close Days', description: 'Days of inactivity before tickets are auto-closed (0 to disable)', valueType: 'number' },
    { key: 'ticket_allow_customer_reopen', value: true, category: 'tickets', label: 'Allow Customer Reopen', description: 'Allow customers to reopen closed tickets', valueType: 'boolean' },
    { key: 'ticket_require_category', value: true, category: 'tickets', label: 'Require Category', description: 'Require category selection when creating tickets', valueType: 'boolean' },
    { key: 'ticket_allow_attachments', value: true, category: 'tickets', label: 'Allow Attachments', description: 'Allow file attachments on tickets', valueType: 'boolean' },
    { key: 'ticket_max_attachment_size', value: 10, category: 'tickets', label: 'Max Attachment Size (MB)', description: 'Maximum file size for attachments in megabytes', valueType: 'number' },

    // Billing Settings
    { key: 'billing_currency', value: 'USD', category: 'billing', label: 'Default Currency', description: 'Default currency for invoices and payments', valueType: 'string' },
    { key: 'billing_tax_rate', value: 0, category: 'billing', label: 'Default Tax Rate (%)', description: 'Default tax rate applied to invoices', valueType: 'number' },
    { key: 'billing_invoice_prefix', value: 'INV-', category: 'billing', label: 'Invoice Prefix', description: 'Prefix for invoice numbers', valueType: 'string' },
    { key: 'billing_due_days', value: 30, category: 'billing', label: 'Invoice Due Days', description: 'Default number of days until invoice is due', valueType: 'number' },

    // Email Settings
    { key: 'email_notifications_enabled', value: true, category: 'email', label: 'Email Notifications', description: 'Enable email notifications for tickets and updates', valueType: 'boolean' },
    { key: 'email_digest_enabled', value: false, category: 'email', label: 'Daily Digest', description: 'Send daily summary emails instead of individual notifications', valueType: 'boolean' },

    // Security Settings
    { key: 'security_two_factor_required', value: false, category: 'security', label: 'Require 2FA', description: 'Require two-factor authentication for all admin users', valueType: 'boolean' },
    { key: 'security_session_timeout_minutes', value: 60, category: 'security', label: 'Session Timeout (minutes)', description: 'Inactive session timeout in minutes', valueType: 'number' },
    { key: 'security_password_min_length', value: 8, category: 'security', label: 'Min Password Length', description: 'Minimum password length for user accounts', valueType: 'number' }
];

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Only super_admin can access settings
    if (locals.profile.role !== 'super_admin') {
        redirect(302, '/admin');
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch all settings
    const settings = await db
        .select({
            key: systemSettings.key,
            value: systemSettings.value,
            category: systemSettings.category,
            label: systemSettings.label,
            description: systemSettings.description,
            valueType: systemSettings.valueType,
            isSecret: systemSettings.isSecret,
            updatedAt: systemSettings.updatedAt,
            updatedById: systemSettings.updatedById,
            updatedByName: profiles.displayName
        })
        .from(systemSettings)
        .leftJoin(profiles, eq(systemSettings.updatedById, profiles.id));

    // Group settings by category
    const settingsByCategory: Record<string, typeof settings> = {};
    for (const setting of settings) {
        if (!settingsByCategory[setting.category]) {
            settingsByCategory[setting.category] = [];
        }
        settingsByCategory[setting.category].push(setting);
    }

    // Categories with labels
    const categories = [
        { key: 'general', label: 'General', description: 'Basic site configuration' },
        { key: 'tickets', label: 'Tickets', description: 'Support ticket settings' },
        { key: 'billing', label: 'Billing', description: 'Invoice and payment settings' },
        { key: 'email', label: 'Email', description: 'Email notification settings' },
        { key: 'security', label: 'Security', description: 'Security and authentication settings' }
    ];

    return { settings, settingsByCategory, categories, defaultSettings };
};

export const actions: Actions = {
    update: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || locals.profile.role !== 'super_admin') {
            return fail(403, { error: 'Access denied. Super admin required.' });
        }

        const formData = await request.formData();
        const key = formData.get('key') as string;
        const value = formData.get('value') as string;
        const valueType = formData.get('valueType') as string;

        if (!key || value === null) {
            return fail(400, { error: 'Key and value are required' });
        }

        // Parse value based on type
        let parsedValue: unknown;
        try {
            switch (valueType) {
                case 'boolean':
                    parsedValue = value === 'true';
                    break;
                case 'number':
                    parsedValue = parseFloat(value);
                    if (isNaN(parsedValue as number)) {
                        return fail(400, { error: 'Invalid number value' });
                    }
                    break;
                case 'json':
                case 'array':
                    parsedValue = JSON.parse(value);
                    break;
                default:
                    parsedValue = value;
            }
        } catch {
            return fail(400, { error: 'Failed to parse value' });
        }

        // Get current value for logging
        const currentSetting = await db.query.systemSettings.findFirst({
            where: eq(systemSettings.key, key)
        });

        await db
            .update(systemSettings)
            .set({
                value: parsedValue,
                updatedById: locals.profile.id,
                updatedAt: new Date()
            })
            .where(eq(systemSettings.key, key));

        // Log the setting change
        await ActivityLogger.log({
            type: 'setting.updated',
            action: 'update',
            description: `Updated system setting: ${key}`,
            userId: locals.profile.id,
            metadata: {
                key,
                previousValue: currentSetting?.value,
                newValue: parsedValue,
                category: currentSetting?.category,
                label: currentSetting?.label
            }
        });

        return { success: true, message: 'Setting updated successfully' };
    },

    initialize: async ({ locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || locals.profile.role !== 'super_admin') {
            return fail(403, { error: 'Access denied. Super admin required.' });
        }

        // Insert default settings (ignore conflicts)
        for (const setting of defaultSettings) {
            try {
                await db.insert(systemSettings).values({
                    key: setting.key,
                    value: setting.value,
                    category: setting.category,
                    label: setting.label,
                    description: setting.description ?? null,
                    valueType: setting.valueType,
                    isSecret: false,
                    updatedById: locals.profile.id
                }).onConflictDoNothing();
            } catch {
                // Ignore - setting already exists
            }
        }

        // Log the initialization
        await ActivityLogger.log({
            type: 'setting.initialized',
            action: 'create',
            description: 'Initialized system settings with defaults',
            userId: locals.profile.id,
            metadata: {
                settingsCount: defaultSettings.length
            }
        });

        return { success: true, message: 'Settings initialized' };
    }
};
