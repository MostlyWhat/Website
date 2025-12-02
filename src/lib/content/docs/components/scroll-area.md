---
title: "Scroll Area"
description: "Augments native scroll functionality for custom, cross-browser styling."
category: "components"
order: 24
---

# Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

## Installation

```ts
import { ScrollArea } from '$lib/components/ui/scroll-area';
```

## Default

```svelte
<ScrollArea class="h-72 w-48 rounded-md border">
  <div class="p-4">
    <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
    {#each tags as tag}
      <div class="text-sm">{tag}</div>
      <Separator class="my-2" />
    {/each}
  </div>
</ScrollArea>
```

## Horizontal Scrolling

```svelte
<ScrollArea class="w-96 whitespace-nowrap rounded-md border">
  <div class="flex w-max space-x-4 p-4">
    {#each works as work}
      <figure class="shrink-0">
        <div class="overflow-hidden rounded-md">
          <img
            src={work.art}
            alt={work.artist}
            class="aspect-[3/4] h-fit w-fit object-cover"
            width={300}
            height={400}
          />
        </div>
        <figcaption class="pt-2 text-xs text-muted-foreground">
          Photo by <span class="font-semibold text-foreground">{work.artist}</span>
        </figcaption>
      </figure>
    {/each}
  </div>
</ScrollArea>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `undefined` |
| `orientation` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` |

> [!NOTE]
> The scroll area provides consistent scrollbar styling across browsers while maintaining native scroll behavior.
