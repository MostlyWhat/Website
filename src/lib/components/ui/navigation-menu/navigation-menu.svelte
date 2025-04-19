<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.RootProps = $props();
</script>

<NavigationMenuPrimitive.Root
	{...restProps}
	bind:ref
	class={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
>
	{@render children?.()}
</NavigationMenuPrimitive.Root>
