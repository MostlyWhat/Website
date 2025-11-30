<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps["level"];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			"focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 px-6 py-5 text-start text-sm font-semibold uppercase tracking-wider outline-none transition-all hover:bg-card focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:px-12 lg:px-16 [&[data-state=open]>svg]:rotate-180",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<ChevronDownIcon
			class="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
