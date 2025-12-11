# Reusable UI Components

**Last Updated:** January 2025

## Overview

This document describes the new reusable UI components extracted from common patterns across the application.

---

## EmptyState Component

**Location:** `src/lib/components/ui/empty-state.svelte`

### Purpose
Displays a consistent empty state when no data is available, with optional icon, description, and action button.

### Props

```typescript
interface Props {
  /** Icon component from lucide-svelte */
  icon?: Component;
  /** Icon size in pixels (default: 48) */
  iconSize?: number;
  /** Title text (required) */
  title: string;
  /** Description text (optional) */
  description?: string;
  /** Action button text (optional) */
  actionText?: string;
  /** Action button click handler (optional) */
  onAction?: () => void;
  /** Custom class for container (optional) */
  class?: string;
}
```

### Usage Examples

```svelte
<script>
  import EmptyState from '$lib/components/ui/empty-state.svelte';
  import { FileQuestion, Plus } from '@lucide/svelte';
</script>

<!-- Simple empty state -->
<EmptyState title="NO TICKETS FOUND" />

<!-- With description -->
<EmptyState 
  title="NO PROJECTS YET"
  description="Start by creating your first project"
/>

<!-- Full featured -->
<EmptyState 
  icon={FileQuestion}
  iconSize={64}
  title="NO DATA AVAILABLE"
  description="Try adjusting your search filters or create new content"
  actionText="Create New"
  onAction={() => goto('/app/tickets/new')}
  class="my-8"
/>
```

### Replaced Patterns

Previously used patterns (21 instances):
- `<p>No data available</p>`
- `<div class="text-center"><h3>NO TICKETS YET</h3></div>`
- `<div class="empty-state">{emptyMessage}</div>`

---

## LoadingState Component

**Location:** `src/lib/components/ui/loading-state.svelte`

### Purpose
Displays a consistent loading indicator with optional message and size variants.

### Props

```typescript
interface Props {
  /** Loading message (default: "Loading...") */
  message?: string;
  /** Size of the spinner: 'sm' | 'md' | 'lg' (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class for container (optional) */
  class?: string;
  /** Whether to show full screen overlay (default: false) */
  fullScreen?: boolean;
}
```

### Size Variants

- `sm`: 16px spinner (h-4 w-4) - for inline/button loading
- `md`: 32px spinner (h-8 w-8) - for content areas
- `lg`: 48px spinner (h-12 w-12) - for page loading

### Usage Examples

```svelte
<script>
  import LoadingState from '$lib/components/ui/loading-state.svelte';
</script>

<!-- Simple loading -->
<LoadingState />

<!-- Small inline loading -->
<LoadingState size="sm" message="Saving..." />

<!-- Large page loading -->
<LoadingState size="lg" message="Loading tickets..." />

<!-- Full screen overlay -->
<LoadingState fullScreen message="Processing..." />

<!-- In a button -->
<Button disabled={isLoading}>
  {#if isLoading}
    <LoadingState size="sm" message="" class="inline-block mr-2" />
  {/if}
  Submit
</Button>
```

### Replaced Patterns

Previously used patterns (30+ instances):
- `<Loader2 class="h-4 w-4 animate-spin" />`
- `<Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />`
- `{#if isLoading}<Loader2 ... />{/if}`
- Skeleton loading states

---

## StatsCard Component

**Location:** `src/lib/components/ui/stats-card.svelte`

### Purpose
Displays a metric/statistic card with optional icon, trend indicator, and click handler.

### Props

```typescript
interface Props {
  /** Card title/label (required) */
  label: string;
  /** Main value to display (required) */
  value: string | number;
  /** Icon component from lucide-svelte (optional) */
  icon?: Component;
  /** Trend direction: 'up' | 'down' | 'neutral' (optional) */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend percentage or text (optional) */
  trendValue?: string;
  /** Description text (optional) */
  description?: string;
  /** Custom class for card (optional) */
  class?: string;
  /** Click handler - makes card clickable (optional) */
  onclick?: () => void;
}
```

### Usage Examples

```svelte
<script>
  import StatsCard from '$lib/components/ui/stats-card.svelte';
  import { Users, TrendingUp, Ticket } from '@lucide/svelte';
</script>

<!-- Simple stat -->
<StatsCard 
  label="Total Users"
  value="1,234"
/>

<!-- With icon -->
<StatsCard 
  label="Open Tickets"
  value={42}
  icon={Ticket}
/>

<!-- With trend -->
<StatsCard 
  label="Revenue"
  value="$12,345"
  trend="up"
  trendValue="+15%"
/>

<!-- Fully featured -->
<StatsCard 
  label="Active Projects"
  value={28}
  icon={Users}
  trend="up"
  trendValue="+5"
  description="Projects currently in progress"
  onclick={() => goto('/admin/projects?status=active')}
  class="hover:shadow-lg"
/>

<!-- In a grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatsCard label="Total" value="150+" />
  <StatsCard label="Active" value="45" trend="up" trendValue="+12%" />
  <StatsCard label="Closed" value="105" trend="down" trendValue="-8%" />
</div>
```

### Replaced Patterns

Previously used patterns (20+ instances):
- `stats={[{ label: 'Total', value: '150+' }]}`
- Custom stats grid implementations
- AnalyticsDashboard metrics displays
- Marketing page stats sections

---

## Migration Guide

### 1. Replacing Empty States

**Before:**
```svelte
{#if tickets.length === 0}
  <div class="text-center py-8">
    <h3 class="font-ui text-lg font-semibold tracking-wider">NO TICKETS YET</h3>
    <p class="text-muted-foreground">Create your first ticket</p>
  </div>
{/if}
```

**After:**
```svelte
<script>
  import EmptyState from '$lib/components/ui/empty-state.svelte';
</script>

{#if tickets.length === 0}
  <EmptyState 
    title="NO TICKETS YET"
    description="Create your first ticket"
  />
{/if}
```

### 2. Replacing Loading States

**Before:**
```svelte
{#if isLoading}
  <Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />
  <p class="text-center text-muted-foreground">Loading...</p>
{/if}
```

**After:**
```svelte
<script>
  import LoadingState from '$lib/components/ui/loading-state.svelte';
</script>

{#if isLoading}
  <LoadingState message="Loading..." />
{/if}
```

### 3. Replacing Stats Cards

**Before:**
```svelte
<div class="border border-border bg-card p-6">
  <p class="font-mono text-[10px] tracking-widest text-muted-foreground">
    TOTAL ARTICLES
  </p>
  <p class="font-display mt-2 text-3xl font-bold">150+</p>
</div>
```

**After:**
```svelte
<script>
  import StatsCard from '$lib/components/ui/stats-card.svelte';
</script>

<StatsCard label="Total Articles" value="150+" />
```

---

## Design Tokens

All components use consistent design tokens:

### Typography
- Labels: `font-mono text-[10px] tracking-widest uppercase`
- Titles: `font-ui text-lg font-semibold tracking-wider uppercase`
- Values: `font-display text-3xl font-bold`
- Descriptions: `font-body text-sm text-muted-foreground`

### Colors
- Background: `bg-card`, `bg-muted`, `bg-background`
- Borders: `border-border`
- Text: `text-primary`, `text-muted-foreground`
- Trends: 
  - Up: `text-green-500`
  - Down: `text-red-500`
  - Neutral: `text-muted-foreground`

### Spacing
- Padding: `p-4`, `p-6`, `py-12`
- Gaps: `gap-2`, `gap-4`, `gap-6`
- Margins: `mb-2`, `mb-4`, `mt-2`, `mt-4`

---

## Best Practices

### EmptyState
- Use descriptive, action-oriented titles
- Provide context in descriptions
- Include action buttons when users can create/add content
- Use appropriate icons (FileQuestion, Inbox, FolderOpen, etc.)

### LoadingState
- Use `sm` size for buttons and inline elements
- Use `md` size for content sections
- Use `lg` size for full page loads
- Use `fullScreen` sparingly for critical operations
- Provide meaningful loading messages

### StatsCard
- Keep labels concise (2-3 words)
- Format large numbers with commas or suffixes (1,234 or 1.2K)
- Use icons that represent the metric
- Only add trends when meaningful
- Make cards clickable if they link to detailed views

---

## Accessibility

All components follow accessibility best practices:

- **EmptyState**: Proper heading hierarchy, semantic HTML
- **LoadingState**: Visual-only (aria-hidden for screen readers recommended)
- **StatsCard**: Keyboard navigation when clickable, proper roles and tabindex

---

## Testing Checklist

- [ ] EmptyState renders with all prop combinations
- [ ] LoadingState displays correct sizes
- [ ] StatsCard shows trends correctly
- [ ] Components work in light/dark mode
- [ ] Responsive behavior on mobile
- [ ] Keyboard navigation for clickable elements
- [ ] Icons load correctly from @lucide/svelte

---

## Future Enhancements

### EmptyState
- [ ] Animation variants (fade in, slide up)
- [ ] Illustration support (SVG)
- [ ] Custom icon colors

### LoadingState
- [ ] Skeleton variant for content placeholders
- [ ] Progress bar variant
- [ ] Custom animations

### StatsCard
- [ ] Sparkline chart integration
- [ ] Comparison mode (current vs previous)
- [ ] Custom color themes
- [ ] Export functionality
