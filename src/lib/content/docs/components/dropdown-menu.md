---
title: "Dropdown Menu"
description: "Displays a menu to the user with a list of actions."
category: "components"
order: 22
---

# Dropdown Menu

Displays a menu to the user with a list of actions or options.

## Installation

```ts
import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
```

## Default

A standard dropdown menu.

```svelte live
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <User class="mr-2 h-4 w-4" />
      <span>Profile</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <Settings class="mr-2 h-4 w-4" />
      <span>Settings</span>
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <LogOut class="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Props

### DropdownMenu.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` |
| `align` | `"start" \| "center" \| "end"` | `"end"` |
| `sideOffset` | `number` | `4` |
| `class` | `string` | `""` |

### DropdownMenu.Item

| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | `false` |
