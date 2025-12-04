# Implementation Plan

## Overview
This document tracks the implementation of features and fixes for the MostlyWhat Systems client portal.

## Tasks

### 1. UI/Layout Fixes
- [x] **Auth Pages Layout**: Site name top-left, back to site top-right on the same bar
- [x] **Auth Pages Footer**: IBM-style footer with Contact, Privacy, Terms, Accessibility links
- [x] **Sign-in/Sign-up Forms**: Keep forms centered in their area, ensure mobile responsive
- [x] **App Top Bar**: Fixed missing top bar in app/admin error pages for full screen
- [x] **Portal Announcement Bar**: Make consistent height, show announcements set by super admin
- [x] **Admin Page Padding**: Consistent `px-6 py-8 md:px-12 lg:px-16` padding across all admin pages
- [ ] **Mobile Responsiveness**: Audit all pages for mobile compatibility

### 2. Navigation & Access
- [x] **Admin Panel Access**: Add "Go to Admin Panel" link in app for admin/super users (moved above profile)
- [x] **Admin Dashboard Redirect Fix**: Fix super admin redirect issue (was redirecting to app)
- [x] **Admin Route Protection**: Ensure proper role-based access control (hooks.server.ts)
- [x] **Back to Portal Link**: Add "Back to Portal" link in admin panel for staff

### 3. Onboarding System
- [x] **Profile Onboarding**: Collect user profile info and preferences after registration
- [x] **Onboarding Form Centering**: Fixed form centering in right panel
- [x] **Tutorial Walkthrough**: Interactive tutorial overlay after onboarding
- [x] **Organization Setup Flow**: 
  - Skip option: Continue without organization, create/join later
  - Create option: Create new organization during onboarding
  - Join option: Join existing organization with invite code (requires approval)
- [x] **Invite System**: Organization invites with codes, approval workflow
- [x] **Join via Invite**: `/join/[code]` route for accepting invites

### 4. Organization Management
- [x] **Client Organization View**: User settings > Organizations section
- [x] **Client Create Organization**: `/app/settings/organizations/new` for creating organizations
- [x] **Admin Organization Management**: `/admin/organizations` full CRUD
- [x] **Member Roles**: Owner, Admin, Member permissions in schema
- [x] **Invite Codes**: Generate, share, and manage invite codes
- [x] **Pending Members**: Approval workflow for pending members
- [x] **Organization Dashboard for Owners**: Enhanced dashboard for org owners to manage team

### 5. Proposal System
- [x] **Create Proposal**: Admin can create proposals for organizations
- [x] **Proposal Workflow**: Draft → Sent → Viewed → Accepted/Rejected
- [x] **Proposal to Project**: Convert accepted proposals to projects
- [x] **Proposal Detail Grid**: Fixed box grid layout to match add proposal form
- [x] **Assignment**: Assign staff to proposals
- [x] **Edit Proposal**: Allow editing draft proposals
- [x] **Proposal PDF Generation**: Generate PDF version for download (client-side jsPDF)
- [x] **Email Notifications**: Send email when proposal is sent/accepted/rejected

### 6. Project Management
- [x] **Project Assignment**: Assign staff members to projects
- [x] **Project from Proposal**: Auto-create project from approved proposal
- [x] **Admin Projects Page**: `/admin/projects` with list and detail views
- [x] **Create New Project**: `/admin/projects/new` form
- [x] **Project Requests**: Client project request system integrated into projects page
  - [x] Client can submit project requests (`/app/projects/new`)
  - [x] Request status tracking: pending → under_review → approved/rejected → converted
  - [x] Admin can review requests at `/admin/project-requests/[id]`
  - [x] Requests tab integrated into admin projects page
- [x] **Project Stages**: Visual stage progression (request → proposal → active → completed)
  - Phase timeline component in admin & client views
  - Phase badges with icons and colors
  - Phase actions for advancing workflow
  - Back/unreview actions for moving phases backward
  - Hold/resume and cancel/reactivate actions
- [x] **Project Milestones**: Track project milestones and deliverables
  - Database schema with weight-based progress tracking
  - Admin CRUD interface for managing milestones
  - Client view to see milestone progress
  - Status: pending, in_progress, completed, on_hold, cancelled
- [ ] **Project Timeline View**: Visual timeline/Gantt view
- [ ] **Project Notes**: Internal notes for staff

### 7. Ticket System Improvements
- [x] **Ticket Assignment**: Assign staff to tickets
- [x] **Initial Issue Display**: Show original issue at top, then conversation
- [x] **Attachment System**: Fixed FileUploader type errors (File icon collision)
- [x] **Reopen Policy**: Allow reopening within 7 days, permanent close after

