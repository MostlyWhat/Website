---
title: "Separator"
description: "Visually or semantically separates content."
category: "components"
order: 15
---

# Separator

Visually or semantically separates content.

## Installation

```ts
import { Separator } from '$lib/components/ui/separator';
```

## Default (Horizontal)

```svelte
<div>
  <h4 class="text-sm font-medium">MostlyWhat Systems</h4>
  <p class="text-sm text-muted-foreground">An open-source design system.</p>
</div>
<Separator class="my-4" />
<div>
  <p>Content below the separator.</p>
</div>
```

## Vertical

```svelte
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator orientation="vertical" />
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Source</div>
</div>
```

## In Navigation

```svelte
<nav class="flex items-center space-x-4">
  <a href="/">Home</a>
  <Separator orientation="vertical" class="h-4" />
  <a href="/about">About</a>
  <Separator orientation="vertical" class="h-4" />
  <a href="/contact">Contact</a>
</nav>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `decorative` | `boolean` | `true` |
| `class` | `string` | `undefined` |

> [!NOTE]
> When `decorative` is false, the separator will be announced to screen readers. Use this when the separator conveys meaningful structure.
