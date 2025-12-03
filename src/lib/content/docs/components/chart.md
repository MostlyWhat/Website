---
title: "Chart"
description: "Data visualization components using Chart.js."
category: "components"
order: 6
---

# Chart

Data visualization components for displaying charts and graphs.

## Installation

```ts
import * as Chart from '$lib/components/ui/chart';
```

## Usage

```svelte
<script lang="ts">
  import * as Chart from '$lib/components/ui/chart';
</script>

<Chart.Container
  config={{
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))"
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))"
    }
  }}
>
  <!-- Chart content here -->
</Chart.Container>
```

## Examples

### With Tooltip

```svelte
<Chart.Container config={chartConfig}>
  <Chart.Tooltip content={Chart.TooltipContent} />
  <!-- Chart content -->
</Chart.Container>
```

### With Legend

```svelte
<Chart.Container config={chartConfig}>
  <Chart.Legend content={Chart.LegendContent} />
  <!-- Chart content -->
</Chart.Container>
```

## Components

| Component | Description |
|-----------|-------------|
| Chart.Container | Wrapper that provides chart configuration context |
| Chart.Tooltip | Tooltip component for data points |
| Chart.TooltipContent | Default tooltip content renderer |
| Chart.Legend | Chart legend component |
| Chart.LegendContent | Default legend content renderer |
| Chart.Style | Injects chart-specific CSS variables |
