---
title: "Input OTP"
description: "Accessible one-time password component with copy paste functionality."
category: "components"
order: 19
---

# Input OTP

Accessible one-time password component with copy paste functionality.

## Installation

```ts
import * as InputOTP from '$lib/components/ui/input-otp';
```

## Default

A 6-digit OTP input.

```svelte live
<InputOTP.Root maxlength={6}>
  <InputOTP.Group>
    <InputOTP.Slot index={0} />
    <InputOTP.Slot index={1} />
    <InputOTP.Slot index={2} />
  </InputOTP.Group>
  <InputOTP.Separator />
  <InputOTP.Group>
    <InputOTP.Slot index={3} />
    <InputOTP.Slot index={4} />
    <InputOTP.Slot index={5} />
  </InputOTP.Group>
</InputOTP.Root>
```

## Props

### InputOTP.Root

| Prop | Type | Default |
|------|------|---------|
| `maxlength` | `number` | - |
| `value` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `class` | `string` | `""` |
