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

A standard checkbox.

```svelte live
<Checkbox />
```

## With Label

Checkbox with an associated label.

```svelte live
<div class="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

## Disabled

A disabled checkbox.

```svelte live
<Checkbox disabled />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `id` | `string` | `""` |
