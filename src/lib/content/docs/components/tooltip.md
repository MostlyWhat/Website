---
title: "Tooltip"
description: "A popup that displays information on hover."
category: "components"
order: 17
---

# Tooltip

A popup that displays information related to an element when it receives focus or hover.

## Installation

```ts
import * as Tooltip from '$lib/components/ui/tooltip';
```

## Default

A standard tooltip on hover.

```svelte live
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button variant="outline">Hover me</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>This is a tooltip</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Props

### Tooltip.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |
| `align` | `"start" \| "center" \| "end"` | `"center"` |
| `sideOffset` | `number` | `4` |
