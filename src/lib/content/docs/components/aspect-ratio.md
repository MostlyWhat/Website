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

## Default (16:9)

```svelte
<AspectRatio ratio={16 / 9}>
  <img src="/image.jpg" alt="Image" class="h-full w-full object-cover" />
</AspectRatio>
```

## Square (1:1)

```svelte
<AspectRatio ratio={1}>
  <img src="/image.jpg" alt="Image" class="h-full w-full object-cover" />
</AspectRatio>
```

## Portrait (3:4)

```svelte
<AspectRatio ratio={3 / 4}>
  <img src="/image.jpg" alt="Image" class="h-full w-full object-cover" />
</AspectRatio>
```

## With Video

```svelte
<AspectRatio ratio={16 / 9}>
  <iframe
    src="https://www.youtube.com/embed/..."
    title="Video"
    class="h-full w-full"
    allowfullscreen
  />
</AspectRatio>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `ratio` | `number` | `1` |
| `class` | `string` | `undefined` |

> [!TIP]
> Common aspect ratios: 16/9 (widescreen video), 4/3 (traditional TV), 1/1 (square), 3/4 (portrait photos), 21/9 (ultrawide).
