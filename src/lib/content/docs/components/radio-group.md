---
title: "Radio Group"
description: "A set of checkable buttons where only one can be checked at a time."
category: "components"
order: 25
---

# Radio Group

A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.

## Installation

```ts
import * as RadioGroup from '$lib/components/ui/radio-group';
import { Label } from '$lib/components/ui/label';
```

## Default

A basic radio group.

```svelte live
<RadioGroup.Root value="comfortable">
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="default" id="r1" />
    <Label for="r1">Default</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="comfortable" id="r2" />
    <Label for="r2">Comfortable</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="compact" id="r3" />
    <Label for="r3">Compact</Label>
  </div>
</RadioGroup.Root>
```

## Props

### RadioGroup.Root

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `class` | `string` | `""` |
