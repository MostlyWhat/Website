---
title: "Select"
description: "Displays a list of options for the user to pick from."
category: "components"
order: 8
---

# Select

Displays a list of options for the user to pick from.

## Installation

```ts
import * as Select from '$lib/components/ui/select';
```

## Default

A standard select dropdown.

```svelte live
<Select.Root>
  <Select.Trigger class="w-[180px]">
    Select option
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option1">Option 1</Select.Item>
    <Select.Item value="option2">Option 2</Select.Item>
    <Select.Item value="option3">Option 3</Select.Item>
  </Select.Content>
</Select.Root>
```

## Props

### Select.Root

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `""` |
| `type` | `"single" \| "multiple"` | `"single"` |

### Select.Item

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
| `disabled` | `boolean` | `false` |
