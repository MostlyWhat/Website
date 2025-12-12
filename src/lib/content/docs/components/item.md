---
title: "Item"
description: "Flexible list item component for displaying content."
category: "components"
order: 19
---

# Item

A flexible item component for building lists, feeds, and content displays.

## Installation

```ts
import * as Item from '$lib/components/ui/item';
```

## Usage

```svelte
<script lang="ts">
  import * as Item from '$lib/components/ui/item';
</script>

<Item.Root>
  <Item.Content>
    <Item.Title>Item Title</Item.Title>
    <Item.Description>Item description text.</Item.Description>
  </Item.Content>
</Item.Root>
```

## Examples

### With Media

```svelte
<Item.Root>
  <Item.Media>
    <img src="/avatar.png" alt="User avatar" class="size-10" />
  </Item.Media>
  <Item.Content>
    <Item.Title>John Doe</Item.Title>
    <Item.Description>Software Engineer</Item.Description>
  </Item.Content>
</Item.Root>
```

### With Actions

```svelte
<Item.Root>
  <Item.Content>
    <Item.Title>Document.pdf</Item.Title>
    <Item.Description>2.4 MB • Modified yesterday</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="ghost" size="icon">
      <DownloadIcon class="size-4" />
    </Button>
    <Button variant="ghost" size="icon">
      <TrashIcon class="size-4" />
    </Button>
  </Item.Actions>
</Item.Root>
```

### Grouped Items

```svelte
<Item.Group>
  <Item.Root>
    <Item.Content>
      <Item.Title>Item 1</Item.Title>
    </Item.Content>
  </Item.Root>
  <Item.Separator />
  <Item.Root>
    <Item.Content>
      <Item.Title>Item 2</Item.Title>
    </Item.Content>
  </Item.Root>
</Item.Group>
```

### With Header and Footer

```svelte
<Item.Root>
  <Item.Header>
    <span class="text-muted-foreground text-xs">2 hours ago</span>
  </Item.Header>
  <Item.Content>
    <Item.Title>Notification Title</Item.Title>
    <Item.Description>This is the notification message.</Item.Description>
  </Item.Content>
  <Item.Footer>
    <Button size="sm">View Details</Button>
  </Item.Footer>
</Item.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| Item.Root | Container for the item |
| Item.Content | Main content area |
| Item.Title | Item title/heading |
| Item.Description | Supporting text |
| Item.Media | Container for images/icons |
| Item.Actions | Action buttons container |
| Item.Header | Top section of item |
| Item.Footer | Bottom section of item |
| Item.Group | Groups multiple items |
| Item.Separator | Divider between items |
