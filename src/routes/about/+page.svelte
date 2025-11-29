<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Target, Lightbulb, Users, Rocket } from '@lucide/svelte';

	const values = [
		{ icon: Target, title: 'CLARITY FIRST', desc: 'Clear communication, transparent processes, honest feedback.' },
		{ icon: Lightbulb, title: 'THOUGHTFUL CRAFT', desc: 'Every pixel, every line of code matters.' },
		{ icon: Users, title: 'PARTNERSHIP', desc: 'We work with you, not for you.' },
		{ icon: Rocket, title: 'SHIP FAST', desc: 'Speed matters without sacrificing quality.' }
	];

	const team = [
		{ name: 'PREM (MOSTLYWHAT)', role: 'FOUNDER & LEAD ENGINEER', desc: 'Full-stack engineer with a passion for design systems.' }
	];

	const tech = [
		{ category: 'FRONTEND', items: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'Vite'] },
		{ category: 'BACKEND', items: ['Cloudflare Workers', 'Drizzle ORM', 'D1/Turso'] },
		{ category: 'TOOLS', items: ['Figma', 'Linear', 'GitHub', 'Vercel'] },
		{ category: 'STANDARDS', items: ['WCAG 2.1', 'Core Web Vitals', 'Semantic HTML'] }
	];
</script>

<svelte:head>
	<title>{m.about_title()} — {m.site_name()}</title>
	<meta name="description" content={m.about_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<section class="relative flex h-dvh flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ABOUT</span>
			<h1 class="font-display mt-6 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
				{m.about_title()}
			</h1>
			<p class="font-body mt-6 max-w-xl text-lg text-muted-foreground">{m.about_subtitle()}</p>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		<div class="col-span-6 bg-background/80 px-6 py-5 backdrop-blur-sm md:col-span-3 md:px-12 lg:px-16">
			<span class="font-display text-xl font-bold text-primary md:text-2xl">2022</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">FOUNDED</p>
		</div>
		<div class="col-span-6 bg-background/80 px-6 py-5 backdrop-blur-sm md:col-span-3 md:px-12 lg:px-16">
			<span class="font-display text-xl font-bold text-primary md:text-2xl">WEB</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">FOCUS</p>
		</div>
		<div class="col-span-6 bg-background/80 px-6 py-5 backdrop-blur-sm md:col-span-3 md:px-12 lg:px-16">
			<span class="font-display text-xl font-bold text-primary md:text-2xl">50+</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">PROJECTS</p>
		</div>
		<div class="col-span-6 bg-background/80 px-6 py-5 backdrop-blur-sm md:col-span-3 md:px-12 lg:px-16">
			<span class="font-display text-xl font-bold text-primary md:text-2xl">SHIP</span>
			<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">FAST</p>
		</div>
	</div>
</section>

<!-- Story Section -->
<section class="grid min-h-[80vh] grid-cols-12 border-b border-border">
	<!-- Left Content -->
	<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — STORY</span>
		<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">OUR ORIGIN</h2>
		<div class="font-body mt-6 max-w-xl space-y-4 text-lg text-muted-foreground">
			<p>MostlyWhat Systems started as a solo venture—a desire to build websites and products that felt different. Not just functional, but intentional.</p>
			<p>We draw inspiration from industrial design, sci-fi interfaces, and the clean precision of developer tools.</p>
			<p>Today, we partner with startups and product teams who share our obsession with quality.</p>
		</div>
	</div>
	<!-- Right Code Block -->
	<div class="col-span-12 flex items-center justify-center bg-card px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="font-mono text-sm text-muted-foreground md:text-base">
			<p class="text-primary">// COMPANY.TS</p>
			<p class="mt-6"><span class="text-yellow-400">const</span> company = {'{'}</p>
			<p class="pl-6">name: <span class="text-green-400">"MostlyWhat Systems"</span>,</p>
			<p class="pl-6">founded: <span class="text-primary">2022</span>,</p>
			<p class="pl-6">focus: <span class="text-green-400">"Web Products"</span>,</p>
			<p class="pl-6">philosophy: <span class="text-green-400">"Ship fast, ship well"</span></p>
			<p>{'}'}</p>
		</div>
	</div>
</section>

<!-- Values Section -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — VALUES</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">WHAT WE STAND FOR</h2>
		</div>
	</div>
	<div class="flex-1 grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each values as { icon: Icon, title, desc } (title)}
			<div class="col-span-12 flex flex-col bg-background px-6 py-10 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
				<div class="mb-6 flex h-12 w-12 items-center justify-center border border-border">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-ui text-lg font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-3 flex-1 text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Tech Stack Section -->
<section class="flex min-h-[80vh] flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — TECHNOLOGY</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">OUR STACK</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">Modern tools for modern products. We use the best technologies to build fast, reliable applications.</p>
		</div>
	</div>
	<div class="flex-1 grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each tech as { category, items } (category)}
			<div class="col-span-12 flex flex-col bg-card px-6 py-10 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
				<h3 class="font-mono text-sm tracking-widest text-primary">{category}</h3>
				<ul class="font-body mt-4 space-y-2 text-base">
					{#each items as item (item)}
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 bg-primary"></span>
							{item}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Team Section -->
<section class="grid min-h-[50vh] grid-cols-12 border-b border-border">
	<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">04 — TEAM</span>
		<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">THE PEOPLE</h2>
	</div>
	<div class="col-span-12 flex items-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		{#each team as { name, role, desc } (name)}
			<div class="flex items-start gap-6">
				<div class="h-16 w-16 shrink-0 border border-border bg-primary/10"></div>
				<div>
					<h3 class="font-ui text-lg font-semibold tracking-wider">{name}</h3>
					<p class="font-mono mt-1 text-sm tracking-widest text-primary">{role}</p>
					<p class="font-body mt-3 text-muted-foreground">{desc}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- CTA Section -->
<section class="relative flex min-h-[60vh] flex-col border-b border-border">
	<div class="pointer-events-none absolute inset-0 -z-10">
		<img 
			src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
	</div>
	<div class="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="max-w-3xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">05 — READY?</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">READY TO WORK TOGETHER?</h2>
			<p class="font-body mt-6 max-w-xl text-lg text-muted-foreground">Let's build something great. Get in touch to discuss your project.</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<Button href={localizeHref('/contact')} size="xl" class="font-ui tracking-wider">
					START A CONVERSATION
					<ArrowRight class="ml-2 h-5 w-5" />
				</Button>
			</div>
		</div>
	</div>
</section>
