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

```svelte
<Alert.Root>
  <Info class="h-4 w-4" />
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>
    You can add components to your app using the CLI.
  </Alert.Description>
</Alert.Root>
```

## Destructive

```svelte
<Alert.Root variant="destructive">
  <AlertCircle class="h-4 w-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>
    Your session has expired. Please log in again.
  </Alert.Description>
</Alert.Root>
```

## Without Icon

```svelte
<Alert.Root>
  <Alert.Title>Note</Alert.Title>
  <Alert.Description>
    This is a simple alert without an icon.
  </Alert.Description>
</Alert.Root>
```

## Title Only

```svelte
<Alert.Root>
  <Info class="h-4 w-4" />
  <Alert.Title>Quick tip: Use keyboard shortcuts for faster navigation.</Alert.Title>
</Alert.Root>
```

## Components

| Component | Description |
|-----------|-------------|
| `Alert.Root` | The main alert container |
| `Alert.Title` | The alert title |
| `Alert.Description` | The alert description |

## Props

### Alert.Root

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"default" \| "destructive"` | `"default"` |
| `class` | `string` | `undefined` |

> [!WARNING]
> Use destructive alerts sparingly. They should be reserved for errors and critical warnings that require immediate attention.
