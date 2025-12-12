---
title: "Separator"
description: "Visually separates content."
category: "components"
order: 15
---

# Separator

Visually separates content.

## Installation

```ts
import { Separator } from '$lib/components/ui/separator';
```

## Horizontal

A horizontal separator (default).

```svelte live
<div>
  <div>Section One</div>
  <Separator class="my-4" />
  <div>Section Two</div>
</div>
```

## Vertical

A vertical separator for inline content.

```svelte live
<div class="flex h-5 items-center space-x-4 text-sm">
  <span>Home</span>
  <Separator orientation="vertical" />
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Components</span>
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `class` | `string` | `""` |
