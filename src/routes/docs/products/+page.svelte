<script lang="ts">
	import { Package, Blocks, Server, Zap, Layout, FileText, Component } from '@lucide/svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>Products — Documentation</title>
	<meta name="description" content="Product documentation for MostlyWhat Systems. Web applications, deployment strategies, and more." />
</svelte:head>

<!-- Header -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PRODUCTS</span>
		<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">PRODUCTS</h1>
		<p class="font-body mt-6 max-w-2xl text-muted-foreground">
			Documentation for our product offerings, web applications, and deployment strategies.
		</p>
	</div>
</section>

<!-- Coming Soon Notice -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<div class="border border-border bg-card p-8 max-w-2xl">
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-primary/10">
					<Package class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h2 class="font-ui text-lg font-semibold tracking-wider">COMING SOON</h2>
					<p class="font-body mt-2 text-muted-foreground">
						Product documentation is currently being developed. Check back soon for comprehensive guides on our web applications and deployment solutions.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Planned Sections -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PLANNED.CONTENT</span>
		<h2 class="font-display mt-4 text-2xl font-bold uppercase">UPCOMING DOCUMENTATION</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		{#each [
			{ icon: Blocks, title: 'Architecture', desc: 'System architecture and design patterns', status: 'In Progress' },
			{ icon: Component, title: 'SvelteKit Apps', desc: 'Building web applications with SvelteKit', status: 'Planned' },
			{ icon: FileText, title: 'Static Sites', desc: 'Static site generation and deployment', status: 'Planned' },
			{ icon: Layout, title: 'Dashboards', desc: 'Admin dashboards and data visualization', status: 'Planned' },
			{ icon: Server, title: 'Cloudflare', desc: 'Deploying to Cloudflare Workers and Pages', status: 'Planned' },
			{ icon: Zap, title: 'Vercel', desc: 'Deploying to Vercel platform', status: 'Planned' }
		] as item (item.title)}
			<div class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 sm:col-span-6 md:px-12 lg:col-span-4 lg:px-16">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
					<item.icon class="h-5 w-5 text-muted-foreground" />
				</div>
				<div class="flex-1">
					<h3 class="font-ui text-sm font-semibold tracking-wider">{item.title}</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">{item.desc}</p>
				</div>
				<span class="font-mono text-[8px] tracking-wider text-muted-foreground">{item.status.toUpperCase()}</span>
			</div>
		{/each}
	</div>
</section>
