-- Seed legal pages with actual content
-- Run this after the database is set up

-- Get the first admin user ID (adjust if needed)
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get first user with admin or super_admin role
    SELECT id INTO admin_user_id 
    FROM profiles 
    WHERE role IN ('admin', 'super_admin') 
    LIMIT 1;

    -- If no admin found, use first user
    IF admin_user_id IS NULL THEN
        SELECT id INTO admin_user_id FROM profiles LIMIT 1;
    END IF;

    -- Insert Privacy Policy
    INSERT INTO legal_pages (
        slug,
        title,
        content,
        summary,
        version,
        effective_date,
        last_reviewed_at,
        is_published,
        sort_order,
        last_edited_by_id
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
        slug,
        title,
        content,
        summary,
        version,
        effective_date,
        last_reviewed_at,
        is_published,
        sort_order,
        last_edited_by_id
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
        slug,
        title,
        content,
        summary,
        version,
        effective_date,
        last_reviewed_at,
        is_published,
        sort_order,
        last_edited_by_id
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
