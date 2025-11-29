<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Compass, Palette, Layout, Code, Database, TrendingUp, Check } from '@lucide/svelte';

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
<section class="relative flex h-[calc(100dvh-6rem)] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Positioned at Bottom -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-xs tracking-widest text-muted-foreground">SERVICES</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.services_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.services_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Service count bar -->
	<div class="grid grid-cols-3 gap-px border-t border-border bg-border">
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SERVICES</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">6 AREAS</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PACKAGES</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">3 OPTIONS</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">DELIVERY</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">2-12 WEEKS</p>
		</div>
	</div>
</section>

<!-- Services Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-2 gap-px bg-border lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each services as { icon: Icon, number, title, desc, features } (number)}
			<div class="flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6">
				<div class="flex items-start justify-between">
					<div class="flex h-10 w-10 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-xs text-primary">{number}</span>
				</div>
				<h3 class="font-ui mt-3 text-xs font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">{desc}</p>
				<ul class="mt-3 space-y-1">
					{#each features as feature (feature)}
						<li class="font-mono flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground">
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
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-4 md:p-6 lg:col-span-3 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ENGAGEMENT</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">HOW WE WORK</h2>
		</div>
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border md:grid-cols-3 lg:col-span-9" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each packages as pkg (pkg.name)}
				<div class="flex flex-col {pkg.featured ? 'bg-primary/10' : 'bg-background'} p-4 md:p-6">
					{#if pkg.featured}
						<span class="font-mono mb-2 text-[10px] tracking-widest text-muted-foreground">POPULAR</span>
					{/if}
					<h3 class="font-display text-xl">{pkg.name}</h3>
					<div class="mt-1">
						<span class="font-display text-2xl text-primary">{pkg.price}</span>
						<span class="font-mono ml-2 text-[10px] tracking-widest text-muted-foreground">{pkg.duration}</span>
					</div>
					<ul class="mt-3 space-y-1">
						{#each pkg.features as feature (feature)}
							<li class="font-mono flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground">
								<Check class="h-3 w-3 shrink-0 text-primary" />
								{feature}
							</li>
						{/each}
					</ul>
					<Button href={localizeHref('/contact')} variant={pkg.featured ? 'default' : 'outline'} class="font-ui mt-4 tracking-wider">GET STARTED</Button>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Process Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-4 md:p-6 lg:col-span-3 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROCESS</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">{m.process_title()}</h2>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			<div class="bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">01</span>
				<h3 class="font-ui mt-2 text-xs font-semibold tracking-wider">{m.process_step1_title().toUpperCase()}</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">{m.process_step1_desc()}</p>
			</div>
			<div class="bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">02</span>
				<h3 class="font-ui mt-2 text-xs font-semibold tracking-wider">{m.process_step2_title().toUpperCase()}</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">{m.process_step2_desc()}</p>
			</div>
			<div class="bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">03</span>
				<h3 class="font-ui mt-2 text-xs font-semibold tracking-wider">{m.process_step3_title().toUpperCase()}</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">{m.process_step3_desc()}</p>
			</div>
			<div class="bg-background p-4 md:p-6">
				<span class="font-display text-3xl text-primary/20">04</span>
				<h3 class="font-ui mt-2 text-xs font-semibold tracking-wider">{m.process_step4_title().toUpperCase()}</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">{m.process_step4_desc()}</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="col-span-12 bg-background p-4 md:col-span-8 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">READY?</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">{m.cta_title()}</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">{m.cta_subtitle()}</p>
			<Button href={localizeHref('/contact')} class="font-ui mt-6 tracking-wider">
				START PROJECT
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card p-4 md:col-span-4 md:p-8">
			<div class="text-center">
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">QUESTIONS?</p>
				<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 block text-lg uppercase text-primary hover:underline">HELLO@MOSTLYWHAT.SYSTEMS</a>
			</div>
		</div>
	</div>
</section>
