<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, ArrowUpRight, Compass, Palette, Layout, Code, Database, TrendingUp, Check } from '@lucide/svelte';

	const services = [
		{ icon: Compass, number: '01', title: 'PRODUCT STRATEGY', desc: 'Discovery, roadmapping, and measurable outcomes.', features: ['Product discovery', 'Competitive analysis', 'Roadmapping', 'KPIs'] },
		{ icon: Palette, number: '02', title: 'BRAND & VISUAL', desc: 'Identity systems, design language, and art direction.', features: ['Logo design', 'Design systems', 'Brand guidelines', 'Art direction'] },
		{ icon: Layout, number: '03', title: 'UX & PROTOTYPING', desc: 'Flows, wireframes, and interactive prototypes.', features: ['User research', 'Information architecture', 'Wireframing', 'Prototypes'] },
		{ icon: Code, number: '04', title: 'WEB ENGINEERING', desc: 'SvelteKit, TypeScript, and performant delivery.', features: ['SvelteKit', 'TypeScript', 'Performance', 'Accessibility'] },
		{ icon: Database, number: '05', title: 'PLATFORMS', desc: 'Headless CMS, e-commerce, and third-party integrations.', features: ['Headless CMS', 'E-commerce', 'APIs', 'Integrations'] },
		{ icon: TrendingUp, number: '06', title: 'GROWTH', desc: 'Analytics, SEO, experimentation, and iteration.', features: ['Analytics', 'SEO', 'A/B testing', 'Conversion'] }
	];

	const packages = [
		{ name: 'SPRINT', price: 'FROM $5K', duration: '2-4 WEEKS', features: ['Single focus', 'Rapid iteration', 'Quick deploy'] },
		{ name: 'BUILD', price: 'FROM $15K', duration: '6-12 WEEKS', features: ['End-to-end', 'Design + code', 'Launch support'], featured: true },
		{ name: 'PARTNER', price: 'CUSTOM', duration: 'ONGOING', features: ['Dedicated capacity', 'Priority support', 'Strategic'] }
	];
</script>

