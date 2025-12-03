-- =============================================================================
-- Seed Data for MostlyWhat Systems CRM
-- =============================================================================

-- Note: User profiles are created automatically via the trigger when users sign up.
-- This seed file creates sample organizations, projects, and other test data.

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
