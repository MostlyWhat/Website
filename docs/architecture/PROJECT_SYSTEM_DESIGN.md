# Project System Design Document

## Overview

This document outlines the simplified 7-phase project management system for MostlyWhat Systems. The goal is to consolidate scattered functionality into a single cohesive project hub while maintaining clear phase progression.

---

## 1. Project Lifecycle - 7 Phases

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              PROJECT LIFECYCLE PHASES                                    │
├───────────┬───────────┬───────────┬───────────┬───────────┬───────────┬───────────────┤
│  REQUEST  │  REVIEW   │ PROPOSAL  │ CONFIRMED │ BUILDING  │ COMPLETED │   SUPPORT     │
│   (01)    │   (02)    │   (03)    │   (04)    │   (05)    │   (06)    │    (07)       │
├───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────────┤
│  Client   │  Admin    │  Admin    │  Client   │  Active   │  Project  │  Optional     │
│  submits  │  reviews  │  sends    │  accepts  │  dev &    │  delivered│  ongoing      │
│  vision   │  request  │  scope &  │  + Admin  │  revisions│  & signed │  maintenance  │
│           │           │  pricing  │  confirms │           │  off      │  & support    │
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────────┘
```

### Phase Details

| Phase | Code | Who Acts | Description | Exit Criteria |
|-------|------|----------|-------------|---------------|
| **01 - Request** | `request` | Client | Client submits project vision, requirements, budget range | Admin reviews |
| **02 - Review** | `review` | Admin | Admin evaluates feasibility, asks clarifying questions | Approve → Proposal, or Decline |
| **03 - Proposal** | `proposal` | Admin | Admin creates detailed scope, timeline, and pricing | Sent to client |
| **04 - Confirmed** | `confirmed` | Both | Client accepts proposal, then Admin confirms to start work | Both parties confirm |
| **05 - Building** | `building` | Team | Active development with version releases and revision cycles | All deliverables complete |
| **06 - Completed** | `completed` | Sign-off | Project delivered, final invoice paid, handover complete | Client signs off |
| **07 - Support** | `support` | Ongoing | Optional recurring maintenance, tied to SLA & ticketing | Contract ends or renews |

---

## 2. Two-Way Confirmation Flow (Phase 03 → 04)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROPOSAL CONFIRMATION FLOW                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ADMIN creates proposal                                              │
│       │                                                              │
│       ▼                                                              │
│  ADMIN sends proposal to client                                      │
│       │                                                              │
│       ▼                                                              │
│  CLIENT reviews proposal                                             │
│       │                                                              │
│       ├──► CLIENT REJECTS ──► Back to Proposal (revise) or Cancel   │
│       │                                                              │
│       ▼                                                              │
│  CLIENT ACCEPTS proposal                                             │
│       │                                                              │
│       ▼                                                              │
│  Status: "Awaiting Admin Confirmation"                               │
│       │                                                              │
│       ▼                                                              │
│  ADMIN CONFIRMS to start project                                     │
│       │                                                              │
│       ▼                                                              │
│  Project moves to BUILDING phase                                     │
│  (First invoice may be generated)                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Status Values for Confirmation:
- `proposal_sent` - Proposal sent, waiting for client
- `proposal_viewed` - Client has viewed the proposal
- `client_accepted` - Client accepted, awaiting admin confirmation
- `admin_confirmed` - Both confirmed, ready to build
- `proposal_rejected` - Client rejected (can revise or cancel)

---

## 3. Revisions During Building Phase

Revisions are **change requests** that occur during the Building phase. They track client feedback on published versions.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUILDING PHASE WORKFLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    REVISION CYCLE                             │   │
│  │                                                               │   │
│  │   BUILD ──► PUBLISH VERSION ──► CLIENT REVIEW                │   │
│  │     ▲              │                   │                      │   │
│  │     │              │                   ▼                      │   │
│  │     │              │         ┌─────────────────┐              │   │
│  │     │              │         │ Feedback?       │              │   │
│  │     │              │         └────────┬────────┘              │   │
│  │     │              │                  │                       │   │
│  │     │              │         YES      │      NO               │   │
│  │     │              │           │      │       │               │   │
│  │     │              │           ▼      │       ▼               │   │
│  │     │              │    CREATE        │    APPROVE            │   │
│  │     │              │    REVISION      │    VERSION            │   │
│  │     │              │         │        │       │               │   │
│  │     └──────────────┼─────────┘        │       │               │   │
│  │                    │                  │       │               │   │
│  └────────────────────┼──────────────────┼───────┼───────────────┘   │
│                       │                  │       │                   │
│                       ▼                  ▼       ▼                   │
│              Continue until all deliverables approved                │
│                              │                                       │
│                              ▼                                       │
│                    Move to COMPLETED phase                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Revision Tracking:
- Each revision is linked to a specific version/milestone
- Revisions have: description, priority, status (pending/in_progress/resolved)
- Revision history is preserved for audit trail
- **Post-completion changes** = New project request (not a revision)

---

## 4. Support Phase & SLA Integration

The Support phase is **optional** and ties into:
1. **Ticketing System** - Support requests from client
2. **SLA Policies** - Response/resolution time guarantees
3. **Recurring Billing** - Monthly/yearly maintenance contracts

### SLA Policy Structure (Updated)

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SLA POLICIES                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Policies can be assigned by:                                        │
│  ├── Organization (specific org gets specific SLA)                  │
│  ├── Customer Type (enterprise, business, personal)                 │
│  └── Ticket Category (billing, technical, general)                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  POLICY: "Enterprise Support"                              │     │
│  │  ├── Response Time: 2 hours                                │     │
│  │  ├── Resolution Time: 24 hours                             │     │
│  │  ├── Applies To:                                           │     │
│  │  │   ├── Organizations: [Acme Corp, TechStart Inc]        │     │
│  │  │   ├── Customer Types: [enterprise]                      │     │
│  │  │   └── Categories: [all]                                 │     │
│  │  └── Priority Multipliers:                                 │     │
│  │      ├── Urgent: 0.5x (1hr response)                       │     │
│  │      ├── High: 0.75x (1.5hr response)                      │     │
│  │      ├── Medium: 1x (2hr response)                         │     │
│  │      └── Low: 2x (4hr response)                            │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  POLICY: "Standard Support"                                │     │
│  │  ├── Response Time: 24 hours                               │     │
│  │  ├── Resolution Time: 72 hours                             │     │
│  │  ├── Applies To:                                           │     │
│  │  │   ├── Organizations: [default]                          │     │
│  │  │   ├── Customer Types: [business, personal]              │     │
│  │  │   └── Categories: [general, billing]                    │     │
│  │  └── Business Hours Only: true                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Ticket Scope Options:
- **Organization Ticket** - Related to org/project, visible to org members
- **Personal Ticket** - Personal account issue, private to user

---

## 5. Simplified Admin Navigation

### Before (Current):
```
├── Dashboard
├── Projects
│   └── [Tab: Requests]
├── Project Requests (separate page)
├── Proposals (separate page)
├── Invoices (separate page)
├── Tickets
├── Organizations
├── Users
├── Reports
├── Settings
├── SLA Policies
├── Canned Responses
└── Activity Log
```

### After (Simplified):
```
├── Dashboard
│
├── Projects                    ← Single hub for all project work
│   ├── [Filter: All Phases]
│   ├── [Filter: Requests]      (Phase 1-2)
│   ├── [Filter: Active]        (Phase 3-5)
│   └── [Filter: Completed]     (Phase 6-7)
│
├── Organizations               ← Client companies (top-level)
│   └── [id]
│       ├── Overview
│       ├── Members
│       ├── Projects            (linked)
│       └── Invoices            (all org invoices)
│
├── Tickets                     ← Support (org or personal scope)
│   ├── [Filter: By Org]
│   └── [Filter: Personal]
│
├── Reports                     ← Analytics
│
└── Settings
    ├── Users                   ← User management
    ├── SLA Policies            ← Renamed: Support policies with rules
    ├── Response Templates      ← Canned responses
    ├── Activity Log            ← Audit trail
    └── System                  ← General settings
