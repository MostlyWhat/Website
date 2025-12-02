<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { Badge } from '$lib/components/ui/badge';
	import MarkdownRenderer from '$lib/components/layout/MarkdownRenderer.svelte';
	import ComponentDocRenderer from '$lib/components/layout/ComponentDocRenderer.svelte';
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
		CreditCard
	} from '@lucide/svelte';

	// Documentation categories for the selector
	type DocCategory = 'design-system' | 'products' | 'api';
	
	// Initialize from URL params
	const validCategories: DocCategory[] = ['design-system', 'products', 'api'];
	
	function getInitialCategory(): DocCategory {
		if (!browser) return 'design-system';
		const param = new URLSearchParams(window.location.search).get('category');
		return validCategories.includes(param as DocCategory) ? (param as DocCategory) : 'design-system';
	}
	
	function getInitialSection(): string {
		if (!browser) return 'overview';
		return new URLSearchParams(window.location.search).get('section') || 'overview';
	}
	
	let selectedCategory = $state<DocCategory>(getInitialCategory());
	let activeSection = $state<string>(getInitialSection());
	let sidebarOpen = $state(false);
	
	// Update URL when section or category changes
	function updateURL(category: DocCategory, section: string) {
		if (!browser) return;
		const url = new URL(window.location.href);
		url.searchParams.set('category', category);
		url.searchParams.set('section', section);
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}
	
	// Watch for changes and update URL
	$effect(() => {
		updateURL(selectedCategory, activeSection);
	});
	
	// Handle browser back/forward navigation
	$effect(() => {
		if (!browser) return;
		
		const handlePopState = () => {
			const params = new URLSearchParams(window.location.search);
			const category = params.get('category');
			const section = params.get('section');
			
			if (validCategories.includes(category as DocCategory)) {
				selectedCategory = category as DocCategory;
			}
			if (section) {
				activeSection = section;
			}
		};
		
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	// Load all docs from markdown
	const componentDocs = loadDocsByCategory('components');
	const overviewDocs = loadDocsByCategory('overview');
	const foundationDocs = loadDocsByCategory('foundation');
	
	// Get current doc based on active section
	const currentDoc = $derived(() => {
		// Check components first
		const componentDoc = componentDocs.find(d => d.slug === activeSection);
		if (componentDoc) return componentDoc;
		
		// Check overview
		const overviewDoc = overviewDocs.find(d => d.slug === activeSection);
		if (overviewDoc) return overviewDoc;
		
		// Check foundation
		const foundationDoc = foundationDocs.find(d => d.slug === activeSection);
		if (foundationDoc) return foundationDoc;
		
		return null;
	});

	// Category options for the select
	const categoryOptions = [
		{ value: 'design-system', label: 'DESIGN SYSTEM', icon: Paintbrush },
		{ value: 'products', label: 'PRODUCTS', icon: Package },
		{ value: 'api', label: 'API REFERENCE', icon: Server }
	];

	// Sidebar navigation structure per category
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
		icon: componentIcons[doc.slug] || Component
	}));

	const sidebarNav: Record<DocCategory, { title: string; sections: { id: string; title: string; icon: typeof Grid3x3; status?: 'coming-soon' | 'new' }[] }[]> = {
		'design-system': [
			{
				title: 'OVERVIEW',
				sections: [
					{ id: 'overview', title: 'Introduction', icon: BookOpen },
					{ id: 'principles', title: 'Design Principles', icon: Eye },
					{ id: 'getting-started', title: 'Getting Started', icon: Zap }
				]
			},
			{
				title: 'FOUNDATION',
				sections: [
					{ id: 'grid', title: 'Grid System', icon: Grid3x3 },
					{ id: 'colors', title: 'Colors', icon: Palette },
					{ id: 'typography', title: 'Typography', icon: Type },
					{ id: 'spacing', title: 'Spacing', icon: Layout },
					{ id: 'animations', title: 'Animations', icon: Sparkles }
				]
			},
			{
				title: 'COMPONENTS',
				sections: componentSections
			},
			{
				title: 'PATTERNS',
				sections: [
					{ id: 'page-layouts', title: 'Page Layouts', icon: Layout, status: 'coming-soon' },
					{ id: 'sections', title: 'Section Types', icon: Layers, status: 'coming-soon' },
					{ id: 'navigation', title: 'Navigation', icon: Workflow, status: 'coming-soon' }
				]
			}
		],
		'products': [
			{
				title: 'OVERVIEW',
				sections: [
					{ id: 'overview', title: 'Introduction', icon: BookOpen },
					{ id: 'architecture', title: 'Architecture', icon: Blocks, status: 'coming-soon' }
				]
			},
			{
				title: 'WEB APPLICATIONS',
				sections: [
					{ id: 'sveltekit', title: 'SvelteKit Apps', icon: Component, status: 'coming-soon' },
					{ id: 'static-sites', title: 'Static Sites', icon: FileText, status: 'coming-soon' },
					{ id: 'dashboards', title: 'Dashboards', icon: Layout, status: 'coming-soon' }
				]
			},
			{
				title: 'DEPLOYMENT',
				sections: [
					{ id: 'cloudflare', title: 'Cloudflare', icon: Server, status: 'coming-soon' },
					{ id: 'vercel', title: 'Vercel', icon: Zap, status: 'coming-soon' }
				]
			}
		],
		'api': [
			{
				title: 'OVERVIEW',
				sections: [
					{ id: 'overview', title: 'Introduction', icon: BookOpen, status: 'coming-soon' },
					{ id: 'authentication', title: 'Authentication', icon: Settings, status: 'coming-soon' }
				]
			},
			{
				title: 'ENDPOINTS',
				sections: [
					{ id: 'contact', title: 'Contact API', icon: Code2, status: 'coming-soon' },
					{ id: 'search', title: 'Search API', icon: Search, status: 'coming-soon' }
				]
			}
		]
	};

	function handleCategoryChange(value: string | undefined) {
		if (value) {
			selectedCategory = value as DocCategory;
			activeSection = 'overview';
		}
	}
