<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
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
		Target,
		Eye,
		Maximize2,
		Square,
		ExternalLink
	} from '@lucide/svelte';

	// Design principles
	const principles = [
		{
			number: '01',
			title: 'INDUSTRIAL PRECISION',
			desc: 'No rounded corners. Sharp edges. Grid-based layouts. Every element is intentional and aligned.',
			icon: Square
		},
		{
			number: '02',
			title: 'HIGH CONTRAST',
			desc: 'Dark backgrounds with vibrant cobalt blue accents create visual impact and hierarchy.',
			icon: Eye
		},
		{
			number: '03',
			title: 'TYPOGRAPHY FIRST',
			desc: 'Clear hierarchy through type scale and weight. Four distinct typefaces for different purposes.',
			icon: Type
		},
		{
			number: '04',
			title: 'MOTION WITH PURPOSE',
			desc: 'Scroll-based animations that enhance rather than distract. Subtle, meaningful transitions.',
			icon: Sparkles
		}
	];

	// Core values
	const values = [
		{ title: 'CONSISTENCY', desc: 'Unified patterns across all pages' },
		{ title: 'ACCESSIBILITY', desc: 'WCAG 2.1 compliant interfaces' },
		{ title: 'PERFORMANCE', desc: 'Optimized for Core Web Vitals' },
		{ title: 'SCALABILITY', desc: 'Built to grow with your project' }
	];

	// Documentation sections - tiles
	const docSections = [
		{
			category: 'FOUNDATION',
			items: [
				{
					icon: Grid3x3,
					title: 'GRID SYSTEM',
					desc: '12-column grid with 1px gap borders. Responsive breakpoints and spacing.',
					href: '/docs/grid',
					stats: '12 COLS'
				},
				{
					icon: Palette,
					title: 'COLORS',
					desc: 'Cobalt blue primary with yellow and red accents on dark backgrounds.',
					href: '/docs/colors',
					stats: '6 COLORS'
				},
				{
					icon: Type,
					title: 'TYPOGRAPHY',
					desc: 'Four distinct typefaces for display, body, UI, and code elements.',
					href: '/docs/typography',
					stats: '4 FONTS'
				},
				{
					icon: Zap,
					title: 'ANIMATIONS',
					desc: 'Scroll-based animations using Intersection Observer.',
					href: '/docs/animations',
					stats: '4 TYPES'
				}
			]
		},
		{
			category: 'COMPONENTS',
			items: [
				{
					icon: MousePointer,
					title: 'BUTTONS',
					desc: 'Button variants for different actions and contexts.',
					href: '/docs/buttons',
					stats: '5 VARIANTS'
				},
				{
					icon: Code2,
					title: 'FORM ELEMENTS',
					desc: 'Input fields, toggles, selects, and form controls.',
					href: '/docs/forms',
					stats: '8 ELEMENTS'
				},
				{
					icon: Layout,
					title: 'LAYOUT',
					desc: 'Section components, tiles, cards, and layout utilities.',
					href: '/docs/layout',
					stats: '12 PARTS'
				},
				{
					icon: Component,
					title: 'INTERACTIVE',
					desc: 'Accordion, modals, tabs, and interactive elements.',
					href: '/docs/interactive',
					stats: '6 ELEMENTS'
				}
			]
		}
	];

	// Quick reference stats
	const quickStats = [
		{ label: 'PADDING MOBILE', value: '24px', code: 'px-6' },
		{ label: 'PADDING TABLET', value: '48px', code: 'md:px-12' },
		{ label: 'PADDING DESKTOP', value: '64px', code: 'lg:px-16' },
		{ label: 'GRID GAP', value: '1px', code: 'gap-px' }
	];
</script>

<svelte:head>
	<title>Documentation — {m.site_name()}</title>
	<meta name="description" content="Design system documentation for MostlyWhat Systems. Grid system, colors, typography, components, and patterns." />
</svelte:head>

<HeroSection label="// REFERENCE.DESIGN" title="DESIGN SYSTEM" />

