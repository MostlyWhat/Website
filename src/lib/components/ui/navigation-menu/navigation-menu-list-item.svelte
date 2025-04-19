<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(),
		class: className,
		children,
		title,
		href,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLAnchorElement>> & {
		href?: string;
	} = $props();
</script>

<li>
	<NavigationMenuPrimitive.Link>
		<a
			{...restProps}
			bind:this={ref}
			class={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
			href={href}
		>
			<div class="text-sm font-medium leading-none">{title}</div>

			<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
				{@render children?.()}
			</p>
		</a>
	</NavigationMenuPrimitive.Link>
</li>
