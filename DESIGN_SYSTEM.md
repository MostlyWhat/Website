# MostlyWhat Systems - Design System Documentation

## Grid System

The grid system uses **multiples of 2** for column counts to maintain visual consistency across all screen sizes.

### Column Patterns

| Mobile (base) | Tablet (sm/md) | Desktop (lg) | Wide (xl) |
|---------------|----------------|--------------|-----------|
| 1 col         | 2 cols         | 4 cols       | 6 cols    |
| 2 cols        | 2 cols         | 4 cols       | 4 cols    |

### Standard Grid Patterns

```css
/* Services/Features: 2 → 3 → 6 columns */
.grid.grid-cols-2.md:grid-cols-3.lg:grid-cols-6

/* Cards/Blog: 1 → 2 → 3 columns */
.grid.grid-cols-1.sm:grid-cols-2.xl:grid-cols-3

/* Stats/Options: 2 → 4 columns */
.grid.grid-cols-2.md:grid-cols-4

/* Content/FAQ: 1 → 2 columns */
.grid.grid-cols-1.lg:grid-cols-2
```

### Gap System

- **`gap-px`**: Seamless tile effect with 1px border (primary pattern)
- **`gap-2`**: Tight spacing for dense information
- **`gap-4`**: Standard comfortable spacing

### 12-Column Layout

For complex layouts, use the 12-column grid:

```svelte
<div class="grid grid-cols-12 gap-px bg-border">
  <div class="col-span-12 lg:col-span-4">Sidebar</div>
  <div class="col-span-12 lg:col-span-8">Content</div>
</div>
```

Common column spans:
- **3/9**: Narrow sidebar + wide content
- **4/8**: Standard sidebar + content
- **5/7**: Balanced two-column
- **6/6**: Equal 50/50 split
- **8/4**: Wide content + narrow aside

---

## Hero Sections

### Full-Screen Hero
```svelte
<section class="relative flex min-h-[calc(100dvh-4rem)] flex-col">
  <!-- Background -->
  <div class="pointer-events-none absolute inset-0 -z-10">
    <div class="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
    <div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
  </div>
  
  <!-- Content aligned to bottom -->
  <div class="flex flex-1 flex-col justify-end p-4 pb-8 md:p-6 lg:p-8">
    ...
  </div>
  
  <!-- Stats bar at bottom -->
  <div class="grid grid-cols-3 gap-px border-t border-border bg-border">
    ...
  </div>
</section>
```

### Hero Heights
- `min-h-[calc(100dvh-4rem)]`: Full viewport minus header
- `min-h-[calc(75dvh-4rem)]`: 3/4 viewport
- `min-h-[calc(50dvh-4rem)]`: Half viewport

---

## Code-Inspired Elements

### Section Labels
```svelte
<p class="font-mono text-[10px] tracking-widest text-primary">// SECTION_NAME</p>
```

### Breadcrumb Path
```svelte
<span class="font-mono text-[10px] tracking-wider text-muted-foreground">
  <span class="text-primary">//</span> HOME / <span class="text-foreground">CURRENT_PAGE</span>
</span>
```

### Code Block Styling
```svelte
<div class="font-mono text-xs text-muted-foreground">
  <p class="text-primary">// FILENAME.TS</p>
  <p class="mt-4"><span class="text-yellow-400">const</span> data = {'{'}</p>
  <p class="pl-4">key: <span class="text-green-400">"value"</span>,</p>
  <p>{'}'}</p>
</div>
```

---

## Typography

### Uppercase Text
All navigation, labels, and buttons use uppercase:

```svelte
<a class="font-ui text-xs tracking-widest">ABOUT</a>
<p class="font-mono text-[10px] tracking-widest">CATEGORY</p>
<button class="font-ui tracking-wider">GET STARTED</button>
```

### Font Classes
- **`.font-display`**: Tourney - For big headings (always uppercase)
- **`.font-body`**: Hubot Sans - For body text
- **`.font-ui`**: Chakra Petch - For buttons and navigation
- **`.font-mono`**: JetBrains Mono - For labels and code

---

## Animation Classes

### Scroll Animations
```svelte
<!-- Fade in from bottom -->
<div use:scrollAnimate={{ animation: 'fade' }}>

<!-- Start visible (for above-fold content) -->
<div use:scrollAnimate={{ animation: 'fade', startVisible: true }}>

<!-- Stagger children -->
<div use:scrollAnimate={{ animation: 'stagger' }}>
  <div class="stagger-children">...</div>
</div>

<!-- Scale in -->
<div use:scrollAnimate={{ animation: 'scale' }}>
```

---

## Tile Pattern

The primary visual pattern uses `gap-px` with `bg-border` on the container:

```svelte
<div class="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
  {#each items as item}
    <div class="bg-background p-4 transition-colors hover:bg-card">
      ...
    </div>
  {/each}
</div>
```

This creates a seamless tile effect where the border color shows through the 1px gaps.

---

## Color Tokens

| Token | Usage |
|-------|-------|
| `text-primary` | Cobalt blue - links, accents, labels |
| `text-muted-foreground` | Gray - secondary text |
| `text-foreground` | White - primary text |
| `bg-background` | Deep black - main background |
| `bg-card` | Slightly lighter - tile backgrounds |
| `bg-border` | Grid line color |

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| base | 0px | Mobile first |
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |
