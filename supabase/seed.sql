-- =============================================================================
-- Seed Data for MostlyWhat Systems CRM
-- =============================================================================

-- Note: User profiles are created automatically via the trigger when users sign up.
-- This seed file creates sample organizations, projects, and other test data.

-- =============================================================================
-- Default SLA Policies
-- =============================================================================
-- These are the default SLA policies for ticket management

INSERT INTO sla_policies (
    id, name, description,
    urgent_response_hours, urgent_resolution_hours,
    high_response_hours, high_resolution_hours,
    medium_response_hours, medium_resolution_hours,
    low_response_hours, low_resolution_hours,
    business_hours_only, business_hours_start, business_hours_end, business_days,
    is_default, is_active, created_by_id
)
VALUES
    (
        'sla00000-0000-0000-0000-000000000001',
        'Standard Support',
        'Default SLA policy for all tickets. Response times are measured in business hours.',
        1, 4,    -- Urgent: 1hr response, 4hr resolution
        4, 8,    -- High: 4hr response, 8hr resolution
        8, 24,   -- Medium: 8hr response, 24hr resolution
        24, 72,  -- Low: 24hr response, 72hr resolution
        true, 9, 17, ARRAY[1, 2, 3, 4, 5],  -- Mon-Fri, 9am-5pm
        true, true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    ),
    (
        'sla00000-0000-0000-0000-000000000002',
        'Priority Support',
        'Enhanced SLA policy for priority clients with faster response times.',
        0.5, 2,   -- Urgent: 30min response, 2hr resolution
        1, 4,     -- High: 1hr response, 4hr resolution
        4, 12,    -- Medium: 4hr response, 12hr resolution
        8, 48,    -- Low: 8hr response, 48hr resolution
        false, 0, 23, ARRAY[0, 1, 2, 3, 4, 5, 6],  -- 24/7 coverage
        false, true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    ),
    (
        'sla00000-0000-0000-0000-000000000003',
        'Enterprise Support',
        'Premium SLA policy for enterprise clients with 24/7 support and fastest response times.',
        0.25, 1,  -- Urgent: 15min response, 1hr resolution
        0.5, 2,   -- High: 30min response, 2hr resolution
        2, 8,     -- Medium: 2hr response, 8hr resolution
        4, 24,    -- Low: 4hr response, 24hr resolution
        false, 0, 23, ARRAY[0, 1, 2, 3, 4, 5, 6],  -- 24/7 coverage
        false, true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Default Canned Responses
-- =============================================================================
-- Pre-defined response templates for common ticket scenarios

INSERT INTO canned_responses (
    id, title, shortcut, content, category, tags, is_active, created_by_id
)
VALUES
    (
        'cr000000-0000-0000-0000-000000000001',
        'Ticket Received',
        '/received',
        'Thank you for contacting MostlyWhat Systems support. We have received your ticket and our team will review it shortly. You can expect an initial response within the timeframe specified by your SLA.\n\nIf you have any additional information to add, please reply to this ticket.',
        'general',
        ARRAY['acknowledgement', 'welcome'],
        true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    ),
    (
        'cr000000-0000-0000-0000-000000000002',
        'Need More Information',
        '/moreinfo',
        'Thank you for reaching out. To help us resolve your issue more efficiently, could you please provide the following additional information:\n\n1. A detailed description of the issue\n2. Steps to reproduce the problem\n3. Any error messages you have received\n4. Screenshots if applicable\n\nOnce we have this information, we will be better equipped to assist you.',
        'general',
        ARRAY['follow-up', 'information'],
        true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    ),
    (
        'cr000000-0000-0000-0000-000000000003',
        'Issue Resolved',
        '/resolved',
        'We are pleased to inform you that your issue has been resolved. Please test and confirm that everything is working as expected.\n\nIf you encounter any further issues or have additional questions, please don''t hesitate to reach out. We''re here to help!\n\nThank you for your patience.',
        'resolution',
        ARRAY['resolved', 'closing'],
        true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    ),
    (
        'cr000000-0000-0000-0000-000000000004',
        'Escalation Notice',
        '/escalate',
        'Your ticket has been escalated to our senior support team for further review. They will be taking over this case and will provide you with an update as soon as possible.\n\nWe appreciate your patience as we work to resolve this matter.',
        'technical',
        ARRAY['escalation', 'priority'],
        true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    ),
    (
        'cr000000-0000-0000-0000-000000000005',
        'Billing Inquiry Response',
        '/billing',
        'Thank you for your billing inquiry. We understand the importance of clear and accurate billing.\n\nOur billing team is reviewing your account and will provide a detailed response within 24-48 hours. If this is urgent, please reply to this ticket with "URGENT" in the subject line.\n\nThank you for your patience.',
        'billing',
        ARRAY['billing', 'payment'],
        true,
        (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Sample Organizations
-- =============================================================================

INSERT INTO organizations (id, name, slug, description, email, phone, website, billing_address_line1, billing_city, billing_country)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Acme Corporation', 'acme-corp', 'A leading technology company', 'contact@acme.com', '+1-555-0100', 'https://acme.com', '123 Tech Street', 'San Francisco', 'USA'),
    ('a0000000-0000-0000-0000-000000000002', 'Global Industries', 'global-industries', 'International manufacturing', 'info@global.com', '+1-555-0200', 'https://global.com', '456 Industry Blvd', 'New York', 'USA'),
    ('a0000000-0000-0000-0000-000000000003', 'StartupXYZ', 'startup-xyz', 'Innovative startup company', 'hello@startupxyz.com', '+1-555-0300', 'https://startupxyz.com', '789 Innovation Way', 'Austin', 'USA')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- Note: Projects, invoices, and tickets will be created through the application
-- after users are registered and linked to organizations.
-- =============================================================================

-- You can uncomment and modify the following after you have created test users:

/*
-- Sample Projects (requires organization_id and assigned_to_id)
INSERT INTO projects (id, organization_id, name, slug, description, status, estimated_budget, currency)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Website Redesign', 'website-redesign', 'Complete website overhaul with new branding', 'in_progress', 15000.00, 'USD'),
    ('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Mobile App Development', 'mobile-app', 'Native iOS and Android application', 'proposal_sent', 45000.00, 'USD'),
    ('p0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'CRM Integration', 'crm-integration', 'Integrate existing systems with new CRM', 'draft', 8000.00, 'USD')
ON CONFLICT DO NOTHING;
*/
