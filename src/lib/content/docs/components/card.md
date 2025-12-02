---
title: "Card"
description: "Displays a card with header, content, and footer."
category: "components"
order: 9
---

# Card

Displays a card with header, content, and footer.

## Installation

```ts
import * as Card from '$lib/components/ui/card';
```

## Default

```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description goes here.</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here.</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card.Root>
```

## With Form

```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Create Project</Card.Title>
    <Card.Description>Deploy your new project in one-click.</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="name">Name</Label>
        <Input id="name" placeholder="Name of your project" />
      </div>
      <div class="space-y-2">
        <Label for="framework">Framework</Label>
        <Select.Root type="single">
          <Select.Trigger>
            <span>Select framework</span>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="next">Next.js</Select.Item>
            <Select.Item value="svelte">SvelteKit</Select.Item>
            <Select.Item value="astro">Astro</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  </Card.Content>
  <Card.Footer class="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </Card.Footer>
</Card.Root>
```

## Minimal Card

```svelte
<Card.Root>
  <Card.Content class="pt-6">
    <p>Simple content-only card.</p>
  </Card.Content>
</Card.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Card.Root` | The main card container |
| `Card.Header` | Contains the title and description |
| `Card.Title` | The card title |
| `Card.Description` | The card description |
| `Card.Content` | The main content area |
| `Card.Footer` | The footer area for actions |

## Props

### Card.Root

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | `undefined` |

> [!TIP]
> Cards work great with the grid system. Combine them with responsive columns for card layouts.
