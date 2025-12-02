---
title: "Accordion"
description: "A vertically stacked set of interactive headings that reveal content."
category: "components"
order: 12
---

# Accordion

A vertically stacked set of interactive headings that reveal content.

## Installation

```ts
import * as Accordion from '$lib/components/ui/accordion';
```

## Default

```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it styled?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It comes with default styles that match the design system.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Is it animated?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It's animated by default, but you can disable it.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Multiple

Allow multiple items to be open at once.

```svelte
<Accordion.Root type="multiple">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>First Item</Accordion.Trigger>
    <Accordion.Content>Content for first item.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Second Item</Accordion.Trigger>
    <Accordion.Content>Content for second item.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Default Open

```svelte
<Accordion.Root type="single" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Open by Default</Accordion.Trigger>
    <Accordion.Content>This item is open by default.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Closed by Default</Accordion.Trigger>
    <Accordion.Content>This item is closed by default.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Accordion.Root` | The root component that manages state |
| `Accordion.Item` | Contains a trigger and content pair |
| `Accordion.Trigger` | The button that toggles the content |
| `Accordion.Content` | The collapsible content area |

## Props

### Accordion.Root

| Prop | Type | Default |
|------|------|---------|
| `type` | `"single" \| "multiple"` | Required |
| `value` | `string \| string[]` | `undefined` |
| `onValueChange` | `(value: string \| string[]) => void` | `undefined` |
| `disabled` | `boolean` | `false` |

### Accordion.Item

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
| `disabled` | `boolean` | `false` |

> [!TIP]
> Use `type="single"` for FAQ-style accordions where only one item should be open at a time. Use `type="multiple"` for settings panels where users may want to compare multiple sections.
