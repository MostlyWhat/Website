---
title: "Sonner"
description: "An opinionated toast component for Svelte."
category: "components"
order: 29
---

# Sonner

An opinionated toast component for Svelte.

## Installation

```ts
import { Toaster, toast } from '$lib/components/ui/sonner';
```

## Setup

Add the Toaster component to your root layout:

```svelte
<script>
  import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster />
<slot />
```

## Usage

```svelte live
<Button onclick={() => toast('Event has been created')}>
  Show Toast
</Button>
```

## Variants

```ts
// Success
toast.success('Event created successfully');

// Error
toast.error('Something went wrong');

// Warning
toast.warning('Please verify your email');

// Info
toast.info('New update available');

// Promise
toast.promise(promise, {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Error!'
});
```

## Props

### Toaster

| Prop | Type | Default |
|------|------|---------|
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"bottom-right"` |
| `richColors` | `boolean` | `false` |
| `expand` | `boolean` | `false` |
| `duration` | `number` | `4000` |
