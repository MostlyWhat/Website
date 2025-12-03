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
- [ ] **Organization Setup Flow**: 
  - Business option: Create organization, invite members
  - Personal option: Solo account setup
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
- [ ] **Organization Dashboard for Owners**: Enhanced dashboard for org owners to manage team

### 5. Proposal System
- [x] **Create Proposal**: Admin can create proposals for organizations
- [x] **Proposal Workflow**: Draft → Sent → Viewed → Accepted/Rejected
- [x] **Proposal to Project**: Convert accepted proposals to projects
- [x] **Proposal Detail Grid**: Fixed box grid layout to match add proposal form
- [x] **Assignment**: Assign staff to proposals
- [ ] **Edit Proposal**: Allow editing draft proposals
- [ ] **Proposal PDF Generation**: Generate PDF version for download/email
- [ ] **Email Notifications**: Send email when proposal is sent/accepted/rejected

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
- [ ] **Project Milestones**: Track project milestones and deliverables
- [ ] **Project Timeline View**: Visual timeline/Gantt view
- [ ] **Project Notes**: Internal notes for staff
- [ ] **Project Stages**: Visual stage progression (request → proposal → active → completed)

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
- [ ] **Audit Trail**: Complete audit trail for compliance (add to invoices, tickets)

### 9. Settings Pages
- [x] **Admin Settings**: System-wide settings with category tabs (`/admin/settings`)
- [x] **Client Settings Layout**: Tab/sidebar navigation for user settings
- [x] **Settings Sections**: Account, Password, Organizations, Notifications, Danger Zone
- [ ] **Two-Factor Authentication**: Add 2FA option in security settings

### 10. Announcement System
- [x] **Admin Announcement Setting**: Super admin can set portal-wide announcements
- [x] **Announcement Bar**: Display in portal header when active
- [ ] **Scheduled Announcements**: Schedule start/end dates for announcements
- [ ] **Target Audience**: Target announcements to specific organizations

### 11. Reports & Analytics
- [x] **Admin Reports Page**: `/admin/reports` with dashboard metrics
- [x] **Ticket Reports**: Volume, status distribution, priority breakdown
- [x] **Project Reports**: Status counts, recent activity
- [x] **Invoice Reports**: Revenue tracking, collection rates
- [ ] **Staff Performance**: Staff workload and performance metrics
- [ ] **Export Reports**: Export to CSV/PDF

### 12. Knowledge Base (New)
- [ ] **Article Management**: Create/edit knowledge base articles
- [ ] **Categories**: Organize articles by category
- [ ] **Search**: Full-text search for articles
- [ ] **Article Suggestions**: Suggest relevant articles when creating tickets
- [ ] **Public/Private Articles**: Control visibility

### 13. Notifications System (New)
- [ ] **Email Notifications**: Email alerts for important events
- [ ] **In-App Notifications**: Real-time notification bell
- [ ] **Notification Preferences**: User-configurable notification settings
- [ ] **Digest Emails**: Daily/weekly summary emails

### 14. Invoice System Improvements
- [x] **Invoice Management**: Admin invoices page with list view
- [ ] **Invoice Generation**: Generate invoices from proposals/projects
- [ ] **Payment Tracking**: Track payment status
- [ ] **Payment Reminders**: Auto-send payment reminders
- [ ] **Invoice PDF**: Generate PDF invoices
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
3. Knowledge Base
4. Advanced Notifications
5. PDF Generation

---

## Database Schema

### Tables (18 total, all with RLS enabled)
- [x] `profiles` - User profiles linked to Supabase Auth
- [x] `organizations` - Client organizations/companies
- [x] `organization_members` - M:N relationship profiles↔organizations
- [x] `organization_invites` - Invite codes for joining organizations
- [x] `pending_org_members` - Members awaiting approval
- [x] `projects` - Client projects
- [x] `project_requests` - Client project requests (NEW)
- [x] `proposals` - Project proposals
- [x] `invoices` - Billing invoices
- [x] `payments` - Payment records
- [x] `tickets` - Support tickets
- [x] `ticket_comments` - Ticket conversation threads
- [x] `activity_log` - Audit trail
- [x] `file_uploads` - File attachment metadata
- [x] `announcements` - Portal announcements
- [x] `sla_policies` - SLA definitions
- [x] `canned_responses` - Ticket response templates
- [x] `system_settings` - Key-value system configuration

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
│   ├── canned-responses/  # Response templates
│   ├── invoices/          # Invoice management
│   ├── organizations/     # Organization management
│   ├── projects/          # Project management (includes requests tab)
│   ├── project-requests/  # Project request detail pages
│   ├── proposals/         # Proposal management
│   ├── reports/           # Analytics dashboard
│   ├── settings/          # System settings
│   ├── sla-policies/      # SLA management
│   ├── tickets/           # Ticket management
│   └── users/             # User management
├── (app)/app/             # Client portal routes
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
│   │   │   └── new/       # Create organization
│   │   └── password/      # Password change
│   └── tickets/           # Client tickets
├── (auth)/auth/           # Authentication routes
├── (marketing)/           # Public marketing pages
├── join/[code]/           # Organization invite links
└── onboarding/            # Profile setup flow
```

---

## Next Steps (Priority Order)

1. **Project Stages UI**: Visual stage progression showing request → proposal → development → completed
2. **Entity Activity Integration**: Wire up activity logging to ticket, project, proposal operations  
3. **Organization Owner Dashboard**: Enhanced management for org owners
4. **PDF Generation**: Proposal and invoice PDF export
5. **Email Notifications**: Basic email notifications for key events
6. **Knowledge Base**: Article management system

---

## Recent Changes (December 2024)

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

### UI Consistency Fixes
- Fixed admin page padding consistency (`px-6 py-8 md:px-12 lg:px-16`)
- Fixed onboarding form centering
- Fixed proposal detail page box grid layout
- Default SLA policies added to seed.sql (Standard + Premium)
