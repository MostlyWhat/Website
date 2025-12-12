# CRUD Page Standardization Plan

**Created:** December 10, 2025  
**Status:** 🔴 Planning Phase

---

## 📋 Executive Summary

After analyzing 100+ `+page.svelte` files, there are **significant inconsistencies** in layout patterns for CRUD operations across admin and app sections. This document outlines a standardization plan to:

1. Create reusable layout components for common CRUD patterns
2. Establish consistent spacing, typography, and visual hierarchy
3. Improve maintainability and reduce code duplication
4. Enhance user experience through predictable interfaces

---

## 🎯 Scope

### In Scope
- ✅ Admin CRUD pages (`(admin)/admin/*`)
- ✅ App CRUD pages (`(app)/app/*`)
- ✅ Create/New pages (`*/new/+page.svelte`)
- ✅ Edit/Update pages (`*/[id]/+page.svelte`)
- ✅ List/Index pages (`*/+page.svelte`)

### Out of Scope
- ❌ Marketing pages (`(marketing)/*`) - different purpose
- ❌ Auth pages (`(auth)/*`) - specialized flows
- ❌ Docs pages (`docs/*`) - documentation specific
- ❌ Special pages (project detail with unique layouts)

---

## 📊 Current State Analysis

### Pattern 1: Full-Width Form (Inconsistent)
**Files:** `admin/tickets/new`, `admin/users/new`, `app/tickets/new`
```svelte
<div class="min-h-screen bg-background">
  <header class="border-b border-border px-6 py-6 lg:px-12">
    <!-- Back button + Title -->
  </header>
  <main class="px-6 py-8 lg:px-12">
    <form><!-- Fields --></form>
  </main>
</div>
```
**Issues:**
- No sidebar for contextual actions/info
- Inconsistent padding (px-6 vs md:px-12 vs lg:px-16)
- Different header structures

### Pattern 2: Grid with Sidebar (Partial)
**Files:** `admin/blog/new`, `admin/knowledge-base/new`, `admin/users/new` (partial)
```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 lg:col-span-8 bg-background">
    <!-- Main form content -->
  </div>
  <div class="col-span-12 lg:col-span-4 bg-card">
    <!-- Sidebar actions/options -->
  </div>
</div>
```
**Issues:**
- Inconsistent col-span values (some use col-span-8/4, others use different ratios)
- Some pages put sidebar inside form, others outside
- No standard component wrapping this pattern

### Pattern 3: Card-Based Layout
**Files:** `admin/projects/new`, `admin/invoices/new`
```svelte
<div class="max-w-3xl">
  <Card.Root>
    <Card.Header><!-- Section title --></Card.Header>
    <Card.Content><!-- Fields --></Card.Content>
  </Card.Root>
</div>
```
**Issues:**
- No sidebar option
- Inconsistent max-width values
- Different from other CRUD pages

### Pattern 4: Existing FormLayout Component
**Files:** `admin/knowledge-base/new` (only one using it!)
```svelte
<FormLayout>
  {#snippet children()}
    <!-- Main content -->
  {/snippet}
  {#snippet sidebar()}
    <!-- Sidebar -->
  {/snippet}
</FormLayout>
```
**Good!** But underutilized - only 1 page uses it!

---

## 🎨 Standardized Patterns

### Standard 1: CrudCreateLayout (NEW)
**Purpose:** Creating new entities (tickets, users, projects, etc.)

**Structure:**
```svelte
<CrudCreateLayout
  title="Create Ticket"
  description="Create a new support ticket on behalf of a user."
  backHref="/admin/tickets"
  backLabel="Back to Tickets"
>
  {#snippet main()}
    <!-- Main form fields -->
  {/snippet}
  
  {#snippet sidebar()}
    <!-- Optional sidebar with:
      - Quick actions
      - Save/Submit button
      - Status toggle
      - Related info
    -->
  {/snippet}
</CrudCreateLayout>
```

**Features:**
- Consistent header with back button
- Standard padding and spacing
- Main content (8 cols) + Sidebar (4 cols)
- Mobile responsive stacking
- Error/success message handling

