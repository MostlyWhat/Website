<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();
</script>

<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	class={cn(
		"data-[state=active]:text-foreground data-[state=active]:border-primary focus-visible:ring-ring/50 text-muted-foreground relative inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-4 text-xs font-ui font-medium uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		className
	)}
	{...restProps}
/>
