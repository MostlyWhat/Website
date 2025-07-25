<script lang="ts">
	import DesignHero from '$lib/components/sections/hero/design-hero.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ArrowRight, Palette, Component, Layout, Zap, Shield, Gauge } from '@lucide/svelte/icons';

	const designSections = [
		{
			title: 'Foundations',
			description: 'Colors, typography, spacing, and design tokens that form the foundation of our design system.',
			href: '/about/design/foundations',
			icon: Palette,
			accent: 'primary',
			stats: '15+ Tokens'
		},
		{
			title: 'Components',
			description: 'Reusable UI components with interactive examples and implementation guidelines.',
			href: '/about/design/components',
			icon: Component,
			accent: 'secondary',
			stats: '30+ Components'
		},
		{
			title: 'Patterns',
			description: 'Layout patterns, composition guidelines, and best practices for building interfaces.',
			href: '/about/design/patterns',
			icon: Layout,
			accent: 'destructive',
			stats: '10+ Patterns'
		}
	];

	const principles = [
		{
			title: 'Performance',
			description: 'Optimized for speed with minimal bundle size and efficient rendering.',
			icon: Gauge,
			accent: 'primary'
		},
		{
			title: 'Accessibility',
			description: 'Built with WCAG guidelines and inclusive design principles.',
			icon: Shield,
			accent: 'secondary'
		},
		{
			title: 'Developer Experience',
			description: 'TypeScript support, clear documentation, and intuitive APIs.',
			icon: Zap,
			accent: 'destructive'
		}
	];
</script>

<DesignHero
	accent="primary"
	breadcrumbs={[
		{ label: 'About', href: '/about' },
		{ label: 'Design System' }
	]}
	description="A comprehensive design system built with Svelte, Tailwind CSS, and modern web standards. Explore our foundations, components, and patterns."
	size="full"
	subtitle="Documentation"
	title="Design System"
>
	{#snippet children()}
		<Button href="#foundations" variant="default" class="font-chakra uppercase">
			Explore Foundations
			<ArrowRight class="ml-2 h-4 w-4" />
		</Button>
		<Button href="#components" variant="outline" class="font-chakra uppercase">
			View Components
		</Button>
	{/snippet}
</DesignHero>

<!-- Main Content -->
<div class="py-16 space-y-24">

	<!-- Design Principles Section -->
	<section class="space-y-8" id="principles">
		<div class="px-4 space-y-4 text-start">
			<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
				Core Principles
			</Badge>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Built for Modern Development
			</h2>
			<p class="text-muted-foreground text-lg max-w-2xl mx-auto">
				Our design system is built on three core principles that ensure consistency,
				accessibility, and developer productivity.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-20">
			{#each principles as principle (principle.title)}
				<div class="group relative">
					<!-- Card Background -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-{principle.accent}/5 to-{principle.accent}/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

					<!-- Card Content -->
					<div
						class="relative bg-card border border-border/50 rounded-lg p-6 hover:border-{principle.accent}/30 transition-all duration-300">
						<!-- Icon -->
						<div class="mb-4">
							<div
								class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-{principle.accent}/10 text-{principle.accent}">
								<svelte:component this={principle.icon} class="h-6 w-6" />
							</div>
						</div>

						<!-- Content -->
						<div class="space-y-3">
							<h3 class="font-heading text-xl font-bold uppercase">
								{principle.title}
							</h3>
							<p class="text-muted-foreground text-sm leading-relaxed">
								{principle.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Navigation Sections -->
	<section class="space-y-8" id="sections">
		<div class="space-y-4">
			<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
				Explore Documentation
			</Badge>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Design System Sections
			</h2>
		</div>

		<div class="space-y-8">
			{#each designSections as section, index (section.title)}
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center {index % 2 === 1 ? 'lg:flex-row-reverse' : ''}">
					<!-- Content -->
					<div class="space-y-6 {index % 2 === 1 ? 'lg:order-2' : ''}">
						<div class="space-y-4">
							<div class="flex items-center space-x-3">
								<div class="h-px bg-{section.accent} w-8"></div>
								<Badge variant="outline"
											 class="font-chakra text-xs uppercase tracking-wider border-{section.accent}/30">
									{section.stats}
								</Badge>
							</div>

							<h3 class="font-heading text-2xl md:text-3xl font-black uppercase">
								{section.title}
							</h3>

							<p class="text-muted-foreground text-lg leading-relaxed">
								{section.description}
							</p>
						</div>

						<div class="flex flex-col sm:flex-row gap-4">
							<Button href={section.href} class="font-chakra uppercase">
								Explore {section.title}
								<ArrowRight class="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>

					<!-- Visual -->
					<div class="relative {index % 2 === 1 ? 'lg:order-1' : ''}">
						<div class="aspect-square relative">
							<!-- Background Pattern -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-{section.accent}/10 to-{section.accent}/5 rounded-lg"></div>

							<!-- Icon Container -->
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="relative">
									<!-- Outer Ring -->
									<div class="w-32 h-32 rounded-full border-2 border-{section.accent}/20 animate-pulse"></div>

									<!-- Inner Ring -->
									<div class="absolute inset-4 rounded-full border border-{section.accent}/30"></div>

									<!-- Icon -->
									<div class="absolute inset-0 flex items-center justify-center">
										<svelte:component this={section.icon} class="h-12 w-12 text-{section.accent}" />
									</div>
								</div>
							</div>

							<!-- Corner Accents -->
							<div class="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-{section.accent}/40"></div>
							<div class="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-{section.accent}/40"></div>
							<div class="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-{section.accent}/40"></div>
							<div class="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-{section.accent}/40"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Stats Section -->
	<section class="relative" id="stats">
		<!-- Background -->
		<div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-destructive/5 rounded-lg"></div>

		<!-- Content -->
		<div class="relative p-8 md:p-12">
			<div class="text-center space-y-8">
				<h2 class="font-heading text-2xl md:text-3xl font-black uppercase">
					System Overview
				</h2>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div class="text-center space-y-2">
						<div class="text-3xl md:text-4xl font-black font-heading text-primary">30+</div>
						<div class="font-chakra text-xs uppercase tracking-wider text-muted-foreground">Components</div>
					</div>
					<div class="text-center space-y-2">
						<div class="text-3xl md:text-4xl font-black font-heading text-secondary">100%</div>
						<div class="font-chakra text-xs uppercase tracking-wider text-muted-foreground">TypeScript</div>
					</div>
					<div class="text-center space-y-2">
						<div class="text-3xl md:text-4xl font-black font-heading text-destructive">OKLCH</div>
						<div class="font-chakra text-xs uppercase tracking-wider text-muted-foreground">Color Space</div>
					</div>
					<div class="text-center space-y-2">
						<div class="text-3xl md:text-4xl font-black font-heading text-foreground">A11Y</div>
						<div class="font-chakra text-xs uppercase tracking-wider text-muted-foreground">Ready</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
