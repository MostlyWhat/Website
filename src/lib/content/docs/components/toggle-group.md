---
title: "Toggle Group"
description: "A set of two-state buttons that can be toggled on or off."
category: "components"
order: 33
---

# Toggle Group

A set of two-state buttons that can be toggled on or off.

## Installation

```ts
import * as ToggleGroup from '$lib/components/ui/toggle-group';
```

## Default (Single)

Only one item can be selected at a time.

```svelte live
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <Bold class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <Italic class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="underline" aria-label="Toggle underline">
    <Underline class="h-4 w-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

## Multiple

Multiple items can be selected.

```svelte live
<ToggleGroup.Root type="multiple">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <Bold class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <Italic class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="underline" aria-label="Toggle underline">
    <Underline class="h-4 w-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

## Props

### ToggleGroup.Root

| Prop | Type | Default |
|------|------|---------|
| `type` | `"single" \| "multiple"` | `"single"` |
| `value` | `string \| string[]` | - |
| `disabled` | `boolean` | `false` |
| `variant` | `"default" \| "outline"` | `"default"` |
| `class` | `string` | `""` |
