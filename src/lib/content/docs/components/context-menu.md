---
title: "Context Menu"
description: "Displays a menu located at the pointer, triggered by a right-click."
category: "components"
order: 13
---

# Context Menu

Displays a menu located at the pointer, triggered by a right-click or long-press.

## Installation

```ts
import * as ContextMenu from '$lib/components/ui/context-menu';
```

## Default

Right-click to open the context menu.

```svelte live
<ContextMenu.Root>
  <ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center border border-dashed border-border text-sm">
    Right click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-64">
    <ContextMenu.Item>Back</ContextMenu.Item>
    <ContextMenu.Item disabled>Forward</ContextMenu.Item>
    <ContextMenu.Item>Reload</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem checked>Show Bookmarks Bar</ContextMenu.CheckboxItem>
    <ContextMenu.CheckboxItem>Show Full URLs</ContextMenu.CheckboxItem>
    <ContextMenu.Separator />
    <ContextMenu.Label>More Tools</ContextMenu.Label>
    <ContextMenu.Item>Developer Tools</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

## Props

### ContextMenu.Content

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |
| `align` | `"start" \| "center" \| "end"` | `"center"` |
