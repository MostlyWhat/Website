---
title: "Field"
description: "Form field wrapper with label and error handling."
category: "components"
order: 15
---

# Field

A form field wrapper component with built-in label and error handling.

## Installation

```ts
import * as Field from '$lib/components/ui/field';
```

## Usage

```svelte
<script lang="ts">
  import * as Field from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';
</script>

<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input type="email" placeholder="Enter your email" />
  <Field.Description>We'll never share your email.</Field.Description>
</Field.Root>
```

## Examples

### With Error

```svelte
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input type="email" class="border-destructive" />
  <Field.Error>Please enter a valid email address.</Field.Error>
</Field.Root>
```

### Required Field

```svelte
<Field.Root>
  <Field.Label>
    Email
    <span class="text-destructive">*</span>
  </Field.Label>
  <Input type="email" required />
</Field.Root>
```

### With Textarea

```svelte
<Field.Root>
  <Field.Label>Message</Field.Label>
  <Textarea placeholder="Enter your message" />
  <Field.Description>Maximum 500 characters.</Field.Description>
</Field.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| Field.Root | Container for the field |
| Field.Label | Label element for the field |
| Field.Description | Help text below the input |
| Field.Error | Error message display |
