<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import {
		navigationMenuHomeStyle,
		navigationMenuTriggerStyle
	} from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { cn } from '$lib/utils';
	import { mainNavConfig } from '$lib/config/nav';
</script>

<NavigationMenu.Root class="mr-auto hidden lg:block" viewport>
	<NavigationMenu.List>
		<!-- Home link unchanged -->
		<NavigationMenu.Item>
			<NavigationMenu.Link class={cn(navigationMenuHomeStyle())} href="/">
				MostlyWhat Systems
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		{#each mainNavConfig as item (item.title)}
			<NavigationMenu.Item>
				{#if item.items && item.items.length > 0}
					<NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle())}>
						<span class="flex flex-row items-center gap-2 uppercase">
							<span>{item.title}</span>
						</span>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content class="min-w-full">
						{#if item.layout === 'grid'}
							<div class="grid w-[500px] grid-cols-3 gap-3 p-4">
								{#each item.items as subItem (subItem.title)}
									<a href={subItem.href} class="hover:bg-muted block rounded-md p-3">
										<div class="font-medium uppercase">{subItem.title}</div>
										{#if subItem.description}
											<p class="text-muted-foreground text-sm font-sans">{subItem.description}</p>
										{/if}
									</a>
								{/each}
							</div>
						{:else if item.layout === 'featured'}
							<div class="flex w-[500px] flex-col p-4">
								{#each item.items.filter((i) => i.featured) as featuredItem (featuredItem.title)}
									<a
										href={featuredItem.href}
										class="bg-primary/10 hover:bg-primary/20 mb-3 rounded-md p-4"
									>
										<div class="text-lg font-bold uppercase">{featuredItem.title}</div>
										{#if featuredItem.description}
											<p class="font-sans">{featuredItem.description}</p>
										{/if}
									</a>
								{/each}
								<div class="grid grid-cols-2 gap-3">
									{#each item.items.filter((i) => !i.featured) as subItem (subItem.title)}
										<a href={subItem.href} class="hover:bg-muted block rounded-md p-3">
											<div class="font-medium uppercase">{subItem.title}</div>
											{#if subItem.description}
												<p class="text-muted-foreground text-sm font-sans">{subItem.description}</p>
											{/if}
										</a>
									{/each}
								</div>
							</div>
						{:else if item.layout === 'cards'}
							<div class="flex justify-between w-full">
								{#each item.items as subItem (subItem.title)}
									<a
										href={subItem.href}
										class="p-4 h-64 w-full relative hover:bg-primary/50 transition-colors duration-200 flex flex-col justify-end"
									>
										<div class="font-medium uppercase">{subItem.title}</div>
										{#if subItem.description}
											<p class="text-muted-foreground mt-2 text-sm font-sans">{subItem.description}</p>
										{/if}
									</a>
								{/each}
							</div>
						{:else if item.layout === 'list'}
							<div class="flex w-[400px] flex-col p-4">
								{#each item.items as subItem (subItem.title)}
									<a href={subItem.href} class="hover:bg-muted block p-3">
										<div class="flex items-center justify-between">
											<div class="font-medium uppercase">{subItem.title}</div>
											{#if subItem.description}
												<p class="text-muted-foreground text-sm font-sans">{subItem.description}</p>
											{/if}
										</div>
									</a>
								{/each}
							</div>
						{:else}
							<!-- Default layout -->
							<div class="flex w-full justify-between">
								{#each item.items as subItem (subItem.title)}
									<a
										href={subItem.href}
										class="bg-primary/50 hover:bg-primary/80 relative flex h-64 w-full items-end transition-colors duration-200"
									>
										<span class="text-primary-foreground p-4 font-medium">{subItem.title}</span>
									</a>
								{/each}
							</div>
						{/if}
					</NavigationMenu.Content>
				{:else}
					<NavigationMenu.Link class={cn(navigationMenuTriggerStyle())} href={item.href}>
						<span class="flex flex-row items-center gap-2 uppercase">{item.title}</span>
					</NavigationMenu.Link>
				{/if}
			</NavigationMenu.Item>
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>
