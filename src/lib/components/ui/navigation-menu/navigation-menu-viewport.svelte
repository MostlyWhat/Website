<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ViewportProps = $props();
</script>

<div class={cn('absolute top-full left-0 isolate z-50 flex justify-center')}>
	<NavigationMenuPrimitive.Viewport
		{...restProps}
		bind:ref
		class={cn(
			'origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative h-[var(--bits-navigation-menu-viewport-height)] min-w-screen overflow-hidden rounded-md border shadow md:w-[var(--bits-navigation-menu-viewport-width)]',
			className
		)}
		data-slot="navigation-menu-viewport"
	/>
</div>
