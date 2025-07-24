<script lang="ts">
	import DesignHero from '$lib/components/sections/hero/design-hero.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		ArrowLeft,
		Layout,
		Smartphone,
		Monitor,
		Tablet,
		Zap,
		Shield,
		Gauge,
		Grid3X3,
		Layers,
		MousePointer,
		Navigation
	} from '@lucide/svelte/icons';

	const layoutPatterns = [
		{
			name: 'Hero Section',
			description: 'Full-width introductory section with call-to-action and visual elements',
			usage: 'Landing pages, feature introductions, page headers',
			example: 'Your current homepage hero with sci-fi styling',
			accent: 'primary',
			icon: Layout
		},
		{
			name: 'Card Grid',
			description: 'Responsive grid layout for displaying multiple items consistently',
			usage: 'Product listings, feature showcases, portfolios, content galleries',
			example: 'Design system navigation cards, component categories',
			accent: 'secondary',
			icon: Grid3X3
		},
		{
			name: 'Sidebar Layout',
			description: 'Main content area with complementary sidebar navigation',
			usage: 'Documentation, dashboards, content management systems',
			example: 'Vertical tabs in component showcase',
			accent: 'destructive',
			icon: Layers
		},
		{
			name: 'Interactive Showcase',
			description: 'Tabbed interface for demonstrating features or components',
			usage: 'Product demos, component libraries, feature comparisons',
			example: 'Component examples with code snippets',
			accent: 'muted',
			icon: MousePointer
		}
	];

	const responsiveBreakpoints = [
		{
			name: 'Mobile',
			size: 'sm',
			pixels: '640px',
			icon: Smartphone,
			accent: 'primary',
			description: 'Single column layouts, stacked navigation'
		},
		{
			name: 'Tablet',
			size: 'md',
			pixels: '768px',
			icon: Tablet,
			accent: 'secondary',
			description: '2-column grids, compact navigation'
		},
		{
			name: 'Desktop',
			size: 'lg',
			pixels: '1024px',
			icon: Monitor,
			accent: 'destructive',
			description: 'Multi-column layouts, full navigation'
		},
		{
			name: 'Wide',
			size: 'xl',
			pixels: '1280px',
			icon: Monitor,
			accent: 'muted',
			description: 'Extended grids, maximum content width'
		}
	];

	const designPrinciples = [
		{
			title: 'Progressive Enhancement',
			description: 'Start with a solid foundation and enhance with advanced features for better devices',
			examples: ['Mobile-first responsive design', 'Graceful JavaScript degradation', 'Semantic HTML structure'],
			accent: 'primary',
			icon: Gauge
		},
		{
			title: 'Content First',
			description: 'Design around your content requirements, not arbitrary layout constraints',
			examples: ['Flexible layouts that adapt to content', 'Readable typography hierarchy', 'Meaningful whitespace usage'],
			accent: 'secondary',
			icon: Layout
		},
		{
			title: 'Performance by Default',
			description: 'Optimize for speed and efficiency in every design and development decision',
			examples: ['Minimal JavaScript payload', 'Optimized image delivery', 'Efficient CSS architecture'],
			accent: 'destructive',
			icon: Zap
		},
		{
			title: 'Accessible by Design',
			description: 'Include everyone from the start, not as an afterthought or retrofit',
			examples: ['Semantic markup structure', 'Keyboard navigation support', 'Screen reader compatibility'],
			accent: 'muted',
			icon: Shield
		}
	];

	const compositionGuidelines = [
		{
			category: 'Spacing & Rhythm',
			rules: [
				'Use the 4px spacing scale consistently across all components',
				'Maintain vertical rhythm with consistent line-height values',
				'Group related content using whitespace hierarchy',
				'Ensure adequate touch targets (44px minimum)'
			]
		},
		{
			category: 'Color Usage',
			rules: [
				'Reserve primary color for main call-to-action elements only',
				'Use semantic colors consistently for status indication',
				'Ensure sufficient contrast ratios for accessibility',
				'Limit color palette to maintain visual cohesion'
			]
		},
		{
			category: 'Typography Hierarchy',
			rules: [
				'Use heading levels (H1-H6) semantically, not for styling',
				'Maintain consistent text sizes and weights throughout',
				'Create emphasis through font weight and color, not just size',
				'Ensure readable line lengths (45-75 characters)'
			]
		},
		{
			category: 'Component Composition',
			rules: [
				'Avoid deeply nested components when possible',
				'Design components to work in multiple contexts',
				'Consider performance impact of component complexity',
				'Maintain consistent interaction patterns'
			]
		}
	];
