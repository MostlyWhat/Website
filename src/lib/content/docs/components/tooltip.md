---
title: "Tooltip"
description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
category: "components"
order: 17
---

# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Installation

```ts
import * as Tooltip from '$lib/components/ui/tooltip';
```

## Default

```svelte
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Hover me</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Placement

```svelte
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Top</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>Top tooltip</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Bottom</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="bottom">
      <p>Bottom tooltip</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Left</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="left">
      <p>Left tooltip</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Right</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      <p>Right tooltip</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## With Delay

```svelte
<Tooltip.Provider delayDuration={0}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Instant</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Shows immediately</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

<Tooltip.Provider delayDuration={700}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Delayed</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Shows after 700ms</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Components

| Component | Description |
|-----------|-------------|
| `Tooltip.Provider` | Wraps the app to provide shared tooltip context |
| `Tooltip.Root` | The root component for a single tooltip |
| `Tooltip.Trigger` | The element that triggers the tooltip |
| `Tooltip.Content` | The tooltip content |

## Props

### Tooltip.Provider

| Prop | Type | Default |
|------|------|---------|
| `delayDuration` | `number` | `700` |
| `skipDelayDuration` | `number` | `300` |

### Tooltip.Content

| Prop | Type | Default |
|------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |
| `sideOffset` | `number` | `4` |
| `align` | `"start" \| "center" \| "end"` | `"center"` |

> [!TIP]
> Use tooltips for supplementary information only. Essential information should be visible without user interaction.
