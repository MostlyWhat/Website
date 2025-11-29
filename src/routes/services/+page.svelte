<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Compass, Palette, Layout, Code, Database, TrendingUp, Check } from '@lucide/svelte';

	const services = [
		{
			icon: Compass,
			number: m.service_strategy_number(),
			title: m.service_strategy_title(),
			desc: m.service_strategy_desc(),
			features: [
				'Product discovery workshops',
				'Competitive analysis',
				'Roadmap development',
				'KPI definition'
			]
		},
		{
			icon: Palette,
			number: m.service_brand_number(),
			title: m.service_brand_title(),
			desc: m.service_brand_desc(),
			features: [
				'Logo & identity design',
				'Design system creation',
				'Brand guidelines',
				'Art direction'
			]
		},
		{
			icon: Layout,
			number: m.service_ux_number(),
			title: m.service_ux_title(),
			desc: m.service_ux_desc(),
			features: [
				'User research',
				'Information architecture',
				'Wireframing',
				'Interactive prototypes'
			]
		},
		{
			icon: Code,
			number: m.service_engineering_number(),
			title: m.service_engineering_title(),
			desc: m.service_engineering_desc(),
			features: [
				'SvelteKit development',
				'TypeScript integration',
				'Performance optimization',
				'Accessibility compliance'
			]
		},
		{
			icon: Database,
			number: m.service_platforms_number(),
			title: m.service_platforms_title(),
			desc: m.service_platforms_desc(),
			features: [
				'Headless CMS setup',
				'E-commerce integration',
				'API development',
				'Third-party services'
			]
		},
		{
			icon: TrendingUp,
			number: m.service_growth_number(),
			title: m.service_growth_title(),
			desc: m.service_growth_desc(),
			features: [
				'Analytics implementation',
				'SEO optimization',
				'A/B testing',
				'Conversion optimization'
			]
		}
	];

	const packages = [
		{
			name: 'Sprint',
			price: 'From $5K',
			duration: '2-4 weeks',
			desc: 'Fast turnaround for focused projects',
			features: ['Single deliverable focus', 'Rapid iteration', 'Direct communication', 'Quick deployment']
		},
		{
			name: 'Build',
			price: 'From $15K',
			duration: '6-12 weeks',
			desc: 'Full product development cycle',
			features: ['End-to-end development', 'Design + engineering', 'Testing & QA', 'Launch support'],
			featured: true
		},
		{
			name: 'Partner',
			price: 'Custom',
			duration: 'Ongoing',
			desc: 'Long-term product partnership',
			features: ['Dedicated capacity', 'Priority support', 'Strategic planning', 'Continuous improvement']
		}
	];
</script>

