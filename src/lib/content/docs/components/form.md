---
title: "Form"
description: "Building forms with Svelte and validation."
category: "components"
order: 16
---

# Form

Building forms with validation using Formsnap and Superforms.

## Installation

```ts
import * as Form from '$lib/components/ui/form';
```

## Overview

The form components work with Superforms to provide:

- Type-safe form handling
- Client and server-side validation
- Accessible error messages
- Loading states

## Basic Example

```svelte
<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm } from 'sveltekit-superforms/client';
  
  export let data;
  const form = superForm(data.form);
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control let:attrs>
      <Form.Label>Email</Form.Label>
      <Input {...attrs} bind:value={$formData.email} />
    </Form.Control>
    <Form.Description>Your email address.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Button type="submit">Submit</Button>
</form>
```

## Components

### Form.Field

Wraps a form field with context for validation.

### Form.Control

Provides attributes for the form control element.

### Form.Label

Accessible label for the form field.

### Form.Description

Help text for the form field.

### Form.FieldErrors

Displays validation errors for the field.
