<script lang="ts">
	import { NavigationMenuTriggerStyle } from "./index.js";
	import { cn } from "$lib/utils";
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger {...restProps} bind:ref class={cn(NavigationMenuTriggerStyle, className)}>
	{@render children?.()}

	<ChevronDown
		aria-hidden="true"
		class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
	/>
</NavigationMenuPrimitive.Trigger>