<svelte:head>
	<title>{m.nav_services()} — {m.site_name()}</title>
	<meta name="description" content={m.services_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Services</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl lg:text-6xl">{m.services_title()}</h1>
		<p class="font-body text-lg text-muted-foreground md:text-xl">{m.services_subtitle()}</p>
	</div>
</Section>

<!-- Services Grid -->
<Section background="card">
	<div class="stagger-children grid gap-6 lg:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { icon: Icon, number, title, desc, features }}
			<Tile padding="lg" class="flex flex-col">
				<div class="mb-4 flex items-start justify-between">
					<div class="flex h-12 w-12 items-center justify-center border border-border">
						<Icon class="h-6 w-6 text-primary" />
					</div>
					<span class="font-display text-3xl text-primary/30">{number}</span>
				</div>
				
				<h3 class="font-ui mb-2 text-xl font-semibold">{title}</h3>
				<p class="font-body mb-4 text-muted-foreground">{desc}</p>
				
				<ul class="mt-auto space-y-2">
					{#each features as feature}
						<li class="font-body flex items-center gap-2 text-sm">
							<Check class="h-4 w-4 shrink-0 text-primary" />
							{feature}
						</li>
					{/each}
				</ul>
			</Tile>
		{/each}
	</div>
</Section>

<!-- Packages Section -->
<Section>
	<div class="mb-12 text-center" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Engagement</p>
		<h2 class="h2 text-3xl md:text-4xl">How We Work</h2>
	</div>

	<div class="stagger-children grid gap-6 md:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each packages as pkg}
			<Tile 
				padding="lg" 
				variant={pkg.featured ? 'primary' : 'default'}
				class="flex flex-col {pkg.featured ? 'border-primary' : ''}"
			>
				{#if pkg.featured}
					<div class="font-ui mb-4 -mt-2 text-xs uppercase tracking-wider text-primary">Most Popular</div>
				{/if}
				
				<h3 class="font-display text-2xl">{pkg.name}</h3>
				<div class="mb-1 mt-2 flex items-baseline gap-2">
					<span class="font-display text-3xl text-primary">{pkg.price}</span>
				</div>
				<p class="font-ui mb-4 text-sm text-muted-foreground">{pkg.duration}</p>
				<p class="font-body mb-6 text-muted-foreground">{pkg.desc}</p>
				
				<ul class="mb-6 space-y-2">
					{#each pkg.features as feature}
						<li class="font-body flex items-center gap-2 text-sm">
							<Check class="h-4 w-4 shrink-0 text-primary" />
							{feature}
						</li>
					{/each}
				</ul>
				
				<Button 
					href="/contact" 
					variant={pkg.featured ? 'default' : 'outline'}
					class="font-ui mt-auto w-full"
				>
					Get Started
				</Button>
			</Tile>
		{/each}
	</div>
</Section>

<!-- Process Section -->
<Section background="card">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div use:scrollAnimate={{ animation: 'slide-left' }}>
			<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Process</p>
			<h2 class="h2 mb-6 text-3xl md:text-4xl">{m.process_title()}</h2>
			<p class="font-body text-lg text-muted-foreground">
				Our process is designed to be transparent, iterative, and collaborative. 
				We believe in shipping early and often, gathering feedback, and improving continuously.
			</p>
		</div>

		<div class="stagger-children space-y-4" use:scrollAnimate={{ animation: 'stagger' }}>
			<Tile padding="lg" class="flex gap-4">
				<div class="font-display text-3xl text-primary/30">1</div>
				<div>
					<h3 class="font-ui font-semibold">{m.process_step1_title()}</h3>
					<p class="font-body text-sm text-muted-foreground">{m.process_step1_desc()}</p>
				</div>
			</Tile>
			<Tile padding="lg" class="flex gap-4">
				<div class="font-display text-3xl text-primary/30">2</div>
				<div>
					<h3 class="font-ui font-semibold">{m.process_step2_title()}</h3>
					<p class="font-body text-sm text-muted-foreground">{m.process_step2_desc()}</p>
				</div>
			</Tile>
			<Tile padding="lg" class="flex gap-4">
				<div class="font-display text-3xl text-primary/30">3</div>
				<div>
					<h3 class="font-ui font-semibold">{m.process_step3_title()}</h3>
					<p class="font-body text-sm text-muted-foreground">{m.process_step3_desc()}</p>
				</div>
			</Tile>
			<Tile padding="lg" class="flex gap-4">
				<div class="font-display text-3xl text-primary/30">4</div>
				<div>
					<h3 class="font-ui font-semibold">{m.process_step4_title()}</h3>
					<p class="font-body text-sm text-muted-foreground">{m.process_step4_desc()}</p>
				</div>
			</Tile>
		</div>
	</div>
</Section>

<!-- CTA Section -->
<Section padding="xl">
	<div class="text-center" use:scrollAnimate={{ animation: 'scale' }}>
		<h2 class="font-display mb-4 text-3xl md:text-4xl">{m.cta_title()}</h2>
		<p class="font-body mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">{m.cta_subtitle()}</p>
		<Button href="/contact" size="lg" class="font-ui">
			{m.cta_button_primary()}
			<ArrowRight class="ml-2 h-5 w-5" />
		</Button>
	</div>
</Section>