#### 7.1 Advanced Ticket Features (Industry Standard)
- [x] **SLA Management**: Define and track service level agreements (admin page created)
  - Response time targets
  - Resolution time targets  
  - SLA breach alerts (TODO: ticket list visual indicators)
  - Default SLA Policies in seed.sql (Standard + Premium)
- [x] **Canned Responses**: Pre-defined response templates for common issues (admin page + ticket integration)
- [ ] **Ticket Merging**: Merge duplicate tickets
- [ ] **Ticket Splitting**: Split ticket into multiple tickets
- [ ] **Ticket Linking**: Link related tickets together
- [ ] **Email to Ticket**: Create tickets from incoming emails
- [ ] **Ticket Categories/Tags**: Better organization with categories and tags
- [ ] **Ticket Escalation**: Auto-escalate based on SLA or priority
- [ ] **Ticket Watchers**: Allow staff to watch tickets for updates
- [ ] **Private Notes**: Internal notes visible only to staff
- [ ] **Satisfaction Survey**: Post-resolution customer satisfaction survey
- [ ] **Ticket Templates**: Pre-defined templates for common ticket types
- [ ] **Auto-Assignment Rules**: Auto-assign based on category/keywords
- [ ] **Ticket Search**: Full-text search across all tickets
- [ ] **Bulk Actions**: Mass update status/priority/assignment

### 8. Activity Logging
- [x] **Activity Log Table**: Log all important actions (schema + admin page)
- [x] **Admin Activity View**: `/admin/activity-log` with filtering
- [x] **Entity Tracking**: Integrated activity logging for projects and proposals
  - Project: create, status change, assign
  - Proposal: create, send, withdraw, accept, reject
- [x] **Audit Trail**: Complete audit trail for compliance
  - Ticket: create, comment, close, reopen, resolve
  - Project Request: create, status change, convert to project

### 9. Settings Pages
- [x] **Admin Settings**: System-wide settings with category tabs (`/admin/settings`)
- [x] **Client Settings Layout**: Tab/sidebar navigation for user settings
- [x] **Settings Sections**: Account, Password, Organizations, Notifications, Danger Zone
- [x] **Two-Factor Authentication**: TOTP-based 2FA with authenticator app
  - `/app/settings/security` page for 2FA management
  - QR code generation for easy authenticator app setup
  - Manual secret key entry option
  - Verification flow before enabling
  - Disable option with verification code confirmation

### 10. Announcement System
- [x] **Admin Announcement Setting**: Super admin can set portal-wide announcements
- [x] **Announcement Bar**: Display in portal header when active
- [x] **Scheduled Announcements**: Schedule start/end dates for announcements
- [x] **Target Audience**: Target announcements to specific user, organization, or staff group
- [x] **Announcements Management**: `/admin/announcements` page for full CRUD management
- [x] **Breadcrumbs Navigation**: Added breadcrumb navigation to admin layout

### 11. Reports & Analytics
- [x] **Admin Reports Page**: `/admin/reports` with dashboard metrics
- [x] **Ticket Reports**: Volume, status distribution, priority breakdown
- [x] **Project Reports**: Status counts, recent activity
- [x] **Invoice Reports**: Revenue tracking, collection rates
- [x] **Staff Performance**: Staff workload and performance metrics
  - Tickets assigned/resolved per staff member
  - Resolution rate with visual indicators
  - Project assignments
  - Ticket reply counts
  - Average response time calculation
- [ ] **Export Reports**: Export to CSV/PDF

### 12. Knowledge Base (New)
- [x] **Article Management**: Create/edit knowledge base articles
- [x] **Categories**: Organize articles by category
- [x] **Search**: Full-text search for articles
- [x] **Article Suggestions**: Suggest relevant articles when creating tickets
- [x] **Public/Private Articles**: Control visibility (audience: user/admin/all)
- [x] **Rich Text Editor**: WYSIWYG markdown editor for article content

### 13. Staff Groups & Team Management (New)
- [x] **Staff Groups**: Create admin/support team groups (`/admin/staff-groups`)
- [x] **Group Types**: admin, support, custom types
- [x] **Group Permissions**: Configurable permissions per group
- [x] **Member Management**: Add/remove staff from groups
- [x] **Announcement Targeting**: Target announcements to staff groups

### 14. Notifications System (New)
- [x] **Email Notifications**: Email alerts for important events
  - Proposal sent/accepted/rejected notifications
  - Ticket created notifications
  - Ticket reply notifications
- [ ] **In-App Notifications**: Real-time notification bell
- [ ] **Notification Preferences**: User-configurable notification settings
- [ ] **Digest Emails**: Daily/weekly summary emails

