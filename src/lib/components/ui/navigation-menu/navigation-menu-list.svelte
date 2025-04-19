<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.ListProps = $props();
</script>

<NavigationMenuPrimitive.List
	{...restProps}
	bind:ref
	class={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
>
	{@render children?.()}
</NavigationMenuPrimitive.List>
