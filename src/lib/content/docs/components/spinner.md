---
title: "Spinner"
description: "A loading spinner indicator."
category: "components"
order: 34
---

# Spinner

A loading spinner for indicating pending operations.

## Installation

```ts
import { Spinner } from '$lib/components/ui/spinner';
```

## Usage

```svelte
<script lang="ts">
  import { Spinner } from '$lib/components/ui/spinner';
</script>

<Spinner />
```

## Examples

### Sizes

```svelte
<script lang="ts">
  import { Spinner } from '$lib/components/ui/spinner';
</script>

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

### With Text

```svelte
<script lang="ts">
  import { Spinner } from '$lib/components/ui/spinner';
</script>

<div class="flex items-center gap-2">
  <Spinner size="sm" />
  <span>Loading...</span>
</div>
```

### Button Loading State

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Spinner } from '$lib/components/ui/spinner';

  let loading = $state(false);
</script>

<Button disabled={loading}>
  {#if loading}
    <Spinner size="sm" class="mr-2" />
  {/if}
  Submit
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "sm" \| "md" \| "lg" | "md" | Size of the spinner |
| class | string | - | Additional CSS classes |
