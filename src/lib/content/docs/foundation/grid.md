---
title: "Grid System"
description: "12-column grid with 1px gap borders. All elements align to the grid for visual consistency."
category: "foundation"
order: 1
slug: "grid"
---

# Grid System

12-column grid with 1px gap borders. All elements align to the grid for visual consistency.

## 12-Column Layout

The grid uses 12 columns that can be combined to create various layouts. Use `col-span-*` classes to define column widths.

## Common Patterns

### Three Columns (4-4-4)

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 md:col-span-4 bg-background px-6 py-8">Item 1</div>
  <div class="col-span-12 md:col-span-4 bg-background px-6 py-8">Item 2</div>
  <div class="col-span-12 md:col-span-4 bg-background px-6 py-8">Item 3</div>
</div>
```

### Two Columns (6-6)

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 md:col-span-6 bg-background px-6 py-8">Left</div>
  <div class="col-span-12 md:col-span-6 bg-background px-6 py-8">Right</div>
</div>
```

### Sidebar Layout (3-9)

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 lg:col-span-3 bg-card px-6 py-8">Sidebar</div>
  <div class="col-span-12 lg:col-span-9 bg-background px-6 py-8">Content</div>
</div>
```

### Four Columns

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-6 lg:col-span-3 bg-background px-6 py-8">1</div>
  <div class="col-span-6 lg:col-span-3 bg-background px-6 py-8">2</div>
  <div class="col-span-6 lg:col-span-3 bg-background px-6 py-8">3</div>
  <div class="col-span-6 lg:col-span-3 bg-background px-6 py-8">4</div>
</div>
```

## Gap Pattern

Use `gap-px bg-border` with child `bg-background` for visible 1px grid gaps:

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-4 bg-background">...</div>
</div>
```

## Responsive Breakpoints

| Breakpoint | Class Prefix | Min Width |
|------------|-------------|-----------|
| Mobile | (default) | 0px |
| Tablet | `md:` | 768px |
| Desktop | `lg:` | 1024px |
| Large | `xl:` | 1280px |

## Padding System

| Breakpoint | Class | Value |
|------------|-------|-------|
| Mobile | `px-6` | 24px |
| Tablet | `md:px-12` | 48px |
| Desktop | `lg:px-16` | 64px |
