# Layout Components Organization

## Structure

The layout components have been reorganized into logical subdirectories for better maintainability:

```
layout/
├── page/              # Page-level layouts
│   ├── CreatePageLayout.svelte
│   ├── DetailPageLayout.svelte
│   ├── EditPageLayout.svelte
│   ├── PageHeader.svelte
│   └── SlugPageLayout.svelte
├── section/           # Section components
│   ├── BackLinkSection.svelte
│   ├── BackToSection.svelte
│   ├── CapabilitiesSection.svelte
│   ├── CTASection.svelte
│   ├── DescriptionSection.svelte
│   ├── HeroSection.svelte
│   ├── LinkCTASection.svelte
│   ├── Section.svelte
│   ├── SectionHeader.svelte
│   ├── SidebarSection.svelte
│   └── WideNavSection.svelte
├── navigation/        # Navigation components
│   ├── Header.svelte
│   ├── Footer.svelte
│   └── MobileNav.svelte
├── form/              # Form-related components
│   ├── FormLayout.svelte
│   ├── MobileForm.svelte
│   └── FieldLabel.svelte
└── [utility components] # Remaining components

## Usage

All components are re-exported from `index.ts` for convenient importing:

```typescript
// Import from the main layout module (recommended)
import { CreatePageLayout, HeroSection, Header } from '$lib/components/layout';

// Or import directly from subdirectories
import CreatePageLayout from '$lib/components/layout/page/CreatePageLayout.svelte';
```

## Deprecated

The following CRUD-prefixed layouts have been removed:
- ❌ `CrudCreateLayout` → Use `CreatePageLayout`
- ❌ `CrudDetailLayout` → Use `DetailPageLayout`
- ❌ `CrudEditLayout` → Use `EditPageLayout`

All pages have been migrated to use the new standardized layouts.

## Benefits

1. **Better Organization**: Components are grouped by function
2. **Easier Navigation**: Find components faster
3. **Clearer Dependencies**: Understand component relationships
4. **Consistent Exports**: All components available from index
