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
			<NavigationMenu.Link
				class={cn(navigationMenuHomeStyle())}
				href="/"
			>
				MostlyWhat Systems
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		{#each mainNavConfig as item (item.title)}
			<NavigationMenu.Item>
				{#if item.items && item.items.length > 0}
					<NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle())}>
						<span class="flex flex-row items-center uppercase gap-2">
							<span>{item.title}</span>
						</span>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content class="min-w-full">
						{#if item.layout === 'grid'}
							<div class="grid grid-cols-3 gap-3 p-4 w-[500px]">
								{#each item.items as subItem (subItem.title)}
									<a
										href={subItem.href}
										class="block rounded-md p-3 hover:bg-muted"
									>
										<div class="font-medium">{subItem.title}</div>
										{#if subItem.description}
											<p class="text-sm text-muted-foreground">{subItem.description}</p>
										{/if}
									</a>
								{/each}
							</div>
						{:else if item.layout === 'featured'}
							<div class="flex flex-col p-4 w-[500px]">
								{#each item.items.filter(i => i.featured) as featuredItem (featuredItem.title)}
									<a
										href={featuredItem.href}
										class="mb-3 bg-primary/10 rounded-md p-4 hover:bg-primary/20"
									>
										<div class="font-bold text-lg">{featuredItem.title}</div>
										{#if featuredItem.description}
											<p>{featuredItem.description}</p>
										{/if}
									</a>
								{/each}
								<div class="grid grid-cols-2 gap-3">
									{#each item.items.filter(i => !i.featured) as subItem (subItem.title)}
										<a
											href={subItem.href}
											class="block rounded-md p-3 hover:bg-muted"
										>
											<div class="font-medium">{subItem.title}</div>
											{#if subItem.description}
												<p class="text-sm text-muted-foreground">{subItem.description}</p>
											{/if}
										</a>
									{/each}
								</div>
							</div>
						{:else if item.layout === 'cards'}
							<div class="grid grid-cols-3 gap-4 p-4 w-[600px]">
								{#each item.items as subItem (subItem.title)}
									<a
										href={subItem.href}
										class="h-36 flex flex-col rounded-md border p-4 hover:bg-muted"
									>
										<div class="font-medium">{subItem.title}</div>
										{#if subItem.description}
											<p class="mt-2 text-sm text-muted-foreground">{subItem.description}</p>
										{/if}
									</a>
								{/each}
							</div>
						{:else if item.layout === 'list'}
							<div class="flex flex-col p-4 w-[400px]">
								{#each item.items as subItem (subItem.title)}
									<a
										href={subItem.href}
										class="block p-3 hover:bg-muted"
									>
										<div class="flex items-center justify-between">
											<div class="font-medium">{subItem.title}</div>
											{#if subItem.description}
												<p class="text-sm text-muted-foreground">{subItem.description}</p>
											{/if}
										</div>
									</a>
								{/each}
							</div>
						{:else}
							<!-- Default layout -->
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
						{/if}
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