# CRUD Page Quick Reference Guide

**Quick guide for developers working on CRUD pages**

---

## 📋 Component Selection

| Page Type | Component | Use Case |
|-----------|-----------|----------|
| **Create** | `CrudCreateLayout` | Adding new entities |
| **Edit** | `CrudEditLayout` | Modifying existing entities |
| **Detail** | `CrudDetailLayout` | Viewing entity details (read-only) |
| **List** | `PageHeader` + custom table | Listing/searching entities |

---

## 🚀 Quick Start Templates

### Create Page Template

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { Save } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import CrudCreateLayout from '$lib/components/layout/CrudCreateLayout.svelte';

  let { data, form } = $props();

  // Form state
  let field1 = $state('');
  let field2 = $state('');
  let isSubmitting = $state(false);

  // Handle success
  $effect(() => {
    if (form?.success && form?.message) {
      toast.success(form.message);
      setTimeout(() => goto('/admin/entities'), 1500);
    }
  });
</script>

<svelte:head>
  <title>New Entity | Admin</title>
</svelte:head>

<CrudCreateLayout
  title="Create Entity"
  description="Add a new entity to the system."
  backHref={localizeHref('/admin/entities')}
  errorMessage={form?.error}
  successMessage={form?.success ? form.message : undefined}
