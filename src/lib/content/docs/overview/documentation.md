---
title: "Documentation"
description: "Learn about the structure of our documentation system and how content is organized."
category: "overview"
order: 2
slug: "documentation"
---

# Documentation

Learn about the structure of our documentation system and how content is organized.

## Structure

Our documentation is organized into three main categories:

| Category | Description |
|----------|-------------|
| **Overview** | Introduction, principles, and getting started guides |
| **Foundation** | Core design tokens: grid, colors, typography, spacing, animations |
| **Components** | Interactive UI components with live examples |

## Content Location

All documentation content is stored as Markdown files:

```
src/lib/content/docs/
├── overview/
│   ├── introduction.md
│   ├── documentation.md
│   ├── principles.md
│   └── getting-started.md
├── foundation/
│   ├── grid.md
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   └── animations.md
└── components/
    ├── button.md
    ├── badge.md
    └── ...
```

## Frontmatter

Each documentation file requires frontmatter with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Display title for the page |
| `description` | string | Brief description shown in header |
| `category` | string | `overview`, `foundation`, or `components` |
| `order` | number | Sort order within category |
| `slug` | string | URL-friendly identifier |

## Example Frontmatter

```yaml
---
title: "Button"
description: "Displays a button or a component that looks like a button."
category: "components"
order: 1
slug: "button"
---
```

## Live Examples

Component documentation supports live examples using the `live` marker:

````markdown
```svelte live
<Button>Click Me</Button>
```
````

The `ComponentDocRenderer` will render both a live preview and the code.

## URL Deep-Linking

Documentation pages support URL parameters for sharing:

```
/docs?category=design-system&section=button
```

| Parameter | Description |
|-----------|-------------|
| `category` | `design-system`, `products`, or `api` |
| `section` | The `slug` of the documentation page |

