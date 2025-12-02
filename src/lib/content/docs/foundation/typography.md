---
title: "Typography"
description: "Four distinct typefaces for display, body, UI, and code elements."
category: "foundation"
order: 3
slug: "typography"
---

# Typography

Four distinct typefaces for display, body, UI, and code elements.

## Typefaces

### Display — Tourney

Used for headlines, page titles, and large display text. Always uppercase with tight tracking.

```svelte
<h1 class="font-display text-5xl font-bold uppercase">
  HEADLINE TEXT
</h1>
```

### Body — Hubot Sans

Used for paragraphs, descriptions, and general body text. Optimized for readability.

```svelte
<p class="font-body text-lg text-muted-foreground">
  Body text content goes here.
</p>
```

### UI — Chakra Petch

Used for buttons, labels, navigation, and interactive elements. Features wider tracking.

```svelte
<button class="font-ui text-sm font-semibold tracking-wider">
  BUTTON TEXT
</button>
```

### Code — JetBrains Mono

Used for code snippets, technical content, and monospace elements.

```svelte
<code class="font-mono text-sm">
  const example = 'code';
</code>
```

## Type Scale

| Element | Classes |
|---------|---------|
| H1 (Hero) | `font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase` |
| H2 (Section) | `font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase` |
| H3 (Card) | `font-ui text-lg font-semibold tracking-wider` |
| Body | `font-body text-lg text-muted-foreground` |
| Small | `font-body text-sm text-muted-foreground` |
| Caption | `font-mono text-[10px] tracking-widest text-muted-foreground` |

## Section Markers

Use monospace text for section labels:

```svelte
<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
  // SECTION.NAME
</span>
```

## Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| Regular | `font-normal` | Body text |
| Medium | `font-medium` | Emphasized text |
| Semibold | `font-semibold` | Subheadings, labels |
| Bold | `font-bold` | Headlines |
| Black | `font-black` | Hero headlines |
