---
title: "Dialog"
description: "A window overlaid on the primary window, rendering content."
category: "components"
order: 10
---

# Dialog

A window overlaid on the primary window, rendering content that requires user interaction.

## Installation

```ts
import * as Dialog from '$lib/components/ui/dialog';
```

## Default

A standard dialog with trigger button.

```svelte live
<Dialog.Root>
  <Dialog.Trigger>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Dialog description here.</Dialog.Description>
    </Dialog.Header>
    <div class="py-4">
      <p>Dialog content goes here.</p>
    </div>
    <Dialog.Footer>
      <Button>Save Changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Props

### Dialog.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |

### Dialog.Content

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |
