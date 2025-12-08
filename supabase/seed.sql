-- =============================================================================
-- Seed Data for MostlyWhat Systems CRM
-- =============================================================================

-- Note: User profiles are created automatically via the trigger when users sign up.
-- This seed file creates sample organizations, projects, and other test data.
-- SLA Policies, Canned Responses, and Ticket Categories are seeded here.

-- =============================================================================
-- Default Ticket Categories
-- =============================================================================
-- Categories for organizing tickets and routing to appropriate SLA policies

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
-- Service Level Agreement policies for ticket management
-- These define response and resolution time targets by priority

DO $$
DECLARE
    admin_id uuid;
BEGIN
    -- Get the first super_admin to be the creator
    SELECT id INTO admin_id FROM profiles WHERE role = 'super_admin' LIMIT 1;
    
    -- If no super_admin exists yet, try to get any admin
    IF admin_id IS NULL THEN
        SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
    END IF;
    
    IF admin_id IS NOT NULL THEN
        -- Standard Support (Default)
        -- For personal and business customers, business hours only
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
            'Default SLA policy for personal and business customers. Response and resolution times are measured in business hours (Mon-Fri, 9AM-5PM).',
            2, 8,      -- Urgent: 2hr response, 8hr resolution
            4, 16,     -- High: 4hr response, 16hr resolution
            8, 24,     -- Medium: 8hr response, 24hr resolution
            24, 72,    -- Low: 24hr response, 72hr resolution
            true, 9, 17, ARRAY[1, 2, 3, 4, 5],
            ARRAY['personal', 'business'], ARRAY[]::TEXT[], 10,
            false, 24, ARRAY[]::TEXT[],
            true, true, admin_id
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

        -- Priority Support
        -- For business customers who need faster response, extended hours
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
            false, true, admin_id
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

        -- Enterprise Support
        -- 24/7 support for enterprise customers
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
            1, 2,      -- Urgent: 30min response, 2hr resolution (stored as integers)
            1, 4,      -- High: 1hr response, 4hr resolution
            2, 8,      -- Medium: 2hr response, 8hr resolution
            4, 24,     -- Low: 4hr response, 24hr resolution
            false, 0, 23, ARRAY[0, 1, 2, 3, 4, 5, 6],
            ARRAY['enterprise'], ARRAY[]::TEXT[], 30,
            true, 6, ARRAY[]::TEXT[],
            false, true, admin_id
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

        -- Technical Escalation Policy
        -- Special policy for technical category tickets that need faster handling
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
            '00000000-0000-0000-0000-000000000004',
            'Technical Escalation',
            'Special policy for technical support tickets. Applied automatically to technical category tickets for all customer types.',
            1, 4,      -- Urgent: 1hr response, 4hr resolution
            2, 8,      -- High: 2hr response, 8hr resolution
            4, 16,     -- Medium: 4hr response, 16hr resolution
            8, 48,     -- Low: 8hr response, 48hr resolution
            true, 9, 17, ARRAY[1, 2, 3, 4, 5],
            ARRAY[]::TEXT[], ARRAY['technical'], 25,
            true, 8, ARRAY[]::TEXT[],
            false, true, admin_id
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            applies_to_categories = EXCLUDED.applies_to_categories,
            priority_order = EXCLUDED.priority_order,
            updated_at = NOW();
    END IF;
END $$;

-- =============================================================================
-- Default Canned Responses
-- =============================================================================
-- Pre-defined response templates for common ticket scenarios

DO $$
DECLARE
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM profiles WHERE role = 'super_admin' LIMIT 1;
    IF admin_id IS NULL THEN
        SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
    END IF;
    
    IF admin_id IS NOT NULL THEN
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
                admin_id
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
                admin_id
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
                admin_id
            ),
            (
                'c0000000-0000-0000-0000-000000000004',
                'Escalation Notice',
                '/escalate',
                'Your ticket has been escalated to our senior support team for further review. They will be taking over this case and will provide you with an update as soon as possible.

Escalation Reason: [Please specify]

We appreciate your patience as we work to resolve this matter.

Best regards,
MostlyWhat Systems Support',
                'technical',
                true,
                admin_id
            ),
            (
                'c0000000-0000-0000-0000-000000000005',
                'Billing Inquiry Response',
                '/billing',
                'Thank you for your billing inquiry. We understand the importance of clear and accurate billing.

Our billing team is reviewing your account and will provide a detailed response within 24-48 hours. If this is urgent, please reply to this ticket with "URGENT" in the subject line.

For your reference:
- Invoice questions: Please include the invoice number
- Payment issues: Please include the transaction ID
- Refund requests: Please include the order/invoice number

Thank you for your patience.

Best regards,
MostlyWhat Systems Billing',
                'billing',
                true,
                admin_id
            ),
            (
                'c0000000-0000-0000-0000-000000000006',
                'Project Update Request',
                '/project-update',
                'Thank you for your inquiry about your project status.

Your project is currently in the [PHASE] phase. Here''s a brief overview:

- Current Status: [STATUS]
- Expected Milestone: [MILESTONE]
- Estimated Completion: [DATE]

If you have specific questions or concerns about the project, please let us know and we''ll arrange a call with your project manager.

Best regards,
MostlyWhat Systems',
                'project',
                true,
                admin_id
            )
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            shortcut = EXCLUDED.shortcut,
            content = EXCLUDED.content,
            category = EXCLUDED.category,
            updated_at = NOW();
    END IF;
