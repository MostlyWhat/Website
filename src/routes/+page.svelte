<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Grid from '$lib/components/layout/Grid.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Zap, Shield, Users, Headphones, Clock, MapPin, Code } from '@lucide/svelte';

	const services = [
		{ number: m.service_strategy_number(), title: m.service_strategy_title(), desc: m.service_strategy_desc() },
		{ number: m.service_brand_number(), title: m.service_brand_title(), desc: m.service_brand_desc() },
		{ number: m.service_ux_number(), title: m.service_ux_title(), desc: m.service_ux_desc() },
		{ number: m.service_engineering_number(), title: m.service_engineering_title(), desc: m.service_engineering_desc() },
		{ number: m.service_platforms_number(), title: m.service_platforms_title(), desc: m.service_platforms_desc() },
		{ number: m.service_growth_number(), title: m.service_growth_title(), desc: m.service_growth_desc() }
	];

	const capabilities = [
		{ icon: Zap, title: m.capability_speed(), desc: m.capability_speed_desc() },
		{ icon: Shield, title: m.capability_quality(), desc: m.capability_quality_desc() },
		{ icon: Users, title: m.capability_process(), desc: m.capability_process_desc() },
		{ icon: Headphones, title: m.capability_support(), desc: m.capability_support_desc() }
	];

	const stats = [
		{ label: m.stats_response_time(), value: m.stats_response_value(), icon: Clock },
		{ label: m.stats_locations(), value: m.stats_locations_value(), icon: MapPin },
		{ label: m.stats_stack(), value: m.stats_stack_value(), icon: Code }
	];

	const process = [
		{ step: '1', title: m.process_step1_title(), desc: m.process_step1_desc() },
		{ step: '2', title: m.process_step2_title(), desc: m.process_step2_desc() },
		{ step: '3', title: m.process_step3_title(), desc: m.process_step3_desc() },
		{ step: '4', title: m.process_step4_title(), desc: m.process_step4_desc() }
	];
</script>

<svelte:head>
	<title>{m.site_name()} — {m.site_tagline()}</title>
	<meta name="description" content={m.site_description()} />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden border-b border-border">
	<div class="mx-auto max-w-7xl px-4 py-24 md:py-32 lg:py-40">
		<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
			<!-- Hero Content -->
			<div use:scrollAnimate={{ animation: 'slide-left', startVisible: true }}>
				<h1 class="vt-title mb-6 text-4xl leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
					{m.hero_title()}
				</h1>
				<p class="font-body mb-8 max-w-xl text-lg text-muted-foreground md:text-xl">
					{m.hero_subtitle()}
				</p>
				<div class="flex flex-wrap gap-4">
					<Button href="/contact" size="lg" class="font-ui">
						{m.hero_cta_primary()}
						<ArrowRight class="ml-2 h-5 w-5" />
					</Button>
					<Button href="/projects" variant="outline" size="lg" class="font-ui">
						{m.hero_cta_secondary()}
					</Button>
				</div>
			</div>

			<!-- Stats Grid -->
			<div class="grid gap-4" use:scrollAnimate={{ animation: 'slide-right', delay: 200 }}>
				{#each stats as { label, value, icon: Icon }}
					<Tile variant="outline" class="flex items-center gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-primary bg-primary/10">
							<Icon class="h-6 w-6 text-primary" />
						</div>
						<div>
							<p class="font-ui text-sm text-muted-foreground">{label}</p>
							<p class="font-body text-lg font-semibold">{value}</p>
						</div>
					</Tile>
				{/each}
			</div>
		</div>
	</div>

	<!-- Grid background decoration -->
	<div class="pointer-events-none absolute inset-0 -z-10 opacity-5">
		<div class="h-full w-full" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 48px 48px;"></div>
	</div>
</section>

<!-- Services Section -->
<Section id="services" background="card">
	<div use:scrollAnimate={{ animation: 'fade' }}>
		<div class="mb-12 max-w-2xl">
			<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Services</p>
			<h2 class="h2 mb-4 text-3xl md:text-4xl">{m.services_title()}</h2>
			<p class="font-body text-lg text-muted-foreground">{m.services_subtitle()}</p>
		</div>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { number, title, desc }}
			<Tile interactive padding="lg">
				<div class="mb-4 flex items-center gap-3">
					<span class="font-display text-2xl text-primary">{number}</span>
					<h3 class="font-ui text-lg font-semibold uppercase tracking-wide">{title}</h3>
				</div>
				<p class="font-body text-muted-foreground">{desc}</p>
			</Tile>
		{/each}
	</div>
</Section>

<!-- Capabilities Section -->
<Section id="capabilities">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div use:scrollAnimate={{ animation: 'slide-left' }}>
			<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Capabilities</p>
			<h2 class="h2 mb-4 text-3xl md:text-4xl">{m.capabilities_title()}</h2>
			<p class="font-body text-lg text-muted-foreground">{m.capabilities_subtitle()}</p>
		</div>

		<div class="stagger-children grid gap-4 sm:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each capabilities as { icon: Icon, title, desc }}
				<Tile padding="lg">
					<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mb-1 font-semibold">{title}</h3>
					<p class="font-body text-sm text-muted-foreground">{desc}</p>
				</Tile>
			{/each}
		</div>
	</div>
</Section>

<!-- Process Section -->
<Section id="process" background="card">
	<div class="mb-12 text-center" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Process</p>
		<h2 class="h2 text-3xl md:text-4xl">{m.process_title()}</h2>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each process as { step, title, desc }}
			<Tile padding="lg" class="relative">
				<div class="font-display mb-4 text-6xl text-primary/20">{step}</div>
				<h3 class="font-ui mb-2 text-lg font-semibold">{title}</h3>
				<p class="font-body text-sm text-muted-foreground">{desc}</p>
			</Tile>
		{/each}
	</div>
</Section>

<!-- CTA Section -->
<Section padding="xl">
	<div class="text-center" use:scrollAnimate={{ animation: 'scale' }}>
		<h2 class="font-display mb-4 text-3xl md:text-4xl lg:text-5xl">{m.cta_title()}</h2>
		<p class="font-body mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">{m.cta_subtitle()}</p>
		<div class="flex flex-wrap justify-center gap-4">
			<Button href="/contact" size="lg" class="font-ui">
				{m.cta_button_primary()}
				<ArrowRight class="ml-2 h-5 w-5" />
			</Button>
			<Button href="/contact" variant="outline" size="lg" class="font-ui">
				{m.cta_button_secondary()}
			</Button>
		</div>
		<p class="font-body mt-6 text-sm text-muted-foreground">{m.cta_disclaimer()}</p>
	</div>
</Section>