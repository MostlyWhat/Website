---
title: "Dialog"
description: "A window overlaid on either the primary window or another dialog window."
category: "components"
order: 10
---

# Dialog

A window overlaid on either the primary window or another dialog window.

## Installation

```ts
import * as Dialog from '$lib/components/ui/dialog';
```

## Default

```svelte
<Dialog.Root>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props}>Open Dialog</Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>
        Dialog description goes here.
      </Dialog.Description>
    </Dialog.Header>
    <p>Dialog content goes here.</p>
    <Dialog.Footer>
      <Button>Save Changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## With Form

```svelte
<Dialog.Root>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props}>Edit Profile</Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="username" class="text-right">Username</Label>
        <Input id="username" value="@peduarte" class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save Changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Controlled

```svelte
<script>
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Open Dialog</Button>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Controlled Dialog</Dialog.Title>
      <Dialog.Description>
        This dialog is controlled externally.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button onclick={() => open = false}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Dialog.Root` | The root component that manages state |
| `Dialog.Trigger` | The element that opens the dialog |
| `Dialog.Content` | The dialog content container |
| `Dialog.Header` | Contains title and description |
| `Dialog.Title` | The dialog title |
| `Dialog.Description` | The dialog description |
| `Dialog.Footer` | The footer area for actions |
| `Dialog.Close` | A button that closes the dialog |

## Props

### Dialog.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `onOpenChange` | `(open: boolean) => void` | `undefined` |

### Dialog.Content

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `undefined` |

> [!WARNING]
> Always include a `Dialog.Title` for accessibility. Screen readers use this to announce the dialog.
