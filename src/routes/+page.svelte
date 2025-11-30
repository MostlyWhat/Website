<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import { ArrowRight, ArrowUpRight, Mail, Zap, Shield, Users, Headphones, Code, Palette, BarChart3, Layers, Globe, type Icon } from '@lucide/svelte';

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
</script>

<svelte:head>
	<title>{m.site_name()} — {m.site_tagline()}</title>
	<meta name="description" content={m.site_description()} />
</svelte:head>

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Video Background -->
	<VideoBackground 
		src={MARATHON_VIDEO}
		class="brightness-[0.50]"
	/>
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-start justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MOSTLYWHAT SYSTEMS</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				<GlitchText text={m.hero_title()} scrambledStart={true} />
			</h1>
			<div class="mt-8 flex flex-wrap justify-start gap-3">
				<Button href={localizeHref('/projects')} variant="outline" size="lg" class="font-ui tracking-wider">
					VIEW WORK
				</Button>
				<Button href={localizeHref('/contact')} size="lg" class="font-ui tracking-wider">
					START PROJECT
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">{m.hero_subtitle()}</p>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border md:col-span-6">
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">~24H</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">RESPONSE TIME</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">100%</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">SATISFACTION</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">5+</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">YEARS EXP</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">50+</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">PROJECTS</p>
			</div>
		</div>
	</div>
</section>

<!-- Services Section - Full Viewport -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — WHAT WE DO</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{m.services_title()}</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">{m.services_subtitle()}</p>
		</div>
	</div>
	
	<div class="grid flex-1 grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { icon: Icon, number, title, desc } (number)}
			<div class="col-span-12 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:col-span-4 lg:px-16">
				<div class="flex items-start justify-between">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-sm text-primary">{number}</span>
				</div>
				<h3 class="font-ui mt-6 text-base font-semibold uppercase tracking-wider">{title}</h3>
				<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
				<a href={localizeHref('/services')} class="font-mono mt-6 flex items-center gap-2 text-xs tracking-wider text-primary hover:underline">
					LEARN MORE
					<ArrowRight class="h-3.5 w-3.5" />
				</a>
			</div>
		{/each}
	</div>
</section>

<!-- Why Choose Us - Full Viewport Split -->
<section class="flex min-h-[80vh] flex-col border-b border-border lg:flex-row">
	<!-- Left - Image -->
	<div class="relative min-h-[50vh] flex-1 overflow-hidden lg:min-h-0">
		<img 
			src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
			alt="Team collaboration" 
			class="absolute inset-0 h-full w-full object-cover brightness-[0.4]"
		/>
		<div class="absolute inset-0 flex flex-col justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-white/60">02 — WHY CHOOSE US</span>
			<h2 class="font-display mt-6 max-w-lg text-4xl font-bold uppercase text-white md:text-5xl lg:text-6xl">BUILD WITH CONFIDENCE</h2>
		</div>
	</div>

	<!-- Right - Capabilities -->
	<div class="grid flex-1 grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each capabilities as { icon: Icon, title, desc } (title)}
			<div class="col-span-12 flex flex-col bg-background px-6 py-10 sm:col-span-6 md:px-12 lg:px-16">
				<div class="mb-6 flex h-12 w-12 items-center justify-center border border-border bg-card">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-ui text-base font-semibold uppercase tracking-wider">{title}</h3>
				<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Process Section - Full Viewport -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — HOW WE WORK</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{m.process_title()}</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">A simple, proven process designed to deliver exceptional results.</p>
		</div>
	</div>

	<div class="grid flex-1 grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each process as { step, title, desc } (step)}
			<div class="col-span-12 relative flex flex-col bg-background px-6 py-10 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
				<span class="font-display text-6xl font-black text-primary/50">{step}</span>
				<h3 class="font-ui mt-4 text-base font-semibold uppercase tracking-wider">{title}</h3>
				<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Stats Section -->
<section class="border-b border-border bg-card">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 sm:col-span-4 md:px-12 lg:px-16">
			<span class="font-display text-5xl font-black text-primary md:text-6xl lg:text-7xl">~24H</span>
			<span class="font-mono mt-3 text-[10px] tracking-widest text-muted-foreground">RESPONSE TIME</span>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 sm:col-span-4 md:px-12 lg:px-16">
			<span class="font-display text-5xl font-black text-primary md:text-6xl lg:text-7xl">100%</span>
			<span class="font-mono mt-3 text-[10px] tracking-widest text-muted-foreground">CLIENT SATISFACTION</span>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 sm:col-span-4 md:px-12 lg:px-16">
			<span class="font-display text-5xl font-black text-primary md:text-6xl lg:text-7xl">5+</span>
			<span class="font-mono mt-3 text-[10px] tracking-widest text-muted-foreground">YEARS EXPERIENCE</span>
		</div>
	</div>
</section>

<!-- CTA Section - Clean Split Layout -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Hook & Description -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'scale' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">04 — READY TO START?</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl lg:text-4xl">{m.cta_title()}</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground md:text-base">{m.cta_subtitle()}</p>
			<p class="font-mono mt-4 text-[10px] tracking-wider text-muted-foreground">{m.cta_disclaimer()}</p>
		</div>
		
		<!-- Right: Actions & Form -->
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<div class="space-y-4">
				<a 
					href={localizeHref('/contact')} 
					class="group flex items-center justify-between border border-border bg-background px-6 py-4 transition-colors hover:border-primary hover:bg-primary/5"
				>
					<div>
						<span class="font-ui block text-sm tracking-widest">START A PROJECT</span>
						<span class="font-mono mt-1 block text-[10px] tracking-wider text-muted-foreground">Tell us about your idea</span>
					</div>
					<ArrowRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
				</a>
				
				<a 
					href="mailto:hello@mostlywhat.systems" 
					class="group flex items-center justify-between border border-border bg-background px-6 py-4 transition-colors hover:border-primary hover:bg-primary/5"
				>
					<div>
						<span class="font-ui block text-sm tracking-widest">EMAIL DIRECTLY</span>
						<span class="font-mono mt-1 block text-[10px] tracking-wider text-muted-foreground">hello@mostlywhat.systems</span>
					</div>
					<Mail class="h-5 w-5 text-muted-foreground group-hover:text-primary" />
				</a>
				
				<a 
					href={localizeHref('/projects')} 
					class="group flex items-center justify-between border border-border bg-background px-6 py-4 transition-colors hover:border-primary hover:bg-primary/5"
				>
					<div>
						<span class="font-ui block text-sm tracking-widest">VIEW OUR WORK</span>
						<span class="font-mono mt-1 block text-[10px] tracking-wider text-muted-foreground">See recent projects</span>
					</div>
					<ArrowUpRight class="h-5 w-5 text-muted-foreground group-hover:text-primary" />
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Contact Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">EMAIL US</span>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 text-base text-primary hover:underline md:text-lg">HELLO@MOSTLYWHAT.SYSTEMS</a>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RESPONSE TIME</span>
			<p class="font-display mt-2 text-base md:text-lg">~24 HOURS</p>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LOCATION</span>
			<p class="font-display mt-2 text-base md:text-lg">REMOTE • GLOBAL</p>
		</div>
	</div>
</section>