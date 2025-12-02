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

```svelte
<Avatar.Root>
  <Avatar.Image src="https://github.com/username.png" alt="@username" />
  <Avatar.Fallback>UN</Avatar.Fallback>
</Avatar.Root>
```

## With Fallback

When the image fails to load, the fallback is displayed.

```svelte
<Avatar.Root>
  <Avatar.Image src="/invalid-image.jpg" alt="User" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

## Sizes

```svelte
<!-- Small -->
<Avatar.Root class="h-8 w-8">
  <Avatar.Image src="/avatar.jpg" alt="User" />
  <Avatar.Fallback>SM</Avatar.Fallback>
</Avatar.Root>

<!-- Medium (default) -->
<Avatar.Root class="h-10 w-10">
  <Avatar.Image src="/avatar.jpg" alt="User" />
  <Avatar.Fallback>MD</Avatar.Fallback>
</Avatar.Root>

<!-- Large -->
<Avatar.Root class="h-14 w-14">
  <Avatar.Image src="/avatar.jpg" alt="User" />
  <Avatar.Fallback>LG</Avatar.Fallback>
</Avatar.Root>
```

## Group

```svelte
<div class="flex -space-x-4">
  <Avatar.Root class="border-2 border-background">
    <Avatar.Image src="/avatar1.jpg" alt="User 1" />
    <Avatar.Fallback>U1</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root class="border-2 border-background">
    <Avatar.Image src="/avatar2.jpg" alt="User 2" />
    <Avatar.Fallback>U2</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root class="border-2 border-background">
    <Avatar.Image src="/avatar3.jpg" alt="User 3" />
    <Avatar.Fallback>U3</Avatar.Fallback>
  </Avatar.Root>
</div>
```

## Components

| Component | Description |
|-----------|-------------|
| `Avatar.Root` | The main container |
| `Avatar.Image` | The image element |
| `Avatar.Fallback` | Displayed when image fails to load |

## Props

### Avatar.Root

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `undefined` |

### Avatar.Image

| Prop | Type | Default |
|------|------|---------|
| `src` | `string` | Required |
| `alt` | `string` | Required |

> [!NOTE]
> The fallback should typically be the user's initials (1-2 characters) or an icon.