<svelte:head>
	<title>{m.nav_services()} — {m.site_name()}</title>
	<meta name="description" content={m.services_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<section class="relative flex h-dvh flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SERVICES</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				{m.services_title()}
			</h1>
			<p class="font-body mt-6 max-w-xl text-base text-muted-foreground md:text-lg">{m.services_subtitle()}</p>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		<div class="col-span-4 bg-background/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
			<span class="font-display text-lg font-bold text-primary md:text-xl">6</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">SERVICES</p>
		</div>
		<div class="col-span-4 bg-background/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
			<span class="font-display text-lg font-bold text-primary md:text-xl">3</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">PACKAGES</p>
		</div>
		<div class="col-span-4 bg-background/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
			<span class="font-display text-lg font-bold text-primary md:text-xl">2-12W</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">DELIVERY</p>
		</div>
	</div>
</section>

<!-- Services Section -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — CAPABILITIES</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">WHAT WE DO</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">End-to-end digital product development, from strategy to launch.</p>
		</div>
	</div>
	<div class="flex-1 grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { icon: Icon, number, title, desc, features } (number)}
			<div class="col-span-12 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:col-span-4 lg:px-16">
				<div class="flex items-start justify-between">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-sm text-primary">{number}</span>
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-3 text-muted-foreground">{desc}</p>
				<ul class="mt-4 space-y-2">
					{#each features as feature (feature)}
						<li class="font-mono flex items-center gap-3 text-xs tracking-wider text-muted-foreground">
							<Check class="h-4 w-4 shrink-0 text-primary" />
							{feature}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Packages Section -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — ENGAGEMENT</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">HOW WE WORK</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">Choose the engagement model that fits your project needs.</p>
		</div>
	</div>
	<div class="flex-1 grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each packages as pkg (pkg.name)}
			<div class="col-span-12 flex flex-col {pkg.featured ? 'bg-primary/10' : 'bg-background'} px-6 py-10 md:col-span-4 md:px-12 lg:px-16">
				{#if pkg.featured}
					<span class="font-mono mb-4 text-[10px] tracking-widest text-primary">POPULAR</span>
				{/if}
				<h3 class="font-display text-2xl font-bold">{pkg.name}</h3>
				<div class="mt-3">
					<span class="font-display text-3xl text-primary">{pkg.price}</span>
				</div>
				<span class="font-mono mt-2 text-xs tracking-widest text-muted-foreground">{pkg.duration}</span>
				<ul class="mt-6 space-y-3">
					{#each pkg.features as feature (feature)}
						<li class="font-body flex items-center gap-3 text-muted-foreground">
							<Check class="h-4 w-4 shrink-0 text-primary" />
							{feature}
						</li>
					{/each}
				</ul>
				<div class="mt-auto pt-6">
					<Button href={localizeHref('/contact')} variant={pkg.featured ? 'default' : 'outline'} size="xl" class="font-ui w-full tracking-wider">
						GET STARTED
						<ArrowRight class="ml-2 h-5 w-5" />
					</Button>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Process Section -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — PROCESS</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{m.process_title()}</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">A proven methodology for delivering exceptional results.</p>
		</div>
	</div>
	<div class="flex-1 grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="col-span-12 flex flex-col bg-background px-6 py-10 md:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-display text-6xl font-black text-primary/10">01</span>
			<h3 class="font-ui mt-4 text-lg font-semibold tracking-wider">{m.process_step1_title().toUpperCase()}</h3>
			<p class="font-body mt-3 flex-1 text-muted-foreground">{m.process_step1_desc()}</p>
		</div>
		<div class="col-span-12 flex flex-col bg-background px-6 py-10 md:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-display text-6xl font-black text-primary/10">02</span>
			<h3 class="font-ui mt-4 text-lg font-semibold tracking-wider">{m.process_step2_title().toUpperCase()}</h3>
			<p class="font-body mt-3 flex-1 text-muted-foreground">{m.process_step2_desc()}</p>
		</div>
		<div class="col-span-12 flex flex-col bg-background px-6 py-10 md:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-display text-6xl font-black text-primary/10">03</span>
			<h3 class="font-ui mt-4 text-lg font-semibold tracking-wider">{m.process_step3_title().toUpperCase()}</h3>
			<p class="font-body mt-3 flex-1 text-muted-foreground">{m.process_step3_desc()}</p>
		</div>
		<div class="col-span-12 flex flex-col bg-background px-6 py-10 md:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<span class="font-display text-6xl font-black text-primary/10">04</span>
			<h3 class="font-ui mt-4 text-lg font-semibold tracking-wider">{m.process_step4_title().toUpperCase()}</h3>
			<p class="font-body mt-3 flex-1 text-muted-foreground">{m.process_step4_desc()}</p>
		</div>
	</div>
</section>

<!-- Why Choose Us -->
<section class="grid min-h-[80vh] grid-cols-12 border-b border-border">
	<!-- Left - Image -->
	<div class="relative col-span-12 min-h-[50vh] overflow-hidden lg:col-span-6 lg:min-h-[80vh]">
		<img 
			src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
			alt="Team collaboration" 
			class="absolute inset-0 h-full w-full object-cover brightness-[0.4]"
		/>
		<div class="absolute inset-0 flex flex-col justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-white/60">04 — WHY CHOOSE US</span>
			<h2 class="font-display mt-6 max-w-lg text-4xl font-bold uppercase text-white md:text-5xl lg:text-6xl">BUILD WITH CONFIDENCE</h2>
		</div>
	</div>

	<!-- Right - Benefits -->
	<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-6" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="flex flex-col bg-background px-6 py-10 md:px-12 lg:px-16">
			<span class="font-display text-4xl font-black text-primary">~24H</span>
			<h3 class="font-ui mt-4 text-base font-semibold uppercase tracking-wider">RESPONSE TIME</h3>
			<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">Fast communication and quick turnaround.</p>
		</div>
		<div class="flex flex-col bg-background px-6 py-10 md:px-12 lg:px-16">
			<span class="font-display text-4xl font-black text-primary">100%</span>
			<h3 class="font-ui mt-4 text-base font-semibold uppercase tracking-wider">SATISFACTION</h3>
			<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">We work until you're happy.</p>
		</div>
		<div class="flex flex-col bg-background px-6 py-10 md:px-12 lg:px-16">
			<span class="font-display text-4xl font-black text-primary">5+</span>
			<h3 class="font-ui mt-4 text-base font-semibold uppercase tracking-wider">YEARS</h3>
			<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">Modern web expertise.</p>
		</div>
		<div class="flex flex-col bg-background px-6 py-10 md:px-12 lg:px-16">
			<span class="font-display text-4xl font-black text-primary">50+</span>
			<h3 class="font-ui mt-4 text-base font-semibold uppercase tracking-wider">PROJECTS</h3>
			<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">Successful deliveries.</p>
		</div>
	</div>
</section>

<!-- CTA Section - Clean Split Layout -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Hook & Description -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-16 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'scale' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">05 — READY TO START?</span>
			<h2 class="font-display mt-6 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">{m.cta_title()}</h2>
			<p class="font-body mt-6 text-base text-muted-foreground md:text-lg">{m.cta_subtitle()}</p>
		</div>
		
		<!-- Right: Actions -->
		<div class="col-span-12 flex flex-col justify-center gap-4 bg-card px-6 py-16 md:col-span-6 md:px-12 lg:px-16">
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
				<ArrowUpRight class="h-5 w-5 text-muted-foreground group-hover:text-primary" />
			</a>
		</div>
	</div>
</section>