</script>

<svelte:head>
	<title>Documentation — {m.site_name()}</title>
	<meta name="description" content="Design system documentation for MostlyWhat Systems. Grid system, colors, typography, components, and patterns." />
</svelte:head>

<!-- Docs Layout with Sidebar -->
<div class="flex min-h-[calc(100vh-theme(spacing.16))] flex-col border-b border-border lg:flex-row">
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
									<button
										type="button"
										onclick={() => { activeSection = section.id; sidebarOpen = false; }}
										class="flex w-full items-center gap-3 px-2 py-2 text-left transition-colors
											{activeSection === section.id ? 'border-l-2 border-primary bg-primary/10 text-primary' : 'border-l-2 border-transparent text-muted-foreground hover:bg-background hover:text-foreground'}"
									>
										<Icon class="h-4 w-4" />
										<span class="font-ui text-xs tracking-wider">{section.title}</span>
										{#if section.status === 'new'}
											<span class="font-mono ml-auto text-[8px] tracking-wider text-primary">NEW</span>
										{/if}
									</button>
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
	<main class="flex-1">
		{#if selectedCategory === 'design-system'}
			<!-- Design System Content -->
			{@const doc = currentDoc()}
			{#if doc}
				<!-- Dynamic Documentation from Markdown -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// {doc.category.toUpperCase()}</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{doc.title.toUpperCase()}</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							{doc.description}
						</p>
					</div>
					
					{#if doc.category === 'overview' && doc.slug === 'overview'}
						<!-- Quick Stats for Overview Page -->
						<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
							<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
								<span class="font-display text-3xl font-bold text-primary">12</span>
								<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">COLUMNS</p>
							</div>
							<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
								<span class="font-display text-3xl font-bold text-primary">64PX</span>
								<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">GRID SIZE</p>
							</div>
							<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
								<span class="font-display text-3xl font-bold text-primary">4</span>
								<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">FONTS</p>
							</div>
						</div>
						
						<!-- Quick Links -->
						<div class="border-t border-border px-6 py-8 md:px-12 lg:px-16">
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// QUICK.START</span>
							<h2 class="font-display mt-4 text-2xl font-bold uppercase">GET STARTED</h2>
						</div>
						<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
							{#each [
								{ icon: Grid3x3, title: 'Grid System', desc: '12-column responsive grid', section: 'grid' },
								{ icon: Palette, title: 'Colors', desc: 'Color palette & usage', section: 'colors' },
								{ icon: Type, title: 'Typography', desc: 'Fonts & text styles', section: 'typography' },
								{ icon: MousePointer, title: 'Components', desc: 'UI component library', section: 'button' }
							] as item (item.title)}
								<button
									type="button"
									onclick={() => activeSection = item.section}
									class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 text-left transition-colors hover:bg-card sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16"
								>
									<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
										<item.icon class="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 class="font-ui text-sm font-semibold tracking-wider">{item.title}</h3>
										<p class="font-body mt-1 text-xs text-muted-foreground">{item.desc}</p>
									</div>
								</button>
							{/each}
						</div>
					{:else if doc.category === 'components'}
						<!-- Component Documentation with Live Examples -->
						<div class="border-t border-border px-6 py-8 md:px-12 lg:px-16">
							<ComponentDocRenderer content={doc.content} slug={doc.slug} class="max-w-4xl" />
						</div>
					{:else}
						<!-- Standard Markdown Content -->
						<div class="border-t border-border px-6 py-8 md:px-12 lg:px-16">
							<MarkdownRenderer content={doc.content} class="max-w-4xl" />
						</div>
					{/if}
				</section>
			{:else}
				<!-- Coming Soon -->
				<section class="border-b border-border">
					<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COMING.SOON</span>
						<h1 class="font-display mt-4 text-center text-3xl font-bold uppercase md:text-4xl">
							{activeSection.toUpperCase().replace(/-/g, ' ')}
						</h1>
						<p class="font-body mt-4 max-w-md text-center text-muted-foreground">
							This section is currently being developed. Check back soon for comprehensive documentation.
						</p>
						<Button onclick={() => activeSection = 'overview'} variant="outline" class="font-ui mt-8 tracking-wider">
							BACK TO OVERVIEW
						</Button>
					</div>
				</section>
			{/if}

		{:else}
			<!-- Products / API - Coming Soon -->
			<section class="border-b border-border">
				<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COMING.SOON</span>
					<h1 class="font-display mt-4 text-center text-3xl font-bold uppercase md:text-4xl">
						{categoryOptions.find(c => c.value === selectedCategory)?.label} DOCUMENTATION
					</h1>
					<p class="font-body mt-4 max-w-md text-center text-muted-foreground">
						This documentation section is currently being developed. Check back soon for comprehensive guides.
					</p>
					<Button onclick={() => { selectedCategory = 'design-system'; activeSection = 'overview'; }} variant="outline" class="font-ui mt-8 tracking-wider">
						VIEW DESIGN SYSTEM
					</Button>
				</div>
			</section>
		{/if}
	</main>
</div>