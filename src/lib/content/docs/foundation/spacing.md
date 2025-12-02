---
title: "Spacing"
description: "Consistent spacing creates visual rhythm. Use these values throughout your layouts."
category: "foundation"
order: 4
slug: "spacing"
---

# Spacing

Consistent spacing creates visual rhythm. Use these values throughout your layouts.

## Responsive Padding

All sections use consistent horizontal padding that scales with viewport:

| Breakpoint | Class | Value |
|------------|-------|-------|
| Mobile | `px-6` | 24px |
| Tablet | `md:px-12` | 48px |
| Desktop | `lg:px-16` | 64px |

```svelte
<section class="px-6 md:px-12 lg:px-16">
  Content with responsive padding
</section>
```

## Vertical Spacing

| Usage | Class | Value |
|-------|-------|-------|
| Section padding | `py-12` | 48px |
| Card padding | `py-8` | 32px |
| Compact padding | `py-6` | 24px |
| Stats bar | `py-5` | 20px |

## Spacing Scale

| Token | Class | Value |
|-------|-------|-------|
| Space 1 | `p-1` | 4px |
| Space 2 | `p-2` | 8px |
| Space 3 | `p-3` | 12px |
| Space 4 | `p-4` | 16px |
| Space 5 | `p-5` | 20px |
| Space 6 | `p-6` | 24px |
| Space 8 | `p-8` | 32px |
| Space 10 | `p-10` | 40px |
| Space 12 | `p-12` | 48px |
| Space 16 | `p-16` | 64px |

## Gap Values

| Usage | Class | Value |
|-------|-------|-------|
| Grid gap | `gap-px` | 1px |
| Flex gap | `gap-4` | 16px |
| Button group | `gap-2` | 8px |

## Section Heights

| Section Type | Class | Usage |
|--------------|-------|-------|
| Hero | `h-dvh` | Full viewport |
| Content | `min-h-[80vh]` | Main sections |
| CTA | `min-h-[60vh]` | Call-to-action |
| Stats | Natural height | Compact bars |

## Icon Sizes

| Container | Icon | Usage |
|-----------|------|-------|
| `h-12 w-12` | `h-5 w-5` | Standard icon boxes |
| `h-10 w-10` | `h-4 w-4` | Small icon boxes |
| `h-8 w-8` | `h-4 w-4` | Compact icon boxes |
| Inline | `h-5 w-5` | Button icons |
| Inline | `h-4 w-4` | Small icons |
| Inline | `h-3 w-3` | Tiny icons |

## Button Sizes

| Size | Height | Padding | Usage |
|------|--------|---------|-------|
| `sm` | 36px | `px-4` | Compact |
| default | 40px | `px-5` | Standard |
| `lg` | 48px | `px-6` | Large |
| `xl` | 56px | `px-10` | Hero/CTA |
