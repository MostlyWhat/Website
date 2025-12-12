---
title: "Command"
description: "Fast, composable, unstyled command menu for Svelte."
category: "components"
order: 12
---

# Command

Fast, composable command menu for Svelte. Used for command palettes, search, and more.

## Installation

```ts
import * as Command from '$lib/components/ui/command';
```

## Default

A basic command menu.

```svelte live
<Command.Root class="border border-border">
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>Profile</Command.Item>
      <Command.Item>Billing</Command.Item>
      <Command.Item>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

## Props

### Command.Root

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `""` |
| `class` | `string` | `""` |

### Command.Input

| Prop | Type | Default |
|------|------|---------|
| `placeholder` | `string` | `""` |
| `class` | `string` | `""` |
