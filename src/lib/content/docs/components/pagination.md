---
title: "Pagination"
description: "Pagination with page navigation, next and previous links."
category: "components"
order: 23
---

# Pagination

Pagination with page navigation, next and previous links.

## Installation

```ts
import * as Pagination from '$lib/components/ui/pagination';
```

## Default

A basic pagination component.

```svelte live
<Pagination.Root count={100} perPage={10} let:pages let:currentPage>
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.PrevButton />
    </Pagination.Item>
    {#each pages as page (page.key)}
      {#if page.type === "ellipsis"}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
      {:else}
        <Pagination.Item>
          <Pagination.Link {page} isActive={currentPage === page.value}>
            {page.value}
          </Pagination.Link>
        </Pagination.Item>
      {/if}
    {/each}
    <Pagination.Item>
      <Pagination.NextButton />
    </Pagination.Item>
  </Pagination.Content>
</Pagination.Root>
```

## Props

### Pagination.Root

| Prop | Type | Default |
|------|------|---------|
| `count` | `number` | - |
| `perPage` | `number` | `10` |
| `page` | `number` | `1` |
| `siblingCount` | `number` | `1` |
| `class` | `string` | `""` |
