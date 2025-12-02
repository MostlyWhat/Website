---
title: "Switch"
description: "A control that allows the user to toggle between checked and not checked."
category: "components"
order: 5
---

# Switch

A control that allows the user to toggle between checked and not checked.

## Installation

```ts
import { Switch } from '$lib/components/ui/switch';
```

## Default

```svelte
<script>
  let checked = $state(false);
</script>

<Switch bind:checked />
```

## With Label

```svelte
<div class="flex items-center gap-3">
  <Switch bind:checked id="airplane" />
  <Label for="airplane">Airplane Mode</Label>
</div>
```

## Disabled

```svelte
<Switch disabled />
<Switch disabled checked />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `id` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `required` | `boolean` | `false` |

## Events

| Event | Description |
|-------|-------------|
| `onCheckedChange` | Fires when the checked state changes |
