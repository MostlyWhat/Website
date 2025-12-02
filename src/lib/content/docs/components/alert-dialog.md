---
title: "Alert Dialog"
description: "A modal dialog that interrupts with important content."
category: "components"
order: 18
---

# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response.

## Installation

```ts
import * as AlertDialog from '$lib/components/ui/alert-dialog';
```

## Default

A standard alert dialog for confirmations.

```svelte live
<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

## Props

### AlertDialog.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |

### AlertDialog.Content

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |
