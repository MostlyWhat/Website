---
title: "The Art of Motion: Animation Principles for Web"
slug: "animation-principles-web"
category: "Design"
date: "2024-07-28"
excerpt: "Creating meaningful motion that enhances user experience without sacrificing performance."
readTime: "6 MIN"
author: "Prem (MostlyWhat)"
featured: false
tags: ["Animation", "UX Design", "CSS", "Performance"]
---

# The Art of Motion: Animation Principles for Web

Animation on the web should serve a purpose. It guides attention, provides feedback, and creates emotional connection. Here's how we approach motion design.

## The 12 Principles (Adapted for Web)

Disney's animation principles translate beautifully to UI:

### 1. Ease In/Out

Never use linear timing. Objects accelerate and decelerate naturally:

```css
.element {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Anticipation

Prepare users for what's coming:

```css
.button:active {
  transform: scale(0.95);
}

.button:hover {
  transform: scale(1.02);
}
```

### 3. Follow Through

Elements don't stop abruptly. They settle into place:

```css
@keyframes bounce-in {
  0% { transform: scale(0); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## Performance-First Animation

Animate only compositor properties to maintain 60fps:

| ✅ Cheap | ❌ Expensive |
|----------|-------------|
| transform | width/height |
| opacity | margin/padding |
| filter | top/left |

### Using `will-change` Wisely

```css
/* Apply only during animation */
.animating {
  will-change: transform;
}
```

## Reduced Motion

Always respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In JavaScript:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  element.animate([...], { duration: 300 });
}
```

## Scroll-Based Animations

Modern CSS enables scroll-driven animations:

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

For broader support, use Intersection Observer:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);
```

## View Transitions API

For page transitions, the new View Transitions API:

```typescript
document.startViewTransition(async () => {
  await navigation.complete;
});
```

```css
::view-transition-old(main),
::view-transition-new(main) {
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
}
```

## Common Patterns

### Staggered Reveals

```css
.stagger-children > *:nth-child(1) { transition-delay: 0ms; }
.stagger-children > *:nth-child(2) { transition-delay: 50ms; }
.stagger-children > *:nth-child(3) { transition-delay: 100ms; }
```

### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.1),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

## Conclusion

Meaningful motion makes interfaces feel alive and responsive. Start subtle, measure performance, and always provide fallbacks. Animation should enhance—never obstruct—the user experience.

---

*Want to add life to your interface? [Let's create together](/contact).*