### 15. Invoice System Improvements
- [x] **Invoice Management**: Admin invoices page with list view
- [x] **Invoice PDF**: Generate PDF invoices (client-side jsPDF)
- [ ] **Invoice Generation**: Generate invoices from proposals/projects
- [ ] **Payment Tracking**: Track payment status
- [ ] **Payment Reminders**: Auto-send payment reminders
- [ ] **Recurring Invoices**: Support for recurring invoices

---

## Implementation Progress

### Phase 1: Critical Fixes ✅
1. ~~Fix admin access/redirect issue~~ ✅
2. ~~Add admin panel link for authorized users~~ ✅
3. ~~Fix auth page layout~~ ✅

### Phase 2: Core Features ✅
1. ~~Profile onboarding flow~~ ✅
2. ~~Organization management (admin + client)~~ ✅
3. ~~Proposal system~~ ✅
4. ~~Invite system~~ ✅

### Phase 3: Enhancements ✅
1. ~~Ticket improvements~~ ✅
2. ~~Activity logging~~ ✅
3. ~~Settings redesign~~ ✅
4. ~~Announcement system~~ ✅
5. ~~Reports dashboard~~ ✅

### Phase 4: Advanced Features (In Progress)
1. ~~SLA Management~~ ✅
2. ~~Canned Responses~~ ✅
3. ~~Knowledge Base~~ ✅
4. ~~Project Stages~~ ✅
5. ~~PDF Generation~~ ✅
6. ~~Email Notifications~~ ✅
7. ~~Project Milestones~~ ✅
8. ~~Staff Performance Reports~~ ✅
9. ~~Two-Factor Authentication~~ ✅

---

## Database Schema

### Tables (22 total, all with RLS enabled)
- [x] `profiles` - User profiles linked to Supabase Auth
- [x] `organizations` - Client organizations/companies
- [x] `organization_members` - M:N relationship profiles↔organizations
- [x] `organization_invites` - Invite codes for joining organizations
- [x] `pending_org_members` - Members awaiting approval
- [x] `projects` - Client projects
- [x] `project_requests` - Client project requests
- [x] `project_milestones` - Project milestones and deliverables
- [x] `proposals` - Project proposals
- [x] `invoices` - Billing invoices
- [x] `payments` - Payment records
- [x] `tickets` - Support tickets
- [x] `ticket_comments` - Ticket conversation threads
- [x] `activity_log` - Audit trail
- [x] `file_uploads` - File attachment metadata
- [x] `announcements` - Portal announcements with targeting
- [x] `announcement_dismissals` - Track dismissed announcements per user
- [x] `sla_policies` - SLA definitions
- [x] `canned_responses` - Ticket response templates
- [x] `system_settings` - Key-value system configuration
- [x] `support_articles` - Knowledge base articles
- [x] `staff_groups` - Admin/support team groups
- [x] `staff_group_members` - M:N relationship profiles↔staff_groups

### Security
- RLS enabled on all tables (no policies = service role only access)
- All database access via Drizzle ORM on server-side
- No direct client-side database access

---

## Technical Notes

### Role Hierarchy
1. **Super Admin**: Full system access, manage all organizations
2. **Admin**: Manage assigned organizations/projects
3. **Staff**: Work on assigned tickets/projects
4. **Customer**: View own organization's data

### File Structure
```
src/routes/
├── (admin)/admin/         # Admin panel routes
│   ├── activity-log/      # Activity audit log
│   ├── announcements/     # Announcement management (NEW)
│   ├── canned-responses/  # Response templates
│   ├── invoices/          # Invoice management
│   ├── knowledge-base/    # Knowledge base articles
│   ├── organizations/     # Organization management
│   ├── projects/          # Project management (includes requests tab)
│   ├── project-requests/  # Project request detail pages
│   ├── proposals/         # Proposal management
│   │   └── [id]/edit/     # Edit proposal
│   ├── reports/           # Analytics dashboard
│   ├── settings/          # System settings
│   ├── sla-policies/      # SLA management
│   ├── staff-groups/      # Staff group management (NEW)
│   │   └── [id]/          # Staff group detail (NEW)
│   ├── tickets/           # Ticket management
│   └── users/             # User management
├── (app)/app/             # Client portal routes
│   ├── help/              # Client help center
│   ├── invoices/          # Client invoices
│   ├── projects/          # Client projects
│   │   ├── new/           # Submit new project request
│   │   ├── requests/      # View request status
│   │   └── [id]/          # Project detail
│   ├── proposals/         # Client proposals
│   ├── settings/          # User settings
│   │   ├── danger/        # Account deletion
│   │   ├── notifications/ # Notification prefs
│   │   ├── organizations/ # Org membership + create
│   │   │   ├── new/       # Create organization
│   │   │   └── [id]/      # Organization management
│   │   ├── password/      # Password change
│   │   └── security/      # 2FA settings (NEW)
│   └── tickets/           # Client tickets (with article suggestions)
├── (auth)/auth/           # Authentication routes
├── (marketing)/           # Public marketing pages
├── join/[code]/           # Organization invite links
└── onboarding/            # Profile setup flow
```

