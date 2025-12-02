---
title: "Badge"
description: "Displays a badge or a component that looks like a badge."
category: "components"
order: 2
---

# Badge

Displays a badge or a component that looks like a badge.

## Installation

```ts
import { Badge } from '$lib/components/ui/badge';
```

## Variants

```svelte
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Default

The primary badge style with solid background.

### Secondary

A muted badge for less emphasis.

### Destructive

For error states or dangerous indicators.

### Outline

A bordered badge without background fill.

## As Link

Badges can be rendered as links by providing an `href` prop.

```svelte
<Badge href="/page">Clickable Badge</Badge>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline"` | `"default"` |
| `href` | `string \| undefined` | `undefined` |
