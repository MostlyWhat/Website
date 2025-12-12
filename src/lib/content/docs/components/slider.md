---
title: "Slider"
description: "An input where the user selects a value from within a given range."
category: "components"
order: 28
---

# Slider

An input where the user selects a value from within a given range.

## Installation

```ts
import { Slider } from '$lib/components/ui/slider';
```

## Default

A basic slider input.

```svelte live
<Slider value={[50]} max={100} step={1} class="w-[60%]" />
```

## Range

A slider with two thumbs for selecting a range.

```svelte live
<Slider value={[25, 75]} max={100} step={1} class="w-[60%]" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `number[]` | `[0]` |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `disabled` | `boolean` | `false` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `class` | `string` | `""` |
