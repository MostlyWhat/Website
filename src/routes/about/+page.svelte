<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import { ArrowRight, ArrowUpRight, Target, Lightbulb, Users, Rocket } from '@lucide/svelte';

	const values = [
		{ icon: Target, title: 'CLARITY FIRST', desc: 'Clear communication, transparent processes, honest feedback.' },
		{ icon: Lightbulb, title: 'THOUGHTFUL CRAFT', desc: 'Every pixel, every line of code matters.' },
		{ icon: Users, title: 'PARTNERSHIP', desc: 'We work with you, not for you.' },
		{ icon: Rocket, title: 'SHIP FAST', desc: 'Speed matters without sacrificing quality.' }
	];

	const team = [
		{ name: 'PREM (MOSTLYWHAT)', role: 'FOUNDER & LEAD ENGINEER', desc: 'Full-stack engineer with a passion for design systems.' },
		{ name: 'ALEX CHEN', role: 'SENIOR DEVELOPER', desc: 'Backend specialist focused on performance and scalability.' },
		{ name: 'MAYA PATEL', role: 'UI/UX DESIGNER', desc: 'Creating intuitive experiences through thoughtful design.' },
		{ name: 'JORDAN PARK', role: 'FRONTEND DEVELOPER', desc: 'Crafting pixel-perfect interfaces with modern frameworks.' }
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
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Video Background -->
	<VideoBackground 
		src={MARATHON_VIDEO}
		class="brightness-[0.80]"
	/>
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-start justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ABOUT</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				<GlitchText text={m.about_title()} scrambledStart={true} />
			</h1>
		</div>
	</div>
</section>

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">{m.about_subtitle()}</p>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border md:col-span-6">
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">2022</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">FOUNDED</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">WEB</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">FOCUS</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">50+</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">PROJECTS</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">SHIP</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">FAST</p>
			</div>
		</div>
	</div>
</section>

<!-- Story Section -->
<section class="grid grid-cols-12 border-b border-border">
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
<section class="flex flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — VALUES</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">WHAT WE STAND FOR</h2>
		</div>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
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
<section class="flex flex-col border-b border-border">
	<div class="px-6 py-12 md:px-12 md:py-16 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — TECHNOLOGY</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">OUR STACK</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">Modern tools for modern products. We use the best technologies to build fast, reliable applications.</p>
		</div>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
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
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">04 — TEAM</span>
		<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">THE PEOPLE</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each team as { name, role, desc } (name)}
			<div class="col-span-12 flex items-start gap-6 bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
				<div class="h-16 w-16 shrink-0 border border-border bg-primary/10"></div>
				<div>
					<h3 class="font-ui text-sm font-semibold tracking-wider">{name}</h3>
					<p class="font-mono mt-1 text-[10px] tracking-widest text-primary">{role}</p>
					<p class="font-body mt-3 text-sm text-muted-foreground">{desc}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- CTA Section - Clean Split Layout -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Hook & Description -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-16 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'scale' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">05 — READY?</span>
			<h2 class="font-display mt-6 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">READY TO WORK TOGETHER?</h2>
			<p class="font-body mt-6 text-base text-muted-foreground md:text-lg">Let's build something great. Get in touch to discuss your project.</p>
		</div>
		
		<!-- Right: Actions -->
		<div class="col-span-12 flex flex-col justify-center gap-4 bg-card px-6 py-16 md:col-span-6 md:px-12 lg:px-16">
			<a 
				href={localizeHref('/contact')} 
				class="group flex items-center justify-between border border-border bg-background px-6 py-4 transition-colors hover:border-primary hover:bg-primary/5"
			>
				<div>
					<span class="font-ui block text-sm tracking-widest">START A CONVERSATION</span>
					<span class="font-mono mt-1 block text-[10px] tracking-wider text-muted-foreground">Let's discuss your project</span>
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