<DescriptionSection 
	description="A comprehensive guide to our design language, grid system, components, and patterns. Everything you need to build consistent, beautiful interfaces."
	stats={[
		{ value: '12', label: 'COLUMNS' },
		{ value: '64PX', label: 'GRID SIZE' },
		{ value: '4', label: 'FONTS' }
	]}
/>

<!-- Design Principles Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PHILOSOPHY</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">DESIGN PRINCIPLES</h2>
		<p class="font-body mt-4 max-w-2xl text-lg text-muted-foreground">
			Our design system is built on four core principles that guide every decision we make.
		</p>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each principles as { number, title, desc, icon: Icon } (number)}
			<div class="col-span-12 flex flex-col bg-background px-6 py-10 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
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

<!-- Core Values Bar -->
<section class="border-b border-border bg-card">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each values as { title, desc } (title)}
			<div class="col-span-6 bg-card px-6 py-6 md:col-span-3 md:px-12 lg:px-16">
				<h3 class="font-ui text-sm font-semibold tracking-wider text-primary">{title}</h3>
				<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Quick Reference - Spacing -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-4 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — QUICK REFERENCE</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">SPACING SYSTEM</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">
				Consistent spacing creates visual rhythm. Use these values throughout your layouts.
			</p>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px border-t border-border bg-border lg:col-span-8 lg:grid-cols-4 lg:border-l lg:border-t-0" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each quickStats as { label, value, code } (label)}
				<div class="flex flex-col justify-center bg-background px-6 py-8 md:px-8">
					<span class="font-display text-2xl font-bold text-primary md:text-3xl">{value}</span>
					<span class="font-mono mt-2 text-[10px] tracking-widest text-muted-foreground">{label}</span>
					<code class="font-mono mt-3 text-xs text-primary/70">{code}</code>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Documentation Sections - Foundation -->
{#each docSections as { category, items } (category)}
	<section class="border-b border-border">
		<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// {category}</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">{category}</h2>
		</div>
		<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each items as { icon: Icon, title, desc, href, stats } (title)}
				<a
					href={localizeHref(href)}
					class="col-span-12 flex flex-col bg-background px-6 py-10 transition-colors hover:bg-card sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16"
				>
					<div class="flex items-start justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Icon class="h-5 w-5 text-primary" />
						</div>
						<span class="font-mono text-[10px] tracking-wider text-primary">{stats}</span>
					</div>
					<h3 class="font-ui mt-6 text-base font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
					<span class="font-mono mt-6 flex items-center gap-2 text-xs tracking-wider text-primary">
						VIEW DOCS
						<ArrowRight class="h-3.5 w-3.5" />
					</span>
				</a>
			{/each}
		</div>
	</section>
{/each}

