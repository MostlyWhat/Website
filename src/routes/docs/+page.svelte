<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { 
		ArrowRight, 
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
		FileCode,
		Sparkles,
		Eye,
		Square,
		ExternalLink,
		ChevronRight,
		Package,
		Blocks,
		Server,
		Workflow,
		Settings,
		FileText,
		Search,
		PanelLeft,
		Menu,
		X
	} from '@lucide/svelte';

	// Documentation categories for the selector
	type DocCategory = 'design-system' | 'products' | 'api';
	
	let selectedCategory = $state<DocCategory>('design-system');
	let activeSection = $state<string>('overview');
	let sidebarOpen = $state(false);

	// Category options for the select
	const categoryOptions = [
		{ value: 'design-system', label: 'DESIGN SYSTEM', icon: Paintbrush },
		{ value: 'products', label: 'PRODUCTS', icon: Package },
		{ value: 'api', label: 'API REFERENCE', icon: Server }
	];

	// Sidebar navigation structure per category
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
				sections: [
					{ id: 'buttons', title: 'Buttons', icon: MousePointer },
					{ id: 'forms', title: 'Form Elements', icon: Code2 },
					{ id: 'layout', title: 'Layout', icon: Blocks },
					{ id: 'feedback', title: 'Feedback', icon: Zap },
					{ id: 'interactive', title: 'Interactive', icon: Component }
				]
			},
			{
				title: 'PATTERNS',
				sections: [
					{ id: 'page-layouts', title: 'Page Layouts', icon: Layout },
					{ id: 'sections', title: 'Section Types', icon: Layers },
					{ id: 'navigation', title: 'Navigation', icon: Workflow }
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

	// Content for each section (Design System)
	const designSystemContent: Record<string, { title: string; description: string }> = {
		'overview': {
			title: 'DESIGN SYSTEM',
			description: 'A comprehensive guide to our design language, grid system, components, and patterns. Everything you need to build consistent, beautiful interfaces.'
		},
		'principles': {
			title: 'DESIGN PRINCIPLES',
			description: 'Our design system is built on four core principles that guide every decision we make.'
		},
		'grid': {
			title: 'GRID SYSTEM',
			description: '12-column grid with 1px gap borders. All elements align to the grid for visual consistency.'
		},
		'colors': {
			title: 'COLORS',
			description: 'Cobalt blue primary with yellow and red accents on dark backgrounds.'
		},
		'typography': {
			title: 'TYPOGRAPHY',
			description: 'Four distinct typefaces for display, body, UI, and code elements.'
		},
		'spacing': {
			title: 'SPACING',
			description: 'Consistent spacing creates visual rhythm. Use these values throughout your layouts.'
		},
		'animations': {
			title: 'ANIMATIONS',
			description: 'Scroll-based animations using Intersection Observer for subtle, meaningful transitions.'
		},
		'buttons': {
			title: 'BUTTONS',
			description: 'Button variants for different actions and contexts.'
		},
		'forms': {
			title: 'FORM ELEMENTS',
			description: 'Input fields, toggles, selects, and form controls.'
		},
		'layout': {
			title: 'LAYOUT COMPONENTS',
			description: 'Section components, tiles, cards, and layout utilities.'
		},
		'feedback': {
			title: 'FEEDBACK COMPONENTS',
			description: 'Progress indicators, spinners, badges, and status components.'
		},
		'interactive': {
			title: 'INTERACTIVE ELEMENTS',
			description: 'Accordion, modals, tabs, and other interactive components.'
		}
	};

	// Design principles data
	const principles = [
		{ number: '01', title: 'INDUSTRIAL PRECISION', desc: 'No rounded corners. Sharp edges. Grid-based layouts. Every element is intentional and aligned.', icon: Square },
		{ number: '02', title: 'HIGH CONTRAST', desc: 'Dark backgrounds with vibrant cobalt blue accents create visual impact and hierarchy.', icon: Eye },
		{ number: '03', title: 'TYPOGRAPHY FIRST', desc: 'Clear hierarchy through type scale and weight. Four distinct typefaces for different purposes.', icon: Type },
		{ number: '04', title: 'MOTION WITH PURPOSE', desc: 'Scroll-based animations that enhance rather than distract. Subtle, meaningful transitions.', icon: Sparkles }
	];

	// Quick stats
	const quickStats = [
		{ label: 'PADDING MOBILE', value: '24px', code: 'px-6' },
		{ label: 'PADDING TABLET', value: '48px', code: 'md:px-12' },
		{ label: 'PADDING DESKTOP', value: '64px', code: 'lg:px-16' },
		{ label: 'GRID GAP', value: '1px', code: 'gap-px' }
	];

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
					<Select.Trigger class="h-11 w-full justify-start gap-3 rounded-none border-border bg-background px-0 shadow-none hover:bg-card">
						{@const selected = categoryOptions.find(c => c.value === selectedCategory)}
						{#if selected}
							{@const Icon = selected.icon}
							<span class="flex h-11 w-11 shrink-0 items-center justify-center border-r border-border bg-primary/10">
								<Icon class="h-4 w-4 text-primary" />
							</span>
							<span class="font-ui text-xs font-medium tracking-wider">{selected.label}</span>
						{/if}
					</Select.Trigger>
					<Select.Content class="rounded-none">
						{#each categoryOptions as option (option.value)}
							{@const Icon = option.icon}
							<Select.Item value={option.value} class="rounded-none py-3 pl-3">
								<Icon class="h-4 w-4 text-primary" />
								<span class="font-ui text-xs tracking-wider">{option.label}</span>
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
			{#if activeSection === 'overview' || activeSection === 'getting-started'}
				<!-- Overview / Introduction -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// DESIGN.SYSTEM</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">DESIGN SYSTEM</h1>
						<p class="font-body mt-6 max-w-2xl text-lg text-muted-foreground">
							A comprehensive guide to our design language, grid system, components, and patterns. Everything you need to build consistent, beautiful interfaces.
						</p>
					</div>
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
				</section>

				<!-- Quick Links -->
				<section class="border-b border-border">
					<div class="px-6 py-8 md:px-12 lg:px-16">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// QUICK.START</span>
						<h2 class="font-display mt-4 text-2xl font-bold uppercase">GET STARTED</h2>
					</div>
					<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
						{#each [
							{ icon: Grid3x3, title: 'Grid System', desc: '12-column responsive grid', section: 'grid' },
							{ icon: Palette, title: 'Colors', desc: 'Color palette & usage', section: 'colors' },
							{ icon: Type, title: 'Typography', desc: 'Fonts & text styles', section: 'typography' },
							{ icon: MousePointer, title: 'Components', desc: 'UI component library', section: 'buttons' }
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
				</section>

			{:else if activeSection === 'principles'}
				<!-- Design Principles -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PHILOSOPHY</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">DESIGN PRINCIPLES</h1>
						<p class="font-body mt-6 max-w-2xl text-lg text-muted-foreground">
							Our design system is built on four core principles that guide every decision we make.
						</p>
					</div>
					<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
						{#each principles as { number, title, desc, icon: Icon } (number)}
							<div class="col-span-12 flex flex-col bg-background px-6 py-10 sm:col-span-6 md:px-12 lg:px-16">
								<div class="flex items-start justify-between">
									<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
										<Icon class="h-5 w-5 text-primary" />
									</div>
									<span class="font-display text-3xl font-black text-primary/30">{number}</span>
								</div>
								<h3 class="font-ui mt-6 text-base font-semibold tracking-wider">{title}</h3>
								<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
							</div>
						{/each}
					</div>
				</section>

			{:else if activeSection === 'grid'}
				<!-- Grid System -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FOUNDATION</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">GRID SYSTEM</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							12-column grid with 1px gap borders. All elements align to the grid for visual consistency.
						</p>
					</div>

					<div class="border-t border-border px-6 py-12 md:px-12 lg:px-16">
						<p class="font-mono mb-4 text-[10px] tracking-widest text-muted-foreground">12-COLUMN GRID</p>
						<div class="grid grid-cols-12 gap-px bg-border">
							{#each Array(12) as _, i (i)}
								<div class="flex items-center justify-center bg-card py-4">
									<span class="font-mono text-xs text-muted-foreground">{i + 1}</span>
								</div>
							{/each}
						</div>
						
						<p class="font-mono mb-4 mt-12 text-[10px] tracking-widest text-muted-foreground">COMMON PATTERNS</p>
						<div class="space-y-2">
							<div class="grid grid-cols-12 gap-px bg-border">
								<div class="col-span-4 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">4</span></div>
								<div class="col-span-4 flex items-center justify-center bg-card py-3"><span class="font-mono text-xs">4</span></div>
								<div class="col-span-4 flex items-center justify-center bg-card py-3"><span class="font-mono text-xs">4</span></div>
							</div>
							<div class="grid grid-cols-12 gap-px bg-border">
								<div class="col-span-6 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">6</span></div>
								<div class="col-span-6 flex items-center justify-center bg-card py-3"><span class="font-mono text-xs">6</span></div>
							</div>
							<div class="grid grid-cols-12 gap-px bg-border">
								<div class="col-span-3 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">3</span></div>
								<div class="col-span-9 flex items-center justify-center bg-card py-3"><span class="font-mono text-xs">9</span></div>
							</div>
						</div>
					</div>
				</section>

				<!-- Spacing Reference -->
				<section class="border-b border-border">
					<div class="px-6 py-8 md:px-12 lg:px-16">
						<p class="font-mono text-[10px] tracking-widest text-muted-foreground">// SPACING</p>
					</div>
					<div class="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
						{#each quickStats as { label, value, code } (label)}
							<div class="flex flex-col justify-center bg-background px-6 py-8">
								<span class="font-display text-2xl font-bold text-primary">{value}</span>
								<span class="font-mono mt-2 text-[10px] tracking-widest text-muted-foreground">{label}</span>
								<code class="font-mono mt-3 text-xs text-primary/70">{code}</code>
							</div>
						{/each}
					</div>
				</section>

			{:else if activeSection === 'colors'}
				<!-- Colors -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FOUNDATION</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">COLORS</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							Cobalt blue primary with yellow and red accents on dark backgrounds.
						</p>
					</div>
					<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
						<div class="col-span-4 sm:col-span-2">
							<div class="h-24 bg-primary"></div>
							<div class="bg-background px-4 py-3">
								<p class="font-ui text-xs font-semibold">Cobalt</p>
								<p class="font-mono text-[10px] text-muted-foreground">#00A3FF</p>
							</div>
						</div>
						<div class="col-span-4 sm:col-span-2">
							<div class="h-24 bg-yellow-500"></div>
							<div class="bg-background px-4 py-3">
								<p class="font-ui text-xs font-semibold">Yellow</p>
								<p class="font-mono text-[10px] text-muted-foreground">#FFD500</p>
							</div>
						</div>
						<div class="col-span-4 sm:col-span-2">
							<div class="h-24 bg-red-500"></div>
							<div class="bg-background px-4 py-3">
								<p class="font-ui text-xs font-semibold">Red</p>
								<p class="font-mono text-[10px] text-muted-foreground">#EF4444</p>
							</div>
						</div>
						<div class="col-span-4 sm:col-span-2">
							<div class="h-24 border-y border-border bg-background"></div>
							<div class="bg-background px-4 py-3">
								<p class="font-ui text-xs font-semibold">Black 950</p>
								<p class="font-mono text-[10px] text-muted-foreground">#000814</p>
							</div>
						</div>
						<div class="col-span-4 sm:col-span-2">
							<div class="h-24 bg-card"></div>
							<div class="bg-background px-4 py-3">
								<p class="font-ui text-xs font-semibold">Black 900</p>
								<p class="font-mono text-[10px] text-muted-foreground">#001122</p>
							</div>
						</div>
						<div class="col-span-4 sm:col-span-2">
							<div class="h-24 bg-border"></div>
							<div class="bg-background px-4 py-3">
								<p class="font-ui text-xs font-semibold">Border</p>
								<p class="font-mono text-[10px] text-muted-foreground">#1a2744</p>
							</div>
						</div>
					</div>
				</section>

			{:else if activeSection === 'typography'}
				<!-- Typography -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FOUNDATION</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">TYPOGRAPHY</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							Four distinct typefaces for display, body, UI, and code elements.
						</p>
					</div>
					<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
						<div class="col-span-12 flex flex-col bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:px-16">
							<span class="font-mono text-[10px] tracking-widest text-primary">DISPLAY</span>
							<p class="font-display mt-3 text-3xl font-bold uppercase">Tourney</p>
							<p class="font-body mt-3 text-sm text-muted-foreground">Headlines & titles</p>
						</div>
						<div class="col-span-12 flex flex-col bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:px-16">
							<span class="font-mono text-[10px] tracking-widest text-primary">BODY</span>
							<p class="font-body mt-3 text-2xl">Hubot Sans</p>
							<p class="font-body mt-3 text-sm text-muted-foreground">Body text & paragraphs</p>
						</div>
						<div class="col-span-12 flex flex-col bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:px-16">
							<span class="font-mono text-[10px] tracking-widest text-primary">UI</span>
							<p class="font-ui mt-3 text-2xl font-semibold tracking-wider">Chakra Petch</p>
							<p class="font-body mt-3 text-sm text-muted-foreground">Buttons & labels</p>
						</div>
						<div class="col-span-12 flex flex-col bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:px-16">
							<span class="font-mono text-[10px] tracking-widest text-primary">CODE</span>
							<p class="font-mono mt-3 text-xl">JetBrains Mono</p>
							<p class="font-body mt-3 text-sm text-muted-foreground">Code & technical text</p>
						</div>
					</div>
				</section>

			{:else if activeSection === 'spacing'}
				<!-- Spacing -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FOUNDATION</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">SPACING</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							Consistent spacing creates visual rhythm. Use these values throughout your layouts.
						</p>
					</div>
					<div class="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
						{#each quickStats as { label, value, code } (label)}
							<div class="flex flex-col justify-center bg-background px-6 py-8">
								<span class="font-display text-2xl font-bold text-primary">{value}</span>
								<span class="font-mono mt-2 text-[10px] tracking-widest text-muted-foreground">{label}</span>
								<code class="font-mono mt-3 text-xs text-primary/70">{code}</code>
							</div>
						{/each}
					</div>
				</section>

			{:else if activeSection === 'animations'}
				<!-- Animations -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// MOTION</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">ANIMATIONS</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							Scroll-based animations using Intersection Observer.
						</p>
					</div>
					<div class="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
						{#each ['fade', 'slide-left', 'slide-right', 'scale'] as anim (anim)}
							<div class="flex flex-col bg-card px-6 py-8">
								<span class="font-mono text-[10px] tracking-widest text-primary">{anim.toUpperCase()}</span>
								<p class="font-body mt-2 text-sm text-muted-foreground">
									{anim === 'fade' ? 'Opacity 0 to 1' : anim === 'scale' ? 'Scale 95% to 100%' : `Slide from ${anim.split('-')[1]}`}
								</p>
								<code class="font-mono mt-4 text-xs text-muted-foreground">animation: '{anim}'</code>
							</div>
						{/each}
					</div>
				</section>

			{:else if activeSection === 'buttons'}
				<!-- Buttons -->
				<section class="border-b border-border">
					<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COMPONENTS</span>
						<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">BUTTONS</h1>
						<p class="font-body mt-6 max-w-2xl text-muted-foreground">
							Button variants for different actions and contexts.
						</p>
					</div>
					<div class="border-t border-border px-6 py-12 md:px-12 lg:px-16">
						<p class="font-mono mb-4 text-[10px] tracking-widest text-muted-foreground">VARIANTS</p>
						<div class="flex flex-wrap gap-4">
							<Button class="font-ui">DEFAULT</Button>
							<Button variant="outline" class="font-ui">OUTLINE</Button>
							<Button variant="secondary" class="font-ui">SECONDARY</Button>
							<Button variant="ghost" class="font-ui">GHOST</Button>
							<Button variant="destructive" class="font-ui">DESTRUCTIVE</Button>
						</div>

						<p class="font-mono mb-4 mt-12 text-[10px] tracking-widest text-muted-foreground">SIZES</p>
						<div class="flex flex-wrap items-center gap-4">
							<Button size="sm" class="font-ui">SMALL</Button>
							<Button size="default" class="font-ui">DEFAULT</Button>
							<Button size="lg" class="font-ui">LARGE</Button>
						</div>

						<p class="font-mono mb-4 mt-12 text-[10px] tracking-widest text-muted-foreground">WITH ICONS</p>
						<div class="flex flex-wrap gap-4">
							<Button class="font-ui">
								CONTINUE
								<ArrowRight class="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				</section>

			{:else}
				<!-- Default / Coming Soon -->
				<section class="border-b border-border">
					<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COMING.SOON</span>
						<h1 class="font-display mt-4 text-center text-3xl font-bold uppercase md:text-4xl">
							{designSystemContent[activeSection]?.title || activeSection.toUpperCase().replace('-', ' ')}
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