```

---

## 6. Single Project Detail Page

All project-related information in one place:

```
/admin/projects/[id]
│
├── HEADER
│   ├── Project Name & Number
│   ├── Phase Badge (visual: 01-07)
│   ├── Organization Link
│   └── Quick Actions (change phase, assign team)
│
├── PHASE TIMELINE
│   └── Visual progress bar showing current phase
│
├── TABS
│   │
│   ├── Overview
│   │   ├── Project Summary
│   │   ├── Original Request Details
│   │   ├── Key Dates (start, estimated end)
│   │   ├── Assigned Team Members
│   │   └── Budget Overview
│   │
│   ├── Proposal & Scope
│   │   ├── Proposal Document
│   │   ├── Scope Items / Deliverables
│   │   ├── Pricing Breakdown
│   │   ├── Client Acceptance Status
│   │   └── Admin Confirmation Status
│   │
│   ├── Revisions (Building Phase)
│   │   ├── Version History
│   │   ├── Active Revision Requests
│   │   ├── Completed Revisions
│   │   └── Create New Revision
│   │
│   ├── Billing
│   │   ├── All Invoices for Project
│   │   ├── Payment History
│   │   ├── Outstanding Balance
│   │   └── Create Invoice
│   │
│   ├── Support (if in Support Phase)
│   │   ├── Linked Tickets
│   │   ├── SLA Status
│   │   └── Support Contract Details
│   │
│   └── Activity
│       └── Full Activity Timeline
│
└── SIDEBAR (on larger screens)
    ├── Quick Stats
    ├── Phase Actions
    └── Related Links