---

## Next Steps (Priority Order)

1. **In-App Notifications**: Real-time notification bell
2. **Invoice Generation**: Generate invoices from proposals/projects
3. **Ticket Advanced Features**: Merging, splitting, linking tickets
4. **Export Reports**: Export to CSV/PDF
5. **Scheduled Announcements**: Schedule start/end dates for announcements

---

## Recent Changes (December 2024)

### Staff Groups & Announcements System (Latest)
- Created `/admin/staff-groups` page for managing admin/support team groups
- Staff groups with types: admin, support, custom
- Configurable permissions per group (manage_users, manage_projects, etc.)
- Group detail page at `/admin/staff-groups/[id]` with member management
- Added `/admin/announcements` page for full announcement CRUD
- Announcements support targeting: global, specific user, organization, or staff group
- Announcements bar in both admin and client layouts with type-based styling
- Breadcrumb navigation added to admin layout
- Announcement dismissal tracking per user

### Project Phase Back-Transitions
- Added unreview action: move reviewed projects back to under review
- Added revert_to_request action: revert pending projects back to request status
- Added hold/resume functionality for in_progress projects
- Added cancel/reactivate functionality
- PhaseActions component updated with back-transition options

### Rich Text Editor
- Created `RichTextEditor` component for WYSIWYG markdown editing
- Toolbar with formatting buttons: bold, italic, headings, lists, code, links
- Live preview mode with rendered markdown
- Used in knowledge base article editing
- Fixed CSS to use regular styles instead of @apply directives

### Staff Assignment Select Component
- Created `StaffAssignmentSelect` component for cleaner staff assignment UI
- Group-first selection with tab filtering
- Shows staff members with role badges
- Popover-based interface using Svelte 5 patterns

### Two-Factor Authentication (2FA)
- Added `/app/settings/security` page for 2FA management
- Uses Supabase Auth MFA with TOTP (Time-based One-Time Password)
- Features: QR code setup, manual secret key entry, verification flow
- Authenticator apps supported: Google Authenticator, Authy, 1Password, etc.
- Added Security link to settings navigation sidebar

### Staff Performance Reports
- Added staff performance metrics to `/admin/reports` page
- Tracks: tickets assigned, tickets resolved, resolution rate, projects assigned, ticket replies, avg response time
- Team summary stats: team size, total tickets handled, team resolution rate
- Color-coded indicators for performance (green 80%+, yellow 50%+, red below)
- Average response time in hours with color coding (green ≤4h, yellow ≤24h, red >24h)

### Project Milestones System
- Added `project_milestones` table with status enum (pending, in_progress, completed, on_hold, cancelled)
- Weight-based progress tracking (each milestone has a weight, progress = completed weight / total weight)
- Admin CRUD interface in project detail page (Milestones tab)
- Client view showing milestone progress and status
- Deliverables array for each milestone
- Migration: `0003_add_project_milestones.sql`

### Email Notifications System
- Created `$lib/server/email.ts` email service using Resend API
- Proposal notifications: sent, accepted, rejected emails
- Ticket notifications: created, reply emails
- Professional HTML email templates with MostlyWhat branding
- Added `RESEND_API_KEY` and `PUBLIC_SITE_URL` environment variables

### PDF Generation (Client-Side)
- Created `$lib/utils/pdf.ts` using jsPDF + jspdf-autotable
- Proposal PDF generation with line items, totals, terms
- Invoice PDF generation with payment details
- Download buttons added to admin and client proposal/invoice pages

### Project Stages UI
- Added PhaseTimeline component to client project views
- Visual stage progression from request to completion
- Phase badges with icons and status colors

### Project Request System
- Added `project_requests` table for client-submitted project requests
- Clients can submit requests at `/app/projects/new`
- Requests have status flow: pending → under_review → approved/rejected → converted
- Admin project requests integrated as tab in `/admin/projects` page
- Admin detail view at `/admin/project-requests/[id]` with approve/reject/convert actions
- Request can be converted to project with one click

### Client Organization Creation
- Added `/app/settings/organizations/new` for clients to create their own organizations
- Creator becomes automatic owner
- Organizations can be managed from settings page

### Ticket System Fixes
- Fixed `/app/tickets/new` error when `support_articles` table doesn't exist
- Added try-catch around suggested articles query for graceful fallback
- Ensures ticket creation works even without knowledge base setup

### UI Consistency Fixes
- Fixed admin page padding consistency (`px-6 py-8 md:px-12 lg:px-16`)
- Fixed onboarding form centering
- Fixed proposal detail page box grid layout
- Default SLA policies added to seed.sql (Standard + Premium)
