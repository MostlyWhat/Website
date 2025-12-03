<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as Select from '$lib/components/ui/select';
	import { loadDocsByCategory } from '$lib/content';
	import { 
		Palette, 
		Type, 
		Layout, 
		Layers, 
		Zap, 
		Box, 
		Grid3x3, 
		Component,
		Paintbrush,
		Code2,
		MousePointer,
		BookOpen,
		Sparkles,
		Eye,
		Square,
		ExternalLink,
		ChevronRight,
		ChevronDown,
		Package,
		Blocks,
		Server,
		Workflow,
		Settings,
		FileText,
		Search,
		PanelLeft,
		Menu,
		X,
		Check,
		AlertCircle,
		Info,
		Bell,
		ToggleLeft,
		FormInput,
		LayoutGrid,
		MessageSquare,
		Loader2,
		CreditCard,
		Plus
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	// Documentation categories for the selector
	type DocCategory = 'design-system' | 'products' | 'api';
	
	let sidebarOpen = $state(false);
	
	// Get current path segments
	const currentPath = $derived($page.url.pathname);
	const pathSegments = $derived(currentPath.replace('/docs', '').split('/').filter(Boolean));
	
	// Determine category from path
	const selectedCategory = $derived.by<DocCategory>(() => {
		if (pathSegments[0] === 'products') return 'products';
		if (pathSegments[0] === 'api') return 'api';
		return 'design-system';
	});
	
	// Determine active section from path
	const activeSection = $derived.by(() => {
		// For /docs -> overview
		if (pathSegments.length === 0) return 'overview';
		// For /docs/components/button -> button
		if (pathSegments.length === 2) return pathSegments[1];
		// For /docs/overview -> overview
		return pathSegments[0];
	});

	// Load all docs from markdown
	const componentDocs = loadDocsByCategory('components');
	const overviewDocs = loadDocsByCategory('overview');
	const foundationDocs = loadDocsByCategory('foundation');

	// Category options for the select
	const categoryOptions = [
		{ value: 'design-system', label: 'DESIGN SYSTEM', icon: Paintbrush },
		{ value: 'products', label: 'PRODUCTS', icon: Package },
		{ value: 'api', label: 'API REFERENCE', icon: Server }
	];

	// Map doc slugs to icons
	const componentIcons: Record<string, typeof Grid3x3> = {
		'button': MousePointer,
		'badge': Bell,
		'input': FormInput,
		'select': ChevronDown,
		'switch': ToggleLeft,
		'checkbox': Check,
		'textarea': FileText,
		'label': Type,
		'card': CreditCard,
		'dialog': MessageSquare,
		'tabs': LayoutGrid,
		'accordion': Layers,
		'progress': Loader2,
		'skeleton': Box,
		'separator': Layout,
		'alert': AlertCircle,
		'tooltip': Info,
		'alert-dialog': AlertCircle,
		'aspect-ratio': Square,
		'avatar': Component,
		'popover': MessageSquare,
		'dropdown-menu': ChevronDown,
		'sheet': PanelLeft,
		'scroll-area': Layers
	};

	// Generate component sections from loaded docs
	const componentSections = componentDocs.map(doc => ({
		id: doc.slug,
		title: doc.title,
		icon: componentIcons[doc.slug] || Component,
		href: `/docs/components/${doc.slug}`
	})).sort((a, b) => a.title.localeCompare(b.title));

	const sidebarNav: Record<DocCategory, { title: string; sections: { id: string; title: string; icon: typeof Grid3x3; href: string; status?: 'coming-soon' | 'new' }[] }[]> = {
		'design-system': [
			{
				title: 'OVERVIEW',
				sections: [
					{ id: 'overview', title: 'Introduction', icon: BookOpen, href: '/docs' },
					{ id: 'principles', title: 'Design Principles', icon: Eye, href: '/docs/principles' },
					{ id: 'getting-started', title: 'Getting Started', icon: Zap, href: '/docs/getting-started' },
					{ id: 'documentation', title: 'Documentation', icon: FileText, href: '/docs/documentation' },
					{ id: 'adding-pages', title: 'Adding Pages', icon: Plus, href: '/docs/adding-pages' }
				]
			},
			{
				title: 'FOUNDATION',
				sections: [
					{ id: 'grid', title: 'Grid System', icon: Grid3x3, href: '/docs/foundation/grid' },
					{ id: 'colors', title: 'Colors', icon: Palette, href: '/docs/foundation/colors' },
					{ id: 'typography', title: 'Typography', icon: Type, href: '/docs/foundation/typography' },
					{ id: 'spacing', title: 'Spacing', icon: Layout, href: '/docs/foundation/spacing' },
					{ id: 'animations', title: 'Animations', icon: Sparkles, href: '/docs/foundation/animations' }
				]
			},
			{
				title: 'COMPONENTS',
				sections: componentSections
			},
			{
				title: 'PATTERNS',
				sections: [
					{ id: 'page-layouts', title: 'Page Layouts', icon: Layout, href: '/docs/patterns/page-layouts', status: 'coming-soon' },
					{ id: 'sections', title: 'Section Types', icon: Layers, href: '/docs/patterns/sections', status: 'coming-soon' },
					{ id: 'navigation', title: 'Navigation', icon: Workflow, href: '/docs/patterns/navigation', status: 'coming-soon' }
				]
			}
		],
		'products': [
			{
				title: 'OVERVIEW',
				sections: [
					{ id: 'overview', title: 'Introduction', icon: BookOpen, href: '/docs/products' },
					{ id: 'architecture', title: 'Architecture', icon: Blocks, href: '/docs/products/architecture' }
				]
			},
			{
				title: 'WEB APPLICATIONS',
				sections: [
					{ id: 'sveltekit', title: 'SvelteKit Apps', icon: Component, href: '/docs/products/sveltekit' },
					{ id: 'static-sites', title: 'Static Sites', icon: FileText, href: '/docs/products/static-sites', status: 'coming-soon' },
					{ id: 'dashboards', title: 'Dashboards', icon: Layout, href: '/docs/products/dashboards', status: 'coming-soon' }
				]
			},
			{
				title: 'DEPLOYMENT',
				sections: [
					{ id: 'deployment', title: 'Deployment Guide', icon: Server, href: '/docs/products/deployment' }
				]
			}
		],
		'api': [
			{
				title: 'OVERVIEW',
				sections: [
					{ id: 'overview', title: 'Introduction', icon: BookOpen, href: '/docs/api' },
					{ id: 'authentication', title: 'Authentication', icon: Settings, href: '/docs/api/authentication' }
				]
			},
			{
				title: 'ENDPOINTS',
				sections: [
					{ id: 'contact', title: 'Contact API', icon: Code2, href: '/docs/api/contact' },
					{ id: 'search', title: 'Search API', icon: Search, href: '/docs/api/search' }
				]
			}
		]
	};

	function handleCategoryChange(value: string | undefined) {
		if (value === 'design-system') {
			goto('/docs');
		} else if (value === 'products') {
			goto('/docs/products');
		} else if (value === 'api') {
			goto('/docs/api');
		}
	}
	
	function isActive(href: string): boolean {
		// Exact match for root
		if (href === '/docs' && currentPath === '/docs') return true;
		// For component/foundation paths, require exact match to avoid alert matching alert-dialog
		if (href !== '/docs') {
			// Exact match
			if (currentPath === href) return true;
			// Or match with trailing slash
			if (currentPath === href + '/') return true;
		}
		return false;
	}
</script>

<svelte:head>
	<title>Documentation — {m.site_name()}</title>
	<meta name="description" content="Design system documentation for MostlyWhat Systems. Grid system, colors, typography, components, and patterns." />
</svelte:head>

<!-- Docs Layout with Sidebar -->
<div class="flex min-h-[calc(100vh-theme(spacing.16))] flex-col border-b border-border lg:flex-row">
	<!-- Prevent layout shift by ensuring consistent structure -->
	<!-- Mobile Header -->
	<div class="flex h-14 items-center justify-between border-b border-border bg-card px-6 md:px-12 lg:hidden">
		<span class="font-mono text-xs tracking-widest text-muted-foreground">// DOCUMENTATION</span>
		<button
			type="button"
			onclick={() => sidebarOpen = !sidebarOpen}
			class="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors hover:bg-card"
		>
			{#if sidebarOpen}
				<X class="h-4 w-4" />
			{:else}
				<Menu class="h-4 w-4" />
			{/if}
			<span class="sr-only">Toggle sidebar</span>
		</button>
	</div>

	<!-- Sidebar -->
	<aside class="w-full shrink-0 border-b border-border bg-card lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-theme(spacing.16))] lg:w-1/4 lg:flex-col lg:border-b-0 lg:border-r {sidebarOpen ? 'block' : 'hidden lg:flex'}">
		<!-- Category Selector (Sticky Header) -->
		<div class="sticky top-0 z-10 border-b border-border bg-card px-6 py-6 lg:pl-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground hidden lg:block">// DOCUMENTATION</span>
			<div class="lg:mt-4">
				<Select.Root type="single" value={selectedCategory} onValueChange={handleCategoryChange}>
					<Select.Trigger showChevron={false} class="group !h-12 w-full justify-start gap-0 border-border bg-background p-0 transition-all hover:border-primary/50">
						{@const selected = categoryOptions.find(c => c.value === selectedCategory)}
						{#if selected}
							{@const Icon = selected.icon}
							<span class="flex h-[46px] w-[46px] shrink-0 items-center justify-center border-r border-border bg-primary/10 transition-colors group-hover:bg-primary/20">
								<Icon class="h-5 w-5 text-primary" />
							</span>
							<span class="flex flex-1 flex-col items-start justify-center px-4">
								<span class="font-mono text-[8px] tracking-widest text-muted-foreground">CATEGORY</span>
								<span class="font-ui text-xs font-semibold tracking-wider">{selected.label}</span>
							</span>
							<span class="flex h-[46px] w-[46px] shrink-0 items-center justify-center border-l border-border text-muted-foreground transition-colors group-hover:text-foreground">
								<ChevronRight class="h-4 w-4 rotate-90" />
							</span>
						{/if}
					</Select.Trigger>
					<Select.Content class="w-[--bits-select-anchor-width] border-t-0 bg-background">
						{#each categoryOptions as option (option.value)}
							{@const Icon = option.icon}
							<Select.Item 
								value={option.value} 
								class="!h-12 cursor-pointer gap-0 border-b border-border p-0 pe-0 ps-0 last:border-b-0 data-[highlighted]:bg-card data-[state=checked]:bg-primary/5"
							>
								{#snippet children({ selected })}
									<span class="flex h-[46px] w-[46px] shrink-0 items-center justify-center border-r border-border {selected ? 'bg-primary/20' : 'bg-card'}">
										<Icon class="h-4 w-4 {selected ? 'text-primary' : 'text-muted-foreground'}" />
									</span>
									<span class="flex flex-1 items-center px-4">
										<span class="font-ui text-xs tracking-wider {selected ? 'text-primary font-semibold' : ''}">{option.label}</span>
									</span>
									{#if selected}
										<span class="flex h-[46px] w-[46px] shrink-0 items-center justify-center border-l border-border bg-primary/10">
											<span class="h-1.5 w-1.5 bg-primary"></span>
										</span>
									{/if}
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<!-- Navigation (Scrollable) -->
		<nav class="flex-1 overflow-y-auto px-4 py-4 lg:pl-14">
			{#each sidebarNav[selectedCategory] as group (group.title)}
				<div class="mb-6">
					<h3 class="font-mono px-2 text-[10px] tracking-widest text-muted-foreground">{group.title}</h3>
					<ul class="mt-2 space-y-1">
						{#each group.sections as section (section.id)}
							{@const Icon = section.icon}
							<li>
								{#if section.status === 'coming-soon'}
									<div class="flex w-full items-center gap-3 px-2 py-2 text-muted-foreground opacity-50 cursor-not-allowed border-l-2 border-transparent">
										<Icon class="h-4 w-4" />
										<span class="font-ui text-xs tracking-wider">{section.title}</span>
										<span class="font-mono ml-auto text-[8px] tracking-wider">SOON</span>
									</div>
								{:else}
									<a
										href={localizeHref(section.href)}
										onclick={() => { sidebarOpen = false; }}
										class="flex w-full items-center gap-3 px-2 py-2 text-left transition-colors
											{isActive(section.href) ? 'border-l-2 border-primary bg-primary/10 text-primary' : 'border-l-2 border-transparent text-muted-foreground hover:bg-background hover:text-foreground'}"
									>
										<Icon class="h-4 w-4" />
										<span class="font-ui text-xs tracking-wider">{section.title}</span>
										{#if section.status === 'new'}
											<span class="font-mono ml-auto text-[8px] tracking-wider text-primary">NEW</span>
										{/if}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>

		<!-- External Links -->
		<div class="border-t border-border px-4 py-4 lg:pl-14">
			<h3 class="font-mono px-2 text-[10px] tracking-widest text-muted-foreground">RESOURCES</h3>
			<ul class="mt-2 space-y-1">
				<li>
					<a href="https://svelte.dev/docs" target="_blank" rel="noopener" class="flex items-center gap-3 px-2 py-2 text-muted-foreground transition-colors hover:text-foreground">
						<ExternalLink class="h-4 w-4" />
						<span class="font-ui text-xs tracking-wider">Svelte Docs</span>
					</a>
				</li>
				<li>
					<a href="https://tailwindcss.com/docs" target="_blank" rel="noopener" class="flex items-center gap-3 px-2 py-2 text-muted-foreground transition-colors hover:text-foreground">
						<ExternalLink class="h-4 w-4" />
						<span class="font-ui text-xs tracking-wider">Tailwind CSS</span>
					</a>
				</li>
			</ul>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.14))] lg:min-h-[calc(100vh-theme(spacing.16))]">
		{@render children()}
	</main>
</div>
