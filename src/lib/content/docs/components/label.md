---
title: "Label"
description: "Renders an accessible label associated with controls."
category: "components"
order: 8
---

# Label

Renders an accessible label associated with controls.

## Installation

```ts
import { Label } from '$lib/components/ui/label';
```

## Default

```svelte
<Label for="email">Email</Label>
<Input id="email" type="email" />
```

## With Various Controls

### With Input

```svelte
<div class="space-y-2">
  <Label for="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### With Checkbox

```svelte
<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

### With Switch

```svelte
<div class="flex items-center gap-3">
  <Switch id="airplane" />
  <Label for="airplane">Airplane Mode</Label>
</div>
```

### With File Input

```svelte
<div class="space-y-2">
  <Label for="picture">Picture</Label>
  <Input id="picture" type="file" />
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `for` | `string` | `undefined` |

> [!IMPORTANT]
> Always use labels with form controls for accessibility. The `for` attribute should match the `id` of the associated control.
