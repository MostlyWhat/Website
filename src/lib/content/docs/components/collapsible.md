---
title: "Collapsible"
description: "An interactive component which expands/collapses a panel."
category: "components"
order: 11
---

# Collapsible

An interactive component which expands and collapses a panel.

## Installation

```ts
import * as Collapsible from '$lib/components/ui/collapsible';
```

## Default

A basic collapsible panel.

```svelte live
<Collapsible.Root class="w-[350px] space-y-2">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="font-ui text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <Collapsible.Trigger asChild let:builder>
      <Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
        <ChevronsUpDown class="h-4 w-4" />
        <span class="sr-only">Toggle</span>
      </Button>
    </Collapsible.Trigger>
  </div>
  <div class="border border-border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
  <Collapsible.Content class="space-y-2">
    <div class="border border-border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
    <div class="border border-border px-4 py-3 font-mono text-sm">@stitches/react</div>
  </Collapsible.Content>
</Collapsible.Root>
```

## Props

### Collapsible.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `class` | `string` | `""` |
