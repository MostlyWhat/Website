---
title: "Avatar"
description: "An image element with a fallback for representing the user."
category: "components"
order: 20
---

# Avatar

An image element with a fallback for representing the user.

## Installation

```ts
import * as Avatar from '$lib/components/ui/avatar';
```

## Default

An avatar with image and fallback.

```svelte live
<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="Avatar" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
```

## Props

### Avatar.Root

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |

### Avatar.Image

| Prop | Type | Default |
|------|------|---------|
| `src` | `string` | Required |
| `alt` | `string` | `""` |

### Avatar.Fallback

| Prop | Type | Default |
|------|------|---------|
| `delayMs` | `number` | `600` |
