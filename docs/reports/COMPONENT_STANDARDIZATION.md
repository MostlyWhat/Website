# Component Standardization Guide

## Overview

All components have been standardized to use shadcn-svelte ui components as the foundation. This creates consistency, reduces duplication, and makes the codebase more maintainable.

## New Component Structure

```
src/lib/components/ui/
├── data-display/          # Display components
│   ├── stat-card.svelte
│   ├── empty-state.svelte
│   ├── info-card.svelte
│   └── data-list.svelte
├── form-fields/           # Form field wrappers with validation
│   ├── text-field.svelte
│   ├── textarea-field.svelte
│   ├── select-field.svelte
│   ├── checkbox-field.svelte
│   └── switch-field.svelte
├── navigation/            # Navigation components
│   ├── breadcrumbs.svelte
│   ├── back-link.svelte
│   └── pagination.svelte
└── sections/              # Page section components
    ├── page-header.svelte
    ├── section-header.svelte
    ├── page-section.svelte
    └── grid-section.svelte
```

## Renamed Layouts

**Old Names** → **New Names**:
- `CrudCreateLayout` → `CreatePageLayout`
- `CrudDetailLayout` → `DetailPageLayout`
- `CrudEditLayout` → `EditPageLayout`

## Form System Integration

All form-fields components now integrate with shadcn-svelte's Form system:

### With Form Validation (Recommended)

```svelte
<script>
  import { superForm } from 'sveltekit-superforms/client';
  import { TextField, TextareaField } from '$lib/components/ui/form-fields';
  
  export let data;
  const form = superForm(data.form);
</script>

<form method="POST" use:form.enhance>
  <TextField
    {form}
    name="email"
    label="Email Address"
    description="We'll never share your email"
  />
  
  <TextareaField
    {form}
    name="message"
    label="Message"
    description="Tell us what you think"
  />
</form>
```

### Without Form Validation (Fallback)

```svelte
<TextField
  name="search"
  label="Search"
  bind:value={searchQuery}
  placeholder="Search..."
/>
```

## Example: Refactored Admin Page

### Before (Old Pattern)

```svelte
<script>
  import CrudCreateLayout from '$lib/components/layout/CrudCreateLayout.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  
  // Manual field handling
</script>

<CrudCreateLayout title="New Project" backHref="/admin/projects">
  {#snippet children()}
    <div class="space-y-6">
      <div>
        <Label for="name">Project Name *</Label>
        <Input id="name" name="name" required />
      </div>
    </div>
  {/snippet}
</CrudCreateLayout>
```

### After (New Pattern)

```svelte
<script>
  import { CreatePageLayout } from '$lib/components/layout';
  import * as Card from '$lib/components/ui/card';
  import { TextField } from '$lib/components/ui/form-fields';
</script>

<CreatePageLayout
  title="New Project"
  backHref="/admin/projects"
  breadcrumbs={[
    { label: 'Admin', href: '/admin' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'New', href: '/admin/projects/new' }
  ]}
>
  {#snippet children()}
    <form method="POST" class="space-y-6">
      <Card.Root>
        <Card.Header>
          <Card.Title>Basic Information</Card.Title>
          <Card.Description>Enter the project details</Card.Description>
        </Card.Header>
        <Card.Content>
          <TextField
            name="name"
            label="Project Name"
            placeholder="e.g., Website Redesign"
            required
          />
        </Card.Content>
      </Card.Root>
    </form>
  {/snippet}
</CreatePageLayout>
```

## Benefits

1. **Consistency**: All pages use the same components and patterns
2. **Less Code**: Reduced duplication with reusable field components
3. **Better Validation**: Integrated with Form component for error handling
4. **Cleaner Imports**: All ui components come from organized groups
5. **Easier Maintenance**: Changes to one component affect all usages

## Migration Checklist

For each page being refactored:

- [ ] Replace `CrudCreateLayout` → `CreatePageLayout`
- [ ] Replace `CrudDetailLayout` → `DetailPageLayout`
- [ ] Replace `CrudEditLayout` → `EditPageLayout`
- [ ] Wrap related fields in `Card.Root` components
- [ ] Replace manual Label + Input pairs with `TextField`
- [ ] Replace manual Label + Textarea pairs with `TextareaField`
- [ ] Replace manual Label + Select pairs with `SelectField`
- [ ] Add breadcrumbs for better navigation
- [ ] Use `InfoCard` for messages instead of custom markup
- [ ] Use `StatCard` for metrics displays
- [ ] Use `EmptyState` for empty data states

## Next Steps

1. Continue refactoring admin pages (44 total)
2. Refactor app pages (26 total)
3. Refactor marketing pages (20 total)
4. Remove old duplicate components
5. Run type checks and validation
