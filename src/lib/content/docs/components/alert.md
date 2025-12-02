---
title: "Alert"
description: "Displays a callout for user attention."
category: "components"
order: 16
---

# Alert

Displays a callout for user attention.

## Installation

```ts
import * as Alert from '$lib/components/ui/alert';
```

## Default

A standard informational alert.

```svelte live
<Alert.Root>
  <Info class="h-4 w-4" />
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>This is an informational alert message.</Alert.Description>
</Alert.Root>
```

## Destructive

An alert for errors or warnings.

```svelte live
<Alert.Root variant="destructive">
  <AlertCircle class="h-4 w-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Something went wrong. Please try again.</Alert.Description>
</Alert.Root>
```

## Props

### Alert.Root

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"default" \| "destructive"` | `"default"` |
| `class` | `string` | `""` |
