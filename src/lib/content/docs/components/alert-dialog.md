---
title: "Alert Dialog"
description: "A modal dialog that interrupts the user with important content and expects a response."
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

```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Delete Account</Button>
    {/snippet}
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

## Destructive Action

```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="destructive">Delete</Button>
    {/snippet}
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this item?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the item.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Delete
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `AlertDialog.Root` | The root component that manages state |
| `AlertDialog.Trigger` | The element that opens the dialog |
| `AlertDialog.Content` | The dialog content container |
| `AlertDialog.Header` | Contains title and description |
| `AlertDialog.Title` | The dialog title |
| `AlertDialog.Description` | The dialog description |
| `AlertDialog.Footer` | The footer area for actions |
| `AlertDialog.Cancel` | A button that closes the dialog |
| `AlertDialog.Action` | A button that confirms the action |

## Props

### AlertDialog.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `onOpenChange` | `(open: boolean) => void` | `undefined` |

> [!CAUTION]
> Use Alert Dialogs for destructive or irreversible actions. For informational dialogs or forms, use the regular Dialog component instead.

## Dialog vs Alert Dialog

| Feature | Dialog | Alert Dialog |
|---------|--------|--------------|
| Click outside to close | Yes | No |
| Escape key to close | Yes | No |
| Purpose | Forms, information | Confirmations, warnings |
| User expectation | Can dismiss freely | Must make a choice |
