---
title: "Select"
description: "Displays a list of options for the user to pick from—triggered by a button."
category: "components"
order: 4
---

# Select

Displays a list of options for the user to pick from—triggered by a button.

## Installation

```ts
import * as Select from '$lib/components/ui/select';
```

## Default

```svelte
<Select.Root type="single">
  <Select.Trigger>
    <span>Select option</span>
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

## With Label

```svelte
<Label for="framework">Framework</Label>
<Select.Root type="single">
  <Select.Trigger>
    <span>Select framework</span>
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="svelte">SvelteKit</Select.Item>
    <Select.Item value="next">Next.js</Select.Item>
    <Select.Item value="nuxt">Nuxt</Select.Item>
    <Select.Item value="astro">Astro</Select.Item>
  </Select.Content>
</Select.Root>
```

## With Groups

```svelte
<Select.Root type="single">
  <Select.Trigger>
    <span>Select timezone</span>
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>North America</Select.Label>
      <Select.Item value="est">Eastern Standard Time (EST)</Select.Item>
      <Select.Item value="cst">Central Standard Time (CST)</Select.Item>
      <Select.Item value="pst">Pacific Standard Time (PST)</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Europe</Select.Label>
      <Select.Item value="gmt">Greenwich Mean Time (GMT)</Select.Item>
      <Select.Item value="cet">Central European Time (CET)</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Select.Root` | The root component that manages state |
| `Select.Trigger` | The button that opens the dropdown |
| `Select.Content` | The dropdown content container |
| `Select.Group` | Groups related items together |
| `Select.Label` | A label for a group of items |
| `Select.Item` | An individual selectable item |
| `Select.Separator` | A visual separator between groups |

## Props

### Select.Root

| Prop | Type | Default |
|------|------|---------|
| `type` | `"single" \| "multiple"` | Required |
| `value` | `string \| string[]` | `undefined` |
| `onValueChange` | `(value: string) => void` | `undefined` |
| `disabled` | `boolean` | `false` |

### Select.Trigger

| Prop | Type | Default |
|------|------|---------|
| `showChevron` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |

### Select.Item

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
| `disabled` | `boolean` | `false` |
