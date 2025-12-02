---
title: "Accordion"
description: "A vertically stacked set of interactive headings."
category: "components"
order: 12
---

# Accordion

A vertically stacked set of interactive headings that expand/collapse content.

## Installation

```ts
import * as Accordion from '$lib/components/ui/accordion';
```

## Default

A standard accordion with collapsible items.

```svelte live
<Accordion.Root type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      <p>Yes. It follows WAI-ARIA design patterns.</p>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it styled?</Accordion.Trigger>
    <Accordion.Content>
      <p>Yes. Styled with Tailwind CSS.</p>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Is it animated?</Accordion.Trigger>
    <Accordion.Content>
      <p>Yes. Smooth expand/collapse animation.</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Props

### Accordion.Root

| Prop | Type | Default |
|------|------|---------|
| `type` | `"single" \| "multiple"` | `"single"` |
| `collapsible` | `boolean` | `false` |
| `value` | `string \| string[]` | `""` |

### Accordion.Item

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
| `disabled` | `boolean` | `false` |
