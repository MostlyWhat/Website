<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Users, Target, Lightbulb, Rocket } from '@lucide/svelte';

	const values = [
		{
			icon: Target,
			title: 'Clarity First',
			desc: 'We believe in clear communication, transparent processes, and honest feedback. No jargon, no hidden agendas.'
		},
		{
			icon: Lightbulb,
			title: 'Thoughtful Craft',
			desc: 'Every pixel, every line of code matters. We obsess over the details that make products feel polished and professional.'
		},
		{
			icon: Users,
			title: 'Partnership',
			desc: 'We work with you, not for you. Your success is our success, and we invest in long-term relationships.'
		},
		{
			icon: Rocket,
			title: 'Ship Fast',
			desc: 'Speed matters. We move quickly without sacrificing quality, getting your product to market when it matters.'
		}
	];

	const team = [
		{
			name: 'Prem (MostlyWhat)',
			role: 'Founder & Lead Engineer',
			desc: 'Full-stack engineer with a passion for design systems and developer experience.'
		}
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

<!-- Hero Section -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">About</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl lg:text-6xl">{m.about_title()}</h1>
		<p class="font-body text-lg text-muted-foreground md:text-xl">{m.about_subtitle()}</p>
	</div>
</Section>

<!-- Story Section -->
<Section background="card">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div use:scrollAnimate={{ animation: 'slide-left' }}>
			<h2 class="h2 mb-6 text-3xl md:text-4xl">Our Story</h2>
			<div class="font-body space-y-4 text-muted-foreground">
				<p>
					MostlyWhat Systems started as a solo venture—a desire to build websites and products
					that felt different. Not just functional, but intentional. Not just pretty, but purposeful.
				</p>
				<p>
					We draw inspiration from industrial design, sci-fi interfaces, and the clean precision
					of developer tools. The result is a design language that feels both futuristic and
					grounded—high-fidelity without being precious.
				</p>
				<p>
					Today, we partner with startups, agencies, and product teams who share our obsession
					with quality and our impatience with mediocrity.
				</p>
			</div>
		</div>

		<div class="border border-border bg-background p-8" use:scrollAnimate={{ animation: 'slide-right' }}>
			<div class="font-mono text-sm text-muted-foreground">
				<p class="mb-2 text-primary">// Company Info</p>
				<p><span class="text-yellow-400">const</span> company = {'{'}</p>
				<p class="pl-4">name: <span class="text-green-400">"MostlyWhat Systems"</span>,</p>
				<p class="pl-4">founded: <span class="text-cobalt-400">2022</span>,</p>
				<p class="pl-4">focus: <span class="text-green-400">"Web Products"</span>,</p>
				<p class="pl-4">philosophy: <span class="text-green-400">"Ship fast, ship well"</span></p>
				<p>{'}'}</p>
			</div>
		</div>
	</div>
</Section>

<!-- Values Section -->
<Section>
	<div class="mb-12" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Values</p>
		<h2 class="h2 text-3xl md:text-4xl">What We Stand For</h2>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each values as { icon: Icon, title, desc }}
			<Tile padding="lg">
				<div class="mb-4 flex h-12 w-12 items-center justify-center border border-border">
					<Icon class="h-6 w-6 text-primary" />
				</div>
				<h3 class="font-ui mb-2 text-lg font-semibold">{title}</h3>
				<p class="font-body text-muted-foreground">{desc}</p>
			</Tile>
		{/each}
	</div>
</Section>

<!-- Team Section -->
<Section background="card">
	<div class="mb-12" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Team</p>
		<h2 class="h2 text-3xl md:text-4xl">The People Behind the Work</h2>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each team as { name, role, desc }}
			<Tile padding="lg">
				<div class="mb-4 h-16 w-16 border border-border bg-primary/10"></div>
				<h3 class="font-ui text-lg font-semibold">{name}</h3>
				<p class="font-ui mb-2 text-sm text-primary">{role}</p>
				<p class="font-body text-sm text-muted-foreground">{desc}</p>
			</Tile>
		{/each}
	</div>
</Section>

<!-- Tech Stack Section -->
<Section>
	<div class="mb-12" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Technology</p>
		<h2 class="h2 text-3xl md:text-4xl">Our Tech Stack</h2>
	</div>

	<div class="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each tech as { category, items }}
			<Tile padding="lg">
				<h3 class="font-ui mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{category}</h3>
				<ul class="font-body space-y-2 text-sm">
					{#each items as item}
						<li class="flex items-center gap-2">
							<span class="h-1.5 w-1.5 bg-primary"></span>
							{item}
						</li>
					{/each}
				</ul>
			</Tile>
		{/each}
	</div>
</Section>

<!-- CTA Section -->
<Section background="card" padding="xl">
	<div class="text-center" use:scrollAnimate={{ animation: 'scale' }}>
		<h2 class="font-display mb-4 text-3xl md:text-4xl">Ready to Work Together?</h2>
		<p class="font-body mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
			Let's build something great. Get in touch to discuss your project.
		</p>
		<Button href="/contact" size="lg" class="font-ui">
			Start a Conversation
			<ArrowRight class="ml-2 h-5 w-5" />
		</Button>
	</div>
</Section>
