<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AlertDialogPrimitive.DescriptionProps = $props();
</script>

<AlertDialogPrimitive.Description
	{...restProps}
	bind:ref
	class={cn('text-muted-foreground text-sm px-4', className)}
	data-slot="alert-dialog-description"
/>