```

---

## 7. Database Schema Changes

### New/Modified Enums

```sql
-- Replace project_status with project_phase
CREATE TYPE project_phase AS ENUM (
  'request',      -- Phase 01: Client submitted request
  'review',       -- Phase 02: Admin reviewing
  'proposal',     -- Phase 03: Proposal being created/sent
  'confirmed',    -- Phase 04: Both parties confirmed
  'building',     -- Phase 05: Active development
  'completed',    -- Phase 06: Project delivered
  'support'       -- Phase 07: Ongoing support
);

-- Proposal confirmation status (sub-status for Phase 03-04)
CREATE TYPE proposal_confirmation_status AS ENUM (
  'draft',              -- Not yet sent
  'sent',               -- Sent to client
  'viewed',             -- Client viewed
  'client_accepted',    -- Client accepted, awaiting admin
  'admin_confirmed',    -- Both confirmed (triggers phase change)
  'rejected',           -- Client rejected
  'expired'             -- Proposal expired
);

-- Revision status
CREATE TYPE revision_status AS ENUM (
  'pending',      -- Revision requested
  'in_progress',  -- Being worked on
  'resolved',     -- Completed
  'declined'      -- Won't fix
);

-- Ticket scope
CREATE TYPE ticket_scope AS ENUM (
  'organization',  -- Org-related ticket
  'personal'       -- Personal account ticket
);

-- Customer type (for SLA assignment)
CREATE TYPE customer_type AS ENUM (
  'personal',
  'business', 
  'enterprise'
);
```

### Projects Table Changes

```sql
ALTER TABLE projects 
  ADD COLUMN phase project_phase DEFAULT 'request',
  ADD COLUMN proposal_status proposal_confirmation_status,
  ADD COLUMN client_accepted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN admin_confirmed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN support_tier_id UUID REFERENCES sla_policies(id),
  ADD COLUMN support_started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN support_ends_at TIMESTAMP WITH TIME ZONE;

