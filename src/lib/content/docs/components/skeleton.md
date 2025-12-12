---
title: "Skeleton"
description: "A placeholder to show while content is loading."
category: "components"
order: 14
---

# Skeleton

A placeholder to show while content is loading.

## Installation

```ts
import { Skeleton } from '$lib/components/ui/skeleton';
```

## Default

A standard skeleton element.

```svelte live
<Skeleton class="h-4 w-[250px]" />
```

## Card Skeleton

A skeleton layout for card-like content.

```svelte live
<div class="flex items-center space-x-4">
  <Skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |
