-- ============================================================================
-- Account Deletion Function
-- ============================================================================
-- This function handles complete account deletion, removing all user data
-- while maintaining referential integrity.

-- Function to delete all user data and their auth account
CREATE OR REPLACE FUNCTION delete_user_account(user_id_to_delete UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Check if the user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id_to_delete) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Delete ticket comments made by this user
    DELETE FROM ticket_comments WHERE author_id = user_id_to_delete;

    -- Delete file uploads by this user
    DELETE FROM file_uploads WHERE uploaded_by = user_id_to_delete;

    -- Delete activity logs for this user
    DELETE FROM activity_log WHERE user_id = user_id_to_delete;

    -- Update tickets to remove assignee reference (set to null instead of deleting)
    UPDATE tickets SET assigned_to = NULL WHERE assigned_to = user_id_to_delete;

    -- Delete tickets created by user (if they are the only member of their org)
    -- Or reassign to another org member if available
    
    -- Get organizations where user is the ONLY member
    FOR org_id IN
        SELECT om.organization_id 
        FROM organization_members om
        WHERE om.user_id = user_id_to_delete
        AND NOT EXISTS (
            SELECT 1 FROM organization_members om2 
            WHERE om2.organization_id = om.organization_id 
            AND om2.user_id != user_id_to_delete
        )
    LOOP
        -- Delete all data associated with this organization since user is the only member
        
        -- Delete payments for invoices in this org's projects
        DELETE FROM payments WHERE invoice_id IN (
            SELECT i.id FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE p.organization_id = org_id
        );
        
        -- Delete invoices for this org's projects
        DELETE FROM invoices WHERE project_id IN (
            SELECT id FROM projects WHERE organization_id = org_id
        );
        
        -- Delete proposals for this org's projects
        DELETE FROM proposals WHERE project_id IN (
            SELECT id FROM projects WHERE organization_id = org_id
        );
        
        -- Delete ticket comments for tickets in this org
        DELETE FROM ticket_comments WHERE ticket_id IN (
            SELECT id FROM tickets WHERE organization_id = org_id
        );
        
        -- Delete tickets for this org
        DELETE FROM tickets WHERE organization_id = org_id;
        
        -- Delete file uploads for this org's projects
        DELETE FROM file_uploads WHERE project_id IN (
            SELECT id FROM projects WHERE organization_id = org_id
        );
        
        -- Delete projects for this org
        DELETE FROM projects WHERE organization_id = org_id;
        
        -- Delete organization members (just this user)
        DELETE FROM organization_members WHERE organization_id = org_id;
        
        -- Delete the organization itself
        DELETE FROM organizations WHERE id = org_id;
    END LOOP;

    -- Remove user from organizations where they are NOT the only member
    DELETE FROM organization_members WHERE user_id = user_id_to_delete;

    -- Delete the user's profile
    DELETE FROM profiles WHERE id = user_id_to_delete;

    -- Finally, delete the auth user (this must be done by service role)
    -- Note: This will cascade and clean up auth-related data
    DELETE FROM auth.users WHERE id = user_id_to_delete;
    
END;
$$;

-- Grant execute permission to service role only
REVOKE ALL ON FUNCTION delete_user_account(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO service_role;

-- Also create an RPC function that users can call to delete their own account
CREATE OR REPLACE FUNCTION request_account_deletion()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Users can only delete their own account
    PERFORM delete_user_account(auth.uid());
END;
$$;

-- Grant execute to authenticated users (they can only delete their own account)
GRANT EXECUTE ON FUNCTION request_account_deletion() TO authenticated;
