---
title: "Aspect Ratio"
description: "Displays content within a desired ratio."
category: "components"
order: 19
---

# Aspect Ratio

Displays content within a desired ratio.

## Installation

```ts
import { AspectRatio } from '$lib/components/ui/aspect-ratio';
```

## Default

A 16:9 aspect ratio container.

```svelte live
<AspectRatio ratio={16 / 9} class="bg-muted">
  <div class="flex h-full items-center justify-center">
    <span>16:9</span>
  </div>
</AspectRatio>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `ratio` | `number` | `1` |
| `class` | `string` | `""` |
