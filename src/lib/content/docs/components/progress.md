---
title: "Progress"
description: "Displays an indicator showing completion progress."
category: "components"
order: 13
---

# Progress

Displays an indicator showing completion progress of a task.

## Installation

```ts
import { Progress } from '$lib/components/ui/progress';
```

## Default

A standard progress bar.

```svelte live
<Progress value={60} />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `number` | `0` |
| `max` | `number` | `100` |
| `class` | `string` | `""` |
