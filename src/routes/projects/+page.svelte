<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, ExternalLink } from '@lucide/svelte';

	// Sample projects - these would typically come from a CMS or data file
	const projects = [
		{
			slug: 'design-system',
			title: 'Enterprise Design System',
			client: 'Tech Startup',
			category: 'Design System',
			year: '2024',
			description: 'A comprehensive design system built with SvelteKit and TailwindCSS, featuring 50+ components and extensive documentation.',
			tags: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'Storybook'],
			featured: true
		},
		{
			slug: 'saas-platform',
			title: 'SaaS Dashboard',
			client: 'FinTech Company',
			category: 'Web Application',
			year: '2024',
			description: 'A real-time analytics dashboard with complex data visualizations and role-based access control.',
			tags: ['SvelteKit', 'D3.js', 'Cloudflare Workers', 'PostgreSQL'],
			featured: true
		},
		{
			slug: 'ecommerce',
			title: 'Headless E-commerce',
			client: 'Retail Brand',
			category: 'E-commerce',
			year: '2023',
			description: 'High-performance e-commerce storefront with headless CMS integration and optimized checkout flow.',
			tags: ['SvelteKit', 'Shopify', 'Sanity CMS', 'Stripe'],
			featured: true
		},
		{
			slug: 'marketing-site',
			title: 'Product Marketing Site',
			client: 'B2B SaaS',
			category: 'Marketing',
			year: '2023',
			description: 'Conversion-focused marketing website with dynamic content and A/B testing capabilities.',
			tags: ['SvelteKit', 'Contentful', 'Vercel', 'Analytics']
		},
		{
			slug: 'documentation',
			title: 'Developer Documentation',
			client: 'API Platform',
			category: 'Documentation',
			year: '2023',
			description: 'Interactive API documentation with live code examples and integrated playground.',
			tags: ['SvelteKit', 'MDX', 'OpenAPI', 'Monaco Editor']
		},
		{
			slug: 'internal-tools',
			title: 'Internal Tools Suite',
			client: 'Enterprise Client',
			category: 'Internal Tools',
			year: '2023',
			description: 'Custom internal tooling for operations, reporting, and workflow automation.',
			tags: ['SvelteKit', 'Drizzle ORM', 'D1', 'Cloudflare']
		}
	];

	const categories = ['All', 'Design System', 'Web Application', 'E-commerce', 'Marketing', 'Documentation', 'Internal Tools'];
	let selectedCategory = $state('All');

	const filteredProjects = $derived(
		selectedCategory === 'All' 
			? projects 
			: projects.filter(p => p.category === selectedCategory)
	);
</script>

<svelte:head>
	<title>{m.projects_title()} — {m.site_name()}</title>
	<meta name="description" content={m.projects_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Portfolio</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl lg:text-6xl">{m.projects_title()}</h1>
		<p class="font-body text-lg text-muted-foreground md:text-xl">{m.projects_subtitle()}</p>
	</div>
</Section>

<!-- Filter Bar -->
<Section padding="none" class="border-b border-border">
	<div class="flex flex-wrap gap-2 py-4" use:scrollAnimate={{ animation: 'fade' }}>
		{#each categories as category}
			<button
				type="button"
				onclick={() => selectedCategory = category}
				class="font-ui border px-4 py-2 text-sm transition-colors {selectedCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-muted'}"
			>
				{category}
			</button>
		{/each}
	</div>
</Section>

<!-- Featured Projects -->
{#if selectedCategory === 'All'}
	<Section background="card">
		<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-ui text-sm uppercase tracking-wider text-primary">Featured</p>
		</div>

		<div class="stagger-children grid gap-6 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each projects.filter(p => p.featured) as project}
				<Tile interactive padding="none" class="group flex flex-col overflow-hidden">
					<!-- Project Image Placeholder -->
					<div class="aspect-video border-b border-border bg-muted">
						<div class="flex h-full items-center justify-center">
							<span class="font-mono text-sm text-muted-foreground">[ {project.category} ]</span>
						</div>
					</div>
					
					<div class="flex flex-1 flex-col p-6">
						<div class="mb-2 flex items-center justify-between">
							<span class="font-ui text-xs uppercase tracking-wider text-primary">{project.category}</span>
							<span class="font-mono text-xs text-muted-foreground">{project.year}</span>
						</div>
						
						<h3 class="font-ui mb-2 text-xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
						<p class="font-body mb-4 text-sm text-muted-foreground">{project.description}</p>
						
						<div class="mt-auto flex flex-wrap gap-2">
							{#each project.tags.slice(0, 3) as tag}
								<span class="font-mono border border-border bg-background px-2 py-1 text-xs">{tag}</span>
							{/each}
						</div>
					</div>
				</Tile>
			{/each}
		</div>
	</Section>
{/if}

<!-- All Projects Grid -->
<Section>
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui text-sm uppercase tracking-wider text-primary">
			{selectedCategory === 'All' ? 'All Projects' : selectedCategory}
		</p>
	</div>

	{#if filteredProjects.length > 0}
		<div class="stagger-children grid gap-4 md:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each filteredProjects as project}
				<Tile interactive padding="lg" class="group flex flex-col">
					<div class="mb-4 flex items-center justify-between">
						<span class="font-ui text-xs uppercase tracking-wider text-primary">{project.category}</span>
						<span class="font-mono text-xs text-muted-foreground">{project.year}</span>
					</div>
					
					<h3 class="font-ui mb-1 text-lg font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
					<p class="font-body mb-2 text-sm text-muted-foreground">{project.client}</p>
					<p class="font-body mb-4 text-sm text-muted-foreground">{project.description}</p>
					
					<div class="mt-auto flex flex-wrap gap-2">
						{#each project.tags as tag}
							<span class="font-mono border border-border bg-background px-2 py-1 text-xs">{tag}</span>
						{/each}
					</div>
				</Tile>
			{/each}
		</div>
	{:else}
		<Tile padding="xl" class="text-center">
			<p class="font-body text-muted-foreground">No projects found in this category.</p>
		</Tile>
	{/if}
</Section>

<!-- Testimonials / Stats Section -->
<Section background="card">
	<div class="grid gap-4 md:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		<Tile padding="lg" class="stagger-children text-center">
			<div class="font-display text-5xl text-primary">20+</div>
			<p class="font-ui mt-2 text-sm uppercase tracking-wider text-muted-foreground">Projects Delivered</p>
		</Tile>
		<Tile padding="lg" class="stagger-children text-center">
			<div class="font-display text-5xl text-primary">100%</div>
			<p class="font-ui mt-2 text-sm uppercase tracking-wider text-muted-foreground">Client Satisfaction</p>
		</Tile>
		<Tile padding="lg" class="stagger-children text-center">
			<div class="font-display text-5xl text-primary">5+</div>
			<p class="font-ui mt-2 text-sm uppercase tracking-wider text-muted-foreground">Years Experience</p>
		</Tile>
	</div>
</Section>

<!-- CTA Section -->
<Section padding="xl">
	<div class="text-center" use:scrollAnimate={{ animation: 'scale' }}>
		<h2 class="font-display mb-4 text-3xl md:text-4xl">Have a Project in Mind?</h2>
		<p class="font-body mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
			Let's discuss how we can bring your vision to life with our expertise.
		</p>
		<Button href="/contact" size="lg" class="font-ui">
			{m.cta_button_primary()}
			<ArrowRight class="ml-2 h-5 w-5" />
		</Button>
	</div>
</Section>
