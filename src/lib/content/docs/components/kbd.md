---
title: "Kbd"
description: "Keyboard key visual representation."
category: "components"
order: 20
---

# Kbd

A component for displaying keyboard keys or shortcuts.

## Installation

```ts
import { Kbd } from '$lib/components/ui/kbd';
```

## Usage

```svelte
<script lang="ts">
  import { Kbd } from '$lib/components/ui/kbd';
</script>

<Kbd>⌘</Kbd>
<Kbd>K</Kbd>
```

## Examples

### Single Key

```svelte
<Kbd>Enter</Kbd>
```

### Key Combination

```svelte
<div class="flex items-center gap-1">
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>C</Kbd>
</div>
```

### In Text

```svelte
<p>
  Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to open the command palette.
</p>
```

### Common Shortcuts

```svelte
<div class="space-y-2">
  <p class="flex items-center justify-between">
    <span>Save</span>
    <span><Kbd>Ctrl</Kbd> + <Kbd>S</Kbd></span>
  </p>
  <p class="flex items-center justify-between">
    <span>Copy</span>
    <span><Kbd>Ctrl</Kbd> + <Kbd>C</Kbd></span>
  </p>
  <p class="flex items-center justify-between">
    <span>Paste</span>
    <span><Kbd>Ctrl</Kbd> + <Kbd>V</Kbd></span>
  </p>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| class | string | - | Additional CSS classes |
