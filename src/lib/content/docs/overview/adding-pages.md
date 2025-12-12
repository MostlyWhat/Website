---
title: "Adding Pages"
description: "Step-by-step guide on how to add new documentation pages to the system."
category: "overview"
order: 4
slug: "adding-pages"
---

# Adding Pages

Step-by-step guide on how to add new documentation pages to the system.

## Quick Start

1. Create a new `.md` file in the appropriate category folder
2. Add the required frontmatter
3. Write your content in Markdown
4. The page appears automatically in the sidebar

## Step 1: Choose Category

Decide which category your documentation belongs to:

| Category | Location | Use For |
|----------|----------|---------|
| Overview | `docs/overview/` | Introductions, guides, concepts |
| Foundation | `docs/foundation/` | Design tokens, grids, colors |
| Components | `docs/components/` | UI component documentation |

## Step 2: Create File

Create a new Markdown file in `src/lib/content/docs/{category}/`:

```bash
# Example: New foundation page
touch src/lib/content/docs/foundation/icons.md

# Example: New component page  
touch src/lib/content/docs/components/toast.md
```

## Step 3: Add Frontmatter

Start your file with required frontmatter:

```yaml
---
title: "Icons"
description: "Icon system and usage guidelines."
category: "foundation"
order: 6
slug: "icons"
---
```

## Step 4: Write Content

Use standard Markdown with our design system styling:

```markdown
# Icons

Icon system and usage guidelines.

## Installation

Install the icon library...

## Usage

| Size | Class | Use Case |
|------|-------|----------|
| Small | `h-4 w-4` | Inline icons |
| Default | `h-5 w-5` | Buttons, cards |
| Large | `h-6 w-6` | Feature icons |
```

## Adding Live Examples

For component docs, use `svelte live` code blocks:

````markdown
## Basic Usage

```svelte live
<Button>Click Me</Button>
<Button variant="secondary">Secondary</Button>
```
````

## Sidebar Configuration

The sidebar is configured in `+page.svelte`. To add a new section:

```typescript
const sidebarNav = {
  'design-system': [
    {
      title: 'FOUNDATION',
      sections: [
        // Add your new page here
        { id: 'icons', title: 'Icons', icon: Paintbrush }
      ]
    }
  ]
};
```

## Icon Mapping

For component pages, add an icon mapping:

```typescript
const componentIcons: Record<string, typeof Grid3x3> = {
  'button': MousePointer,
  'toast': Bell,  // Add your component
};
```

## Testing

1. Start the dev server: `pnpm dev`
2. Navigate to `/docs`
3. Select your category and section
4. Verify content renders correctly
5. Test URL sharing: `/docs?section=your-slug`

## Best Practices

### File Naming

- Use lowercase with hyphens: `alert-dialog.md`
- Match the slug to the filename
- Keep names concise

### Content Structure

```markdown
# Component Name

Brief description.

## Installation

How to import.

## Basic Usage

```svelte live
<!-- Live example -->
```

## Variants

Different variations with examples.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |
```

### Design System Compliance

- Use `font-ui` for labels and buttons
- Use `font-mono` for code references
- Keep text uppercase for headings
- Follow the color system: primary, secondary, destructive