### Standard 2: CrudEditLayout (NEW)
**Purpose:** Editing existing entities

**Structure:**
```svelte
<CrudEditLayout
  title="Edit Ticket #1234"
  description="Update ticket details and status."
  backHref="/admin/tickets/1234"
  backLabel="Back to Ticket"
  entityName="Ticket #1234"
>
  {#snippet main()}
    <!-- Main form fields -->
  {/snippet}
  
  {#snippet sidebar()}
    <!-- Sidebar with:
      - Quick info (created date, author, etc.)
      - Quick actions (delete, archive, etc.)
      - Activity log preview
    -->
  {/snippet}
  
  {#snippet dangerZone()}
    <!-- Optional danger actions (delete, deactivate) -->
  {/snippet}
</CrudEditLayout>
```

### Standard 3: CrudDetailLayout (NEW)
**Purpose:** Viewing entity details (read-only or with embedded forms)

**Structure:**
```svelte
<CrudDetailLayout
  title="Ticket #1234"
  backHref="/admin/tickets"
  backLabel="Back to Tickets"
>
  {#snippet header()}
    <!-- Custom header content (breadcrumbs, status badges) -->
  {/snippet}
  
  {#snippet main()}
    <!-- Main content area -->
  {/snippet}
  
  {#snippet sidebar()}
    <!-- Sidebar with metadata, actions -->
  {/snippet}
</CrudDetailLayout>
```

### Standard 4: CrudListLayout (Keep Simple)
**Purpose:** List pages don't need complex layouts

**Structure:**
```svelte
<div class="min-h-screen bg-background">
  <PageHeader
    title="Tickets"
    description="Manage support tickets"
    action={{ label: "New Ticket", href: "/admin/tickets/new" }}
  />
  
  <main class="px-6 py-8 md:px-12">
    <!-- Filters, search, table/grid -->
  </main>
</div>
```

---

## 🏗️ Component Architecture

### New Components to Create

#### 1. CrudCreateLayout.svelte
```typescript
interface Props {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
  showSidebar?: boolean; // default: true
  children: Snippet; // main content
  sidebar?: Snippet; // sidebar content
  class?: string;
}
```

#### 2. CrudEditLayout.svelte
```typescript
interface Props {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
  entityName: string;
  showSidebar?: boolean;
  children: Snippet;
  sidebar?: Snippet;
  dangerZone?: Snippet;
  class?: string;
}
```

#### 3. CrudDetailLayout.svelte
```typescript
interface Props {
  title: string;
  backHref: string;
  backLabel?: string;
  showSidebar?: boolean;
  header?: Snippet;
  children: Snippet;
  sidebar?: Snippet;
  class?: string;
}
```

#### 4. PageHeader.svelte (Enhanced)
```typescript
interface Props {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href: string }>;
  action?: {
    label: string;
    href?: string;
    onclick?: () => void;
    variant?: 'default' | 'primary';
  };
  backButton?: {
    href: string;
    label?: string;
  };
  class?: string;
}
```

#### 5. SidebarSection.svelte (Enhanced - Already Exists)
**Current:** Basic section wrapper  
**Needed:** Add common patterns
```typescript
interface Props {
  title: string;
  icon?: Component;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: Snippet;
  class?: string;
}
```

---

## 📋 Migration Plan

### Phase 1: Create Core Components (Day 1-2)
**Priority:** 🔴 Critical

1. **Create CrudCreateLayout.svelte**
   - Include header, main content area, sidebar
   - Error/success message handling
   - Form submission loading states
   - Responsive breakpoints

2. **Create CrudEditLayout.svelte**
   - Similar to CrudCreateLayout
   - Add danger zone section
   - Entity metadata display

3. **Create CrudDetailLayout.svelte**
   - Flexible header area
   - Content + sidebar layout
   - Action bar support

4. **Enhance PageHeader.svelte**
   - Add breadcrumb support
   - Standardize back button
   - Action button variants

