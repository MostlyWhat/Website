-- =============================================================================
-- MostlyWhat Systems CRM Schema Migration
-- Created: 2024-12-02
-- 
-- This migration creates all tables for the project management, billing, 
-- and ticketing system.
-- =============================================================================

-- =============================================================================
-- ENUMS
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'staff', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM (
        'draft',
        'proposal_sent',
        'proposal_accepted',
        'proposal_rejected',
        'in_progress',
        'on_hold',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM (
        'draft',
        'sent',
        'viewed',
        'accepted',
        'rejected',
        'expired',
        'revised'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM (
        'draft',
        'sent',
        'viewed',
        'paid',
        'partially_paid',
        'overdue',
        'cancelled',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM (
        'open',
        'in_progress',
        'awaiting_customer',
        'awaiting_staff',
        'resolved',
        'closed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM (
        'created',
        'updated',
        'status_changed',
        'comment_added',
        'file_uploaded',
        'email_sent',
        'payment_received',
        'assigned',
        'approved',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- PROFILES TABLE
-- =============================================================================
-- Extends Supabase Auth users with additional profile information

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    
    -- Onboarding & Preferences
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    preferences JSONB DEFAULT '{
        "emailNotifications": true,
        "smsNotifications": false,
        "theme": "system",
        "language": "en",
        "timezone": "UTC",
        "magicLinkEnabled": true
    }'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- =============================================================================
-- ORGANIZATIONS TABLE
-- =============================================================================
-- Companies/clients that projects and billing are associated with

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    
    -- Contact Information
    email TEXT,
    phone TEXT,
    
    -- Billing Address
    billing_address_line1 TEXT,
    billing_address_line2 TEXT,
    billing_city TEXT,
    billing_state TEXT,
    billing_postal_code TEXT,
    billing_country TEXT,
    
    -- Tax Information
    tax_id TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS organizations_slug_idx ON organizations(slug);

-- =============================================================================
-- ORGANIZATION MEMBERS TABLE
-- =============================================================================
-- Links profiles to organizations with roles

CREATE TABLE IF NOT EXISTS organization_members (
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (organization_id, profile_id)
);

CREATE INDEX IF NOT EXISTS org_members_profile_idx ON organization_members(profile_id);
CREATE INDEX IF NOT EXISTS org_members_org_idx ON organization_members(organization_id);

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'draft',
    
    -- Assigned Staff
    assigned_to_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Timeline
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Budget
    estimated_budget DECIMAL(12, 2),
    actual_budget DECIMAL(12, 2),
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_org_idx ON projects(organization_id);
CREATE INDEX IF NOT EXISTS projects_assigned_idx ON projects(assigned_to_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE UNIQUE INDEX IF NOT EXISTS projects_org_slug_idx ON projects(organization_id, slug);

-- =============================================================================
-- PROPOSALS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Versioning
    version INTEGER NOT NULL DEFAULT 1,
    parent_proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    
    -- Content
    title TEXT NOT NULL,
    summary TEXT,
    content JSONB, -- sections and line items
    
    -- Pricing
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Status & Approval
    status proposal_status NOT NULL DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Approval tracking
    approved_by_id UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    
    -- PDF & Documents
    pdf_url TEXT,
    
    -- Internal
    created_by_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS proposals_project_idx ON proposals(project_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals(status);
CREATE INDEX IF NOT EXISTS proposals_created_by_idx ON proposals(created_by_id);

-- =============================================================================
-- INVOICES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Invoice Number (auto-generated or custom)
    invoice_number TEXT NOT NULL UNIQUE,
    
    -- Content
    title TEXT,
    description TEXT,
    line_items JSONB,
    
    -- Pricing
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    amount_paid DECIMAL(12, 2) NOT NULL DEFAULT 0,
    amount_due DECIMAL(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Dates
    issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    
    -- Status
    status invoice_status NOT NULL DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    
    -- Payment Information
    payment_method TEXT,
    payment_reference TEXT,
    
    -- Notes
    notes TEXT,
    internal_notes TEXT,
    
    -- PDF
    pdf_url TEXT,
    
    -- Internal
    created_by_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_org_idx ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS invoices_project_idx ON invoices(project_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices(due_date);

-- =============================================================================
-- PAYMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    transaction_id TEXT,
    
    notes TEXT,
    
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Who recorded this payment
    recorded_by_id UUID NOT NULL REFERENCES profiles(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_invoice_idx ON payments(invoice_id);

-- =============================================================================
-- TICKETS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Ticket Number (auto-generated)
    ticket_number TEXT NOT NULL UNIQUE,
    
    -- Content
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Status & Priority
    status ticket_status NOT NULL DEFAULT 'open',
    priority ticket_priority NOT NULL DEFAULT 'medium',
    
    -- Category/Type
    category TEXT,
    tags TEXT[],
    
    -- Assignment
    assigned_to_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Reporter
    created_by_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Resolution
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    resolution TEXT,
    
    -- SLA
    due_at TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tickets_org_idx ON tickets(organization_id);
CREATE INDEX IF NOT EXISTS tickets_project_idx ON tickets(project_id);
CREATE INDEX IF NOT EXISTS tickets_assigned_idx ON tickets(assigned_to_id);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON tickets(status);
CREATE INDEX IF NOT EXISTS tickets_priority_idx ON tickets(priority);
CREATE INDEX IF NOT EXISTS tickets_created_by_idx ON tickets(created_by_id);

-- =============================================================================
-- TICKET COMMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE, -- Staff-only comments
    
    author_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Attachments
    attachments JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ticket_comments_ticket_idx ON ticket_comments(ticket_id);
CREATE INDEX IF NOT EXISTS ticket_comments_author_idx ON ticket_comments(author_id);

-- =============================================================================
-- ACTIVITY LOG TABLE
-- =============================================================================
-- Audit trail for all important actions

CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What entity this activity is about
    entity_type TEXT NOT NULL, -- 'project', 'proposal', 'invoice', 'ticket', etc.
    entity_id UUID NOT NULL,
    
    -- Activity details
    activity_type activity_type NOT NULL,
    description TEXT NOT NULL,
    
    -- Changes (for updates)
    previous_values JSONB,
    new_values JSONB,
    
    -- Who performed this action
    performed_by_id UUID REFERENCES profiles(id),
    
    -- IP and user agent for audit purposes
    ip_address TEXT,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_log_entity_idx ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS activity_log_performed_by_idx ON activity_log(performed_by_id);
CREATE INDEX IF NOT EXISTS activity_log_created_at_idx ON activity_log(created_at DESC);

-- =============================================================================
-- FILE UPLOADS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What entity this file belongs to
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    
    -- File info
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    
    -- Storage info
    storage_path TEXT NOT NULL,
    
    uploaded_by_id UUID NOT NULL REFERENCES profiles(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS file_uploads_entity_idx ON file_uploads(entity_type, entity_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    seq_num INTEGER;
    new_number TEXT;
BEGIN
    year_part := to_char(NOW(), 'YYYY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5 FOR 5) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year_part || '-%';
    
    new_number := 'INV-' || year_part || '-' || LPAD(seq_num::TEXT, 5, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    seq_num INTEGER;
    new_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM tickets;
    
    new_number := 'TKT-' || LPAD(seq_num::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['profiles', 'organizations', 'projects', 'proposals', 'invoices', 'tickets', 'ticket_comments'])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
            CREATE TRIGGER update_%s_updated_at
                BEFORE UPDATE ON %s
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at();
        ', t, t, t, t);
    END LOOP;
END $$;

-- Auto-set invoice number on insert
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invoice_number_trigger ON invoices;
CREATE TRIGGER set_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();

-- Auto-set ticket number on insert
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_ticket_number_trigger ON tickets;
CREATE TRIGGER set_ticket_number_trigger
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_number();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, first_name, last_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is staff or admin
CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check organization membership
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = org_id
        AND profile_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
    ON profiles FOR SELECT
    USING (is_staff_or_admin());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
    ON profiles FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
    ));

-- ORGANIZATIONS POLICIES
CREATE POLICY "Members can view their organizations"
    ON organizations FOR SELECT
    USING (is_org_member(id) OR is_staff_or_admin());

CREATE POLICY "Staff can create organizations"
    ON organizations FOR INSERT
    WITH CHECK (is_staff_or_admin());

CREATE POLICY "Staff can update organizations"
    ON organizations FOR UPDATE
    USING (is_staff_or_admin());

-- ORGANIZATION MEMBERS POLICIES
CREATE POLICY "Members can view org members"
    ON organization_members FOR SELECT
    USING (is_org_member(organization_id) OR is_staff_or_admin());

CREATE POLICY "Staff can manage org members"
    ON organization_members FOR ALL
    USING (is_staff_or_admin());

-- PROJECTS POLICIES
CREATE POLICY "Members can view their projects"
    ON projects FOR SELECT
    USING (is_org_member(organization_id) OR is_staff_or_admin());

CREATE POLICY "Staff can manage projects"
    ON projects FOR ALL
    USING (is_staff_or_admin());

-- PROPOSALS POLICIES
CREATE POLICY "Users can view proposals for their projects"
    ON proposals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = proposals.project_id
            AND (is_org_member(p.organization_id) OR is_staff_or_admin())
        )
    );

CREATE POLICY "Staff can manage proposals"
    ON proposals FOR ALL
    USING (is_staff_or_admin());

-- INVOICES POLICIES
CREATE POLICY "Members can view their invoices"
    ON invoices FOR SELECT
    USING (is_org_member(organization_id) OR is_staff_or_admin());

CREATE POLICY "Staff can manage invoices"
    ON invoices FOR ALL
    USING (is_staff_or_admin());

-- PAYMENTS POLICIES
CREATE POLICY "Members can view payments for their invoices"
    ON payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = payments.invoice_id
            AND (is_org_member(i.organization_id) OR is_staff_or_admin())
        )
    );

CREATE POLICY "Staff can manage payments"
    ON payments FOR ALL
    USING (is_staff_or_admin());

-- TICKETS POLICIES
CREATE POLICY "Users can view their tickets"
    ON tickets FOR SELECT
    USING (
        created_by_id = auth.uid()
        OR is_org_member(organization_id)
        OR is_staff_or_admin()
    );

CREATE POLICY "Users can create tickets"
    ON tickets FOR INSERT
    WITH CHECK (
        created_by_id = auth.uid()
        AND is_org_member(organization_id)
    );

CREATE POLICY "Users can update their tickets"
    ON tickets FOR UPDATE
    USING (created_by_id = auth.uid() OR is_staff_or_admin());

CREATE POLICY "Staff can manage all tickets"
    ON tickets FOR ALL
    USING (is_staff_or_admin());

-- TICKET COMMENTS POLICIES
CREATE POLICY "Users can view non-internal comments on their tickets"
    ON ticket_comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_comments.ticket_id
            AND (
                (t.created_by_id = auth.uid() AND NOT ticket_comments.is_internal)
                OR is_org_member(t.organization_id)
                OR is_staff_or_admin()
            )
        )
    );

CREATE POLICY "Users can add comments to their tickets"
    ON ticket_comments FOR INSERT
    WITH CHECK (
        author_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_id
            AND (t.created_by_id = auth.uid() OR is_org_member(t.organization_id) OR is_staff_or_admin())
        )
        AND (NOT is_internal OR is_staff_or_admin())
    );

-- ACTIVITY LOG POLICIES
CREATE POLICY "Staff can view activity log"
    ON activity_log FOR SELECT
    USING (is_staff_or_admin());

CREATE POLICY "System can insert activity log"
    ON activity_log FOR INSERT
    WITH CHECK (true);

-- FILE UPLOADS POLICIES
CREATE POLICY "Users can view files for their entities"
    ON file_uploads FOR SELECT
    USING (uploaded_by_id = auth.uid() OR is_staff_or_admin());

CREATE POLICY "Users can upload files"
    ON file_uploads FOR INSERT
    WITH CHECK (uploaded_by_id = auth.uid());

CREATE POLICY "Staff can manage all files"
    ON file_uploads FOR ALL
    USING (is_staff_or_admin());

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
