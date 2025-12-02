---
title: "Switch"
description: "A control that allows toggling between checked and not checked."
category: "components"
order: 5
---

# Switch

A control that allows toggling between checked and not checked.

## Installation

```ts
import { Switch } from '$lib/components/ui/switch';
```

## Default

A standard switch toggle.

```svelte live
<Switch />
```

## With Label

Switch with an associated label.

```svelte live
<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

## Disabled

A disabled switch.

```svelte live
<Switch disabled />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `id` | `string` | `""` |
