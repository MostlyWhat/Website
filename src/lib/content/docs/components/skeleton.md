---
title: "Skeleton"
description: "Use to show a placeholder while content is loading."
category: "components"
order: 14
---

# Skeleton

Use to show a placeholder while content is loading.

## Installation

```ts
import { Skeleton } from '$lib/components/ui/skeleton';
```

## Default

```svelte
<Skeleton class="h-4 w-[250px]" />
```

## Card Skeleton

```svelte
<div class="flex items-center space-x-4">
  <Skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## Full Card Loading

```svelte
<Card.Root>
  <Card.Header>
    <Skeleton class="h-6 w-[180px]" />
    <Skeleton class="h-4 w-[250px]" />
  </Card.Header>
  <Card.Content class="space-y-4">
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-3/4" />
  </Card.Content>
  <Card.Footer>
    <Skeleton class="h-10 w-[100px]" />
  </Card.Footer>
</Card.Root>
```

## Table Skeleton

```svelte
<div class="space-y-4">
  <div class="flex gap-4">
    <Skeleton class="h-8 w-1/4" />
    <Skeleton class="h-8 w-1/4" />
    <Skeleton class="h-8 w-1/4" />
    <Skeleton class="h-8 w-1/4" />
  </div>
  {#each Array(5) as _}
    <div class="flex gap-4">
      <Skeleton class="h-6 w-1/4" />
      <Skeleton class="h-6 w-1/4" />
      <Skeleton class="h-6 w-1/4" />
      <Skeleton class="h-6 w-1/4" />
    </div>
  {/each}
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `undefined` |

> [!TIP]
> Match skeleton dimensions to your actual content for the smoothest loading experience. This prevents layout shift when content loads.
