<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import NavigationMenuViewport from './navigation-menu-viewport.svelte';

	let {
		ref = $bindable(null),
		class: className,
		viewport = true,
		children,
		...restProps
	}: NavigationMenuPrimitive.RootProps & {
		viewport?: boolean;
	} = $props();
</script>

<NavigationMenuPrimitive.Root
	{...restProps}
	bind:ref
	class={cn(
		"group/navigation-menu relative flex max-w-max flex-1 items-center justify-center font-chakra",
		className
	)}
	data-slot="navigation-menu"
	data-viewport={viewport}
>
	{@render children?.()}

	{#if viewport}
		<NavigationMenuViewport />
	{/if}
</NavigationMenuPrimitive.Root>
