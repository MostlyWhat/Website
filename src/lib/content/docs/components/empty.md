---
title: "Empty"
description: "Empty state placeholder for no content scenarios."
category: "components"
order: 14
---

# Empty

An empty state component for when there's no content to display.

## Installation

```ts
import * as Empty from '$lib/components/ui/empty';
```

## Usage

```svelte
<script lang="ts">
  import * as Empty from '$lib/components/ui/empty';
</script>

<Empty.Root>
  <Empty.Icon>
    <!-- Icon here -->
  </Empty.Icon>
  <Empty.Title>No results found</Empty.Title>
  <Empty.Description>
    Try adjusting your search or filters.
  </Empty.Description>
  <Empty.Actions>
    <Button>Clear filters</Button>
  </Empty.Actions>
</Empty.Root>
```

## Examples

### Simple Empty State

```svelte
<Empty.Root>
  <Empty.Title>No items yet</Empty.Title>
  <Empty.Description>
    Items you add will appear here.
  </Empty.Description>
</Empty.Root>
```

### With Action

```svelte
<Empty.Root>
  <Empty.Title>No projects</Empty.Title>
  <Empty.Description>
    Get started by creating your first project.
  </Empty.Description>
  <Empty.Actions>
    <Button>Create Project</Button>
  </Empty.Actions>
</Empty.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| Empty.Root | Container for the empty state |
| Empty.Icon | Slot for an illustrative icon |
| Empty.Title | Main heading text |
| Empty.Description | Supporting description text |
| Empty.Actions | Container for action buttons |
