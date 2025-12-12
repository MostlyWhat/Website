---
title: "Sidebar"
description: "A collapsible side navigation panel."
category: "components"
order: 32
---

# Sidebar

A collapsible navigation sidebar for application layouts.

## Installation

```ts
import * as Sidebar from '$lib/components/ui/sidebar';
```

## Usage

```svelte
<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar';
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header>
      <h2>Navigation</h2>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>Dashboard</Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>Settings</Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <p>Footer content</p>
    </Sidebar.Footer>
  </Sidebar.Root>
  <main>
    <Sidebar.Trigger />
    <p>Main content</p>
  </main>
</Sidebar.Provider>
```

## Components

| Component | Description |
|-----------|-------------|
| Sidebar.Provider | Context provider for sidebar state |
| Sidebar.Root | Main sidebar container |
| Sidebar.Header | Header section |
| Sidebar.Content | Scrollable content area |
| Sidebar.Footer | Footer section |
| Sidebar.Group | Groups related menu items |
| Sidebar.GroupLabel | Label for a group |
| Sidebar.GroupContent | Content wrapper for group |
| Sidebar.Menu | Menu container |
| Sidebar.MenuItem | Individual menu item |
| Sidebar.MenuButton | Button within menu item |
| Sidebar.Trigger | Toggle button for sidebar |
| Sidebar.Rail | Slim rail for collapsed state |
