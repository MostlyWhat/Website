<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, ArrowUpRight } from '@lucide/svelte';

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
		{ value: '20+', label: 'PROJECTS' },
		{ value: '100%', label: 'SATISFACTION' },
		{ value: '5+', label: 'YEARS' }
	];
</script>

<svelte:head>
	<title>{m.projects_title()} — {m.site_name()}</title>
	<meta name="description" content={m.projects_subtitle()} />
</svelte:head>

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Grid Background -->
	<div class="pointer-events-none absolute inset-0 -z-10">
		<div class="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-end px-4 pb-8 md:px-6 lg:px-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SELECTED WORK</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.projects_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.projects_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		{#each stats as { value, label } (label)}
			<div class="col-span-4 bg-card/80 p-4 backdrop-blur-sm">
				<span class="font-display text-lg font-bold text-primary md:text-2xl">{value}</span>
				<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Filter Bar - Full Width Even Distribution -->
<section class="border-b border-border">
	<div class="grid grid-cols-8 gap-px bg-border">
		<!-- Filter Label -->
		<div class="col-span-1 flex items-center justify-center bg-card p-4">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FILTER</span>
		</div>
		<!-- Filter Options -->
		{#each categories as category (category)}
			<button
				type="button"
				onclick={() => selectedCategory = category}
				class="font-mono flex items-center justify-center bg-background p-4 text-xs uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
			>
				{category}
			</button>
		{/each}
	</div>
</section>

<!-- Projects Grid - Minimum Height Section -->
<section class="min-h-[80vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		{#each filteredProjects as project (project.slug)}
			<a 
				href={localizeHref(`/projects/${project.slug}`)} 
				class="group col-span-12 flex flex-col bg-background transition-colors hover:bg-card md:col-span-6 lg:col-span-4"
			>
				<!-- Image placeholder -->
				<div class="aspect-video border-b border-border bg-card">
					<div class="flex h-full items-center justify-center">
						<span class="font-mono text-xs uppercase text-muted-foreground">[ {project.category} ]</span>
					</div>
				</div>
				
				<div class="flex flex-1 flex-col p-6">
					<div class="flex items-center justify-between text-xs">
						<span class="font-mono uppercase text-primary">{project.category}</span>
						<span class="font-mono text-muted-foreground">{project.year}</span>
					</div>
					
					<h2 class="font-ui mt-3 text-base font-semibold transition-colors group-hover:text-primary">{project.title}</h2>
					<p class="font-mono mt-1 text-xs text-muted-foreground">{project.client}</p>
					<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{project.description}</p>
					
					<div class="mt-4 flex flex-wrap gap-1">
						{#each project.tags as tag}
							<span class="font-mono border border-border bg-card px-2 py-0.5 text-[10px]">{tag}</span>
						{/each}
					</div>
				</div>
			</a>
		{:else}
			<div class="col-span-12 flex min-h-[40vh] items-center justify-center bg-background p-8">
				<p class="font-body text-center text-muted-foreground">No projects found.</p>
			</div>
		{/each}
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background p-8 lg:col-span-6 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">START BUILDING</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">HAVE A PROJECT?</h2>
			<p class="font-body mt-4 max-w-md text-muted-foreground">Let's discuss how we can bring your vision to life.</p>
			<Button href={localizeHref('/contact')} class="font-ui mt-6 w-fit uppercase tracking-wider">
				GET IN TOUCH
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card p-8 lg:col-span-6 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT</span>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-4 block text-xl text-primary transition-colors hover:text-primary/80 md:text-2xl">
				HELLO@MOSTLYWHAT.SYSTEMS
			</a>
		</div>
	</div>
</section>
