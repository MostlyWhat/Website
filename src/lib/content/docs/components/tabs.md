---
title: "Tabs"
description: "A set of layered sections of content that display one panel at a time."
category: "components"
order: 11
---

# Tabs

A set of layered sections of content that display one panel at a time.

## Installation

```ts
import * as Tabs from '$lib/components/ui/tabs';
```

## Default

```svelte
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

## With Cards

```svelte
<Tabs.Root value="account">
  <Tabs.List class="grid w-full grid-cols-2">
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <Card.Root>
      <Card.Header>
        <Card.Title>Account</Card.Title>
        <Card.Description>Make changes to your account here.</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" value="Pedro Duarte" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Changes</Button>
      </Card.Footer>
    </Card.Root>
  </Tabs.Content>
  <Tabs.Content value="password">
    <Card.Root>
      <Card.Header>
        <Card.Title>Password</Card.Title>
        <Card.Description>Change your password here.</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <Label for="current">Current Password</Label>
          <Input id="current" type="password" />
        </div>
        <div class="space-y-2">
          <Label for="new">New Password</Label>
          <Input id="new" type="password" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Password</Button>
      </Card.Footer>
    </Card.Root>
  </Tabs.Content>
</Tabs.Root>
```

## Controlled

```svelte
<script>
  let value = $state("account");
</script>

<Tabs.Root bind:value>
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="password">Password content</Tabs.Content>
</Tabs.Root>

<p>Current tab: {value}</p>
```

## Components

| Component | Description |
|-----------|-------------|
| `Tabs.Root` | The root component that manages state |
| `Tabs.List` | Contains the tab triggers |
| `Tabs.Trigger` | A button that activates a tab panel |
| `Tabs.Content` | The content for each tab panel |

## Props

### Tabs.Root

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | First tab |
| `onValueChange` | `(value: string) => void` | `undefined` |

### Tabs.Trigger

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
| `disabled` | `boolean` | `false` |

### Tabs.Content

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | Required |
