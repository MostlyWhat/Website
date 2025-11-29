<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Target, Lightbulb, Users, Rocket } from '@lucide/svelte';

	const values = [
		{ icon: Target, title: 'Clarity First', desc: 'Clear communication, transparent processes, honest feedback.' },
		{ icon: Lightbulb, title: 'Thoughtful Craft', desc: 'Every pixel, every line of code matters.' },
		{ icon: Users, title: 'Partnership', desc: 'We work with you, not for you.' },
		{ icon: Rocket, title: 'Ship Fast', desc: 'Speed matters without sacrificing quality.' }
	];

	const team = [
		{ name: 'Prem (MostlyWhat)', role: 'Founder & Lead Engineer', desc: 'Full-stack engineer with a passion for design systems.' }
	];

	const tech = [
		{ category: 'Frontend', items: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'Vite'] },
		{ category: 'Backend', items: ['Cloudflare Workers', 'Drizzle ORM', 'D1/Turso'] },
		{ category: 'Tools', items: ['Figma', 'Linear', 'GitHub', 'Vercel'] },
		{ category: 'Standards', items: ['WCAG 2.1', 'Core Web Vitals', 'Semantic HTML'] }
	];
</script>

<svelte:head>
	<title>{m.about_title()} — {m.site_name()}</title>
	<meta name="description" content={m.about_subtitle()} />
</svelte:head>

<!-- Hero Section - Full Screen -->
<section class="relative flex min-h-[70vh] flex-col border-b border-border">
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<div class="flex flex-1 items-end p-4 pb-12 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid w-full gap-4 lg:grid-cols-12">
			<div class="lg:col-span-7">
				<p class="font-mono text-xs uppercase tracking-wider text-primary">About</p>
				<h1 class="font-display mt-2 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
					{m.about_title()}
				</h1>
			</div>
			<div class="lg:col-span-5 lg:flex lg:flex-col lg:justify-end">
				<p class="font-body text-muted-foreground">{m.about_subtitle()}</p>
			</div>
		</div>
	</div>
</section>

<!-- Story Section -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-2">
		<div class="border-b border-border p-4 md:p-6 lg:border-b-0 lg:border-r lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Story</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Our Origin</h2>
			<div class="font-body mt-4 space-y-3 text-sm text-muted-foreground">
				<p>MostlyWhat Systems started as a solo venture—a desire to build websites and products that felt different. Not just functional, but intentional.</p>
				<p>We draw inspiration from industrial design, sci-fi interfaces, and the clean precision of developer tools.</p>
				<p>Today, we partner with startups and product teams who share our obsession with quality.</p>
			</div>
		</div>
		<div class="bg-card p-4 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="font-mono text-xs text-muted-foreground">
				<p class="text-primary">// Company Info</p>
				<p class="mt-2"><span class="text-yellow-400">const</span> company = {'{'}</p>
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
	<div class="grid lg:grid-cols-12">
		<div class="border-b border-border p-4 md:p-6 lg:col-span-3 lg:border-b-0 lg:border-r" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Values</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">What We Stand For</h2>
		</div>
		<div class="grid gap-px bg-border sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each values as { icon: Icon, title, desc }}
				<div class="stagger-children bg-background p-4 md:p-6">
					<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui text-sm font-semibold">{title}</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Tech Stack Grid -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-12">
		<div class="border-b border-border p-4 md:p-6 lg:col-span-3 lg:border-b-0 lg:border-r" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Technology</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Our Stack</h2>
		</div>
		<div class="grid gap-px bg-border sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each tech as { category, items }}
				<div class="stagger-children bg-card p-4 md:p-6">
					<h3 class="font-mono text-xs uppercase tracking-wider text-primary">{category}</h3>
					<ul class="font-body mt-2 space-y-1 text-xs">
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
	<div class="grid lg:grid-cols-2" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="border-b border-border p-4 md:p-6 lg:border-b-0 lg:border-r lg:p-8">
			<p class="font-mono text-xs uppercase tracking-wider text-primary">Team</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">The People</h2>
		</div>
		<div class="p-4 md:p-6 lg:p-8">
			{#each team as { name, role, desc }}
				<div class="flex items-start gap-4">
					<div class="h-12 w-12 shrink-0 border border-border bg-primary/10"></div>
					<div>
						<h3 class="font-ui text-sm font-semibold">{name}</h3>
						<p class="font-mono text-xs text-primary">{role}</p>
						<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="p-4 md:p-6 lg:p-8">
			<h2 class="font-display text-2xl font-bold uppercase md:text-3xl">Ready to Work Together?</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Let's build something great. Get in touch to discuss your project.</p>
			<Button href="/contact" class="font-ui mt-4">
				Start a Conversation
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="border-t border-border bg-card p-4 md:p-6 lg:border-l lg:border-t-0 lg:p-8">
			<p class="font-mono text-xs uppercase text-muted-foreground">Email us</p>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-1 block text-lg text-primary hover:underline">hello@mostlywhat.systems</a>
		</div>
	</div>
</section>
