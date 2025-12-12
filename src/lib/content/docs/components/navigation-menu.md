---
title: "Navigation Menu"
description: "A collection of links for navigating websites."
category: "components"
order: 22
---

# Navigation Menu

A collection of links for navigating websites.

## Installation

```ts
import * as NavigationMenu from '$lib/components/ui/navigation-menu';
```

## Default

A basic navigation menu.

```svelte live
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Getting started</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <ul class="grid gap-3 p-4 w-[400px]">
          <li>
            <NavigationMenu.Link href="/docs">
              <div class="font-ui text-sm font-medium">Introduction</div>
              <p class="text-sm text-muted-foreground">Re-usable components built using Bits UI and Tailwind CSS.</p>
            </NavigationMenu.Link>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/docs/components">Components</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

## Props

### NavigationMenu.Root

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `""` |
| `class` | `string` | `""` |