>
  {#snippet children()}
    <form method="POST" use:enhance={...} class="space-y-8">
      <!-- Main form fields here -->
      
      <div class="flex items-center gap-4 border-t border-border pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          class="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save class="h-4 w-4" />
          <span class="font-mono text-xs tracking-wider">
            {isSubmitting ? 'SAVING...' : 'SAVE ENTITY'}
          </span>
        </button>
        <a
          href={localizeHref('/admin/entities')}
          class="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-card"
        >
          <span class="font-mono text-xs tracking-wider">CANCEL</span>
        </a>
      </div>
    </form>
  {/snippet}

  {#snippet sidebar()}
    <div class="space-y-6">
      <!-- Sidebar guides/helpers -->
      <div>
        <span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK GUIDE</span>
        <div class="mt-3 space-y-2">
          <div class="rounded bg-muted/30 p-3">
            <div class="font-ui text-xs font-semibold">Tip 1</div>
            <p class="font-body text-xs text-muted-foreground mt-1">Helper text...</p>
          </div>
        </div>
      </div>
    </div>
  {/snippet}
</CrudCreateLayout>
```

### Edit Page Template

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { Save, Trash2, ExternalLink } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import CrudEditLayout from '$lib/components/layout/CrudEditLayout.svelte';

  let { data, form } = $props();

  // Form state (initialized from loaded data)
  let field1 = $state(data.entity.field1);
  let field2 = $state(data.entity.field2);
  let isSubmitting = $state(false);

  $effect(() => {
    if (form?.success && form?.message) {
      toast.success(form.message);
    }
  });
</script>

<svelte:head>
  <title>Edit: {data.entity.name} | Admin</title>
</svelte:head>

<CrudEditLayout
  title="Edit Entity"
  entityName={data.entity.name}
  backHref={localizeHref('/admin/entities')}
  errorMessage={form?.error}
  successMessage={form?.success ? form.message : undefined}
>
  {#snippet header()}
    <!-- Optional custom header content (view buttons, etc) -->
    <a
      href={localizeHref(`/entities/${data.entity.slug}`)}
      target="_blank"
      class="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card"
    >
      <ExternalLink class="h-4 w-4" />
      <span class="font-mono text-xs tracking-wider">VIEW ENTITY</span>
    </a>
  {/snippet}

  {#snippet children()}
    <form method="POST" action="?/update" use:enhance={...} class="space-y-8">
      <!-- Main form fields -->
      
      <div class="flex items-center gap-4 border-t border-border pt-8">
        <button type="submit" disabled={isSubmitting} class="...">
          <Save class="h-4 w-4" />
          <span class="font-mono text-xs tracking-wider">
            {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
          </span>
        </button>
        <a href={localizeHref('/admin/entities')} class="...">
          <span class="font-mono text-xs tracking-wider">CANCEL</span>
        </a>
      </div>
    </form>
  {/snippet}

  {#snippet sidebar()}
    <div class="space-y-6">
      <!-- Metadata, settings, etc -->
    </div>
  {/snippet}

  {#snippet dangerZone()}
    <form method="POST" action="?/delete" use:enhance>
      <button
        type="submit"
        class="inline-flex w-full items-center justify-center gap-2 border border-red-500 bg-red-500 px-4 py-3 text-sm text-white transition-colors hover:bg-red-600"
      >
        <Trash2 class="h-4 w-4" />
        <span class="font-mono text-xs tracking-wider">DELETE ENTITY</span>
      </button>
    </form>
  {/snippet}
</CrudEditLayout>
```

---

## 🎨 Standard Form Elements

### Text Input

```svelte
<div class="space-y-2">
  <label for="field" class="font-mono text-[10px] tracking-widest text-muted-foreground">
    FIELD LABEL *
  </label>
  <input
    type="text"
    id="field"
    name="field"
    bind:value={field}
    required
    class="font-ui w-full border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
    placeholder="Placeholder text..."
  />
</div>
```

### Textarea

```svelte
<div class="space-y-2">
  <label for="field" class="font-mono text-[10px] tracking-widest text-muted-foreground">
    FIELD LABEL
  </label>
  <textarea
    id="field"
    name="field"
    bind:value={field}
    rows="3"
    class="font-body w-full resize-none border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
    placeholder="Placeholder text..."
  ></textarea>
</div>
```

### Select

```svelte
<div class="space-y-2">
  <label for="field" class="font-mono text-[10px] tracking-widest text-muted-foreground">
    FIELD LABEL *
  </label>
  <select
    id="field"
    name="field"
    bind:value={field}
    required
    class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
  >
    <option value="">Select an option...</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </select>
</div>
```

### Checkbox

```svelte
<label class="flex items-center gap-3">
  <input
    type="checkbox"
    name="field"
    value="true"
    bind:checked={field}
    class="h-4 w-4 border border-border bg-background text-primary focus:ring-primary"
  />
  <span class="font-ui text-sm">Checkbox label</span>
</label>
```

### Radio Buttons

```svelte
<div class="space-y-3">
  <label class="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors hover:border-primary {value === 'option1' ? 'border-primary bg-primary/5' : ''}">
    <input
      type="radio"
      name="field"
      value="option1"
      bind:group={value}
      class="sr-only"
    />
    <div class="flex h-5 w-5 items-center justify-center border {value === 'option1' ? 'border-primary bg-primary' : 'border-border'}">
      {#if value === 'option1'}
        <div class="h-2 w-2 bg-background"></div>
      {/if}
    </div>
    <div>
      <div class="font-ui text-xs font-semibold">Option 1</div>
      <p class="font-body text-xs text-muted-foreground">Description</p>
    </div>
  </label>
</div>
```

---

## 📦 Sidebar Sections

### Standard Section

```svelte
<div class="border-t border-border pt-6">
  <div class="flex items-center gap-2 mb-3">
    <Icon class="h-4 w-4 text-primary" />
    <span class="font-mono text-[10px] tracking-widest text-muted-foreground">SECTION NAME</span>
  </div>
  
  <div class="space-y-4">
    <!-- Section content -->
  </div>
</div>
```

### Help Card

```svelte
<div class="rounded bg-muted/30 p-3">
  <div class="font-ui text-xs font-semibold">Tip Title</div>
  <p class="font-body text-xs text-muted-foreground mt-1">
    Helper text or guidance...
  </p>
</div>
```

### Stats Display

```svelte
<div class="grid grid-cols-2 gap-4">
  <div class="border border-border bg-background p-3">
    <span class="font-mono text-[10px] text-muted-foreground">METRIC</span>
    <p class="font-display mt-1 text-xl font-bold">{value}</p>
  </div>
</div>
```

---

## ⚠️ Common Pitfalls

### ❌ Don't

```svelte
<!-- Don't use hardcoded colors -->
<div class="bg-blue-500">...</div>

<!-- Don't duplicate layout logic -->
<div class="container max-w-6xl grid grid-cols-12">...</div>

<!-- Don't use inline styles -->
<div style="margin-top: 20px">...</div>

<!-- Don't forget required attribute -->
<input name="field" />
```

### ✅ Do

```svelte
<!-- Use design system tokens -->
<div class="bg-primary">...</div>

<!-- Use layout components -->
<CrudCreateLayout>...</CrudCreateLayout>

<!-- Use Tailwind classes -->
<div class="mt-5">...</div>

<!-- Mark required fields -->
<input name="field" required />
```

---

## 🔍 Testing Checklist

Before committing a new CRUD page:

- [ ] Run `pnpm check` - 0 errors, 0 warnings
- [ ] Test form submission (success & error cases)
- [ ] Test back button navigation
- [ ] Test mobile responsive (stack columns)
- [ ] Test required field validation
- [ ] Test error message display
- [ ] Test success message & redirect
- [ ] Check accessibility (labels, ARIA)
- [ ] Verify consistent styling with other pages
- [ ] Test with real data (not just placeholders)

---

## 📚 Reference Links

- **Full Documentation**: `/docs/CRUD_PAGE_STANDARDIZATION_PLAN.md`
- **Migration Progress**: `/CRUD_MIGRATION_PROGRESS.md`
- **Complete Summary**: `/CRUD_STANDARDIZATION_COMPLETE_SUMMARY.md`
- **Component Files**: `/src/lib/components/layout/`

---

## 💡 Pro Tips

1. **Copy from existing**: Start with a similar migrated page
2. **Validate early**: Run `pnpm check` frequently
3. **Test incrementally**: Don't wait until the end
4. **Keep sidebar organized**: Group related fields
5. **Use consistent naming**: Follow established patterns
6. **Document edge cases**: Comment unusual logic
7. **Think mobile-first**: Test responsive behavior
8. **Preserve functionality**: Don't lose features during migration

---

*Last Updated: December 10, 2024*
