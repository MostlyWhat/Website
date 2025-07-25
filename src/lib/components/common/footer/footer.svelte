<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { footerNavConfig } from '$lib/config/nav';

	let current_year = new Date().getFullYear();
</script>

<footer
	class="bg-background font-chakra relative z-30 grid grid-cols-1 gap-0 divide-x divide-y border sm:grid-cols-2 lg:grid-cols-4"
>
	<div
		class="bg-primary text-primary-foreground row-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1"
	>
		<div class="p-4">
			<p class="font-heading font-bold uppercase">MostlyWhat Systems</p>
			<p class="mt-2 text-sm">
				MostlyWhat Systems is a creative studio producing performant, minimalist, secure solutions.
			</p>
		</div>
	</div>

	{#each footerNavConfig as section, i (section.title)}
		<div class="row-span-1 lg:col-start-{i + 2} lg:row-span-2 lg:row-start-1">
			<div class="p-4">
				<p class="font-heading mb-2 font-bold uppercase">{section.title}</p>
				<div class="font-chakra flex flex-col space-y-1">
					{#if section.items && section.items.length > 0}
						{#each section.items as link (link.title)}
							<a
								class="hover:bg-primary hover:text-primary-foreground tracking-wide text-white uppercase"
								href={link.href}
								target={link.href?.startsWith('http') ? '_blank' : undefined}
								rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
							>
								<span class="flex flex-row items-center text-sm">
									[<ArrowUpRight class="h-4 w-4" />] {link.title}
								</span>
							</a>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/each}

	<div class="col-span-1 sm:col-span-2 lg:col-start-1">
		<div class="p-4">
			<p>&copy; 2018-{current_year} MostlyWhat Systems, LLC. All rights reserved.</p>
		</div>
	</div>
	<div class="col-span-1 sm:col-span-2 lg:col-start-3">
		<div class="p-4 text-sm">
			<p class="text-muted-foreground text-xs">
				Any use of the MostlyWhat Systems name, logo, or any other intellectual property is strictly
				prohibited without explicit written permission.
			</p>
		</div>
	</div>
</footer>
