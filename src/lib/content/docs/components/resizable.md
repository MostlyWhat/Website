---
title: "Resizable"
description: "Accessible resizable panel groups and layouts."
category: "components"
order: 26
---

# Resizable

Accessible resizable panel groups and layouts with keyboard support.

## Installation

```ts
import * as Resizable from '$lib/components/ui/resizable';
```

## Default

A basic resizable panel layout.

```svelte live
<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] max-w-md border border-border">
  <Resizable.Pane defaultSize={50}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-ui text-sm">One</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={25}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-ui text-sm">Two</span>
        </div>
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={75}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-ui text-sm">Three</span>
        </div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

## Props

### Resizable.PaneGroup

| Prop | Type | Default |
|------|------|---------|
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `class` | `string` | `""` |

### Resizable.Pane

| Prop | Type | Default |
|------|------|---------|
| `defaultSize` | `number` | - |
| `minSize` | `number` | `0` |
| `maxSize` | `number` | `100` |