<!-- Preview Section - Grid Demo -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-5 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PREVIEW</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">12-COLUMN GRID</h2>
			<p class="font-body mt-4 text-muted-foreground">
				The foundation of our layout system. All elements align to this grid for visual consistency across every page.
			</p>
			<div class="mt-8 space-y-4">
				<div class="flex items-center gap-4">
					<span class="font-mono text-xs text-primary">gap-px</span>
					<span class="font-body text-sm text-muted-foreground">1px grid gaps create subtle borders</span>
				</div>
				<div class="flex items-center gap-4">
					<span class="font-mono text-xs text-primary">col-span-*</span>
					<span class="font-body text-sm text-muted-foreground">Flexible column spanning</span>
				</div>
				<div class="flex items-center gap-4">
					<span class="font-mono text-xs text-primary">bg-border</span>
					<span class="font-body text-sm text-muted-foreground">Border color as grid background</span>
				</div>
			</div>
		</div>
		<div class="col-span-12 flex flex-col justify-center border-t border-border bg-card px-6 py-12 md:px-12 lg:col-span-7 lg:border-l lg:border-t-0 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<!-- Grid Demo -->
			<p class="font-mono mb-4 text-[10px] tracking-widest text-muted-foreground">12-COLUMN GRID</p>
			<div class="grid grid-cols-12 gap-px bg-border">
				{#each Array(12) as _, i (i)}
					<div class="flex items-center justify-center bg-background py-4">
						<span class="font-mono text-xs text-muted-foreground">{i + 1}</span>
					</div>
				{/each}
			</div>
			
			<p class="font-mono mb-4 mt-8 text-[10px] tracking-widest text-muted-foreground">COMMON PATTERNS</p>
			<div class="space-y-2">
				<div class="grid grid-cols-12 gap-px bg-border">
					<div class="col-span-4 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">4</span></div>
					<div class="col-span-4 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">4</span></div>
					<div class="col-span-4 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">4</span></div>
				</div>
				<div class="grid grid-cols-12 gap-px bg-border">
					<div class="col-span-6 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">6</span></div>
					<div class="col-span-6 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">6</span></div>
				</div>
				<div class="grid grid-cols-12 gap-px bg-border">
					<div class="col-span-3 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">3</span></div>
					<div class="col-span-9 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">9</span></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Typography Preview -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// TYPOGRAPHY</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">FOUR TYPEFACES</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="col-span-12 flex flex-col bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-primary">DISPLAY</span>
			<p class="font-display mt-3 text-3xl font-bold uppercase">Tourney</p>
			<p class="font-body mt-3 text-sm text-muted-foreground">Headlines & titles</p>
		</div>
		<div class="col-span-12 flex flex-col bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-primary">BODY</span>
			<p class="font-body mt-3 text-2xl">Hubot Sans</p>
			<p class="font-body mt-3 text-sm text-muted-foreground">Body text & paragraphs</p>
		</div>
		<div class="col-span-12 flex flex-col bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-primary">UI</span>
			<p class="font-ui mt-3 text-2xl font-semibold tracking-wider">Chakra Petch</p>
			<p class="font-body mt-3 text-sm text-muted-foreground">Buttons & labels</p>
		</div>
		<div class="col-span-12 flex flex-col bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-primary">CODE</span>
			<p class="font-mono mt-3 text-xl">JetBrains Mono</p>
			<p class="font-body mt-3 text-sm text-muted-foreground">Code & technical text</p>
		</div>
	</div>
</section>

<!-- Color Palette Preview -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COLORS</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COLOR PALETTE</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
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
			<div class="h-24 bg-background border-y border-border"></div>
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

<!-- External Resources -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// RESOURCES</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">EXTERNAL DOCS</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">Additional resources and documentation for the technologies we use.</p>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border md:col-span-6" use:scrollAnimate={{ animation: 'stagger' }}>
			<a href="https://svelte.dev/docs" target="_blank" rel="noopener" class="flex items-center justify-between bg-card px-6 py-6 transition-colors hover:bg-background md:px-8">
				<span class="font-ui text-sm font-semibold tracking-wider">SVELTE</span>
				<ExternalLink class="h-4 w-4 text-primary" />
			</a>
			<a href="https://tailwindcss.com/docs" target="_blank" rel="noopener" class="flex items-center justify-between bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
				<span class="font-ui text-sm font-semibold tracking-wider">TAILWIND</span>
				<ExternalLink class="h-4 w-4 text-primary" />
			</a>
			<a href="https://lucide.dev/icons" target="_blank" rel="noopener" class="flex items-center justify-between bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
				<span class="font-ui text-sm font-semibold tracking-wider">LUCIDE ICONS</span>
				<ExternalLink class="h-4 w-4 text-primary" />
			</a>
			<a href="https://www.shadcn-svelte.com" target="_blank" rel="noopener" class="flex items-center justify-between bg-card px-6 py-6 transition-colors hover:bg-background md:px-8">
				<span class="font-ui text-sm font-semibold tracking-wider">SHADCN-SVELTE</span>
				<ExternalLink class="h-4 w-4 text-primary" />
			</a>
		</div>
	</div>
</section>

<!-- CTA Section -->
<CTASection
	variant="split"
	label="NEED HELP?"
	title="GET SUPPORT"
	description="Having trouble with implementation? Our team is here to help you build something great."
	buttonText="CONTACT US"
	buttonHref="/contact"
	secondaryButtonText="VIEW SUPPORT"
	secondaryButtonHref="/support"
	stats={[
		{ value: '<24H', label: 'RESPONSE' },
		{ value: '100%', label: 'HELPFUL' }
	]}
/>
