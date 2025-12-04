# MostlyWhat Systems Design System

## Overview

This document outlines the design system standards for the MostlyWhat Systems website. All pages and components should follow these guidelines for consistency.

---

## Padding System

| Breakpoint | Padding Class | Value |
|------------|--------------|-------|
| Mobile (default) | `px-6` | 24px |
| Tablet (md:) | `md:px-12` | 48px |
| Desktop (lg:) | `lg:px-16` | 64px |

**Usage:** Apply to all sections and nested content uniformly.

```svelte
<section class="px-6 md:px-12 lg:px-16">
  <!-- Content -->
</section>
```

---

## Grid System

Always use a 12-column grid (`grid-cols-12`) with `col-span-*` for responsive layouts.

| Mobile | Tablet | Desktop | Pattern |
|--------|--------|---------|---------|
| 12 cols | 6 cols | 4 cols | 3 items per row |
| 12 cols | 6 cols | 3 cols | 4 items per row |
| 12 cols | 4 cols | 2 cols | 6 items per row |

**Examples:**

```svelte
<!-- 3-column layout -->
<div class="grid grid-cols-12 gap-px">
  <div class="col-span-12 md:col-span-4">Item 1</div>
  <div class="col-span-12 md:col-span-4">Item 2</div>
  <div class="col-span-12 md:col-span-4">Item 3</div>
</div>

<!-- 4-column layout -->
<div class="grid grid-cols-12 gap-px">
  <div class="col-span-12 md:col-span-6 lg:col-span-3">Item</div>
  <!-- ... -->
</div>

<!-- 2-column split layout -->
<div class="grid grid-cols-12">
  <div class="col-span-12 lg:col-span-6">Left</div>
  <div class="col-span-12 lg:col-span-6">Right</div>
</div>
```

---

## Section Heights

| Section Type | Height Class | Purpose |
|--------------|-------------|---------|
| Hero | `h-dvh` | Full viewport hero sections |
| Content | `min-h-[80vh]` | Main content sections |
| CTA | `min-h-[60vh]` | Call-to-action sections |
| Stats/Bars | Natural height | Compact info bars |

---

## Icon Sizes

| Container | Icon Size | Usage |
|-----------|-----------|-------|
| `h-12 w-12` | `h-5 w-5` | Standard icon boxes in cards |
| `h-8 w-8` | `h-4 w-4` | Small icon boxes |
| Inline | `h-5 w-5` | Button icons |
| Inline | `h-4 w-4` | Small button icons |
| Inline | `h-3 w-3` | Tiny icons (arrows in links) |

**Example:**

```svelte
<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
  <Icon class="h-5 w-5 text-primary" />
</div>
```

---

## Button Sizes

| Size | Height | Horizontal Padding | Usage |
|------|--------|-------------------|-------|
| `sm` | `h-9` (36px) | `px-4` | Compact buttons |
| default | `h-10` (40px) | `px-5` | Standard buttons |
| `lg` | `h-12` (48px) | `px-6` | Large buttons |
| `xl` | `h-14` (56px) | `px-10` | Hero/CTA buttons |

**Hero/CTA buttons should use `size="xl"`**

```svelte
<Button href="/contact" size="xl" class="font-ui tracking-wider">
  START PROJECT
  <ArrowRight class="ml-2 h-5 w-5" />
</Button>
```

---

## Stats Bar Pattern

Compact stats bars at the bottom of hero sections:

```svelte
<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
  <div class="col-span-4 bg-background/80 px-6 py-5 backdrop-blur-sm md:px-12 lg:px-16">
    <span class="font-display text-xl font-bold text-primary md:text-2xl">VALUE</span>
    <p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">LABEL</p>
  </div>
  <!-- More stat items... -->
</div>
```

- Use `py-5` for compact vertical padding
- Use `col-span-4` for 3 stats, `col-span-3` for 4 stats
- Text size: `text-xl md:text-2xl` for values

---

## Section Markers

Section numbering pattern:

```svelte
<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
  01 — SECTION NAME
</span>
```

---

## Gap Pattern

Use `gap-px bg-border` with child `bg-background` for visible grid gaps:

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-4 bg-background px-6 py-8">Content</div>
  <div class="col-span-4 bg-background px-6 py-8">Content</div>
  <div class="col-span-4 bg-background px-6 py-8">Content</div>
</div>
```

---

## Typography

| Element | Classes |
|---------|---------|
| Section marker | `font-mono text-[10px] tracking-widest text-muted-foreground` |
| H1 (Hero) | `font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase` |
| H2 (Section) | `font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase` |
| H3 (Card) | `font-ui text-lg font-semibold tracking-wider` |
| Body | `font-body text-lg text-muted-foreground` |
| Small | `font-body text-sm text-muted-foreground` |

---

## Color Usage

- Primary actions: `text-primary`, `bg-primary`
- Backgrounds: `bg-background`, `bg-card`
- Borders: `border-border`
- Muted text: `text-muted-foreground`
- Primary accent: `text-primary`, `bg-primary/10`

---

## Responsive Breakpoints

| Breakpoint | Class Prefix | Min Width |
|------------|-------------|-----------|
| Mobile | (default) | 0px |
| Tablet | `md:` | 768px |
| Desktop | `lg:` | 1024px |
| Large Desktop | `xl:` | 1280px |

---

## Component Patterns

### Card with Icon

```svelte
<div class="flex flex-col bg-background px-6 py-8 md:px-12 lg:px-16">
  <div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
    <Icon class="h-5 w-5 text-primary" />
  </div>
  <h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">TITLE</h3>
  <p class="font-body mt-3 text-muted-foreground">Description</p>
</div>
```

### Contact Bar

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 md:col-span-4 bg-background px-6 py-8 md:px-12 lg:px-16">
    <span class="font-mono text-[10px] tracking-widest text-muted-foreground">LABEL</span>
    <p class="font-display mt-2 text-base md:text-lg">VALUE</p>
  </div>
  <!-- More items... -->
</div>
```

### CTA Section

```svelte
<section class="relative flex min-h-[60vh] flex-col border-b border-border">
  <div class="pointer-events-none absolute inset-0 -z-10">
    <img src="..." class="h-full w-full object-cover brightness-[0.15]" />
  </div>
  <div class="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 lg:px-16">
    <div class="max-w-3xl">
      <span class="font-mono text-[10px] tracking-widest text-muted-foreground">04 — READY?</span>
      <h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">CTA TITLE</h2>
      <p class="font-body mt-6 max-w-xl text-lg text-muted-foreground">Description</p>
      <div class="mt-8 flex flex-wrap gap-4">
        <Button href="/contact" size="xl">PRIMARY ACTION</Button>
        <Button href="/contact" variant="outline" size="xl">SECONDARY</Button>
      </div>
    </div>
  </div>
</section>
```

---

## Checklist

When creating or updating pages:

- [ ] Use `grid-cols-12` for all layouts
- [ ] Use consistent padding: `px-6 md:px-12 lg:px-16`
- [ ] Use `min-h-[80vh]` for content sections (not `min-h-dvh`)
- [ ] Use `min-h-[60vh]` for CTA sections
- [ ] Use `h-12 w-12` icon boxes with `h-5 w-5` icons
- [ ] Use `size="xl"` for hero/CTA buttons
- [ ] Add section markers: `01 — SECTION NAME`
- [ ] Use `gap-px bg-border` pattern for visible gaps
