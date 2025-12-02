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

Badge variants for different contexts and statuses.

```svelte live
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline"` | `"default"` |