END $$;

-- =============================================================================
-- Sample Organizations (for development/testing)
-- =============================================================================

INSERT INTO organizations (id, org_number, name, slug, description, email, phone, website, billing_address_line1, billing_city, billing_country, customer_type)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'ORG-0001', 'Acme Corporation', 'acme-corp', 'A leading technology company', 'contact@acme.com', '+1-555-0100', 'https://acme.com', '123 Tech Street', 'San Francisco', 'USA', 'enterprise'),
    ('a0000000-0000-0000-0000-000000000002', 'ORG-0002', 'Global Industries', 'global-industries', 'International manufacturing', 'info@global.com', '+1-555-0200', 'https://global.com', '456 Industry Blvd', 'New York', 'USA', 'business'),
    ('a0000000-0000-0000-0000-000000000003', 'ORG-0003', 'StartupXYZ', 'startup-xyz', 'Innovative startup company', 'hello@startupxyz.com', '+1-555-0300', 'https://startupxyz.com', '789 Innovation Way', 'Austin', 'USA', 'business')
ON CONFLICT (slug) DO UPDATE SET
    customer_type = EXCLUDED.customer_type;

-- =============================================================================
-- Link Sample Organizations to SLA Policies
-- =============================================================================

DO $$
DECLARE
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM profiles WHERE role IN ('super_admin', 'admin') LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        -- Acme Corporation gets Enterprise Support
        INSERT INTO sla_org_assignments (sla_policy_id, organization_id, notes, created_by_id)
        VALUES (
            '00000000-0000-0000-0000-000000000003',  -- Enterprise Support
            'a0000000-0000-0000-0000-000000000001',  -- Acme Corp
            'Enterprise client with 24/7 support agreement',
            admin_id
        )
        ON CONFLICT (sla_policy_id, organization_id) DO NOTHING;

        -- Global Industries gets Priority Support
        INSERT INTO sla_org_assignments (sla_policy_id, organization_id, notes, created_by_id)
        VALUES (
            '00000000-0000-0000-0000-000000000002',  -- Priority Support
            'a0000000-0000-0000-0000-000000000002',  -- Global Industries
            'Business client with priority support add-on',
            admin_id
        )
        ON CONFLICT (sla_policy_id, organization_id) DO NOTHING;

        -- StartupXYZ uses default Standard Support (no explicit assignment needed)
    END IF;
END $$;

-- =============================================================================
-- Sample Projects (with 7-Phase System)
-- =============================================================================

INSERT INTO projects (
    id, organization_id, project_number, name, slug, description, 
    phase, status, 
    start_date, end_date, estimated_budget, currency
) VALUES
    -- Acme Corp: Completed project in support phase
    (
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'PRJ-2024-00001',
        'Corporate Website Redesign',
        'acme-website-redesign',
        'Complete redesign of the corporate website with modern UI/UX',
        'support', 'completed',
        '2024-01-15', '2024-06-30', '75000.00', 'USD'
    ),
    -- Acme Corp: Active project in building phase
    (
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'PRJ-2024-00002',
        'Customer Portal Development',
        'acme-customer-portal',
        'Self-service customer portal for order tracking and support',
        'building', 'in_progress',
        '2024-09-01', '2025-03-31', '150000.00', 'USD'
    ),
    -- Global Industries: In proposal phase
    (
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000002',
        'PRJ-2024-00003',
        'Inventory Management System',
        'global-inventory-system',
        'Real-time inventory tracking and management system',
        'proposal', 'proposal_sent',
        NULL, NULL, '95000.00', 'USD'
    ),
    -- Global Industries: Confirmed, ready to start
    (
        'b0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000002',
        'PRJ-2025-00001',
        'Supply Chain Analytics Dashboard',
        'global-supply-chain-dashboard',
        'Analytics dashboard for supply chain optimization',
        'confirmed', 'proposal_accepted',
        '2025-01-15', '2025-06-30', '85000.00', 'USD'
    ),
    -- StartupXYZ: In review phase
    (
        'b0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000003',
        'PRJ-2025-00002',
        'MVP Mobile App',
        'startup-mvp-app',
        'Minimum viable product mobile application',
        'review', 'draft',
        NULL, NULL, '45000.00', 'USD'
    ),
    -- StartupXYZ: Just requested
    (
        'b0000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000003',
        'PRJ-2025-00003',
        'Landing Page Design',
        'startup-landing-page',
        'Marketing landing page for product launch',
        'request', 'draft',
        NULL, NULL, '12000.00', 'USD'
    )
ON CONFLICT (project_number) DO UPDATE SET
    phase = EXCLUDED.phase,
    status = EXCLUDED.status,
    updated_at = NOW();

-- =============================================================================
-- Sample Project Revisions (for projects in building phase)
-- =============================================================================

INSERT INTO project_revisions (
    id, project_id, version, title, description, status, priority
) VALUES
    -- Revisions for Customer Portal Development (in building phase)
    (
        'd0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000002',
        'v1.0',
        'Dashboard layout adjustment',
        'Requested changes to the main dashboard layout to better highlight key metrics',
        'resolved', 'medium'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000002',
        'v1.1',
        'Add export functionality',
        'Need to export order history to CSV/PDF formats',
        'in_progress', 'high'
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000002',
        'v1.1',
        'Color scheme update',
        'Update brand colors to match new corporate identity',
        'pending', 'low'
    )
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = NOW();

-- =============================================================================
-- Default System Settings
-- =============================================================================
-- Key-value system configuration settings

INSERT INTO system_settings (key, value, category, label, description, value_type, is_secret)
VALUES
    -- General Settings
    ('site_name', '"MostlyWhat Systems"', 'general', 'Site Name', 'The name of your site shown in the header and emails', 'string', false),
    ('support_email', '"support@mostlywhat.com"', 'general', 'Support Email', 'Default email for support inquiries', 'string', false),
    ('timezone', '"America/New_York"', 'general', 'Default Timezone', 'Default timezone for date/time display', 'string', false),
    
    -- Ticket Settings  
    ('ticket_auto_close_days', '7', 'tickets', 'Auto-Close Days', 'Days of inactivity before tickets are auto-closed (0 to disable)', 'number', false),
    ('ticket_allow_customer_reopen', 'true', 'tickets', 'Allow Customer Reopen', 'Allow customers to reopen closed tickets', 'boolean', false),
    ('ticket_require_category', 'true', 'tickets', 'Require Category', 'Require category selection when creating tickets', 'boolean', false),
    ('ticket_allow_attachments', 'true', 'tickets', 'Allow Attachments', 'Allow file attachments on tickets', 'boolean', false),
    ('ticket_max_attachment_size', '10', 'tickets', 'Max Attachment Size (MB)', 'Maximum file size for attachments in megabytes', 'number', false),
    
    -- Billing Settings
    ('billing_currency', '"USD"', 'billing', 'Default Currency', 'Default currency for invoices and payments', 'string', false),
    ('billing_tax_rate', '0', 'billing', 'Default Tax Rate (%)', 'Default tax rate applied to invoices', 'number', false),
    ('billing_invoice_prefix', '"INV-"', 'billing', 'Invoice Prefix', 'Prefix for invoice numbers', 'string', false),
    ('billing_due_days', '30', 'billing', 'Invoice Due Days', 'Default number of days until invoice is due', 'number', false),
    
    -- Email Settings
    ('email_notifications_enabled', 'true', 'email', 'Email Notifications', 'Enable email notifications for tickets and updates', 'boolean', false),
    ('email_digest_enabled', 'false', 'email', 'Daily Digest', 'Send daily summary emails instead of individual notifications', 'boolean', false),
    
    -- Security Settings
    ('security_two_factor_required', 'false', 'security', 'Require 2FA', 'Require two-factor authentication for all admin users', 'boolean', false),
    ('security_session_timeout_minutes', '60', 'security', 'Session Timeout (minutes)', 'Inactive session timeout in minutes', 'number', false),
    ('security_password_min_length', '8', 'security', 'Min Password Length', 'Minimum password length for user accounts', 'number', false)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- =============================================================================
-- Status Page Services (Default)
-- =============================================================================
-- Basic services for the status page

