---
title: "Data Table"
description: "Powerful table and datagrids built using TanStack Table."
category: "components"
order: 14
---

# Data Table

Powerful table and datagrids built using TanStack Table.

## Installation

```ts
import * as Table from '$lib/components/ui/table';
// Plus TanStack Table for data management
```

## Default

A basic data table with sorting and filtering.

```svelte live
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">INV001</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
      <Table.Cell>Credit Card</Table.Cell>
      <Table.Cell class="text-right">$250.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">INV002</Table.Cell>
      <Table.Cell>Pending</Table.Cell>
      <Table.Cell>PayPal</Table.Cell>
      <Table.Cell class="text-right">$150.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Features

- Sorting
- Filtering
- Pagination
- Row selection
- Column visibility
- Column resizing

## Props

See TanStack Table documentation for full API reference.