### Phase 2: Migrate Admin Create Pages (Day 3-4)
**Priority:** 🔴 Critical

Migrate in this order (complexity ascending):

1. ✅ **admin/organizations/new** - Simple form
2. ✅ **admin/users/new** - Basic fields
3. ✅ **admin/tickets/new** - Medium complexity
4. ✅ **admin/projects/new** - More fields
5. ✅ **admin/blog/new** - Rich text editor
6. ✅ **admin/knowledge-base/new** - Already uses FormLayout!
7. ✅ **admin/invoices/new** - Complex (line items)
8. ✅ **admin/portfolio/new** - Media heavy

**Verification:**
- [ ] All create pages use CrudCreateLayout
- [ ] Consistent padding and spacing
- [ ] Sidebar present on all pages
- [ ] Back button functionality works
- [ ] Error/success handling consistent

### Phase 3: Migrate Admin Edit Pages (Day 5-6)
**Priority:** 🟡 High

1. ✅ **admin/users/[id]** - User profile edit
2. ✅ **admin/organizations/[id]** - Org details edit
3. ✅ **admin/projects/[id]** - Project edit
4. ✅ **admin/blog/[id]** - Blog post edit
5. ✅ **admin/tickets/[id]** - Special case (detail + edit hybrid)

**Note:** Ticket detail page has unique layout - keep as-is but standardize header

### Phase 4: Migrate App Pages (Day 7-8)
**Priority:** 🟡 High

1. ✅ **app/tickets/new** - Create ticket (client-facing)
2. ✅ **app/projects/new** - Project request
3. ✅ **app/settings/organizations/new** - Org creation

**Note:** App pages may need simplified sidebar compared to admin

### Phase 5: List Pages Standardization (Day 9)
**Priority:** 🟢 Medium

Standardize list page headers:
- admin/tickets
- admin/users
- admin/organizations
- admin/projects
- admin/blog
- app/tickets
- app/projects
- app/invoices

**Goal:** Consistent PageHeader usage

### Phase 6: Documentation Cleanup (Day 10)
**Priority:** 🟢 Low

1. Update component documentation
2. Create migration examples
3. Add Storybook stories
4. Remove outdated docs

---

## 🎨 Design System Standards

### Spacing
```css
/* Container padding */
.page-container: px-6 md:px-12 lg:px-16

/* Section padding */
.section-y: py-8 md:py-12
.section-x: px-6 md:px-12

/* Component spacing */
.gap-sections: gap-8
.gap-fields: gap-6
.gap-labels: gap-2
```

### Typography
```css
/* Page titles */
.page-title: font-display text-2xl md:text-3xl font-bold uppercase

/* Section titles */
.section-title: font-mono text-[10px] tracking-widest text-muted-foreground uppercase

/* Field labels */
.field-label: font-ui text-xs font-medium tracking-wider uppercase

/* Descriptions */
.description: font-body text-sm text-muted-foreground
```

### Grid Layout
```css
/* Main content + Sidebar */
.grid-cols-12.gap-px.bg-border

/* Main content area */
.col-span-12.lg:col-span-8.bg-background

/* Sidebar area */
.col-span-12.lg:col-span-4.bg-card
```

### Colors
```css
/* Background hierarchy */
bg-background    /* Main page bg */
bg-card          /* Sidebar bg */
bg-muted         /* Disabled/subtle bg */

/* Borders */
border-border    /* Standard borders */
```

---

## ✅ Acceptance Criteria

### Component Standards
- [ ] All CRUD create pages use CrudCreateLayout
- [ ] All CRUD edit pages use CrudEditLayout
- [ ] All detail pages use CrudDetailLayout
- [ ] All list pages use PageHeader
- [ ] Zero custom layout code in CRUD pages

### Visual Consistency
- [ ] Consistent header structure across all pages
- [ ] Consistent spacing (padding, gaps)
- [ ] Consistent typography hierarchy
- [ ] Consistent back button behavior
- [ ] Consistent error/success messaging

