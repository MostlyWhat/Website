---
title: "Card"
description: "Displays a card with header, content, and footer."
category: "components"
order: 9
---

# Card

Displays a card with header, content, and footer.

## Installation

```ts
import * as Card from '$lib/components/ui/card';
```

## Default

A standard card with all sections.

```svelte live
<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description goes here.</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card content area.</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card.Root>
```

## Props

### Card.Root

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |

### Card.Title

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |
