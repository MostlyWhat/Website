---
title: "Button"
description: "Displays a button or a component that looks like a button."
category: "components"
order: 1
---

# Button

Displays a button or a component that looks like a button.

## Installation

```ts
import Button from '$lib/components/ui/button/button.svelte';
```

## Variants

Button variants for different actions and contexts.

```svelte live
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

## Sizes

Available button sizes for different use cases.

```svelte live
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon"><Icon /></Button>
```

## With Icons

Buttons can include icons for additional visual context.

```svelte live
<Button>
  <Mail class="mr-2 h-4 w-4" />
  Login with Email
</Button>

<Button variant="outline">
  Continue
  <ArrowRight class="ml-2 h-4 w-4" />
</Button>

<Button variant="secondary" disabled>
  <Loader2 class="mr-2 h-4 w-4 animate-spin" />
  Loading
</Button>
```

## As Link

Buttons can be rendered as links by providing an `href` prop.

```svelte live
<Button href="/page">As Link</Button>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` |
| `size` | `"default" \| "sm" \| "lg" \| "xl" \| "icon" \| "icon-sm" \| "icon-lg"` | `"default"` |
| `href` | `string \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |
