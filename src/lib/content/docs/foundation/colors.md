---
title: "Colors"
description: "Cobalt blue primary with yellow and red accents on dark backgrounds."
category: "foundation"
order: 2
slug: "colors"
---

# Colors

Cobalt blue primary with yellow and red accents on dark backgrounds.

## Primary Colors

| Color | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Cobalt Blue | `#00A3FF` | `--primary` | Primary actions, links, focus |
| Yellow | `#FFD500` | `--accent` | Highlights, warnings |
| Red | `#EF4444` | `--destructive` | Errors, destructive actions |

## Background Colors

| Color | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Black 950 | `#000814` | `--background` | Page background |
| Black 900 | `#001122` | `--card` | Card backgrounds |
| Black 800 | `#001a33` | `--muted` | Muted areas |
| Border | `#1a2744` | `--border` | All borders |

## Text Colors

| Color | CSS Variable | Usage |
|-------|--------------|-------|
| White | `--foreground` | Primary text |
| Gray 400 | `--muted-foreground` | Secondary text |

## Usage Examples

### Primary Button

```svelte
<Button class="bg-primary text-primary-foreground">
  Primary Action
</Button>
```

### Destructive Action

```svelte
<Button variant="destructive">
  Delete
</Button>
```

### Card with Border

```svelte
<div class="bg-card border border-border">
  Card content
</div>
```

### Muted Text

```svelte
<p class="text-muted-foreground">
  Secondary information
</p>
```

## Color Tokens

All colors are defined as CSS custom properties in `layout.css`:

```css
:root {
  --background: oklch(0.06 0.02 260);
  --foreground: oklch(0.95 0.008 260);
  --primary: oklch(0.58 0.20 230);
  --card: oklch(0.14 0.02 260);
  --border: oklch(0.22 0.02 260);
  --muted-foreground: oklch(0.60 0.01 260);
}
```