### Code Quality
- [ ] DRY principle applied (no layout duplication)
- [ ] Type-safe props with TypeScript
- [ ] Svelte 5 snippet syntax
- [ ] Responsive on all breakpoints
- [ ] Accessibility maintained

### Testing
- [ ] Visual regression testing
- [ ] Mobile responsive testing
- [ ] Form submission testing
- [ ] Navigation testing
- [ ] Accessibility testing

---

## 📊 Affected Files Summary

### Create Pages (15 files)
```
✅ admin/organizations/new/+page.svelte
✅ admin/users/new/+page.svelte
✅ admin/tickets/new/+page.svelte
✅ admin/projects/new/+page.svelte
✅ admin/blog/new/+page.svelte
✅ admin/knowledge-base/new/+page.svelte
✅ admin/invoices/new/+page.svelte
✅ admin/portfolio/new/+page.svelte
✅ admin/careers/[id]/+page.svelte (create mode)
✅ app/tickets/new/+page.svelte
✅ app/projects/new/+page.svelte
✅ app/settings/organizations/new/+page.svelte
```

### Edit Pages (12 files)
```
✅ admin/users/[id]/+page.svelte
✅ admin/organizations/[id]/+page.svelte
✅ admin/projects/[id]/+page.svelte
✅ admin/blog/[id]/+page.svelte
✅ admin/portfolio/[id]/+page.svelte
✅ admin/tickets/[id]/+page.svelte (special)
✅ app/settings/+page.svelte
✅ app/settings/organizations/[id]/+page.svelte
```

### List Pages (20+ files)
```
admin/tickets/+page.svelte
admin/users/+page.svelte
admin/organizations/+page.svelte
admin/projects/+page.svelte
admin/blog/+page.svelte
admin/invoices/+page.svelte
admin/knowledge-base/+page.svelte
admin/portfolio/+page.svelte
admin/careers/+page.svelte
admin/reports/+page.svelte
app/tickets/+page.svelte
app/projects/+page.svelte
app/invoices/+page.svelte
... (more)
```

**Total Affected:** ~50 pages

---

## 🚀 Implementation Timeline

### Week 1: Foundation
- **Day 1-2:** Create layout components
- **Day 3-4:** Migrate admin create pages
- **Day 5:** Testing and fixes

### Week 2: Migration
- **Day 6-7:** Migrate admin edit pages
- **Day 8-9:** Migrate app pages
- **Day 10:** List pages + header standardization

### Week 3: Polish
- **Day 11-12:** Visual QA and refinements
- **Day 13-14:** Documentation and examples
- **Day 15:** Final testing and deployment

---

## 🎯 Success Metrics

### Code Metrics
- **Before:** ~50 pages with custom layouts
- **After:** ~50 pages using 3-4 standard components
- **Code Reduction:** ~40% reduction in layout code
- **Consistency:** 100% CRUD pages follow standards

### Quality Metrics
- **Visual Consistency:** 100% pages use same spacing/typography
- **Accessibility:** WCAG 2.1 AA maintained
- **Performance:** No regression in load times
- **Type Safety:** 100% TypeScript coverage

### User Experience
- **Predictability:** Users know what to expect
- **Navigation:** Consistent back button behavior
- **Actions:** Sidebar actions in predictable location
- **Responsive:** Perfect mobile experience

---

## 📚 Related Documentation

- [Reusable Components Guide](./REUSABLE_COMPONENTS.md)
- [Design System](../DESIGN_SYSTEM.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Testing Checklist](./TESTING_DEPLOYMENT_CHECKLIST.md)

---

## 🔄 Next Steps

1. **Review and Approve Plan** - Team review of standardization approach
2. **Create Component Prototypes** - Build CrudCreateLayout first
3. **Pilot Migration** - Test with 2-3 simple pages
4. **Full Migration** - Roll out to all CRUD pages
5. **Documentation** - Update guides and examples

---

**Status:** 🔴 Awaiting approval to proceed with Phase 1

**Estimated Effort:** 3 weeks (1 developer)

**Risk Level:** 🟡 Medium (many files affected, but changes are straightforward)
