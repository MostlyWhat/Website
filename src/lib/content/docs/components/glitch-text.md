---
title: "Glitch Text"
description: "Text with animated glitch effects."
category: "components"
order: 17
---

# Glitch Text

A text component with animated glitch effects for cyberpunk/tech aesthetics.

## Installation

```ts
import { GlitchText } from '$lib/components/ui/glitch-text';
```

## Usage

```svelte
<script lang="ts">
  import { GlitchText } from '$lib/components/ui/glitch-text';
</script>

<GlitchText>SYSTEM ERROR</GlitchText>
```

## Examples

### Default

```svelte
<GlitchText>GLITCH EFFECT</GlitchText>
```

### In Headings

```svelte
<h1 class="text-4xl font-bold">
  <GlitchText>WELCOME</GlitchText>
</h1>
```

### With Custom Intensity

```svelte
<GlitchText intensity="high">CRITICAL ERROR</GlitchText>
<GlitchText intensity="low">Minor glitch</GlitchText>
```

### On Hover Only

```svelte
<GlitchText trigger="hover">Hover me</GlitchText>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| intensity | "low" \| "medium" \| "high" | "medium" | Intensity of the glitch effect |
| trigger | "always" \| "hover" | "always" | When to trigger the effect |
| class | string | - | Additional CSS classes |
