# Implementation Plan

## Overview
This document tracks the implementation of features and fixes for the MostlyWhat Systems client portal.

## Tasks

### 1. UI/Layout Fixes
- [x] **Auth Pages Layout**: Site name top-left, back to site top-right on the same bar
- [ ] **Sign-in/Sign-up Forms**: Keep forms centered in their area, ensure mobile responsive
- [ ] **App Top Bar**: Fix missing top bar in app error pages for full screen
- [ ] **Portal Announcement Bar**: Make consistent height, show announcements set by super admin
- [ ] **Mobile Responsiveness**: Audit all pages for mobile compatibility

### 2. Navigation & Access
- [ ] **Admin Panel Access**: Add "Go to Admin Panel" link in app for admin/super users
- [ ] **Admin Dashboard Redirect Fix**: Fix super admin redirect issue (redirects to app instead of admin)
- [ ] **Admin Route Protection**: Ensure proper role-based access control

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

### 6. Project Management
- [x] **Project Assignment**: Assign staff members to projects
- [x] **Project from Proposal**: Auto-create project from approved proposal

### 7. Ticket System Improvements
- [x] **Ticket Assignment**: Assign staff to tickets
- [x] **Initial Issue Display**: Show original issue at top, then conversation
- [ ] **Attachment System**: Fix file upload/attachment functionality
- [x] **Reopen Policy**: Allow reopening within 7 days, permanent close after

### 8. Activity Logging
- [ ] **Activity Log Table**: Log all important actions
- [ ] **Admin Activity View**: Super admin can view all activity logs
- [ ] **Entity Tracking**: Track changes to proposals, projects, tickets, etc.

### 9. Settings Page Redesign
- [ ] **Tab/Sidebar Navigation**: Replace single page with sections
- [ ] **Sections**: Account, Password, Organizations, Notifications, etc.
- [ ] **Remove Account Info Area**: Move to dedicated Account section

### 10. Announcement System
- [x] **Admin Announcement Setting**: Super admin can set portal-wide announcements
- [x] **Announcement Bar**: Display in portal header when active

---

## Implementation Progress

### Phase 1: Critical Fixes (Current)
1. Fix admin access/redirect issue
2. Add admin panel link for authorized users
3. Fix auth page layout

### Phase 2: Core Features
1. Onboarding flow
2. Organization management
3. Proposal system

### Phase 3: Enhancements
1. Ticket improvements
2. Activity logging
3. Settings redesign
4. Announcement system

---

## Technical Notes

### Database Schema Updates Needed
- `announcements` table for portal announcements
- `organization_invites` table for invite codes
- Update `proposals` to support full workflow
- Ensure `activity_log` captures all events

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
