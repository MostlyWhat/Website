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
<section class="relative flex min-h-[calc(100dvh-4rem)] flex-col">
	<!-- Grid Background -->
	<div class="pointer-events-none absolute inset-0 -z-10">
		<div class="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-end p-4 pb-8 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-xs tracking-widest text-muted-foreground">ABOUT</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.about_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.about_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">FOUNDED</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">2022</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">FOCUS</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">WEB PRODUCTS</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECTS</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">50+</p>
		</div>
		<div class="bg-card/80 p-4 backdrop-blur-sm md:p-6">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PHILOSOPHY</p>
			<p class="font-display mt-1 text-sm font-bold md:text-base">SHIP FAST</p>
		</div>
	</div>
</section>

<!-- Story Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border lg:grid-cols-2">
		<div class="bg-background p-4 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STORY</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">OUR ORIGIN</h2>
			<div class="font-body mt-4 space-y-3 text-sm text-muted-foreground">
				<p>MostlyWhat Systems started as a solo venture—a desire to build websites and products that felt different. Not just functional, but intentional.</p>
				<p>We draw inspiration from industrial design, sci-fi interfaces, and the clean precision of developer tools.</p>
				<p>Today, we partner with startups and product teams who share our obsession with quality.</p>
			</div>
		</div>
		<div class="bg-card p-4 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="font-mono text-xs text-muted-foreground">
				<p class="text-primary">// COMPANY.TS</p>
				<p class="mt-4"><span class="text-yellow-400">const</span> company = {'{'}</p>
				<p class="pl-4">name: <span class="text-green-400">"MostlyWhat Systems"</span>,</p>
				<p class="pl-4">founded: <span class="text-primary">2022</span>,</p>
				<p class="pl-4">focus: <span class="text-green-400">"Web Products"</span>,</p>
				<p class="pl-4">philosophy: <span class="text-green-400">"Ship fast, ship well"</span></p>
				<p>{'}'}</p>
			</div>
		</div>
	</div>
</section>

<!-- Values Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-4 md:p-6 lg:col-span-3 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">VALUES</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">WHAT WE STAND FOR</h2>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each values as { icon: Icon, title, desc }}
				<div class="stagger-children bg-background p-4 md:p-6">
					<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui text-xs font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Tech Stack Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-4 md:p-6 lg:col-span-3 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TECHNOLOGY</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">OUR STACK</h2>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each tech as { category, items }}
				<div class="stagger-children bg-card p-4 md:p-6">
					<h3 class="font-mono text-[10px] tracking-widest text-primary">{category}</h3>
					<ul class="font-body mt-3 space-y-1 text-xs">
						{#each items as item}
							<li class="flex items-center gap-2">
								<span class="h-1 w-1 bg-primary"></span>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border lg:grid-cols-2" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="bg-background p-4 md:p-6 lg:p-8">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TEAM</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">THE PEOPLE</h2>
		</div>
		<div class="bg-background p-4 md:p-6 lg:p-8">
			{#each team as { name, role, desc }}
				<div class="flex items-start gap-4">
					<div class="h-12 w-12 shrink-0 border border-border bg-primary/10"></div>
					<div>
						<h3 class="font-ui text-xs font-semibold tracking-wider">{name}</h3>
						<p class="font-mono text-[10px] tracking-widest text-primary">{role}</p>
						<p class="font-body mt-1 text-[11px] text-muted-foreground">{desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="col-span-12 bg-background p-4 md:col-span-8 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">READY?</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">READY TO WORK TOGETHER?</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Let's build something great. Get in touch to discuss your project.</p>
			<Button href={localizeHref('/contact')} class="font-ui mt-6 tracking-wider">
				START A CONVERSATION
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card p-4 md:col-span-4 md:p-8">
			<div class="text-center">
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">EMAIL US</p>
				<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 block text-lg uppercase text-primary hover:underline">HELLO@MOSTLYWHAT.SYSTEMS</a>
			</div>
		</div>
	</div>
</section>
