---
title: "Input"
description: "Displays a form input field."
category: "components"
order: 3
---

# Input

Displays a form input field.

## Installation

```ts
import { Input } from '$lib/components/ui/input';
```

## Default

A standard text input field.

```svelte live
<Input placeholder="Enter text..." />
```

## With Label

Input with an associated label for accessibility.

```svelte live
<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

## Input Types

Different input types for various data.

```svelte live
<Input type="email" placeholder="Email" />
```

```svelte live
<Input type="password" placeholder="Password" />
```

## Disabled

A disabled input field.

```svelte live
<Input disabled placeholder="Disabled input" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `string` | `"text"` |
| `placeholder` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `value` | `string` | `""` |
