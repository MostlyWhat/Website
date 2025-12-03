<script lang="ts">
	import { Server, Code2, Search, Settings, Shield, Key } from '@lucide/svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>API Reference — Documentation</title>
	<meta name="description" content="API documentation for MostlyWhat Systems. Authentication, endpoints, and integration guides." />
</svelte:head>

<!-- Header -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// API</span>
		<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">API REFERENCE</h1>
		<p class="font-body mt-6 max-w-2xl text-muted-foreground">
			Complete API documentation with authentication guides, endpoint references, and integration examples.
		</p>
	</div>
</section>

<!-- Coming Soon Notice -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<div class="border border-border bg-card p-8 max-w-2xl">
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-primary/10">
					<Server class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h2 class="font-ui text-lg font-semibold tracking-wider">COMING SOON</h2>
					<p class="font-body mt-2 text-muted-foreground">
						API documentation is currently being developed. Check back soon for comprehensive guides on authentication and available endpoints.
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
			{ icon: Key, title: 'Authentication', desc: 'API keys and authentication methods', status: 'In Progress' },
			{ icon: Shield, title: 'Authorization', desc: 'Scopes and permission management', status: 'Planned' },
			{ icon: Code2, title: 'Contact API', desc: 'Contact form submission endpoints', status: 'Planned' },
			{ icon: Search, title: 'Search API', desc: 'Full-text search functionality', status: 'Planned' }
		] as item (item.title)}
			<div class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 sm:col-span-6 md:px-12 lg:px-16">
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

<!-- API Example -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PREVIEW</span>
		<h2 class="font-display mt-4 text-2xl font-bold uppercase">API PREVIEW</h2>
		<p class="font-body mt-4 text-muted-foreground max-w-2xl">
			Here's a preview of what the API will look like:
		</p>
		<div class="mt-6 border border-border bg-card">
			<div class="flex items-center justify-between border-b border-border px-4 py-2 bg-muted/30">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// EXAMPLE.REQUEST</span>
			</div>
			<pre class="p-4 font-mono text-xs overflow-x-auto"><code>curl -X POST https://api.mostlywhat.io/v1/contact \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '&#123;
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  &#125;'</code></pre>
		</div>
	</div>
</section>
