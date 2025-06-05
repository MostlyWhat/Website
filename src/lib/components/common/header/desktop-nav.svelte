<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import {
		navigationMenuHomeStyle,
		navigationMenuTriggerStyle
	} from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { cn } from '$lib/utils';
	import { navigationConfig } from '$lib/config/nav';
</script>

<NavigationMenu.Root class="mr-auto hidden lg:block" viewport>
	<NavigationMenu.List>
		<!-- Home link unchanged -->
		<NavigationMenu.Item>
			<NavigationMenu.Link
				class={cn(navigationMenuHomeStyle())}
				href="/"
			>
				MostlyWhat Systems
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		{#each navigationConfig.mainNav as item (item.title)}
			<NavigationMenu.Item>
				{#if item.items && item.items.length > 0}
					<NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle())}>
      <span class="flex flex-row items-center uppercase gap-2">
       <span>{item.title}</span>
      </span>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content class="min-w-full">
						<div class="flex justify-between w-full">
							{#each item.items as subItem (subItem.title)}
								<a
									href={subItem.href}
									class="h-64 w-full relative bg-primary/50 hover:bg-primary/80 transition-colors duration-200 flex items-end"
								>
									<span class="p-4 text-primary-foreground font-medium">{subItem.title}</span>
								</a>
							{/each}
						</div>
					</NavigationMenu.Content>
				{:else}
					<NavigationMenu.Link
						class={cn(navigationMenuTriggerStyle())}
						href={item.href}
					>
						<span class="flex flex-row items-center uppercase gap-2">{item.title}</span>
					</NavigationMenu.Link>
				{/if}
			</NavigationMenu.Item>
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>