-- Migrate existing status to phase
-- draft -> request
-- proposal_sent -> proposal
-- proposal_accepted -> confirmed
-- in_progress -> building
-- completed -> completed
-- etc.
```

### New: Project Revisions Table

```sql
CREATE TABLE project_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version VARCHAR(50),                    -- e.g., "v1.2", "Build 42"
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requested_by_id UUID REFERENCES profiles(id),
  assigned_to_id UUID REFERENCES profiles(id),
  status revision_status DEFAULT 'pending',
  priority ticket_priority DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

CREATE INDEX idx_revisions_project ON project_revisions(project_id);
CREATE INDEX idx_revisions_status ON project_revisions(status);
```

### SLA Policies Table Changes

```sql
ALTER TABLE sla_policies
  ADD COLUMN applies_to_customer_types customer_type[] DEFAULT '{}',
  ADD COLUMN applies_to_categories VARCHAR(50)[] DEFAULT '{}',
  ADD COLUMN priority_multipliers JSONB DEFAULT '{"urgent": 0.5, "high": 0.75, "medium": 1, "low": 2}',
  ADD COLUMN business_hours_only BOOLEAN DEFAULT true;

-- New: SLA Organization Assignments
CREATE TABLE sla_organization_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sla_policy_id UUID NOT NULL REFERENCES sla_policies(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sla_policy_id, organization_id)
);
```

### Tickets Table Changes

```sql
ALTER TABLE tickets
  ADD COLUMN scope ticket_scope DEFAULT 'organization',
  ADD COLUMN project_id UUID REFERENCES projects(id);  -- Link to project if relevant
```

### Organizations Table Changes

```sql
ALTER TABLE organizations
  ADD COLUMN customer_type customer_type DEFAULT 'business',
  ADD COLUMN default_sla_policy_id UUID REFERENCES sla_policies(id);
```

---

## 8. Phase Transition Rules

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE TRANSITION RULES                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  REQUEST (01) ──────────────────────────────────────────────────►   │
│     │                                                                │
│     ├── Admin clicks "Start Review" ──► REVIEW (02)                 │
│     └── Admin clicks "Decline" ──► CANCELLED                        │
│                                                                      │
│  REVIEW (02) ────────────────────────────────────────────────────►  │
│     │                                                                │
│     ├── Admin clicks "Create Proposal" ──► PROPOSAL (03)            │
│     ├── Admin clicks "Request More Info" ──► (stays in Review)      │
│     └── Admin clicks "Decline" ──► CANCELLED                        │
│                                                                      │
│  PROPOSAL (03) ──────────────────────────────────────────────────►  │
│     │                                                                │
│     ├── Client accepts ──► proposal_status = 'client_accepted'      │
│     │     └── Admin confirms ──► CONFIRMED (04)                     │
│     ├── Client rejects ──► (revise proposal or cancel)              │
│     └── Proposal expires ──► (revise or cancel)                     │
│                                                                      │
│  CONFIRMED (04) ─────────────────────────────────────────────────►  │
│     │                                                                │
│     └── Admin clicks "Start Building" ──► BUILDING (05)             │
│         (May generate first invoice)                                 │
│                                                                      │
│  BUILDING (05) ──────────────────────────────────────────────────►  │
│     │                                                                │
│     ├── Revisions can be created/resolved (cycles)                  │
│     ├── Admin clicks "Mark Complete" ──► COMPLETED (06)             │
│     └── Admin clicks "Put On Hold" ──► ON_HOLD (returns to Building)│
│                                                                      │
│  COMPLETED (06) ─────────────────────────────────────────────────►  │
│     │                                                                │
│     ├── Admin clicks "Enable Support" ──► SUPPORT (07)              │
│     └── Project stays completed (archived)                          │
│         └── New work = New project request                          │
│                                                                      │
│  SUPPORT (07) ───────────────────────────────────────────────────►  │
│     │                                                                │
│     ├── Tickets can be created (linked to project)                  │
│     ├── SLA tracking active                                         │
│     ├── Support contract can be renewed                             │
│     └── Admin clicks "End Support" ──► COMPLETED (06)               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. UI Components to Build

### Phase Badge Component
```svelte
<!-- Shows current phase with number and color -->
<PhaseBadge phase="building" /> 
<!-- Renders: [05 BUILDING] with yellow color -->
```

### Phase Timeline Component
```svelte
<!-- Horizontal progress showing all 7 phases -->
<PhaseTimeline currentPhase="building" />
<!--
  [✓] Request → [✓] Review → [✓] Proposal → [✓] Confirmed → [●] Building → [ ] Completed → [ ] Support
