-- Migration: Add blog_posts and portfolio_projects tables
-- This creates the content management tables for blog posts and portfolio projects

-- Blog Post Status Enum
DO $$ BEGIN
    CREATE TYPE "public"."blog_post_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Portfolio Project Status Enum
DO $$ BEGIN
    CREATE TYPE "public"."portfolio_project_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS "blog_posts" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "excerpt" text,
    "category" text NOT NULL,
    "tags" jsonb DEFAULT '[]'::jsonb,
    "featured_image" text,
    "meta_title" text,
    "meta_description" text,
    "read_time" text,
    "status" "blog_post_status" DEFAULT 'draft' NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "view_count" integer DEFAULT 0 NOT NULL,
    "author_id" uuid REFERENCES "profiles"("id") ON DELETE SET NULL,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Portfolio Projects Table
CREATE TABLE IF NOT EXISTS "portfolio_projects" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "title" text NOT NULL,
    "client" text,
    "category" text NOT NULL,
    "year" text,
    "description" text,
    "tags" jsonb DEFAULT '[]'::jsonb,
    "content" text NOT NULL,
    "featured_image" text,
    "gallery_images" jsonb DEFAULT '[]'::jsonb,
    "testimonial" jsonb,
    "meta_title" text,
    "meta_description" text,
    "status" "portfolio_project_status" DEFAULT 'draft' NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_by_id" uuid REFERENCES "profiles"("id") ON DELETE SET NULL,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Login Logs Table (for security auditing)
CREATE TABLE IF NOT EXISTS "login_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "profile_id" uuid NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
    "event_type" text NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "country" text,
    "region" text,
    "city" text,
    "geolocation" text,
    "login_method" text,
    "device_info" jsonb,
    "success" boolean DEFAULT true NOT NULL,
    "failure_reason" text,
    "session_id" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolio_projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "login_logs" ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_blog_posts_slug" ON "blog_posts" ("slug");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_status" ON "blog_posts" ("status");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_category" ON "blog_posts" ("category");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_published_at" ON "blog_posts" ("published_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_portfolio_projects_slug" ON "portfolio_projects" ("slug");
CREATE INDEX IF NOT EXISTS "idx_portfolio_projects_status" ON "portfolio_projects" ("status");
CREATE INDEX IF NOT EXISTS "idx_portfolio_projects_category" ON "portfolio_projects" ("category");

CREATE INDEX IF NOT EXISTS "idx_login_logs_profile_id" ON "login_logs" ("profile_id");
CREATE INDEX IF NOT EXISTS "idx_login_logs_created_at" ON "login_logs" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_login_logs_event_type" ON "login_logs" ("event_type");

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
    BEFORE UPDATE ON portfolio_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
