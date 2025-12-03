---
title: "Scroll Area"
description: "Augments native scroll functionality for custom styling."
category: "components"
order: 24
---

# Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

## Installation

```ts
import { ScrollArea } from '$lib/components/ui/scroll-area';
```

## Default

A scrollable container with custom scrollbar.

```svelte live
<ScrollArea class="h-48 w-48 border border-border">
  <div class="p-4">
    {#each Array(20) as _, i}
      <div class="py-2 text-sm">Item {i + 1}</div>
    {/each}
  </div>
</ScrollArea>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `orientation` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` |
| `class` | `string` | `""` |
