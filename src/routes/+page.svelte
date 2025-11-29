<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Zap, Shield, Users, Headphones, Code, Palette, Rocket, BarChart3, Layers, Globe, type Icon } from '@lucide/svelte';

	const services: { icon: typeof Icon; number: string; title: string; desc: string }[] = [
		{ icon: Layers, number: '01', title: m.service_strategy_title(), desc: m.service_strategy_desc() },
		{ icon: Palette, number: '02', title: m.service_brand_title(), desc: m.service_brand_desc() },
		{ icon: Users, number: '03', title: m.service_ux_title(), desc: m.service_ux_desc() },
		{ icon: Code, number: '04', title: m.service_engineering_title(), desc: m.service_engineering_desc() },
		{ icon: Globe, number: '05', title: m.service_platforms_title(), desc: m.service_platforms_desc() },
		{ icon: BarChart3, number: '06', title: m.service_growth_title(), desc: m.service_growth_desc() }
	];

	const capabilities: { icon: typeof Icon; title: string; desc: string }[] = [
		{ icon: Zap, title: m.capability_speed(), desc: m.capability_speed_desc() },
		{ icon: Shield, title: m.capability_quality(), desc: m.capability_quality_desc() },
		{ icon: Users, title: m.capability_process(), desc: m.capability_process_desc() },
		{ icon: Headphones, title: m.capability_support(), desc: m.capability_support_desc() }
	];

	const process: { step: string; title: string; desc: string }[] = [
		{ step: '01', title: m.process_step1_title(), desc: m.process_step1_desc() },
		{ step: '02', title: m.process_step2_title(), desc: m.process_step2_desc() },
		{ step: '03', title: m.process_step3_title(), desc: m.process_step3_desc() },
		{ step: '04', title: m.process_step4_title(), desc: m.process_step4_desc() }
	];

	const trustedBy = [
		'Startups', 'Tech Companies', 'Agencies', 'E-commerce', 'SaaS', 'Enterprise'
	];
</script>

<svelte:head>
	<title>{m.site_name()} — {m.site_tagline()}</title>
	<meta name="description" content={m.site_description()} />
</svelte:head>

<!-- Hero Section - Full Viewport with Bottom-aligned Content -->
<section class="relative flex h-[calc(100dvh-6rem)] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4 lg:gap-8">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MOSTLYWHAT SYSTEMS</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.hero_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.hero_subtitle()}</p>
				<div class="mt-6 flex flex-wrap gap-3">
					<Button href={localizeHref('/contact')} class="font-ui tracking-wider">
						START PROJECT
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
					<Button href={localizeHref('/projects')} variant="outline" class="font-ui tracking-wider">
						VIEW WORK
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">~24H</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">RESPONSE TIME</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">100%</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">SATISFACTION</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">5+</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">YEARS EXP</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">50+</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">PROJECTS</p>
		</div>
	</div>
</section>

<!-- Services Section -->
<section class="border-b border-border py-24 md:py-32">
	<div class="px-6 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="mx-auto max-w-6xl">
			<div class="mb-16 max-w-2xl">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">WHAT WE DO</span>
				<h2 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{m.services_title()}</h2>
				<p class="font-body mt-6 text-lg text-muted-foreground">{m.services_subtitle()}</p>
			</div>
		</div>
	</div>
	
	<div class="grid grid-cols-1 gap-px border-y border-border bg-border md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { icon: Icon, number, title, desc } (number)}
			<div class="flex flex-col bg-background p-8 transition-colors hover:bg-card md:p-10 lg:p-12">
				<div class="flex items-start justify-between">
					<div class="flex h-14 w-14 items-center justify-center border border-border bg-card">
						<Icon class="h-7 w-7 text-primary" />
					</div>
					<span class="font-mono text-sm text-primary">{number}</span>
				</div>
				<h3 class="font-ui mt-8 text-lg font-semibold uppercase tracking-wider">{title}</h3>
				<p class="font-body mt-4 flex-1 text-muted-foreground">{desc}</p>
				<a href={localizeHref('/services')} class="font-mono mt-8 flex items-center gap-2 text-xs tracking-wider text-primary hover:underline">
					LEARN MORE
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
		{/each}
	</div>
</section>

<!-- Why Choose Us - Split Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 lg:grid-cols-2">
		<!-- Left - Image -->
		<div class="relative min-h-[50vh] overflow-hidden lg:min-h-[80vh]">
			<img 
				src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
				alt="Team collaboration" 
				class="absolute inset-0 h-full w-full object-cover brightness-[0.4]"
			/>
			<div class="absolute inset-0 flex items-end p-8 md:p-12 lg:p-16" use:scrollAnimate={{ animation: 'fade' }}>
				<div>
					<span class="font-mono text-[10px] tracking-widest text-white/60">WHY CHOOSE US</span>
					<h2 class="font-display mt-4 max-w-lg text-4xl font-bold uppercase text-white md:text-5xl">BUILD WITH CONFIDENCE</h2>
				</div>
			</div>
		</div>

		<!-- Right - Capabilities -->
		<div class="grid grid-cols-1 gap-px bg-border sm:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each capabilities as { icon: Icon, title, desc } (title)}
				<div class="flex flex-col bg-background p-8 md:p-10 lg:p-12">
					<div class="mb-6 flex h-12 w-12 items-center justify-center border border-border bg-card">
						<Icon class="h-6 w-6 text-primary" />
					</div>
					<h3 class="font-ui text-base font-semibold uppercase tracking-wider">{title}</h3>
					<p class="font-body mt-4 flex-1 text-sm text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Process Section - Vertical -->
<section class="border-b border-border py-24 md:py-32">
	<div class="px-6 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="mx-auto max-w-6xl">
			<div class="mb-16 text-center">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">HOW WE WORK</span>
				<h2 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{m.process_title()}</h2>
				<p class="font-body mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">A simple, proven process designed to deliver exceptional results.</p>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-4xl px-6 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
			{#each process as { step, title, desc } (step)}
				<div class="relative border border-border bg-background p-8 transition-colors hover:border-primary/50 md:p-10">
					<span class="font-display absolute -top-6 left-8 bg-background px-4 text-6xl font-black text-primary/20">{step}</span>
					<h3 class="font-ui mt-4 text-lg font-semibold uppercase tracking-wider">{title}</h3>
					<p class="font-body mt-4 text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="border-b border-border bg-card">
	<div class="grid grid-cols-1 gap-px bg-border sm:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="flex flex-col items-center justify-center bg-card p-12 text-center md:p-16">
			<span class="font-display text-5xl font-black text-primary md:text-6xl lg:text-7xl">~24H</span>
			<span class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">RESPONSE TIME</span>
		</div>
		<div class="flex flex-col items-center justify-center bg-card p-12 text-center md:p-16">
			<span class="font-display text-5xl font-black text-primary md:text-6xl lg:text-7xl">100%</span>
			<span class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">CLIENT SATISFACTION</span>
		</div>
		<div class="flex flex-col items-center justify-center bg-card p-12 text-center md:p-16">
			<span class="font-display text-5xl font-black text-primary md:text-6xl lg:text-7xl">5+</span>
			<span class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">YEARS EXPERIENCE</span>
		</div>
	</div>
</section>

<!-- CTA Section - Full Width -->
<section class="relative overflow-hidden border-b border-border">
	<!-- Background -->
	<div class="absolute inset-0 -z-10">
		<img 
			src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
	</div>

	<div class="px-6 py-24 md:px-8 md:py-32 lg:px-12 lg:py-40" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="mx-auto max-w-4xl text-center">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">READY TO START?</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{m.cta_title()}</h2>
			<p class="font-body mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">{m.cta_subtitle()}</p>
			<div class="mt-10 flex flex-wrap justify-center gap-4">
				<Button href={localizeHref('/contact')} size="lg" class="font-ui h-14 px-8 text-base tracking-wider">
					START PROJECT
					<ArrowRight class="ml-2 h-5 w-5" />
				</Button>
				<Button href={localizeHref('/contact')} variant="outline" size="lg" class="font-ui h-14 px-8 text-base tracking-wider">
					SCHEDULE CALL
				</Button>
			</div>
			<p class="font-mono mt-8 text-[10px] tracking-wider text-muted-foreground">{m.cta_disclaimer()}</p>
		</div>
	</div>
</section>

<!-- Contact Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
		<div class="flex flex-col justify-center bg-background p-8 md:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">EMAIL US</span>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 text-lg text-primary hover:underline md:text-xl">HELLO@MOSTLYWHAT.SYSTEMS</a>
		</div>
		<div class="flex flex-col justify-center bg-background p-8 md:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RESPONSE TIME</span>
			<p class="font-display mt-2 text-lg md:text-xl">~24 HOURS</p>
		</div>
		<div class="flex flex-col justify-center bg-background p-8 md:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LOCATION</span>
			<p class="font-display mt-2 text-lg md:text-xl">REMOTE • GLOBAL</p>
		</div>
	</div>
</section>