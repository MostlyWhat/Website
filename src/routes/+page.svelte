<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Zap, Shield, Users, Headphones } from '@lucide/svelte';

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
		{ label: 'RESPONSE', value: '~24H' },
		{ label: 'LOCATIONS', value: 'GLOBAL' },
		{ label: 'STACK', value: 'SVELTE + TS' }
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

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Grid Background -->
	<div class="pointer-events-none absolute inset-0 -z-10">
		<div class="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-center px-4 md:px-6 lg:px-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MOSTLYWHAT SYSTEMS</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
					{m.hero_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-base text-muted-foreground md:text-lg">{m.hero_subtitle()}</p>
				<div class="mt-4 flex gap-2">
					<Button href={localizeHref('/contact')} class="font-ui tracking-wider">START PROJECT<ArrowRight class="ml-2 h-4 w-4" /></Button>
					<Button href={localizeHref('/projects')} variant="outline" class="font-ui tracking-wider">VIEW WORK</Button>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Stats Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		{#each stats as { label, value } (label)}
			<div class="col-span-4 bg-card p-4 md:p-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
				<p class="font-display mt-1 text-sm font-bold md:text-base">{value}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Services Grid - 2→3→6 columns -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Label -->
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-4 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">WHAT WE DO</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">{m.services_title()}</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">{m.services_subtitle()}</p>
		</div>
		
		<!-- Services Grid -->
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:col-span-8" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each services as { number, title, desc } (number)}
				<div class="stagger-children bg-background p-4 transition-colors hover:bg-card md:p-6">
					<span class="font-mono text-xs text-primary">{number}</span>
					<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider">{title}</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Capabilities Grid - 2→4 columns -->
<section class="border-b border-border">
	<div class="grid grid-cols-2 gap-px bg-border lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each capabilities as { icon: Icon, title, desc } (title)}
			<div class="stagger-children flex flex-col bg-card p-4 md:p-6">
				<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border bg-background">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-ui text-xs font-semibold uppercase tracking-wider">{title}</h3>
				<p class="font-body mt-1 flex-1 text-[11px] text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Process Section - 2→4 columns -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Label -->
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-3 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">HOW WE WORK</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">{m.process_title()}</h2>
		</div>
		
		<!-- Process Steps -->
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each process as { step, title, desc } (step)}
				<div class="stagger-children bg-background p-4 md:p-6">
					<span class="font-display text-4xl font-black text-primary/20">{step}</span>
					<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider">{title}</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="bg-background p-6 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">READY?</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">{m.cta_title()}</h2>
			<p class="font-body mt-4 max-w-lg text-muted-foreground">{m.cta_subtitle()}</p>
			<div class="mt-6 flex flex-wrap gap-2">
				<Button href={localizeHref('/contact')} class="font-ui tracking-wider">START PROJECT<ArrowRight class="ml-2 h-4 w-4" /></Button>
				<Button href={localizeHref('/contact')} variant="outline" class="font-ui tracking-wider">SCHEDULE CALL</Button>
			</div>
			<p class="font-mono mt-4 text-[10px] tracking-wider text-muted-foreground">{m.cta_disclaimer()}</p>
		</div>
		<div class="bg-card p-6 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK CONTACT</span>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 block text-xl text-primary hover:underline md:text-2xl">HELLO@MOSTLYWHAT.SYSTEMS</a>
			<div class="mt-6 grid grid-cols-2 gap-px bg-border">
				<div class="bg-background p-4">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RESPONSE</span>
					<p class="font-ui mt-1 text-sm font-semibold">~24 HOURS</p>
				</div>
				<div class="bg-background p-4">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BASED IN</span>
					<p class="font-ui mt-1 text-sm font-semibold">REMOTE • GLOBAL</p>
				</div>
			</div>
		</div>
	</div>
</section>