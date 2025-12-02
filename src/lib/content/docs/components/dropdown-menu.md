---
title: "Dropdown Menu"
description: "Displays a menu to the user—such as a set of actions or functions—triggered by a button."
category: "components"
order: 22
---

# Dropdown Menu

Displays a menu to the user—such as a set of actions or functions—triggered by a button.

## Installation

```ts
import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
```

## Default

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Profile</DropdownMenu.Item>
    <DropdownMenu.Item>Billing</DropdownMenu.Item>
    <DropdownMenu.Item>Settings</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Log out</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## With Icons

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>
      <User class="mr-2 h-4 w-4" />
      Profile
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <CreditCard class="mr-2 h-4 w-4" />
      Billing
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <Settings class="mr-2 h-4 w-4" />
      Settings
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## With Checkboxes

```svelte
<script>
  let showStatusBar = $state(true);
  let showPanel = $state(false);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">View</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Appearance</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
      Status Bar
    </DropdownMenu.CheckboxItem>
    <DropdownMenu.CheckboxItem bind:checked={showPanel}>
      Panel
    </DropdownMenu.CheckboxItem>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## With Sub Menu

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>New Tab</DropdownMenu.Item>
    <DropdownMenu.Item>New Window</DropdownMenu.Item>
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>More Tools</DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item>Save Page As...</DropdownMenu.Item>
        <DropdownMenu.Item>Create Shortcut...</DropdownMenu.Item>
        <DropdownMenu.Item>Name Window...</DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `DropdownMenu.Root` | The root component |
| `DropdownMenu.Trigger` | Opens the menu |
| `DropdownMenu.Content` | The menu content |
| `DropdownMenu.Item` | A menu item |
| `DropdownMenu.Label` | A label for grouping |
| `DropdownMenu.Separator` | A visual separator |
| `DropdownMenu.CheckboxItem` | A checkable item |
| `DropdownMenu.RadioGroup` | Groups radio items |
| `DropdownMenu.RadioItem` | A radio item |
| `DropdownMenu.Sub` | A sub menu container |
| `DropdownMenu.SubTrigger` | Opens the sub menu |
| `DropdownMenu.SubContent` | The sub menu content |

## Props

### DropdownMenu.Item

| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | `false` |
| `onSelect` | `() => void` | `undefined` |
