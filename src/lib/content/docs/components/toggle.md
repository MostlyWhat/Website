---
title: "Toggle"
description: "A two-state button that can be either on or off."
category: "components"
order: 32
---

# Toggle

A two-state button that can be either on or off.

## Installation

```ts
import { Toggle } from '$lib/components/ui/toggle';
```

## Default

A basic toggle button.

```svelte live
<Toggle aria-label="Toggle italic">
  <Bold class="h-4 w-4" />
</Toggle>
```

## With Text

```svelte live
<Toggle aria-label="Toggle italic">
  <Italic class="mr-2 h-4 w-4" />
  Italic
</Toggle>
```

## Variants

```svelte live
<div class="flex gap-2">
  <Toggle variant="default">Default</Toggle>
  <Toggle variant="outline">Outline</Toggle>
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `pressed` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `variant` | `"default" \| "outline"` | `"default"` |
| `size` | `"default" \| "sm" \| "lg"` | `"default"` |
| `class` | `string` | `""` |
