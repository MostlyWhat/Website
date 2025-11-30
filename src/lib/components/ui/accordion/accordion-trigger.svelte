<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { Plus, Minus } from "@lucide/svelte";
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
			"group focus-visible:ring-ring/50 flex w-full items-center justify-between gap-4 px-6 py-5 text-left outline-none transition-all hover:bg-card focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:px-12 lg:px-16 [&[data-state=open]]:border-primary [&[data-state=open]]:bg-card",
			className
		)}
		{...restProps}
	>
		<span class="font-ui text-sm font-semibold uppercase tracking-wider">
			{@render children?.()}
		</span>
		<div class="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-card transition-all group-hover:border-primary group-[[data-state=open]]:border-primary group-[[data-state=open]]:bg-primary">
			<Plus class="h-4 w-4 text-muted-foreground transition-transform group-[[data-state=open]]:hidden group-hover:text-primary" />
			<Minus class="hidden h-4 w-4 text-primary-foreground group-[[data-state=open]]:block" />
		</div>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
