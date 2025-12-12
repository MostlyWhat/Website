---
title: "Popover"
description: "Displays rich content in a portal, triggered by a button."
category: "components"
order: 21
---

# Popover

Displays rich content in a portal, triggered by a button.

## Installation

```ts
import * as Popover from '$lib/components/ui/popover';
```

## Default

A standard popover with content.

```svelte live
<Popover.Root>
  <Popover.Trigger>
    <Button variant="outline">Open Popover</Button>
  </Popover.Trigger>
  <Popover.Content class="w-80">
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Popover Title</h4>
        <p class="text-sm text-muted-foreground">Popover content goes here.</p>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
```

## Props

### Popover.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` |
| `align` | `"start" \| "center" \| "end"` | `"center"` |
| `sideOffset` | `number` | `4` |
| `class` | `string` | `""` |
