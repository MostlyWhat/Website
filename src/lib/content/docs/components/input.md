---
title: "Input"
description: "Displays a form input field or a component that looks like an input field."
category: "components"
order: 3
---

# Input

Displays a form input field or a component that looks like an input field.

## Installation

```ts
import { Input } from '$lib/components/ui/input';
```

## Default

```svelte
<Input type="email" placeholder="Email" />
```

## With Label

```svelte
<Label for="email">Email</Label>
<Input id="email" type="email" placeholder="Enter your email" />
```

## Disabled

```svelte
<Input disabled placeholder="Disabled input" />
```

## File Input

```svelte
<Label for="picture">Picture</Label>
<Input id="picture" type="file" />
```

## With Button

```svelte
<div class="flex gap-2">
  <Input type="email" placeholder="Email" />
  <Button>Subscribe</Button>
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `string` | `"text"` |
| `placeholder` | `string` | `undefined` |
| `disabled` | `boolean` | `false` |
| `value` | `string` | `""` |
| `id` | `string` | `undefined` |

> [!NOTE]
> The Input component supports all standard HTML input attributes through rest props.
