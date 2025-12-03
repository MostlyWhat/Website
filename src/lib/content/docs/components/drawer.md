---
title: "Drawer"
description: "A drawer component for Svelte."
category: "components"
order: 15
---

# Drawer

A drawer component that slides in from the edge of the screen.

## Installation

```ts
import * as Drawer from '$lib/components/ui/drawer';
```

## Default

A basic drawer that opens from the bottom.

```svelte live
<Drawer.Root>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline">Open Drawer</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Edit Profile</Drawer.Title>
      <Drawer.Description>Make changes to your profile here.</Drawer.Description>
    </Drawer.Header>
    <div class="p-4">
      <p class="text-sm text-muted-foreground">Drawer content goes here.</p>
    </div>
    <Drawer.Footer>
      <Button>Save changes</Button>
      <Drawer.Close asChild let:builder>
        <Button builders={[builder]} variant="outline">Cancel</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

## Props

### Drawer.Root

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `shouldScaleBackground` | `boolean` | `true` |
