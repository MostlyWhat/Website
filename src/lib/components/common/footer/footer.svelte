<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	let current_year = new Date().getFullYear();

	const links: { title: string; href: string }[] = [
		{
			title: 'About',
			href: '/about'
		},
		{
			title: 'Services',
			href: '/services'
		},
		{
			title: 'Projects',
			href: '/projects'
		},
		{
			title: 'News',
			href: '/news'
		},
		{
			title: 'Careers',
			href: '/careers'
		},
		{
			title: 'Contact',
			href: '/contact'
		}
	];
</script>

<footer
	class="z-30 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 bg-background font-chakra border divide-x divide-y">
	<div class="lg:col-start-1 row-span-1 lg:row-span-2 lg:row-start-1 bg-primary text-primary-foreground">
		<div class="p-4">
			<p class="font-heading font-bold uppercase">MostlyWhat Systems</p>
			<p class="text-sm mt-2">MostlyWhat Systems is a creative studio producing performant, minimalist, secure
				solutions.</p>
		</div>
	</div>
	<div class="lg:col-start-2 row-span-1 lg:row-span-2 lg:row-start-1">
		<div class="p-4">
			<p class="font-heading font-bold uppercase mb-2">Navigation</p>
			<div class="flex flex-col space-y-1 font-chakra">
				{#each links as link}
					<a
						class="text-white hover:bg-primary hover:text-primary-foreground uppercase tracking-wide"
						href={link.href}
					>
      <span class="flex flex-row items-center text-sm">[<ArrowUpRight
				class="h-4 w-4" />] {link.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="lg:col-start-3 row-span-1 lg:row-span-2 lg:row-start-1">
		<div class="p-4">
			<p class="font-heading font-bold uppercase mb-2">Connect</p>
			<div class="flex flex-col space-y-1 font-chakra">
				{#each links as link}
					<a
						class="text-white hover:bg-primary hover:text-primary-foreground uppercase tracking-wide"
						href={link.href}
					>
      <span class="flex flex-row items-center text-sm">[<ArrowUpRight
				class="h-4 w-4" />] {link.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="lg:col-start-4 row-span-1 lg:row-span-2 lg:row-start-1">
		<div class="p-4">
			<p class="font-heading font-bold uppercase mb-2">Legal</p>
			<div class="flex flex-col space-y-1 font-chakra">
				{#each links as link}
					<a
						class="text-white hover:bg-primary hover:text-primary-foreground uppercase tracking-wide"
						href={link.href}
					>
      <span class="flex flex-row items-center text-sm">[<ArrowUpRight
				class="h-4 w-4" />] {link.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="col-span-1 sm:col-span-2 lg:col-start-1">
		<div class="p-4">
			<p>Copyright 2018-{current_year} MostlyWhat Systems, LLC. All rights reserved.</p>
			<br />
			<p class="text-xs text-muted-foreground">
				Any use of the MostlyWhat Systems name, logo, or any other intellectual
				property is strictly prohibited without explicit written permission.</p>
		</div>
	</div>
	<div class="col-span-1 sm:col-span-2 lg:col-start-3">
		<div class="p-4 text-sm">
			<p class="italic">The sky calls to us. If we do not destroy ourselves, we will one
				day venture to the stars.</p>
			<p class="mt-6">- Carl Sagan</p>
		</div>
	</div>
</footer>