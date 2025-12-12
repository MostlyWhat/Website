---
title: "Textarea"
description: "Displays a multi-line text input field."
category: "components"
order: 4
---

# Textarea

Displays a multi-line text input field.

## Installation

```ts
import { Textarea } from '$lib/components/ui/textarea';
```

## Default

A standard textarea field.

```svelte live
<Textarea placeholder="Enter text..." />
```

## With Label

Textarea with an associated label for accessibility.

```svelte live
<div class="grid w-full max-w-sm gap-1.5">
  <Label for="message">Message</Label>
  <Textarea id="message" placeholder="Type your message here." />
</div>
```

## Disabled

A disabled textarea field.

```svelte live
<Textarea disabled placeholder="Disabled textarea" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `placeholder` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `value` | `string` | `""` |
| `rows` | `number` | `3` |
