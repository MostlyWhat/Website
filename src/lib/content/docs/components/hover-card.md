---
title: "Hover Card"
description: "For sighted users to preview content available behind a link."
category: "components"
order: 17
---

# Hover Card

For sighted users to preview content available behind a link.

## Installation

```ts
import * as HoverCard from '$lib/components/ui/hover-card';
```

## Default

Hover over the link to see the card.

```svelte live
<HoverCard.Root>
  <HoverCard.Trigger asChild let:builder>
    <a href="#" class="text-primary underline" use:builder.action {...builder}>@svelte</a>
  </HoverCard.Trigger>
  <HoverCard.Content class="w-80">
    <div class="flex justify-between space-x-4">
      <div class="space-y-1">
        <h4 class="font-ui text-sm font-semibold">@svelte</h4>
        <p class="text-sm text-muted-foreground">
          The Svelte framework – cybernetically enhanced web apps.
        </p>
        <div class="flex items-center pt-2">
          <span class="text-xs text-muted-foreground">Joined December 2016</span>
        </div>
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
```

## Props

### HoverCard.Content

| Prop | Type | Default |
|------|------|---------|
| `align` | `"start" \| "center" \| "end"` | `"center"` |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` |
| `class` | `string` | `""` |