-->
```

### Revision Card Component
```svelte
<RevisionCard 
  version="v1.2"
  title="Homepage hero section changes"
  status="in_progress"
  priority="high"
/>
```

### SLA Policy Card Component
```svelte
<SlaPolicyCard
  name="Enterprise Support"
  responseTime="2 hours"
  resolutionTime="24 hours"
  appliesTo={['Acme Corp', 'TechStart']}
/>
```

---

## 10. Migration Plan

### Phase 1: Database Changes
1. Add new enums and columns
2. Create migration script for existing data
3. Create new tables (project_revisions, sla_organization_assignments)

### Phase 2: Backend Updates
1. Update Drizzle schema
2. Create phase transition helpers
3. Update existing server actions
4. Add revision CRUD operations

### Phase 3: Admin UI Updates
1. Build phase components (badge, timeline)
2. Redesign project list with phase filters
3. Redesign project detail page with tabs
4. Update SLA policies page with new fields
5. Simplify navigation

### Phase 4: Client Portal Updates
1. Update project view with phase timeline
2. Add two-way confirmation flow
3. Add revision request UI (during building)

### Phase 5: Testing & Cleanup
1. Test all phase transitions
2. Remove deprecated pages/routes
3. Update documentation

---

## 11. Files to Modify/Create

### New Files:
```
src/lib/components/projects/
├── PhaseBadge.svelte
├── PhaseTimeline.svelte
├── PhaseActions.svelte
├── RevisionCard.svelte
└── RevisionList.svelte

src/lib/components/sla/
├── SlaPolicyCard.svelte
└── SlaPolicyForm.svelte

src/routes/(admin)/admin/projects/[id]/
├── +page.svelte              (redesigned)
├── +page.server.ts           (redesigned)
├── overview/
├── proposal/
├── revisions/
├── billing/
├── support/
└── activity/
```

### Modified Files:
```
src/lib/server/db/schema.ts   (add new enums, tables, columns)
src/routes/(admin)/admin/
├── +layout.svelte            (simplified nav)
├── projects/+page.svelte     (phase filters)
├── sla-policies/             (redesigned)
└── organizations/[id]/       (add tabs)
```

### Deprecated (to remove later):
```
src/routes/(admin)/admin/proposals/        (merge into projects)
src/routes/(admin)/admin/project-requests/ (merge into projects)
```

---

## 12. Summary

| Change | Description |
|--------|-------------|
| **7 Phases** | Clear lifecycle from Request to Support |
| **Two-Way Confirmation** | Client accepts → Admin confirms → Work begins |
| **Revisions** | During Building phase only; post-completion = new project |
| **SLA Policies** | Flexible assignment by org, customer type, category |
| **Simplified Nav** | Merge proposals/requests into Projects; org to top-level |
| **Single Project Page** | All info (proposal, billing, revisions, support) in tabs |
| **Ticket Scope** | Choose between organization or personal |

---

## Appendix: Mapping to Homepage Process

| Homepage Step | Admin Phases |
|---------------|--------------|
| 01 - Tell Us Your Vision | Phase 1 (Request) + Phase 2 (Review) |
| 02 - Design & Plan | Phase 3 (Proposal) + Phase 4 (Confirmed) |
| 03 - Build & Test | Phase 5 (Building) with Revisions |
| 04 - Launch & Support | Phase 6 (Completed) + Phase 7 (Support) |

This maintains the simple 4-step customer-facing message while providing detailed internal tracking.
