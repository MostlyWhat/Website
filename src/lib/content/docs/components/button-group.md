---
title: "Button Group"
description: "Groups multiple buttons together with consistent styling."
category: "components"
order: 7
---

# Button Group

Groups multiple buttons together with consistent styling and shared borders.

## Installation

```ts
import * as ButtonGroup from '$lib/components/ui/button-group';
```

## Default

A horizontal group of buttons.

```svelte live
<ButtonGroup.Root>
  <ButtonGroup.Button>Left</ButtonGroup.Button>
  <ButtonGroup.Button>Center</ButtonGroup.Button>
  <ButtonGroup.Button>Right</ButtonGroup.Button>
</ButtonGroup.Root>
```

## Props

### ButtonGroup.Root

| Prop | Type | Default |
|------|------|---------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `class` | `string` | `""` |
