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

-- =============================================================================
-- Sample Blog Post
-- =============================================================================
-- Example blog post for demonstration

DO $$
DECLARE
    system_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
    INSERT INTO blog_posts (
        id, slug, title, excerpt, content, category, tags, status,
        is_featured, published_at, meta_title, meta_description,
        read_time, author_id, created_at
    ) VALUES (
        'b0000000-0000-0000-0000-000000000001',
        'welcome-to-mostlywhat-systems',
        'Welcome to MostlyWhat Systems',
        'Discover how we build modern web applications with cutting-edge technology and design.',
        '# Welcome to MostlyWhat Systems

We are excited to launch our new platform! MostlyWhat Systems specializes in creating exceptional digital experiences through modern web development, thoughtful design, and robust engineering practices.

## What We Do

Our team focuses on:

- **Web Development**: Building scalable, performant web applications using the latest frameworks and technologies
- **UI/UX Design**: Creating intuitive interfaces that users love
- **Design Systems**: Developing comprehensive component libraries for consistency
- **Technical Consulting**: Helping teams make informed technology decisions

## Our Approach

We believe in:

1. **Quality First**: Every line of code is crafted with care
2. **User-Centered Design**: Your users are at the heart of what we build
3. **Modern Technology**: We use the best tools for the job
4. **Clear Communication**: You are always in the loop

## Get Started

Ready to bring your project to life? [Contact us](/contact) today to discuss your needs.

We look forward to working with you!',
        'announcement',
        '["launch", "company", "web-development"]'::jsonb,
        'published',
        true,
        NOW(),
        'Welcome to MostlyWhat Systems - Modern Web Development',
        'Discover how MostlyWhat Systems builds modern web applications with cutting-edge technology and thoughtful design.',
        '3 min read',
        system_id,
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        updated_at = NOW();
END $$;

-- =============================================================================
-- Sample Portfolio Project
-- =============================================================================
-- Example portfolio project for demonstration

DO $$
DECLARE
    system_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
    INSERT INTO portfolio_projects (
        slug, title, description, content, client, live_url,
        featured_image, gallery, category, tags,
        status, is_featured, published_at,
        created_by_id, created_at
    ) VALUES (
        'crm-platform',
        'Enterprise CRM Platform',
        'A comprehensive customer relationship management system built for modern businesses.',
        '# Enterprise CRM Platform

We designed and developed a full-featured CRM platform that helps businesses manage their customer relationships, track sales pipelines, and automate workflows.

## Challenge

Our client needed a scalable solution to replace their aging CRM system. The new platform had to integrate with existing tools while providing a modern, intuitive interface.

## Solution

We built a cloud-native application using:

- **SvelteKit** for the frontend
- **PostgreSQL** with Drizzle ORM for data management
- **Cloudflare Workers** for edge computing
- **Tailwind CSS** for consistent styling

## Features

- Real-time collaboration
- Advanced reporting and analytics
- Custom workflow automation
- Multi-tenant architecture
- Role-based access control
- Email and calendar integration

## Results

- 50% improvement in team productivity
- 99.9% uptime since launch
- Reduced operational costs by 40%
- Positive user feedback across all departments

## Technologies Used

SvelteKit, TypeScript, PostgreSQL, Drizzle ORM, Tailwind CSS, Cloudflare Workers',
        'Enterprise Tech Solutions',
        'https://example.com',
        '/images/portfolio/crm-platform.jpg',
        '[]'::jsonb,
        'web-development',
        '["crm", "enterprise", "saas"]'::jsonb,
        'published',
        true,
        NOW() - INTERVAL '30 days',
        system_id,
        NOW() - INTERVAL '60 days'
    )
    ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        updated_at = NOW();
END $$;

-- =============================================================================
-- Legal Pages
-- =============================================================================
-- Default legal documents (Privacy Policy, Terms of Service, Cookie Policy)

DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get first user with admin or super_admin role
    SELECT id INTO admin_user_id 
    FROM profiles 
    WHERE role IN ('admin', 'super_admin') 
    LIMIT 1;

    -- If no admin found, use system ID
    IF admin_user_id IS NULL THEN
        admin_user_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- Insert Privacy Policy
    INSERT INTO legal_pages (
        slug, title, content, summary, version,
        effective_date, last_reviewed_at, is_published, sort_order, last_edited_by_id
    ) VALUES (
        'privacy',
        'Privacy Policy',
        '# Privacy Policy

**Last Updated: January 2024**

## Information We Collect

We collect information you provide directly to us, such as when you fill out a contact form, request a consultation, or communicate with us via email.

This information may include:
- Name and contact information
- Company name and role
- Project details and requirements
- Communication history

We also automatically collect certain technical information when you visit our website:
- Device type and browser information
- IP address and approximate location
- Pages visited and time spent on site
- Referral sources

## How We Use Your Information

We use the information we collect to:
- Respond to your inquiries and provide requested services
- Send you updates about projects and services
- Improve our website and services
- Comply with legal obligations
- Analyze website traffic and usage patterns
- Protect against fraudulent or unauthorized activity

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, so long as they agree to keep this information confidential.

We may disclose your information when:
- Required by law or legal process
- Necessary to protect our rights or safety
- You have given us consent to share

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

Security measures include:
- SSL/TLS encryption for data in transit
- Secure data storage with access controls
- Regular security assessments
- Employee training on data protection

## Cookies and Tracking

We use cookies and similar technologies to enhance your browsing experience. These include:

**Essential Cookies:** Required for basic site functionality
**Analytics Cookies:** Help us understand how visitors use our site
**Preference Cookies:** Remember your settings and preferences

You can control cookies through your browser settings. Disabling certain cookies may limit site functionality.

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate data
- Request deletion of your data
- Object to processing of your data
- Withdraw consent at any time
- Data portability

To exercise these rights, contact us using the information below.

## Data Retention

We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.

## International Transfers

Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.

## Children''s Privacy

Our services are not directed to individuals under 16. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.

## Contact Us

If you have questions about this Privacy Policy, please contact us at:

**Email:** privacy@mostlywhat.systems  
**Address:** Remote • Global

---

*This policy is effective as of January 2024.*',
        'How we collect, use, and protect your personal information when you use our services.',
        '1.0',
        '2024-01-01',
        NOW(),
        true,
        1,
        admin_user_id
    )
    ON CONFLICT (slug) DO NOTHING;

    -- Insert Terms of Service
    INSERT INTO legal_pages (
        slug, title, content, summary, version,
        effective_date, last_reviewed_at, is_published, sort_order, last_edited_by_id
    ) VALUES (
        'terms',
        'Terms of Service',
        '# Terms of Service

**Last Updated: January 2024**

## Acceptance of Terms

By accessing or using MostlyWhat Systems'' services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and others who access our website or engage our services.

## Description of Services

MostlyWhat Systems provides web development, design, and consulting services, including but not limited to:
- Website design and development
- Web application development
- UI/UX design services
- Technical consulting
- Design systems and component libraries
- Maintenance and support services

## Client Obligations

As a client, you agree to:
- Provide accurate and complete information
- Respond to requests for information in a timely manner
- Pay fees according to agreed terms
- Provide necessary access to systems and resources
- Review and approve deliverables within agreed timeframes
- Maintain confidentiality of project information

## Project Scope and Changes

### Scope Definition
Project scope will be defined in a separate Statement of Work (SOW) or project agreement. Any work outside the defined scope may require additional fees and timeline adjustments.

### Change Requests
Changes to project scope must be submitted in writing. We will provide estimates for additional work required. Changes will be implemented upon written approval and may affect project timelines.

## Intellectual Property

### Work Product
Upon full payment, clients receive ownership of the final deliverables as specified in the project agreement. We retain the right to:
- Display work in our portfolio
- Reference the project in marketing materials
- Retain any pre-existing intellectual property

### Third-Party Components
Some projects may include third-party libraries, fonts, or assets. Usage rights for these components are governed by their respective licenses.

## Payment Terms

### Invoicing
We typically require:
- 50% deposit before project commencement
- Remaining balance upon project completion
- Monthly invoicing for ongoing retainers

### Late Payments
Invoices are due within 14 days unless otherwise agreed. Late payments may incur:
- Interest charges of 1.5% per month
- Suspension of services
- Collection actions for severely delinquent accounts

## Warranties and Disclaimers

### Our Warranty
We warrant that our services will be performed in a professional manner consistent with industry standards.

### Disclaimer
EXCEPT AS EXPRESSLY PROVIDED, OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

## Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOSTLYWHAT SYSTEMS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES.

Our total liability shall not exceed the fees paid for the specific services giving rise to the claim.

## Confidentiality

Both parties agree to maintain the confidentiality of proprietary information shared during the project. This includes:
- Business strategies and plans
- Technical specifications
- Client data and user information
- Pricing and financial information

Confidentiality obligations survive termination of our relationship.

## Termination

### By Client
You may terminate services with 30 days written notice. You remain responsible for fees incurred up to the termination date.

### By Us
We may terminate or suspend services if:
- Payment is not received when due
- You breach these terms
- Continued service would be unlawful

### Effect of Termination
Upon termination, we will deliver all completed work and you will pay all outstanding fees.

## Dispute Resolution

Any disputes arising from these terms shall be resolved through:
1. Good faith negotiation
2. Mediation if negotiation fails
3. Binding arbitration as a last resort

This agreement shall be governed by the laws of Thailand.

## General Provisions

### Entire Agreement
These terms, together with any project agreements, constitute the entire agreement between parties.

### Severability
If any provision is found unenforceable, the remaining provisions remain in effect.

### Waiver
Failure to enforce any right does not constitute a waiver of that right.

### Assignment
You may not assign your rights under these terms without our written consent.

## Contact Information

For questions about these Terms of Service, contact us at:

**Email:** legal@mostlywhat.systems  
**Website:** mostlywhat.systems

---

*These terms are effective as of January 2024.*',
        'The terms and conditions governing the use of our services and website.',
        '1.0',
        '2024-01-01',
        NOW(),
        true,
        2,
        admin_user_id
    )
    ON CONFLICT (slug) DO NOTHING;

    -- Insert Cookie Policy
    INSERT INTO legal_pages (
        slug, title, content, summary, version,
        effective_date, last_reviewed_at, is_published, sort_order, last_edited_by_id
    ) VALUES (
        'cookies',
        'Cookie Policy',
        '# Cookie Policy

**Last Updated: January 2024**

## What Are Cookies

Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.

## Types of Cookies We Use

### Essential Cookies
These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.

### Analytics Cookies
We use analytics cookies to understand how visitors interact with our website. This information helps us improve our site and services.

### Preference Cookies
These cookies allow our website to remember your choices (such as language or region) and provide enhanced features.

## How We Use Cookies

We use cookies to:
- Keep you signed in to your account
- Remember your preferences and settings
- Analyze site traffic and usage patterns
- Improve website performance and user experience
- Provide personalized content

## Third-Party Cookies

Some cookies may be set by third-party services that appear on our pages:
- Analytics providers (e.g., Google Analytics)
- Content delivery networks
- Social media platforms

## Managing Cookies

You can control and manage cookies in various ways:

### Browser Settings
Most browsers allow you to:
- View and delete cookies
- Block cookies from specific sites
- Block all third-party cookies
- Clear all cookies when closing the browser

### Opt-Out Tools
You can opt out of certain third-party cookies using industry opt-out tools.

Note that disabling cookies may affect the functionality of our website.

## Changes to This Policy

We may update this Cookie Policy to reflect changes in our practices or for legal reasons. We will notify you of significant changes by posting the new policy on this page.

## Contact Us

If you have questions about our use of cookies, please contact us at:

**Email:** privacy@mostlywhat.systems

---

*This policy is effective as of January 2024.*',
        'Information about how we use cookies and similar technologies on our website.',
        '1.0',
        '2024-01-01',
        NOW(),
        true,
        3,
        admin_user_id
    )
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- =============================================================================
-- Note: User-specific content like tickets and organizations are created
-- through the application UI by authenticated users.
-- =============================================================================
