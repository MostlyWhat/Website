---
title: "Calendar"
description: "A date field component that allows users to enter and edit date."
category: "components"
order: 8
---

# Calendar

A date field component that allows users to enter and edit date values.

## Installation

```ts
import { Calendar } from '$lib/components/ui/calendar';
```

## Default

A basic calendar for date selection.

```svelte live
<Calendar class="border border-border" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `DateValue` | - |
| `placeholder` | `DateValue` | - |
| `weekdayFormat` | `"narrow" \| "short" \| "long"` | `"short"` |
| `class` | `string` | `""` |
