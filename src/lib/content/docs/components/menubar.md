---
title: "Menubar"
description: "A visually persistent menu common in desktop applications."
category: "components"
order: 21
---

# Menubar

A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.

## Installation

```ts
import * as Menubar from '$lib/components/ui/menubar';
```

## Default

A basic menubar with multiple menus.

```svelte live
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New Tab</Menubar.Item>
      <Menubar.Item>New Window</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Share</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Print</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>Undo</Menubar.Item>
      <Menubar.Item>Redo</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Cut</Menubar.Item>
      <Menubar.Item>Copy</Menubar.Item>
      <Menubar.Item>Paste</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem>Always Show Bookmarks Bar</Menubar.CheckboxItem>
      <Menubar.CheckboxItem checked>Always Show Full URLs</Menubar.CheckboxItem>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

## Props

### Menubar.Root

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |
