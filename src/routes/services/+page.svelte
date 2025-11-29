<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Compass, Palette, Layout, Code, Database, TrendingUp, Check } from '@lucide/svelte';

	const services = [
		{ icon: Compass, number: '01', title: m.service_strategy_title(), desc: m.service_strategy_desc(), features: ['Product discovery', 'Competitive analysis', 'Roadmapping', 'KPIs'] },
		{ icon: Palette, number: '02', title: m.service_brand_title(), desc: m.service_brand_desc(), features: ['Logo design', 'Design systems', 'Brand guidelines', 'Art direction'] },
		{ icon: Layout, number: '03', title: m.service_ux_title(), desc: m.service_ux_desc(), features: ['User research', 'Information architecture', 'Wireframing', 'Prototypes'] },
		{ icon: Code, number: '04', title: m.service_engineering_title(), desc: m.service_engineering_desc(), features: ['SvelteKit', 'TypeScript', 'Performance', 'Accessibility'] },
		{ icon: Database, number: '05', title: m.service_platforms_title(), desc: m.service_platforms_desc(), features: ['Headless CMS', 'E-commerce', 'APIs', 'Integrations'] },
		{ icon: TrendingUp, number: '06', title: m.service_growth_title(), desc: m.service_growth_desc(), features: ['Analytics', 'SEO', 'A/B testing', 'Conversion'] }
	];

	const packages = [
		{ name: 'Sprint', price: 'From $5K', duration: '2-4 weeks', features: ['Single focus', 'Rapid iteration', 'Quick deploy'] },
		{ name: 'Build', price: 'From $15K', duration: '6-12 weeks', features: ['End-to-end', 'Design + code', 'Launch support'], featured: true },
		{ name: 'Partner', price: 'Custom', duration: 'Ongoing', features: ['Dedicated capacity', 'Priority support', 'Strategic'] }
	];
</script>

<svelte:head>
	<title>{m.nav_services()} — {m.site_name()}</title>
	<meta name="description" content={m.services_subtitle()} />
</svelte:head>

<!-- Hero Section - Full Screen -->
<section class="relative flex min-h-[70vh] flex-col border-b border-border">
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<div class="flex flex-1 items-end p-4 pb-12 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid w-full gap-4 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<p class="font-mono text-xs uppercase tracking-wider text-primary">Services</p>
				<h1 class="font-display mt-2 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
					{m.services_title()}
				</h1>
			</div>
			<div class="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
				<p class="font-body text-muted-foreground">{m.services_subtitle()}</p>
			</div>
		</div>
	</div>
</section>

<!-- Services Grid -->
<section class="border-b border-border">
	<div class="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { icon: Icon, number, title, desc, features }}
			<div class="stagger-children flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6">
				<div class="flex items-start justify-between">
					<div class="flex h-10 w-10 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-xs text-primary">{number}</span>
				</div>
				<h3 class="font-ui mt-3 text-sm font-semibold uppercase">{title}</h3>
				<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
				<ul class="mt-3 space-y-1">
					{#each features as feature}
						<li class="font-mono flex items-center gap-2 text-xs text-muted-foreground">
							<Check class="h-3 w-3 shrink-0 text-primary" />
							{feature}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Packages Grid -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-12">
		<div class="border-b border-border p-4 md:p-6 lg:col-span-3 lg:border-b-0 lg:border-r" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Engagement</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">How We Work</h2>
		</div>
		<div class="grid gap-px bg-border lg:col-span-9 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each packages as pkg}
				<div class="stagger-children flex flex-col {pkg.featured ? 'bg-card' : 'bg-background'} p-4 md:p-6">
					{#if pkg.featured}
						<span class="font-mono mb-2 text-xs text-primary">Popular</span>
					{/if}
					<h3 class="font-display text-xl">{pkg.name}</h3>
					<div class="mt-1">
						<span class="font-display text-2xl text-primary">{pkg.price}</span>
						<span class="font-mono ml-2 text-xs text-muted-foreground">{pkg.duration}</span>
					</div>
					<ul class="mt-3 space-y-1">
						{#each pkg.features as feature}
							<li class="font-mono flex items-center gap-2 text-xs text-muted-foreground">
								<Check class="h-3 w-3 shrink-0 text-primary" />
								{feature}
							</li>
						{/each}
					</ul>
					<Button href="/contact" variant={pkg.featured ? 'default' : 'outline'} class="font-ui mt-4">Get Started</Button>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Process Section -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-12">
		<div class="border-b border-border p-4 md:p-6 lg:col-span-3 lg:border-b-0 lg:border-r" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Process</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">{m.process_title()}</h2>
		</div>
		<div class="grid gap-px bg-border sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			<div class="stagger-children bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">01</span>
				<h3 class="font-ui mt-2 text-sm font-semibold">{m.process_step1_title()}</h3>
				<p class="font-body mt-1 text-xs text-muted-foreground">{m.process_step1_desc()}</p>
			</div>
			<div class="stagger-children bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">02</span>
				<h3 class="font-ui mt-2 text-sm font-semibold">{m.process_step2_title()}</h3>
				<p class="font-body mt-1 text-xs text-muted-foreground">{m.process_step2_desc()}</p>
			</div>
			<div class="stagger-children bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">03</span>
				<h3 class="font-ui mt-2 text-sm font-semibold">{m.process_step3_title()}</h3>
				<p class="font-body mt-1 text-xs text-muted-foreground">{m.process_step3_desc()}</p>
			</div>
			<div class="stagger-children bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">04</span>
				<h3 class="font-ui mt-2 text-sm font-semibold">{m.process_step4_title()}</h3>
				<p class="font-body mt-1 text-xs text-muted-foreground">{m.process_step4_desc()}</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="p-4 md:p-6 lg:p-8">
			<h2 class="font-display text-2xl font-bold uppercase md:text-3xl">{m.cta_title()}</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">{m.cta_subtitle()}</p>
			<Button href="/contact" class="font-ui mt-4">
				{m.cta_button_primary()}
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="border-t border-border bg-card p-4 md:p-6 lg:border-l lg:border-t-0 lg:p-8">
			<p class="font-mono text-xs uppercase text-muted-foreground">Questions?</p>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-1 block text-lg text-primary hover:underline">hello@mostlywhat.systems</a>
		</div>
	</div>
</section>
