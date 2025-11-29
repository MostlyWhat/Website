<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, ArrowDown, Zap, Shield, Users, Headphones } from '@lucide/svelte';

	const services = [
		{ number: '01', title: m.service_strategy_title(), desc: m.service_strategy_desc() },
		{ number: '02', title: m.service_brand_title(), desc: m.service_brand_desc() },
		{ number: '03', title: m.service_ux_title(), desc: m.service_ux_desc() },
		{ number: '04', title: m.service_engineering_title(), desc: m.service_engineering_desc() },
		{ number: '05', title: m.service_platforms_title(), desc: m.service_platforms_desc() },
		{ number: '06', title: m.service_growth_title(), desc: m.service_growth_desc() }
	];

	const capabilities = [
		{ icon: Zap, title: m.capability_speed(), desc: m.capability_speed_desc() },
		{ icon: Shield, title: m.capability_quality(), desc: m.capability_quality_desc() },
		{ icon: Users, title: m.capability_process(), desc: m.capability_process_desc() },
		{ icon: Headphones, title: m.capability_support(), desc: m.capability_support_desc() }
	];

	const stats = [
		{ label: m.stats_response_time(), value: m.stats_response_value() },
		{ label: m.stats_locations(), value: m.stats_locations_value() },
		{ label: m.stats_stack(), value: m.stats_stack_value() }
	];

	const process = [
		{ step: '01', title: m.process_step1_title(), desc: m.process_step1_desc() },
		{ step: '02', title: m.process_step2_title(), desc: m.process_step2_desc() },
		{ step: '03', title: m.process_step3_title(), desc: m.process_step3_desc() },
		{ step: '04', title: m.process_step4_title(), desc: m.process_step4_desc() }
	];
</script>

<svelte:head>
	<title>{m.site_name()} — {m.site_tagline()}</title>
	<meta name="description" content={m.site_description()} />
</svelte:head>

<!-- Hero Section - Full Screen -->
<section class="relative flex min-h-screen flex-col">
	<!-- Background -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 items-end p-4 pb-24 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid w-full gap-4 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<h1 class="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
					{m.hero_title()}
				</h1>
			</div>
			<div class="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
				<p class="font-body text-base text-muted-foreground md:text-lg">{m.hero_subtitle()}</p>
				<div class="mt-4 flex gap-2">
					<Button href="/contact" class="font-ui">{m.hero_cta_primary()}<ArrowRight class="ml-2 h-4 w-4" /></Button>
					<Button href="/projects" variant="outline" class="font-ui">{m.hero_cta_secondary()}</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<ArrowDown class="h-6 w-6 text-muted-foreground" />
	</div>

	<!-- Stats bar -->
	<div class="border-t border-border bg-card/50 backdrop-blur-sm">
		<div class="grid grid-cols-3 divide-x divide-border">
			{#each stats as { label, value }}
				<div class="p-4 md:p-6">
					<p class="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
					<p class="font-display mt-1 text-lg font-bold md:text-xl">{value}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Services Grid -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-12">
		<div class="border-b border-border p-4 md:p-6 lg:col-span-4 lg:border-b-0 lg:border-r" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Services</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">{m.services_title()}</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">{m.services_subtitle()}</p>
		</div>
		<div class="grid gap-px bg-border sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each services as { number, title, desc }}
				<div class="stagger-children bg-background p-4 transition-colors hover:bg-card md:p-6">
					<span class="font-mono text-xs text-primary">{number}</span>
					<h3 class="font-ui mt-2 text-sm font-semibold uppercase tracking-wide">{title}</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Capabilities Grid -->
<section class="border-b border-border">
	<div class="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each capabilities as { icon: Icon, title, desc }}
			<div class="stagger-children flex flex-col bg-card p-4 md:p-6">
				<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border bg-background">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-ui text-sm font-semibold uppercase">{title}</h3>
				<p class="font-body mt-1 flex-1 text-xs text-muted-foreground">{desc}</p>
			</div>
		{/each}
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
			{#each process as { step, title, desc }}
				<div class="stagger-children bg-background p-4 md:p-6">
					<span class="font-display text-4xl font-black text-primary/20">{step}</span>
					<h3 class="font-ui mt-2 text-sm font-semibold">{title}</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="p-4 md:p-8 lg:p-12">
			<h2 class="font-display text-3xl font-bold uppercase md:text-4xl lg:text-5xl">{m.cta_title()}</h2>
			<p class="font-body mt-4 max-w-lg text-muted-foreground">{m.cta_subtitle()}</p>
			<div class="mt-6 flex flex-wrap gap-2">
				<Button href="/contact" class="font-ui">{m.cta_button_primary()}<ArrowRight class="ml-2 h-4 w-4" /></Button>
				<Button href="/contact" variant="outline" class="font-ui">{m.cta_button_secondary()}</Button>
			</div>
			<p class="font-body mt-4 text-xs text-muted-foreground">{m.cta_disclaimer()}</p>
		</div>
		<div class="border-t border-border bg-card p-4 md:p-8 lg:border-l lg:border-t-0 lg:p-12">
			<p class="font-mono text-xs uppercase tracking-wider text-muted-foreground">Quick contact</p>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 block text-xl text-primary hover:underline md:text-2xl">hello@mostlywhat.systems</a>
			<div class="mt-6 grid grid-cols-2 gap-4">
				<div>
					<p class="font-mono text-xs uppercase text-muted-foreground">Response</p>
					<p class="font-ui mt-1 text-sm font-semibold">~24 hours</p>
				</div>
				<div>
					<p class="font-mono text-xs uppercase text-muted-foreground">Based in</p>
					<p class="font-ui mt-1 text-sm font-semibold">Remote • Global</p>
				</div>
			</div>
		</div>
	</div>
</section>