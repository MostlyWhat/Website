---
title: "Tabs"
description: "A set of layered sections of content displayed one at a time."
category: "components"
order: 11
---

# Tabs

A set of layered sections of content displayed one at a time.

## Installation

```ts
import * as Tabs from '$lib/components/ui/tabs';
```

## Default

A standard tabs component.

```svelte live
<Tabs.Root value="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <p>Account settings content here.</p>
  </Tabs.Content>
  <Tabs.Content value="password">
    <p>Password settings content here.</p>
  </Tabs.Content>
</Tabs.Root>
```

## Props

### Tabs.Root

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `""` |

### Tabs.Trigger

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
| `disabled` | `boolean` | `false` |
