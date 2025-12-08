-- =============================================================================
-- Seed Data for MostlyWhat Systems CRM
-- =============================================================================

-- This seed file initializes the system with essential defaults.
-- User profiles are created automatically via trigger when users sign up.

-- Temporarily disable foreign key checks for seeding
SET session_replication_role = replica;

-- =============================================================================
-- Default Ticket Categories
-- =============================================================================
-- Essential categories for organizing support tickets

INSERT INTO ticket_categories (id, name, slug, description, color, icon, sort_order, is_active) VALUES
    ('ca000000-0000-0000-0000-000000000001', 'General Inquiry', 'general', 'General questions and information requests', '#6b7280', 'help-circle', 1, true),
    ('ca000000-0000-0000-0000-000000000002', 'Technical Support', 'technical', 'Technical issues, bugs, and troubleshooting', '#ef4444', 'wrench', 2, true),
    ('ca000000-0000-0000-0000-000000000003', 'Billing & Payments', 'billing', 'Invoice questions, payment issues, refunds', '#f59e0b', 'credit-card', 3, true),
    ('ca000000-0000-0000-0000-000000000004', 'Feature Request', 'feature', 'Suggestions and feature requests', '#8b5cf6', 'lightbulb', 4, true),
    ('ca000000-0000-0000-0000-000000000005', 'Account & Access', 'account', 'Login issues, permissions, account settings', '#3b82f6', 'user', 5, true),
    ('ca000000-0000-0000-0000-000000000006', 'Project Related', 'project', 'Questions about active or completed projects', '#10b981', 'folder', 6, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- Default SLA Policies
-- =============================================================================
-- Use a system UUID for created_by_id since no users exist yet during seeding

DO $$
DECLARE
    system_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
    -- Standard Support (Default SLA for all customers)
    INSERT INTO sla_policies (
        id, name, description,
        urgent_response_hours, urgent_resolution_hours,
        high_response_hours, high_resolution_hours,
        medium_response_hours, medium_resolution_hours,
        low_response_hours, low_resolution_hours,
        business_hours_only, business_hours_start, business_hours_end, business_days,
        applies_to_customer_types, applies_to_categories, priority_order,
        escalation_enabled, escalation_after_hours, escalation_notify_emails,
        is_default, is_active, created_by_id
    ) VALUES (
        '00000000-0000-0000-0000-000000000001',
        'Standard Support',
        'Default SLA policy for all customers. Response and resolution times are measured in business hours (Mon-Fri, 9AM-6PM).',
        2, 8,      -- Urgent: 2hr response, 8hr resolution
        4, 16,     -- High: 4hr response, 16hr resolution
        8, 24,     -- Medium: 8hr response, 24hr resolution
        24, 72,    -- Low: 24hr response, 72hr resolution
        true, 9, 18, ARRAY[1, 2, 3, 4, 5],
        ARRAY['personal', 'business', 'enterprise'], ARRAY[]::TEXT[], 10,
        true, 24, ARRAY[]::TEXT[],
        true, true, system_id  -- is_default = true
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        is_default = true,
        updated_at = NOW();

    -- Priority Support (Business)
    INSERT INTO sla_policies (
        id, name, description,
        urgent_response_hours, urgent_resolution_hours,
        high_response_hours, high_resolution_hours,
        medium_response_hours, medium_resolution_hours,
        low_response_hours, low_resolution_hours,
        business_hours_only, business_hours_start, business_hours_end, business_days,
        applies_to_customer_types, applies_to_categories, priority_order,
        escalation_enabled, escalation_after_hours, escalation_notify_emails,
        is_default, is_active, created_by_id
    ) VALUES (
        '00000000-0000-0000-0000-000000000002',
        'Priority Support',
        'Enhanced SLA policy with faster response times. Extended hours (Mon-Sat, 8AM-8PM). Recommended for business customers with active projects.',
        1, 4,      -- Urgent: 1hr response, 4hr resolution
        2, 8,      -- High: 2hr response, 8hr resolution
        4, 16,     -- Medium: 4hr response, 16hr resolution
        8, 48,     -- Low: 8hr response, 48hr resolution
        true, 8, 20, ARRAY[1, 2, 3, 4, 5, 6],
        ARRAY['business'], ARRAY[]::TEXT[], 20,
        true, 12, ARRAY[]::TEXT[],
        false, true, system_id
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        urgent_response_hours = EXCLUDED.urgent_response_hours,
        urgent_resolution_hours = EXCLUDED.urgent_resolution_hours,
        high_response_hours = EXCLUDED.high_response_hours,
        high_resolution_hours = EXCLUDED.high_resolution_hours,
        medium_response_hours = EXCLUDED.medium_response_hours,
        medium_resolution_hours = EXCLUDED.medium_resolution_hours,
        low_response_hours = EXCLUDED.low_response_hours,
        low_resolution_hours = EXCLUDED.low_resolution_hours,
        applies_to_customer_types = EXCLUDED.applies_to_customer_types,
        priority_order = EXCLUDED.priority_order,
        updated_at = NOW();

    -- Enterprise Support (24/7)
    INSERT INTO sla_policies (
        id, name, description,
        urgent_response_hours, urgent_resolution_hours,
        high_response_hours, high_resolution_hours,
        medium_response_hours, medium_resolution_hours,
        low_response_hours, low_resolution_hours,
        business_hours_only, business_hours_start, business_hours_end, business_days,
        applies_to_customer_types, applies_to_categories, priority_order,
        escalation_enabled, escalation_after_hours, escalation_notify_emails,
        is_default, is_active, created_by_id
    ) VALUES (
        '00000000-0000-0000-0000-000000000003',
        'Enterprise Support',
        'Premium 24/7 SLA policy for enterprise customers. Fastest response times with automatic escalation for urgent issues.',
        1, 2,      -- Urgent: 1hr response, 2hr resolution
        1, 4,      -- High: 1hr response, 4hr resolution
        2, 8,      -- Medium: 2hr response, 8hr resolution
        4, 24,     -- Low: 4hr response, 24hr resolution
        false, 0, 23, ARRAY[0, 1, 2, 3, 4, 5, 6],
        ARRAY['enterprise'], ARRAY[]::TEXT[], 30,
        true, 6, ARRAY[]::TEXT[],
        false, true, system_id
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        urgent_response_hours = EXCLUDED.urgent_response_hours,
        urgent_resolution_hours = EXCLUDED.urgent_resolution_hours,
        high_response_hours = EXCLUDED.high_response_hours,
        high_resolution_hours = EXCLUDED.high_resolution_hours,
        medium_response_hours = EXCLUDED.medium_response_hours,
        medium_resolution_hours = EXCLUDED.medium_resolution_hours,
        low_response_hours = EXCLUDED.low_response_hours,
        low_resolution_hours = EXCLUDED.low_resolution_hours,
        applies_to_customer_types = EXCLUDED.applies_to_customer_types,
        priority_order = EXCLUDED.priority_order,
        updated_at = NOW();
END $$;

-- =============================================================================
-- Default Canned Responses
-- =============================================================================
-- Essential response templates for common ticket scenarios

DO $$
DECLARE
    system_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
    INSERT INTO canned_responses (id, title, shortcut, content, category, is_active, created_by_id)
    VALUES
        (
            'c0000000-0000-0000-0000-000000000001',
            'Ticket Received',
            '/received',
            'Thank you for contacting MostlyWhat Systems support. We have received your ticket and our team will review it shortly.

You can expect an initial response within the timeframe specified by your support agreement. If you have any additional information to add, please reply to this ticket.

Best regards,
MostlyWhat Systems Support',
            'general',
            true,
            system_id
        ),
        (
            'c0000000-0000-0000-0000-000000000002',
            'Need More Information',
            '/moreinfo',
            'Thank you for reaching out. To help us resolve your issue more efficiently, could you please provide the following additional information:

1. A detailed description of the issue
2. Steps to reproduce the problem
3. Any error messages you have received
4. Screenshots if applicable
5. Your browser/device information

Once we have this information, we will be better equipped to assist you.

Best regards,
MostlyWhat Systems Support',
            'general',
            true,
            system_id
        ),
        (
            'c0000000-0000-0000-0000-000000000003',
            'Issue Resolved',
            '/resolved',
            'We are pleased to inform you that your issue has been resolved. Please test and confirm that everything is working as expected.

If you encounter any further issues or have additional questions, please don''t hesitate to reach out. We''re here to help!

Thank you for your patience.

Best regards,
MostlyWhat Systems Support',
            'resolution',
            true,
            system_id
        )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        shortcut = EXCLUDED.shortcut,
        content = EXCLUDED.content,
        category = EXCLUDED.category,
        updated_at = NOW();
END $$;

-- =============================================================================
-- Default System Settings
-- =============================================================================
-- Core system configuration

INSERT INTO system_settings (key, value, category, label, description, value_type, is_secret)
VALUES
    -- General Settings
    ('site_name', '"MostlyWhat Systems"', 'general', 'Site Name', 'The name of your site shown in the header and emails', 'string', false),
    ('support_email', '"support@mostlywhat.com"', 'general', 'Support Email', 'Default email for support inquiries', 'string', false),
    ('timezone', '"Asia/Bangkok"', 'general', 'Default Timezone', 'Default timezone for date/time display', 'string', false),
    
    -- Ticket Settings  
    ('ticket_auto_close_days', '7', 'tickets', 'Auto-Close Days', 'Days of inactivity before tickets are auto-closed (0 to disable)', 'number', false),
    ('ticket_allow_customer_reopen', 'true', 'tickets', 'Allow Customer Reopen', 'Allow customers to reopen closed tickets', 'boolean', false),
    ('ticket_require_category', 'true', 'tickets', 'Require Category', 'Require category selection when creating tickets', 'boolean', false),
    ('ticket_allow_attachments', 'true', 'tickets', 'Allow Attachments', 'Allow file attachments on tickets', 'boolean', false),
    ('ticket_max_attachment_size', '10', 'tickets', 'Max Attachment Size (MB)', 'Maximum file size for attachments in megabytes', 'number', false),
    
    -- Billing Settings
    ('billing_currency', '"THB"', 'billing', 'Default Currency', 'Default currency for invoices and payments', 'string', false),
    ('billing_tax_rate', '7', 'billing', 'Default Tax Rate (%)', 'Default tax rate applied to invoices (VAT)', 'number', false),
    ('billing_invoice_prefix', '"INV-"', 'billing', 'Invoice Prefix', 'Prefix for invoice numbers', 'string', false),
    ('billing_due_days', '30', 'billing', 'Invoice Due Days', 'Default number of days until invoice is due', 'number', false),
    
    -- Email Settings
    ('email_notifications_enabled', 'true', 'email', 'Email Notifications', 'Enable email notifications for tickets and updates', 'boolean', false),
    ('email_digest_enabled', 'false', 'email', 'Daily Digest', 'Send daily summary emails instead of individual notifications', 'boolean', false),
    
    -- Security Settings
    ('security_two_factor_required', 'false', 'security', 'Require 2FA', 'Require two-factor authentication for all admin users', 'boolean', false),
    ('security_session_timeout_minutes', '60', 'security', 'Session Timeout (minutes)', 'Inactive session timeout in minutes', 'number', false),
    ('security_password_min_length', '8', 'security', 'Min Password Length', 'Minimum password length for user accounts', 'number', false),
    
    -- Magic Link Settings
    ('auth_magic_link_enabled', 'true', 'security', 'Magic Link Enabled', 'Enable passwordless sign-in via email link', 'boolean', false),
    ('auth_magic_link_expiry_minutes', '60', 'security', 'Magic Link Expiry', 'Minutes until magic link expires', 'number', false)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- =============================================================================
-- Status Page Services
-- =============================================================================
-- Default services for the public status page

INSERT INTO status_services (id, name, slug, description, status, uptime, sort_order)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Website', 'website', 'Main marketing website and public pages', 'operational', '99.99', 1),
    ('e0000000-0000-0000-0000-000000000002', 'Client Portal', 'client-portal', 'Customer dashboard and project management', 'operational', '99.95', 2),
    ('e0000000-0000-0000-0000-000000000003', 'API Services', 'api', 'Backend API and integrations', 'operational', '99.98', 3)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    uptime = EXCLUDED.uptime,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- =============================================================================
-- Note: Blog posts, portfolio projects, organizations, and tickets are created
-- through the application UI by authenticated users.
-- =============================================================================
