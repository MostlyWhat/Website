<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { ArrowUpRight } from '@lucide/svelte';
	import {
		navigationMenuHomeStyle,
		navigationMenuTriggerStyle
	} from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { cn } from '$lib/utils';
	import { navigationConfig } from '$lib/config/nav';

	// We can still accept links prop, but we'll primarily use navigationConfig
	let { links = [] } = $props();
</script>

<NavigationMenu.Root class="mr-auto hidden lg:block" viewport>
	<NavigationMenu.List>
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
					<NavigationMenu.Content>
						<ul class="grid w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{#each item.items as subItem (subItem.title)}
								<li>
									<NavigationMenu.Link
										href={subItem.href}
										class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										external={subItem.external}
									>
										<div class="text-sm font-medium leading-none">{subItem.title}</div>
										{#if subItem.label}
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">{subItem.label}</p>
										{/if}
									</NavigationMenu.Link>
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				{:else}
					<NavigationMenu.Link
						class={cn(navigationMenuTriggerStyle())}
						href={item.href}
						external={item.external}
					>
      <span class="flex flex-row items-center uppercase gap-2">
       <span>{item.title}</span>
				{#if item.external}
        <ArrowUpRight class="h-4 w-4" />
       {/if}
      </span>
					</NavigationMenu.Link>
				{/if}
			</NavigationMenu.Item>
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>