---
title: "Mastering Tailwind CSS: Utility-First Done Right"
slug: "mastering-tailwind"
category: "Design"
date: "2024-09-05"
excerpt: "Tips and patterns for writing maintainable Tailwind CSS at scale."
readTime: "5 MIN"
author: "Prem (MostlyWhat)"
featured: false
tags: ["Tailwind CSS", "CSS", "Styling", "Best Practices"]
---

# Mastering Tailwind CSS: Utility-First Done Right

Tailwind CSS has changed how we write styles. But without discipline, utility classes can become an unreadable mess. Here's how we keep things maintainable.

## The Class Ordering Convention

Consistent ordering makes scanning classes easier:

```
Layout → Positioning → Box → Typography → Visual → Misc
```

Example:
```html
<div class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium bg-primary rounded-lg hover:bg-primary/90 transition-colors">
```

## Extract Components, Not Classes

Instead of `@apply` for shared styles, extract Svelte components:

```svelte
<!-- Button.svelte -->
<script>
  let { variant = 'primary', size = 'md', ...props } = $props();
</script>

<button 
  class="font-ui tracking-wider transition-colors
    {variant === 'primary' ? 'bg-primary text-primary-foreground' : 'border border-border bg-transparent'}
    {size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}"
  {...props}
>
  <slot />
</button>
```

## Design Tokens via CSS Variables

Configure Tailwind to use CSS custom properties:

```javascript
// tailwind.config.js
theme: {
  colors: {
    primary: 'hsl(var(--primary))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
  }
}
```

This enables runtime theming and keeps your config clean.

## Group Related Utilities

Use Prettier's tailwind plugin to sort classes, and group logically:

```html
<!-- Layout -->
<div class="
  grid grid-cols-12 gap-px
  bg-border
">
  <!-- Child with its own logical grouping -->
  <div class="
    col-span-4
    bg-background p-6
    text-sm text-muted-foreground
  ">
```

## Responsive Design Patterns

Mobile-first is the way:

```html
<div class="
  grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  gap-4
">
```

Use container queries for component-level responsiveness:

```html
<div class="@container">
  <div class="@lg:flex @lg:items-center">
    <!-- Content adapts to container size -->
  </div>
</div>
```

## Performance Considerations

1. **PurgeCSS is your friend**: Unused utilities are stripped in production
2. **Avoid dynamic class names**: Use complete strings for proper purging
3. **Limit arbitrary values**: Prefer configured values when possible

```html
<!-- ❌ Avoid: Can't be purged -->
<div class="w-[${width}px]">

<!-- ✅ Better: Use configured or computed classes -->
<div class={`w-${widthClass}`}>
```

## Conclusion

Tailwind CSS is a powerful tool, but power requires responsibility. Follow conventions, extract components thoughtfully, and your codebase will remain maintainable at any scale.

---

*Need help organizing your Tailwind setup? [Let's chat](/contact).*
