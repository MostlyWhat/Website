# CRM System Documentation

A WordPress-inspired CRM system built with SvelteKit, Supabase, and Drizzle ORM for managing project proposals, billing, tickets, and overall project management.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Features](#features)
8. [API Endpoints](#api-endpoints)
9. [Development](#development)
10. [Deployment](#deployment)

---

## Overview

This CRM system provides a complete solution for managing client relationships, projects, and support. It includes:

- **User Management**: Multi-role system with super admins, admins, staff, and customers
- **Organization Management**: Group customers into organizations with multiple members
- **Project Management**: Track projects from proposal to completion
- **Proposal System**: Create, send, and track project proposals
- **Invoicing & Billing**: Generate invoices, track payments
- **Support Tickets**: Full ticketing system with priorities and categories
- **Activity Logging**: Comprehensive audit trail of all actions

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SvelteKit Frontend                      │
├─────────────────────────────────────────────────────────────┤
│  Routes                                                      │
│  ├── (admin)/admin/*    → Admin dashboard & management      │
│  ├── (app)/app/*        → Customer portal                   │
│  └── (auth)/auth/*      → Authentication flows              │
├─────────────────────────────────────────────────────────────┤
│                    Server-Side Logic                         │
│  ├── hooks.server.ts    → Auth middleware                   │
│  ├── +page.server.ts    → Form actions & data loading       │
│  └── lib/server/*       → Database & business logic         │
├─────────────────────────────────────────────────────────────┤
│  Supabase (Auth)        │  Drizzle ORM (Database)           │
│  ├── Email/Password     │  ├── PostgreSQL                   │
│  ├── OAuth (Google)     │  ├── Type-safe queries            │
│  └── Magic Links        │  └── Migrations                   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | SvelteKit 2, Svelte 5 (runes) |
| Styling | Tailwind CSS, shadcn-svelte |
| Authentication | Supabase Auth |
| Database | PostgreSQL (via Supabase) |
| ORM | Drizzle ORM |
| Deployment | Cloudflare Pages |
| i18n | Paraglide (en/th) |

## Setup & Installation

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase CLI
- Docker (for local Supabase)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd website
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Database Connection (for Drizzle)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

### 3. Start Supabase Locally

```bash
# Start Supabase containers
supabase start

# This will output your local credentials
# Copy the anon key and service_role key to your .env file
```

### 4. Run Database Migrations

```bash
# Apply migrations
supabase db push

# Or manually run the migration file
supabase db reset
```

### 5. Seed Sample Data (Optional)

```bash
# Load sample data for testing
supabase db seed
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────────┐       ┌─────────────┐
│  profiles   │───────│ organization_members│───────│organizations│
└─────────────┘       └─────────────────────┘       └─────────────┘
      │                                                    │
      │                                                    │
      ▼                                                    ▼
┌─────────────┐                                     ┌─────────────┐
│   tickets   │◄────────────────────────────────────│   projects  │
└─────────────┘                                     └─────────────┘
      │                                                    │
      ▼                                                    │
┌─────────────────┐                                        │
│ ticket_comments │                                        ▼
└─────────────────┘                              ┌─────────────────┐
                                                 │    proposals    │
                                                 └─────────────────┘
                                                         │
                                                         ▼
                                                 ┌─────────────────┐
                                                 │    invoices     │
                                                 └─────────────────┘
                                                         │
                                                         ▼
                                                 ┌─────────────────┐
                                                 │    payments     │
                                                 └─────────────────┘
```

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles extending Supabase auth.users |
| `organizations` | Customer organizations/companies |
| `organization_members` | Many-to-many: users ↔ organizations |
| `projects` | Customer projects with status, budget, timeline |
| `proposals` | Project proposals with scope and pricing |
| `invoices` | Billing invoices with line items |
| `payments` | Payment records for invoices |
| `tickets` | Support tickets with priority and category |
| `ticket_comments` | Conversation threads on tickets |
| `activity_log` | Audit log for all system actions |
| `file_uploads` | File attachments for various entities |

### Enums

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'staff', 'customer');

-- Project status
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');

-- Proposal status
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');

-- Invoice status
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Ticket status
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');

-- Ticket priority
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Organization member role
CREATE TYPE org_member_role AS ENUM ('owner', 'admin', 'member', 'billing');
```

## Authentication

### Supported Methods

1. **Email/Password**: Traditional signup and login
2. **Magic Links**: Passwordless email authentication
3. **OAuth**: Google and GitHub social login

### Auth Flow

```
1. User visits /auth/login or /auth/signup
2. Supabase Auth handles authentication
3. On success, user profile is created/updated in profiles table
4. Session cookie is set via @supabase/ssr
5. hooks.server.ts validates session on each request
6. Protected routes redirect to login if no valid session
```

### Onboarding Flow

New users go through an onboarding process:

1. **Account Setup**: Basic profile information
2. **Organization**: Create or join an organization
3. **Preferences**: Set notification and display preferences

## User Roles & Permissions

### Role Hierarchy

| Role | Level | Access |
|------|-------|--------|
| `super_admin` | 100 | Full system access, can manage all admins |
| `admin` | 80 | Manage staff, customers, all projects/tickets |
| `staff` | 50 | Handle assigned tickets, view assigned projects |
| `customer` | 10 | View own projects, create tickets, pay invoices |

### Making a User Admin

To promote a user to admin or super_admin role, you need to update their role in the `profiles` table. This can be done via:

#### Option 1: SQL Query (Supabase Dashboard or CLI)

```sql
-- Promote user to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Promote user to super_admin
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'user@example.com';

-- Or using user ID
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```

#### Option 2: Drizzle Studio

```bash
# Open Drizzle Studio
pnpm db:studio
```

1. Navigate to the `profiles` table
2. Find the user by email or ID
3. Change the `role` column to `admin` or `super_admin`
4. Save changes

#### Option 3: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find the user row by email
4. Edit the `role` column value
5. Save the changes

#### Option 4: Using the Admin Panel (Super Admin Only)

If you already have a super_admin user:
1. Log in as super_admin
2. Go to `/admin/users`
3. Find the user you want to promote
4. Click Edit and change their role
5. Save changes

> **Note**: The first admin must be created manually using Option 1, 2, or 3. Once you have a super_admin, you can use the admin panel to manage other users.

### Route Protection

| Route Pattern | Required Role |
|---------------|---------------|
| `/admin/*` | admin, super_admin |
| `/app/*` | customer, staff, admin, super_admin |
| `/auth/*` | Public (redirects if authenticated) |

### Row Level Security (RLS)

All database tables have RLS policies that ensure:

- Customers can only see their own organization's data
- Staff can see assigned items
- Admins can see all data
- Super admins have unrestricted access

## Features

### Admin Dashboard (`/admin`)

- **Overview**: Key metrics, recent activity, alerts
- **Users**: Manage all users, change roles, deactivate accounts
- **Organizations**: View/edit customer organizations
- **Projects**: Full project management with timeline
- **Proposals**: Create, send, track proposals
- **Invoices**: Generate invoices, track payments
- **Tickets**: Support queue with assignment and priorities

### Customer Portal (`/app`)

- **Dashboard**: Overview of projects, invoices, tickets
- **Projects**: View project progress, milestones, team
- **Proposals**: Review and accept/decline proposals
- **Invoices**: View invoices, make payments
- **Tickets**: Submit support tickets, track conversations

### Key Functionality

#### Proposals
```
Draft → Sent → Accepted/Rejected
                    ↓
              Create Project (if accepted)
```

#### Invoicing
```
Draft → Sent → Paid/Overdue
         ↓
   Payment Recorded → Update Status
```

#### Tickets
```
Open → In Progress → Waiting → Resolved → Closed
  ↓         ↓           ↓          ↓
Comments added at any stage until closed
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Email/password login |
| POST | `/auth/signup` | New user registration |
| POST | `/auth/magic-link` | Send magic link email |
| GET | `/auth/callback` | OAuth callback handler |
| POST | `/auth/logout` | Sign out user |

### Protected Endpoints

All `/api/*` endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search` | Global search across entities |
| POST | `/api/contact` | Contact form submission |

### Form Actions

Server actions are used for mutations via SvelteKit form actions:

```svelte
<form method="POST" action="?/createTicket">
  <!-- form fields -->
</form>
```

## Development

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI primitives (shadcn)
│   ├── server/
│   │   ├── db/
│   │   │   ├── index.ts    # Drizzle client
│   │   │   └── schema.ts   # Database schema
│   │   └── supabase.ts     # Supabase client
│   └── utils/              # Utility functions
├── routes/
│   ├── (admin)/           # Admin routes
│   ├── (app)/             # Customer portal routes
│   └── (auth)/            # Auth routes
└── hooks.server.ts        # Server hooks (auth middleware)
```

### Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio

# Linting & Formatting
pnpm lint             # Run ESLint
pnpm format           # Run Prettier

# Supabase
supabase start        # Start local Supabase
supabase stop         # Stop local Supabase
supabase db reset     # Reset database with migrations & seed
supabase db push      # Push migrations to database
```

### Adding New Features

1. **Database Changes**:
   - Update `src/lib/server/db/schema.ts`
   - Generate migration: `pnpm db:generate`
   - Apply migration: `pnpm db:push`

2. **New Routes**:
   - Create `+page.svelte` and `+page.server.ts`
   - Add to appropriate route group `(admin)`, `(app)`, etc.
   - Follow design system guidelines

3. **Design System**:
   - Refer to `DESIGN_SYSTEM.md` for styling guidelines
   - Use 12-column grid layout
   - Follow font and icon specifications

## Deployment

### Cloudflare Pages

The project is configured for Cloudflare Pages deployment:

1. **Build Settings**:
   - Build command: `pnpm build`
   - Output directory: `.svelte-kit/cloudflare`

2. **Environment Variables**:
   Set in Cloudflare dashboard:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

3. **Wrangler Configuration**:
   See `wrangler.jsonc` for worker configuration.

### Production Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run migrations against production database
3. Configure OAuth providers in Supabase dashboard
4. Set up email templates for auth emails
5. Configure RLS policies (already defined in migrations)

### Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] OAuth providers configured
- [ ] Email templates customized
- [ ] RLS policies verified
- [ ] Initial admin user created
- [ ] Monitoring/logging set up

---

## Support

For issues or questions:
- Create a GitHub issue
- Contact: support@mostlywhat.com

## License

Proprietary - MostlyWhat Systems
