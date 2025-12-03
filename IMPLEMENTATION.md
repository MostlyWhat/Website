# Implementation Plan

## Overview
This document tracks the implementation of features and fixes for the MostlyWhat Systems client portal.

## Tasks

### 1. UI/Layout Fixes
- [x] **Auth Pages Layout**: Site name top-left, back to site top-right on the same bar
- [ ] **Sign-in/Sign-up Forms**: Keep forms centered in their area, ensure mobile responsive
- [ ] **App Top Bar**: Fix missing top bar in app error pages for full screen
- [x] **Portal Announcement Bar**: Make consistent height, show announcements set by super admin
- [ ] **Mobile Responsiveness**: Audit all pages for mobile compatibility

### 2. Navigation & Access
- [x] **Admin Panel Access**: Add "Go to Admin Panel" link in app for admin/super users (moved above profile)
- [x] **Admin Dashboard Redirect Fix**: Fix super admin redirect issue (was redirecting to app)
- [x] **Admin Route Protection**: Ensure proper role-based access control (hooks.server.ts)
- [x] **Back to Portal Link**: Add "Back to Portal" link in admin panel for staff

### 3. Onboarding System
- [ ] **Organization Setup Flow**: 
  - Business option: Create organization, invite members
  - Personal option: Solo account setup
  - Join option: Join existing organization with invite code (requires approval)
- [ ] **Invite System**: Generate invite codes, approval workflow

### 4. Organization Management
- [ ] **Organization Dashboard**: Owner can manage team members
- [ ] **Member Roles**: Owner, Admin, Member permissions
- [ ] **Invite Codes**: Generate, share, and manage invite codes
- [ ] **Approval System**: Pending member approval workflow

### 5. Proposal System
- [x] **Create Proposal**: Admin can create proposals for organizations
- [x] **Proposal Workflow**: Draft → Sent → Viewed → Accepted/Rejected
- [x] **Proposal to Project**: Convert accepted proposals to projects
- [x] **Assignment**: Assign staff to proposals
- [ ] **Edit Proposal**: Allow editing draft proposals
- [ ] **Proposal PDF Generation**: Generate PDF version for download/email
- [ ] **Email Notifications**: Send email when proposal is sent/accepted/rejected

### 6. Project Management
- [x] **Project Assignment**: Assign staff members to projects
- [x] **Project from Proposal**: Auto-create project from approved proposal
- [ ] **Project Milestones**: Track project milestones and deliverables
- [ ] **Project Timeline View**: Visual timeline/Gantt view
- [ ] **Project Notes**: Internal notes for staff

### 7. Ticket System Improvements
- [x] **Ticket Assignment**: Assign staff to tickets
- [x] **Initial Issue Display**: Show original issue at top, then conversation
- [ ] **Attachment System**: Fix file upload/attachment functionality
- [x] **Reopen Policy**: Allow reopening within 7 days, permanent close after

#### 7.1 Advanced Ticket Features (Industry Standard)
- [x] **SLA Management**: Define and track service level agreements (admin page created)
  - Response time targets
  - Resolution time targets  
  - SLA breach alerts (TODO: ticket list visual indicators)
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
- [ ] **Activity Log Table**: Log all important actions
- [ ] **Admin Activity View**: Super admin can view all activity logs
- [ ] **Entity Tracking**: Track changes to proposals, projects, tickets, etc.
- [ ] **Audit Trail**: Complete audit trail for compliance

### 9. Settings Page Redesign
- [ ] **Tab/Sidebar Navigation**: Replace single page with sections
- [ ] **Sections**: Account, Password, Organizations, Notifications, etc.
- [ ] **Remove Account Info Area**: Move to dedicated Account section

### 10. Announcement System
- [x] **Admin Announcement Setting**: Super admin can set portal-wide announcements
- [x] **Announcement Bar**: Display in portal header when active
- [ ] **Scheduled Announcements**: Schedule start/end dates for announcements
- [ ] **Target Audience**: Target announcements to specific organizations

### 11. Knowledge Base (New)
- [ ] **Article Management**: Create/edit knowledge base articles
- [ ] **Categories**: Organize articles by category
- [ ] **Search**: Full-text search for articles
- [ ] **Article Suggestions**: Suggest relevant articles when creating tickets
- [ ] **Public/Private Articles**: Control visibility

### 12. Reporting & Analytics (New)
- [ ] **Dashboard Metrics**: Key metrics on admin dashboard
- [ ] **Ticket Reports**: Response time, resolution time, volume
- [ ] **Project Reports**: Progress, budget tracking
- [ ] **Staff Performance**: Staff workload and performance metrics
- [ ] **Export Reports**: Export to CSV/PDF

### 13. Notifications System (New)
- [ ] **Email Notifications**: Email alerts for important events
- [ ] **In-App Notifications**: Real-time notification bell
- [ ] **Notification Preferences**: User-configurable notification settings
- [ ] **Digest Emails**: Daily/weekly summary emails

### 14. Invoice System Improvements (New)
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
3. Fix auth page layout

### Phase 2: Core Features (In Progress)
1. Onboarding flow
2. Organization management
3. ~~Proposal system~~ ✅

### Phase 3: Enhancements
1. ~~Ticket basic improvements~~ ✅
2. Activity logging
3. Settings redesign
4. ~~Announcement system~~ ✅

### Phase 4: Advanced Features (New)
1. ~~SLA Management~~ ✅
2. ~~Canned Responses~~ ✅
3. Knowledge Base
4. Reporting & Analytics
5. Advanced Notifications

---

## Technical Notes

### Database Schema Updates Needed
- [x] `announcements` table for portal announcements
- [ ] `organization_invites` table for invite codes
- [x] Update `proposals` to support full workflow
- [ ] Ensure `activity_log` captures all events
- [x] `canned_responses` table for ticket templates
- [x] `sla_policies` table for SLA management
- [ ] `knowledge_articles` table for knowledge base
- [ ] `notifications` table for in-app notifications

### Role Hierarchy
1. **Super Admin**: Full system access, manage all organizations
2. **Admin**: Manage assigned organizations/projects
3. **Staff**: Work on assigned tickets/projects
4. **Client**: View own organization's data

### File Structure
```
src/routes/
├── (admin)/admin/         # Admin panel routes
├── (app)/app/             # Client portal routes
├── (auth)/auth/           # Authentication routes
└── (onboarding)/          # Onboarding flow (new)
```
