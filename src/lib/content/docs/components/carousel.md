---
title: "Carousel"
description: "A carousel with motion and swipe built using Embla."
category: "components"
order: 9
---

# Carousel

A carousel with motion and swipe built using Embla Carousel.

## Installation

```ts
import * as Carousel from '$lib/components/ui/carousel';
```

## Default

A basic carousel with navigation.

```svelte live
<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each [1, 2, 3, 4, 5] as item}
      <Carousel.Item>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center border border-border bg-card p-6">
            <span class="font-display text-4xl font-semibold">{item}</span>
          </div>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Props

### Carousel.Root

| Prop | Type | Default |
|------|------|---------|
| `opts` | `EmblaOptionsType` | `{}` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `class` | `string` | `""` |
