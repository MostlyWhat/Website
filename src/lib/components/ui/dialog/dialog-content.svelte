<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import XIcon from "@lucide/svelte/icons/x";
	import type { Snippet } from "svelte";
	import * as Dialog from "./index.js";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		showCloseButton = true,
		type = "INFO",
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
		portalProps?: DialogPrimitive.PortalProps;
		children: Snippet;
		showCloseButton?: boolean;
		type?: string;
	} = $props();
</script>

<Dialog.Portal {...portalProps}>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		bind:ref
		data-slot="dialog-content"
		class={cn(
			"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed start-[50%] top-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden border shadow-lg duration-200 sm:max-w-lg",
			className
		)}
		{...restProps}
	>
		<div class="flex h-10 shrink-0 items-center border-b border-primary bg-primary">
			<span class="px-4 text-[10px] font-mono font-medium uppercase tracking-widest text-primary-foreground">// {type}</span>
			{#if showCloseButton}
				<DialogPrimitive.Close
					class="group ms-auto flex h-10 w-10 items-center justify-center border-l border-primary-foreground/20 outline-none transition-all hover:bg-primary-foreground/20 focus-visible:bg-primary-foreground/20 disabled:pointer-events-none disabled:opacity-50"
				>
					<XIcon class="size-3.5 text-primary-foreground" />
					<span class="sr-only">Close</span>
				</DialogPrimitive.Close>
			{/if}
		</div>
		{@render children?.()}
	</DialogPrimitive.Content>
</Dialog.Portal>
