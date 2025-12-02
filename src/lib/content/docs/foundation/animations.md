---
title: "Animations"
description: "Scroll-based animations using Intersection Observer for subtle, meaningful transitions."
category: "foundation"
order: 5
slug: "animations"
---

# Animations

Scroll-based animations using Intersection Observer for subtle, meaningful transitions.

## Scroll Animate Action

The `scrollAnimate` action triggers animations when elements enter the viewport:

```svelte
<script>
  import { scrollAnimate } from '$lib/actions/scroll-animate';
</script>

<div use:scrollAnimate={{ animation: 'fade' }}>
  This content fades in on scroll
</div>
```

## Animation Types

### Fade

Opacity transitions from 0 to 1.

```svelte
<div use:scrollAnimate={{ animation: 'fade' }}>
  Fade in content
</div>
```

### Slide Left

Element slides in from the left while fading.

```svelte
<div use:scrollAnimate={{ animation: 'slide-left' }}>
  Slides from left
</div>
```

### Slide Right

Element slides in from the right while fading.

```svelte
<div use:scrollAnimate={{ animation: 'slide-right' }}>
  Slides from right
</div>
```

### Scale

Element scales up from 95% to 100% while fading.

```svelte
<div use:scrollAnimate={{ animation: 'scale' }}>
  Scales up
</div>
```

### Stagger

For grid items, each child animates with a delay.

```svelte
<div use:scrollAnimate={{ animation: 'stagger' }}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `animation` | string | `'fade'` | Animation type |
| `threshold` | number | `0.1` | Intersection threshold |
| `delay` | number | `0` | Animation delay (ms) |
| `duration` | number | `600` | Animation duration (ms) |

## Usage Example

```svelte
<div 
  use:scrollAnimate={{ 
    animation: 'fade', 
    threshold: 0.2,
    delay: 100 
  }}
>
  Content with custom animation settings
</div>
```

## Best Practices

1. **Use sparingly** — Too many animations can be distracting
2. **Keep it subtle** — Small movements and opacity changes work best
3. **Consider performance** — Avoid animating large elements
4. **Respect reduced motion** — The action respects `prefers-reduced-motion`
