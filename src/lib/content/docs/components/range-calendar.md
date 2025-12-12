---
title: "Range Calendar"
description: "A calendar for selecting date ranges."
category: "components"
order: 30
---

# Range Calendar

A calendar component for selecting date ranges with start and end dates.

## Installation

```ts
import { RangeCalendar } from '$lib/components/ui/range-calendar';
```

## Usage

```svelte
<script lang="ts">
  import { RangeCalendar } from '$lib/components/ui/range-calendar';
  import { today, getLocalTimeZone } from '@internationalized/date';

  let value = $state({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 })
  });
</script>

<RangeCalendar bind:value />
```

## Examples

### With Placeholder

```svelte
<script lang="ts">
  import { RangeCalendar } from '$lib/components/ui/range-calendar';
  import { today, getLocalTimeZone } from '@internationalized/date';

  let value = $state(undefined);
  const placeholder = today(getLocalTimeZone());
</script>

<RangeCalendar bind:value {placeholder} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | DateRange | - | The selected date range |
| placeholder | DateValue | - | Placeholder date when no range selected |
| disabled | boolean | false | Disable the calendar |
| readonly | boolean | false | Make the calendar read-only |
| minValue | DateValue | - | Minimum selectable date |
| maxValue | DateValue | - | Maximum selectable date |
| weekStartsOn | number | 0 | Day the week starts on (0 = Sunday) |
