---
title: "Textarea"
description: "Displays a form textarea or a component that looks like a textarea."
category: "components"
order: 7
---

# Textarea

Displays a form textarea or a component that looks like a textarea.

## Installation

```ts
import { Textarea } from '$lib/components/ui/textarea';
```

## Default

```svelte
<Textarea placeholder="Type your message here..." />
```

## With Label

```svelte
<div class="space-y-2">
  <Label for="message">Message</Label>
  <Textarea id="message" placeholder="Type your message here..." />
</div>
```

## Disabled

```svelte
<Textarea disabled placeholder="Disabled textarea" />
```

## With Default Value

```svelte
<Textarea value="This is the default content of the textarea." />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `placeholder` | `string` | `undefined` |
| `disabled` | `boolean` | `false` |
| `value` | `string` | `""` |
| `id` | `string` | `undefined` |
| `rows` | `number` | `undefined` |

> [!NOTE]
> The Textarea component supports all standard HTML textarea attributes through rest props.
