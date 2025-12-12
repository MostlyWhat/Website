---
title: "Native Select"
description: "Native HTML select element with consistent styling."
category: "components"
order: 22
---

# Native Select

A styled native HTML select element for simple dropdowns.

## Installation

```ts
import { NativeSelect } from '$lib/components/ui/native-select';
```

## Usage

```svelte
<script lang="ts">
  import { NativeSelect } from '$lib/components/ui/native-select';

  let value = $state('');
</script>

<NativeSelect bind:value>
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</NativeSelect>
```

## Examples

### With Default Value

```svelte
<script lang="ts">
  let value = $state('2');
</script>

<NativeSelect bind:value>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</NativeSelect>
```

### Disabled

```svelte
<NativeSelect disabled>
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
</NativeSelect>
```

### With Option Groups

```svelte
<NativeSelect>
  <optgroup label="Fruits">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
  </optgroup>
  <optgroup label="Vegetables">
    <option value="carrot">Carrot</option>
    <option value="broccoli">Broccoli</option>
  </optgroup>
</NativeSelect>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | - | The selected value |
| disabled | boolean | false | Disable the select |
| required | boolean | false | Make the field required |
| class | string | - | Additional CSS classes |
