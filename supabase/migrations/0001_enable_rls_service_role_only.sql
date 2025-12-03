-- =============================================================================
-- Enable RLS on all tables with service-role-only access
-- 
-- This ensures all database changes go through the server-side application
-- using the service_role key, not through client-side access.
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "proposals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "file_uploads" ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Service Role Policies
-- The service_role bypasses RLS by default, so we don't need explicit policies
-- for it. However, we create restrictive policies that block all other access.
-- =============================================================================

-- PROFILES: No client access (service role only)
CREATE POLICY "Service role only" ON "profiles" FOR ALL USING (false) WITH CHECK (false);

-- ORGANIZATIONS: No client access (service role only)
CREATE POLICY "Service role only" ON "organizations" FOR ALL USING (false) WITH CHECK (false);

-- ORGANIZATION_MEMBERS: No client access (service role only)
CREATE POLICY "Service role only" ON "organization_members" FOR ALL USING (false) WITH CHECK (false);

-- PROJECTS: No client access (service role only)
CREATE POLICY "Service role only" ON "projects" FOR ALL USING (false) WITH CHECK (false);

-- PROPOSALS: No client access (service role only)
CREATE POLICY "Service role only" ON "proposals" FOR ALL USING (false) WITH CHECK (false);

-- INVOICES: No client access (service role only)
CREATE POLICY "Service role only" ON "invoices" FOR ALL USING (false) WITH CHECK (false);

-- PAYMENTS: No client access (service role only)
CREATE POLICY "Service role only" ON "payments" FOR ALL USING (false) WITH CHECK (false);

-- TICKETS: No client access (service role only)
CREATE POLICY "Service role only" ON "tickets" FOR ALL USING (false) WITH CHECK (false);

-- TICKET_COMMENTS: No client access (service role only)
CREATE POLICY "Service role only" ON "ticket_comments" FOR ALL USING (false) WITH CHECK (false);

-- ACTIVITY_LOG: No client access (service role only)
CREATE POLICY "Service role only" ON "activity_log" FOR ALL USING (false) WITH CHECK (false);

-- FILE_UPLOADS: No client access (service role only)
CREATE POLICY "Service role only" ON "file_uploads" FOR ALL USING (false) WITH CHECK (false);
