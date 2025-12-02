---
title: "Sheet"
description: "A panel that slides out from the edge of the screen."
category: "components"
order: 23
---

# Sheet

A panel that slides out from the edge of the screen.

## Installation

```ts
import * as Sheet from '$lib/components/ui/sheet';
```

## Default

A standard sheet sliding from the right.

```svelte live
<Sheet.Root>
  <Sheet.Trigger>
    <Button variant="outline">Open Sheet</Button>
  </Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Sheet Title</Sheet.Title>
      <Sheet.Description>Sheet description goes here.</Sheet.Description>
    </Sheet.Header>
    <div class="py-4">
      <p>Sheet content goes here.</p>
    </div>
  </Sheet.Content>
</Sheet.Root>
```

## Props

### Sheet.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |

### Sheet.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` |
| `class` | `string` | `""` |
