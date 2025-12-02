---
title: "Sheet"
description: "Extends the Dialog component to display content that complements the main content of the screen."
category: "components"
order: 23
---

# Sheet

Extends the Dialog component to display content that complements the main content of the screen.

## Installation

```ts
import * as Sheet from '$lib/components/ui/sheet';
```

## Default (Right)

```svelte
<Sheet.Root>
  <Sheet.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open Sheet</Button>
    {/snippet}
  </Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Edit Profile</Sheet.Title>
      <Sheet.Description>
        Make changes to your profile here. Click save when you're done.
      </Sheet.Description>
    </Sheet.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close>
        {#snippet child({ props })}
          <Button {...props}>Save Changes</Button>
        {/snippet}
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

## Sides

```svelte
<!-- Left -->
<Sheet.Root>
  <Sheet.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Left</Button>
    {/snippet}
  </Sheet.Trigger>
  <Sheet.Content side="left">
    <Sheet.Header>
      <Sheet.Title>Left Sheet</Sheet.Title>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>

<!-- Top -->
<Sheet.Root>
  <Sheet.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Top</Button>
    {/snippet}
  </Sheet.Trigger>
  <Sheet.Content side="top">
    <Sheet.Header>
      <Sheet.Title>Top Sheet</Sheet.Title>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>

<!-- Bottom -->
<Sheet.Root>
  <Sheet.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Bottom</Button>
    {/snippet}
  </Sheet.Trigger>
  <Sheet.Content side="bottom">
    <Sheet.Header>
      <Sheet.Title>Bottom Sheet</Sheet.Title>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Sheet.Root` | The root component |
| `Sheet.Trigger` | Opens the sheet |
| `Sheet.Content` | The sheet content |
| `Sheet.Header` | Contains title and description |
| `Sheet.Title` | The sheet title |
| `Sheet.Description` | The sheet description |
| `Sheet.Footer` | The footer area |
| `Sheet.Close` | Closes the sheet |

## Props

### Sheet.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` |
| `class` | `string` | `undefined` |

> [!TIP]
> Use sheets for navigation menus, filters, or forms that need more space than a dialog but shouldn't take over the entire screen.
