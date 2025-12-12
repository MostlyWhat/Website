---
title: "Getting Started"
description: "Everything you need to start building with the MostlyWhat design system."
category: "overview"
order: 3
slug: "getting-started"
---

# Getting Started

Everything you need to start building with the MostlyWhat design system.

## Installation

The design system is built into this SvelteKit project. All components are available in `$lib/components/ui/`.

```ts
// Import components from the UI library
import Button from '$lib/components/ui/button/button.svelte';
import { Badge } from '$lib/components/ui/badge';
import { Input } from '$lib/components/ui/input';
import * as Card from '$lib/components/ui/card';
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/          # UI components
│   │   └── layout/      # Layout components
│   ├── actions/         # Svelte actions
│   └── utils/           # Utility functions
├── routes/              # SvelteKit routes
└── app.css              # Global styles
```

## Key Concepts

### Responsive Padding

Use consistent padding across all breakpoints:

| Breakpoint | Class | Value |
|------------|-------|-------|
| Mobile | `px-6` | 24px |
| Tablet | `md:px-12` | 48px |
| Desktop | `lg:px-16` | 64px |

### Grid System

Always use a 12-column grid with `grid-cols-12`:

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 md:col-span-6 lg:col-span-4 bg-background">
    Content
  </div>
</div>
```

### Scroll Animations

Add scroll-based animations using the `scrollAnimate` action:

```svelte
<script>
  import { scrollAnimate } from '$lib/actions/scroll-animate';
</script>

<div use:scrollAnimate={{ animation: 'fade' }}>
  Content animates on scroll
</div>
```

Available animations: `fade`, `slide-left`, `slide-right`, `scale`, `stagger`
