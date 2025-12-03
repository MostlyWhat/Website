---
title: "Input Group"
description: "Input with attached addons like buttons or text."
category: "components"
order: 18
---

# Input Group

Group inputs with addons like buttons, icons, or text.

## Installation

```ts
import * as InputGroup from '$lib/components/ui/input-group';
```

## Usage

```svelte
<script lang="ts">
  import * as InputGroup from '$lib/components/ui/input-group';
  import { Input } from '$lib/components/ui/input';
</script>

<InputGroup.Root>
  <InputGroup.Addon>$</InputGroup.Addon>
  <Input type="number" placeholder="0.00" />
</InputGroup.Root>
```

## Examples

### With Suffix

```svelte
<InputGroup.Root>
  <Input type="text" placeholder="username" />
  <InputGroup.Addon>@example.com</InputGroup.Addon>
</InputGroup.Root>
```

### With Button

```svelte
<InputGroup.Root>
  <Input type="text" placeholder="Search..." />
  <InputGroup.Button>
    <SearchIcon class="size-4" />
  </InputGroup.Button>
</InputGroup.Root>
```

### With Icon

```svelte
<InputGroup.Root>
  <InputGroup.Addon>
    <MailIcon class="size-4" />
  </InputGroup.Addon>
  <Input type="email" placeholder="Enter email" />
</InputGroup.Root>
```

### Both Sides

```svelte
<InputGroup.Root>
  <InputGroup.Addon>https://</InputGroup.Addon>
  <Input type="text" placeholder="example" />
  <InputGroup.Addon>.com</InputGroup.Addon>
</InputGroup.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| InputGroup.Root | Container for input and addons |
| InputGroup.Addon | Text or icon addon |
| InputGroup.Button | Button addon |
