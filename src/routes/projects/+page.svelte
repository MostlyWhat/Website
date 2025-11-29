<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight } from '@lucide/svelte';

	const projects = [
		{ slug: 'design-system', title: 'Enterprise Design System', client: 'Tech Startup', category: 'Design System', year: '2024', description: 'Comprehensive design system with 50+ components.', tags: ['SvelteKit', 'TypeScript', 'TailwindCSS'], featured: true },
		{ slug: 'saas-platform', title: 'SaaS Dashboard', client: 'FinTech Company', category: 'Web App', year: '2024', description: 'Real-time analytics with complex visualizations.', tags: ['SvelteKit', 'D3.js', 'PostgreSQL'], featured: true },
		{ slug: 'ecommerce', title: 'Headless E-commerce', client: 'Retail Brand', category: 'E-commerce', year: '2023', description: 'High-performance storefront with headless CMS.', tags: ['SvelteKit', 'Shopify', 'Stripe'], featured: true },
		{ slug: 'marketing-site', title: 'Product Marketing Site', client: 'B2B SaaS', category: 'Marketing', year: '2023', description: 'Conversion-focused website with A/B testing.', tags: ['SvelteKit', 'Contentful', 'Analytics'] },
		{ slug: 'documentation', title: 'Developer Documentation', client: 'API Platform', category: 'Docs', year: '2023', description: 'Interactive API docs with live playground.', tags: ['SvelteKit', 'MDX', 'OpenAPI'] },
		{ slug: 'internal-tools', title: 'Internal Tools Suite', client: 'Enterprise', category: 'Tools', year: '2023', description: 'Custom tooling for operations and reporting.', tags: ['SvelteKit', 'Drizzle', 'Cloudflare'] }
	];

	const categories = ['All', 'Design System', 'Web App', 'E-commerce', 'Marketing', 'Docs', 'Tools'];
	let selectedCategory = $state('All');

	const filteredProjects = $derived(
		selectedCategory === 'All' ? projects : projects.filter(p => p.category === selectedCategory)
	);

	const stats = [
		{ value: '20+', label: 'Projects Delivered' },
		{ value: '100%', label: 'Client Satisfaction' },
		{ value: '5+', label: 'Years Experience' }
	];
</script>

<svelte:head>
	<title>{m.projects_title()} — {m.site_name()}</title>
	<meta name="description" content={m.projects_subtitle()} />
</svelte:head>

<!-- Hero Section - Full Screen -->
<section class="relative flex min-h-[60vh] flex-col border-b border-border">
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<div class="flex flex-1 items-end p-4 pb-12 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid w-full gap-4 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<p class="font-mono text-xs uppercase tracking-wider text-primary">Portfolio</p>
				<h1 class="font-display mt-2 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
					{m.projects_title()}
				</h1>
			</div>
			<div class="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
				<p class="font-body text-muted-foreground">{m.projects_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Category Filter -->
	<div class="border-t border-border bg-card/50 backdrop-blur-sm">
		<div class="flex flex-wrap gap-px bg-border">
			{#each categories as category}
				<button
					type="button"
					onclick={() => selectedCategory = category}
					class="font-mono bg-background px-4 py-3 text-xs uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Projects Grid -->
<section class="border-b border-border">
	<div class="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each filteredProjects as project}
			<div class="stagger-children group flex flex-col bg-background transition-colors hover:bg-card">
				<!-- Image placeholder -->
				<div class="aspect-video border-b border-border bg-card">
					<div class="flex h-full items-center justify-center">
						<span class="font-mono text-xs uppercase text-muted-foreground">[ {project.category} ]</span>
					</div>
				</div>
				
				<div class="flex flex-1 flex-col p-4">
					<div class="flex items-center justify-between text-xs">
						<span class="font-mono uppercase text-primary">{project.category}</span>
						<span class="font-mono text-muted-foreground">{project.year}</span>
					</div>
					
					<h2 class="font-ui mt-2 text-sm font-semibold transition-colors group-hover:text-primary">{project.title}</h2>
					<p class="font-mono mt-1 text-xs text-muted-foreground">{project.client}</p>
					<p class="font-body mt-2 flex-1 text-xs text-muted-foreground">{project.description}</p>
					
					<div class="mt-3 flex flex-wrap gap-1">
						{#each project.tags as tag}
							<span class="font-mono border border-border bg-card px-2 py-0.5 text-[10px]">{tag}</span>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<div class="col-span-full bg-background p-8">
				<p class="font-body text-center text-muted-foreground">No projects found.</p>
			</div>
		{/each}
	</div>
</section>

<!-- Stats Grid -->
<section class="border-b border-border">
	<div class="grid gap-px bg-border md:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each stats as { value, label }}
			<div class="stagger-children bg-card p-4 md:p-6">
				<span class="font-display text-4xl font-bold text-primary">{value}</span>
				<p class="font-mono mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="p-4 md:p-6 lg:p-8">
			<h2 class="font-display text-2xl font-bold uppercase md:text-3xl">Have a Project in Mind?</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Let's discuss how we can bring your vision to life.</p>
			<Button href="/contact" class="font-ui mt-4">
				{m.cta_button_primary()}
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="border-t border-border bg-card p-4 md:p-6 lg:border-l lg:border-t-0 lg:p-8">
			<p class="font-mono text-xs uppercase text-muted-foreground">Get in touch</p>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-1 block text-lg text-primary hover:underline">hello@mostlywhat.systems</a>
		</div>
	</div>
</section>
