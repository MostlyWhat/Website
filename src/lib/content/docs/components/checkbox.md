---
title: "Checkbox"
description: "A control that allows the user to toggle between checked and not checked."
category: "components"
order: 6
---

# Checkbox

A control that allows the user to toggle between checked and not checked.

## Installation

```ts
import { Checkbox } from '$lib/components/ui/checkbox';
```

## Default

```svelte
<script>
  let checked = $state(false);
</script>

<Checkbox bind:checked />
```

## With Label

```svelte
<div class="flex items-center gap-3">
  <Checkbox id="terms" bind:checked />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

## Indeterminate

```svelte
<script>
  let checked = $state<boolean | 'indeterminate'>('indeterminate');
</script>

<Checkbox bind:checked />
```

## Disabled

```svelte
<Checkbox disabled />
<Checkbox disabled checked />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean \| "indeterminate"` | `false` |
| `disabled` | `boolean` | `false` |
| `id` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `required` | `boolean` | `false` |

## Events

| Event | Description |
|-------|-------------|
| `onCheckedChange` | Fires when the checked state changes |

> [!TIP]
> Use the indeterminate state to represent a "partial" selection, such as when some but not all items in a group are selected.
