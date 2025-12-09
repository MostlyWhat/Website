/**
 * Migration: Add Ticket Merging & Parent/Child Relationships
 * 
 * Adds support for:
 * - Merging duplicate tickets
 * - Parent/child ticket relationships
 * - Satisfaction surveys after resolution
 */

-- Add merged_into_id column to tickets table for tracking merged tickets
ALTER TABLE tickets
ADD COLUMN merged_into_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
ADD COLUMN merged_at TIMESTAMPTZ,
ADD COLUMN merged_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add parent_ticket_id for parent/child relationships
ALTER TABLE tickets
ADD COLUMN parent_ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL;

-- Create ticket_satisfaction_surveys table
CREATE TABLE IF NOT EXISTS ticket_satisfaction_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    response_time_rating INTEGER CHECK (response_time_rating >= 1 AND response_time_rating <= 5),
    resolution_quality_rating INTEGER CHECK (resolution_quality_rating >= 1 AND resolution_quality_rating <= 5),
    staff_professionalism_rating INTEGER CHECK (staff_professionalism_rating >= 1 AND staff_professionalism_rating <= 5),
    would_recommend BOOLEAN,
    survey_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    survey_token VARCHAR(64) UNIQUE NOT NULL,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(ticket_id) -- One survey per ticket
);

-- Create indexes for merged tickets queries
CREATE INDEX idx_tickets_merged_into ON tickets(merged_into_id) WHERE merged_into_id IS NOT NULL;
CREATE INDEX idx_tickets_parent_ticket ON tickets(parent_ticket_id) WHERE parent_ticket_id IS NOT NULL;
CREATE INDEX idx_satisfaction_surveys_ticket ON ticket_satisfaction_surveys(ticket_id);
CREATE INDEX idx_satisfaction_surveys_customer ON ticket_satisfaction_surveys(customer_id);
CREATE INDEX idx_satisfaction_surveys_rating ON ticket_satisfaction_surveys(rating);
CREATE INDEX idx_satisfaction_surveys_responded ON ticket_satisfaction_surveys(responded_at) WHERE responded_at IS NOT NULL;
CREATE INDEX idx_satisfaction_surveys_token ON ticket_satisfaction_surveys(survey_token);

-- Add comments
COMMENT ON COLUMN tickets.merged_into_id IS 'If this ticket was merged into another ticket, references the target ticket';
COMMENT ON COLUMN tickets.merged_at IS 'Timestamp when ticket was merged';
COMMENT ON COLUMN tickets.merged_by_id IS 'Staff member who performed the merge';
COMMENT ON COLUMN tickets.parent_ticket_id IS 'For child tickets, references the parent ticket';
COMMENT ON TABLE ticket_satisfaction_surveys IS 'Customer satisfaction surveys sent after ticket resolution';
COMMENT ON COLUMN ticket_satisfaction_surveys.survey_token IS 'Unique token for anonymous survey access';

-- RLS Policies for ticket_satisfaction_surveys
ALTER TABLE ticket_satisfaction_surveys ENABLE ROW LEVEL SECURITY;

-- Customers can view and respond to their own surveys
CREATE POLICY "Customers can view their own surveys"
    ON ticket_satisfaction_surveys
    FOR SELECT
    USING (
        auth.uid() = customer_id
        OR survey_token = current_setting('app.survey_token', TRUE)
    );

CREATE POLICY "Customers can respond to their own surveys"
    ON ticket_satisfaction_surveys
    FOR UPDATE
    USING (
        auth.uid() = customer_id
        OR survey_token = current_setting('app.survey_token', TRUE)
    )
    WITH CHECK (
        auth.uid() = customer_id
        OR survey_token = current_setting('app.survey_token', TRUE)
    );

-- Staff can view all surveys
CREATE POLICY "Staff can view all surveys"
    ON ticket_satisfaction_surveys
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_staff = TRUE)
        )
    );

-- System can insert surveys (for automated survey creation)
CREATE POLICY "System can create surveys"
    ON ticket_satisfaction_surveys
    FOR INSERT
    WITH CHECK (TRUE);

-- Add function to prevent circular parent/child relationships
CREATE OR REPLACE FUNCTION check_circular_ticket_relationship()
RETURNS TRIGGER AS $$
DECLARE
    current_parent_id UUID;
    max_depth INTEGER := 10;
    depth INTEGER := 0;
BEGIN
    -- If parent_ticket_id is NULL, no check needed
    IF NEW.parent_ticket_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Can't be parent of itself
    IF NEW.parent_ticket_id = NEW.id THEN
        RAISE EXCEPTION 'A ticket cannot be its own parent';
    END IF;

    -- Check for circular reference by traversing up the parent chain
    current_parent_id := NEW.parent_ticket_id;
    
    WHILE current_parent_id IS NOT NULL AND depth < max_depth LOOP
        -- If we find our ticket ID in the parent chain, it's circular
        IF current_parent_id = NEW.id THEN
            RAISE EXCEPTION 'Circular parent/child relationship detected';
        END IF;

        -- Get the parent of the current parent
        SELECT parent_ticket_id INTO current_parent_id
        FROM tickets
        WHERE id = current_parent_id;

        depth := depth + 1;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check for circular relationships
CREATE TRIGGER check_circular_ticket_relationship_trigger
    BEFORE INSERT OR UPDATE OF parent_ticket_id ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION check_circular_ticket_relationship();

-- Add function to prevent merging into merged tickets
CREATE OR REPLACE FUNCTION check_merge_target()
RETURNS TRIGGER AS $$
DECLARE
    target_is_merged BOOLEAN;
BEGIN
    -- If merged_into_id is NULL, no check needed
    IF NEW.merged_into_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Can't merge into itself
    IF NEW.merged_into_id = NEW.id THEN
        RAISE EXCEPTION 'A ticket cannot be merged into itself';
    END IF;

    -- Check if target ticket is already merged
    SELECT (merged_into_id IS NOT NULL) INTO target_is_merged
    FROM tickets
    WHERE id = NEW.merged_into_id;

    IF target_is_merged THEN
        RAISE EXCEPTION 'Cannot merge into a ticket that is already merged';
    END IF;

    -- Auto-set merged_at if not already set
    IF NEW.merged_at IS NULL THEN
        NEW.merged_at := NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate merge target
CREATE TRIGGER check_merge_target_trigger
    BEFORE INSERT OR UPDATE OF merged_into_id ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION check_merge_target();