INSERT INTO status_services (id, name, slug, description, status, sort_order)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Website', 'website', 'Main marketing website and public pages', 'operational', 1),
    ('e0000000-0000-0000-0000-000000000002', 'Client Portal', 'client-portal', 'Customer dashboard and project management', 'operational', 2),
    ('e0000000-0000-0000-0000-000000000003', 'API', 'api', 'Backend API services and integrations', 'operational', 3),
    ('e0000000-0000-0000-0000-000000000004', 'Database', 'database', 'Data storage and retrieval services', 'operational', 4),
    ('e0000000-0000-0000-0000-000000000005', 'Email Services', 'email', 'Transactional and notification emails', 'operational', 5)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- =============================================================================
-- Sample Blog Post
-- =============================================================================
-- One sample blog post for the marketing site

DO $$
DECLARE
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM profiles WHERE role IN ('super_admin', 'admin') LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        INSERT INTO blog_posts (
            id, slug, title, excerpt, content, category, tags,
            status, is_featured, published_at, read_time, author_id
        ) VALUES (
            'f0000000-0000-0000-0000-000000000001',
            'building-modern-web-applications',
            'Building Modern Web Applications with SvelteKit',
            'Learn how we leverage SvelteKit to build fast, scalable web applications for our clients.',
            '## Introduction

Modern web development has evolved significantly over the past few years. At MostlyWhat Systems, we''ve embraced SvelteKit as our framework of choice for building client applications.

## Why SvelteKit?

SvelteKit offers several advantages that make it ideal for production applications:

- **Performance**: Svelte compiles to vanilla JavaScript, resulting in smaller bundle sizes
- **Developer Experience**: The framework is intuitive and reduces boilerplate code
- **SEO-Friendly**: Server-side rendering is built-in and easy to configure
- **Type Safety**: Full TypeScript support out of the box

## Our Approach

When we start a new project, we follow these principles:

1. **Design System First**: We establish a consistent design language
2. **Component Architecture**: Reusable components for maintainability
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Performance Budgets**: We set and monitor performance metrics

## Conclusion

SvelteKit has become an essential part of our technology stack. Its combination of performance, developer experience, and flexibility makes it perfect for building modern web applications.

If you''re interested in learning more about how we can help build your next project, [get in touch](/contact).',
            'development',
            '["sveltekit", "web development", "javascript", "performance"]',
            'published',
            true,
            NOW(),
            '5 min read',
            admin_id
        )
        ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            updated_at = NOW();
    END IF;
END $$;

-- =============================================================================
-- Sample Portfolio Project
-- =============================================================================
-- One sample portfolio project for the marketing site

DO $$
DECLARE
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM profiles WHERE role IN ('super_admin', 'admin') LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        INSERT INTO portfolio_projects (
            id, slug, title, client, description, content, category, tags, year,
            status, is_featured, published_at, sort_order, created_by_id
        ) VALUES (
            'f0000000-0000-0000-0000-000000000002',
            'enterprise-dashboard',
            'Enterprise Analytics Dashboard',
            'TechCorp Industries',
            'A comprehensive analytics dashboard for enterprise-level data visualization and reporting.',
            '## Project Overview

TechCorp Industries needed a powerful analytics solution to help their executive team make data-driven decisions. We built a custom dashboard that aggregates data from multiple sources and presents it in an intuitive interface.

## The Challenge

The client was dealing with:
- Data scattered across multiple systems
- Manual report generation taking days
- Lack of real-time insights
- Poor mobile experience for executives on the go

## Our Solution

We developed a comprehensive dashboard featuring:

### Real-time Data Integration
Connected to 5 different data sources with live updates every 30 seconds.

### Custom Visualizations
Built interactive charts and graphs tailored to their specific KPIs.

### Mobile-First Design
Fully responsive design that works seamlessly on tablets and phones.

### Role-Based Access
Different views for executives, managers, and analysts.

## Results

After implementation, TechCorp saw:
- 80% reduction in report generation time
- 45% increase in data-driven decisions
- 100% executive adoption rate within first month

## Technologies Used

- SvelteKit for the frontend
- PostgreSQL for data storage
- Redis for caching
- D3.js for visualizations',
            'web-app',
            '["dashboard", "analytics", "enterprise", "sveltekit"]',
            '2024',
            'published',
            true,
            NOW(),
            1,
            admin_id
        )
        ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content = EXCLUDED.content,
            updated_at = NOW();
    END IF;
END $$;

-- =============================================================================
-- Note: Tickets and invoices will be created through the application
-- after users are registered and linked to organizations.
-- =============================================================================
