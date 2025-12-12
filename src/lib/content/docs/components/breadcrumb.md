---
title: "Breadcrumb"
description: "Displays the path to the current resource using a hierarchy of links."
category: "components"
order: 5
---

# Breadcrumb

Displays the path to the current resource using a hierarchy of links.

## Installation

```ts
import * as Breadcrumb from '$lib/components/ui/breadcrumb';
```

## Default

A basic breadcrumb navigation.

```svelte live
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Props

### Breadcrumb.Root

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `""` |

### Breadcrumb.Link

| Prop | Type | Default |
|------|------|---------|
| `href` | `string` | - |
| `class` | `string` | `""` |