</script>

<DesignHero
	accent="destructive"
	breadcrumbs={[
		{ label: 'About', href: '/about' },
		{ label: 'Design System', href: '/about/design' },
		{ label: 'Patterns' }
	]}
	description="Layout patterns, composition guidelines, and best practices for building consistent, accessible interfaces that scale."
	size="small"
	subtitle="Design Guidelines"
	title="Patterns"
>
	{#snippet children()}
		<Button href="/about/design" variant="outline" class="font-chakra uppercase">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Design System
		</Button>
	{/snippet}
</DesignHero>

<!-- Main Content -->
<div class="container mx-auto px-4 py-16 space-y-24">

	<!-- Design Principles Section -->
	<section class="space-y-8" id="principles">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Shield class="h-6 w-6 text-primary" />
				<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
					Design Principles
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Core Philosophy
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Our design system is built on four core principles that ensure consistency,
				accessibility, and developer productivity across all projects.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each designPrinciples as principle (principle.title)}
				<div class="group relative">
					<!-- Background Gradient -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-{principle.accent}/5 to-{principle.accent}/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

					<!-- Card Content -->
					<div
						class="relative bg-card border border-border/50 rounded-lg p-6 hover:border-{principle.accent}/30 transition-all duration-300">
						<!-- Header -->
						<div class="flex items-start space-x-4 mb-4">
							<div
								class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-{principle.accent}/10 text-{principle.accent}">
								<svelte:component this={principle.icon} class="h-6 w-6" />
							</div>
							<div class="flex-1">
								<h3 class="font-heading text-xl font-bold uppercase mb-2">
									{principle.title}
								</h3>
								<p class="text-muted-foreground text-sm">
									{principle.description}
								</p>
							</div>
						</div>

						<!-- Examples -->
						<div class="space-y-2">
							{#each principle.examples as example (example)}
								<div class="flex items-start space-x-2">
									<div class="w-1.5 h-1.5 rounded-full bg-{principle.accent} mt-2 flex-shrink-0"></div>
									<p class="text-xs text-muted-foreground">
										{example}
									</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Layout Patterns Section -->
	<section class="space-y-8" id="patterns">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Layout class="h-6 w-6 text-secondary" />
				<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
					Layout Patterns
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Common Layout Patterns
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Proven layout patterns used throughout the application for consistency and user familiarity.
			</p>
		</div>

		<div class="space-y-8">
			{#each layoutPatterns as pattern, index (pattern.name)}
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center {index % 2 === 1 ? 'lg:flex-row-reverse' : ''}">
					<!-- Content -->
					<div class="space-y-6 {index % 2 === 1 ? 'lg:order-2' : ''}">
						<div class="space-y-4">
							<div class="flex items-center space-x-3">
								<div class="h-px bg-{pattern.accent} w-8"></div>
								<Badge variant="outline"
											 class="font-chakra text-xs uppercase tracking-wider border-{pattern.accent}/30">
									Pattern
								</Badge>
							</div>

							<h3 class="font-heading text-2xl md:text-3xl font-black uppercase">
								{pattern.name}
							</h3>

							<p class="text-muted-foreground leading-relaxed">
								{pattern.description}
							</p>

							<div class="space-y-2 text-sm">
								<div class="flex items-start space-x-2">
									<span class="font-chakra text-xs uppercase text-muted-foreground min-w-0 w-16">Best for:</span>
									<span>{pattern.usage}</span>
								</div>
								<div class="flex items-start space-x-2">
									<span class="font-chakra text-xs uppercase text-muted-foreground min-w-0 w-16">Example:</span>
									<span>{pattern.example}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Visual -->
					<div class="relative {index % 2 === 1 ? 'lg:order-1' : ''}">
						<div class="aspect-square relative">
							<!-- Background Pattern -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-{pattern.accent}/10 to-{pattern.accent}/5 rounded-lg"></div>

							<!-- Icon Container -->
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="relative">
									<!-- Outer Ring -->
									<div class="w-32 h-32 rounded-full border-2 border-{pattern.accent}/20 animate-pulse"></div>

									<!-- Inner Ring -->
									<div class="absolute inset-6 rounded-full border border-{pattern.accent}/30"></div>

									<!-- Icon -->
									<div class="absolute inset-0 flex items-center justify-center">
										<svelte:component this={pattern.icon} class="h-12 w-12 text-{pattern.accent}" />
									</div>
								</div>
							</div>

							<!-- Corner Accents -->
							<div class="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-{pattern.accent}/40"></div>
							<div class="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-{pattern.accent}/40"></div>
							<div class="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-{pattern.accent}/40"></div>
							<div class="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-{pattern.accent}/40"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Responsive Design Section -->
	<section class="space-y-8" id="responsive">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Smartphone class="h-6 w-6 text-destructive" />
				<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
					Responsive Design
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Mobile-First Approach
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Progressive enhancement starting with mobile-first responsive design for optimal experience across all devices.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each responsiveBreakpoints as breakpoint (breakpoint.name)}
				<div class="group relative">
					<!-- Background Gradient -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-{breakpoint.accent}/5 to-{breakpoint.accent}/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

					<!-- Card Content -->
					<div
						class="relative bg-card border border-border/50 rounded-lg p-6 hover:border-{breakpoint.accent}/30 transition-all duration-300 text-center">
						<!-- Icon -->
						<div class="mb-4">
							<div
								class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-{breakpoint.accent}/10 text-{breakpoint.accent} mx-auto">
								<svelte:component this={breakpoint.icon} class="h-6 w-6" />
							</div>
						</div>

						<!-- Content -->
						<div class="space-y-3">
							<h3 class="font-heading text-lg font-bold uppercase">
								{breakpoint.name}
							</h3>
							<div class="text-2xl font-black text-{breakpoint.accent}">
								{breakpoint.pixels}+
							</div>
							<Badge variant="outline" class="font-chakra text-xs">
								{breakpoint.size}:
							</Badge>
							<p class="text-xs text-muted-foreground mt-2">
								{breakpoint.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Grid Example -->
		<div class="bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg p-8 border border-border/20">
			<h3 class="font-heading text-xl font-bold uppercase mb-4">Responsive Grid Example</h3>
			<div class="bg-muted/50 p-4 rounded-lg">
				<pre class="text-sm overflow-x-auto"><code>{`<!-- Responsive 2-column base grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {#each items as item}
    <div class="col-span-1">
      <!-- Content -->
    </div>
  {/each}
</div>

<!-- Content-first responsive layout -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <div class="space-y-6">
    <!-- Text content -->
  </div>
  <div class="relative">
    <!-- Visual content -->
  </div>
</div>`}</code></pre>
			</div>
		</div>
	</section>

	<!-- Composition Guidelines Section -->
	<section class="space-y-8" id="guidelines">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Navigation class="h-6 w-6 text-muted-foreground" />
				<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
					Composition Guidelines
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Best Practices
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Guidelines for combining components and creating effective, accessible layouts.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each compositionGuidelines as guideline (guideline.category)}
				<div class="bg-card border border-border/50 rounded-lg p-6">
					<h3 class="font-heading text-lg font-bold uppercase mb-4">
						{guideline.category}
					</h3>
					<ul class="space-y-3">
						{#each guideline.rules as rule (rule)}
							<li class="flex items-start space-x-3">
								<div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
								<p class="text-sm text-muted-foreground">
									{rule}
								</p>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>
</div>
