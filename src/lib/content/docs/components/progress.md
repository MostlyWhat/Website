---
title: "Progress"
description: "Displays an indicator showing the completion progress of a task."
category: "components"
order: 13
---

# Progress

Displays an indicator showing the completion progress of a task.

## Installation

```ts
import { Progress } from '$lib/components/ui/progress';
```

## Default

```svelte
<Progress value={60} />
```

## Different Values

```svelte
<Progress value={0} />
<Progress value={25} />
<Progress value={50} />
<Progress value={75} />
<Progress value={100} />
```

## Dynamic Progress

```svelte
<script>
  let value = $state(0);
  
  function increment() {
    value = Math.min(100, value + 10);
  }
  
  function decrement() {
    value = Math.max(0, value - 10);
  }
</script>

<Progress {value} />

<div class="flex gap-2 mt-4">
  <Button size="sm" onclick={decrement}>-10%</Button>
  <Button size="sm" onclick={increment}>+10%</Button>
</div>
```

## Indeterminate

When no value is provided, the progress bar shows an indeterminate state.

```svelte
<Progress />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `number \| null` | `null` |
| `max` | `number` | `100` |
| `class` | `string` | `undefined` |

> [!NOTE]
> The progress bar is animated by default. The fill animates smoothly when the value changes.
