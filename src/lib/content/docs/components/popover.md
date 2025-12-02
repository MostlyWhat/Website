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

```svelte
<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open Popover</Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content>
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Dimensions</h4>
        <p class="text-sm text-muted-foreground">
          Set the dimensions for the layer.
        </p>
      </div>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="width">Width</Label>
          <Input id="width" value="100%" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="height">Height</Label>
          <Input id="height" value="25px" class="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
```

## Placement

```svelte
<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Top</Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content side="top">
    <p>Popover on top</p>
  </Popover.Content>
</Popover.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Popover.Root` | The root component that manages state |
| `Popover.Trigger` | The element that opens the popover |
| `Popover.Content` | The popover content |

## Props

### Popover.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `onOpenChange` | `(open: boolean) => void` | `undefined` |

### Popover.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` |
| `sideOffset` | `number` | `4` |
| `align` | `"start" \| "center" \| "end"` | `"center"` |

> [!TIP]
> Use popovers for complex interactions that need more space than a tooltip but don't warrant a full dialog.
