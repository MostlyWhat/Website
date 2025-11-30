<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import SectionHeader from '$lib/components/layout/SectionHeader.svelte';
	import LinkCTASection from '$lib/components/layout/LinkCTASection.svelte';
	import { ArrowRight, MapPin, Clock, Briefcase, Users } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const benefits = [
		{ title: 'REMOTE FIRST', desc: 'Work from anywhere in the world. We believe in async communication and flexible schedules.' },
		{ title: 'LEARNING BUDGET', desc: 'Annual stipend for courses, conferences, books, and professional development.' },
		{ title: 'MODERN STACK', desc: 'Work with cutting-edge technologies like SvelteKit, TypeScript, and Cloudflare.' },
		{ title: 'OWNERSHIP', desc: 'Take ownership of projects from concept to launch. Your ideas matter here.' }
	];

	const values = [
		{ title: 'SHIP FAST', desc: 'We move quickly without sacrificing quality.' },
		{ title: 'STAY CURIOUS', desc: 'Always learning, always improving.' },
		{ title: 'BE TRANSPARENT', desc: 'Open communication builds trust.' },
		{ title: 'TAKE OWNERSHIP', desc: 'Own your work from start to finish.' }
	];
</script>

<svelte:head>
	<title>Careers — {m.site_name()}</title>
	<meta name="description" content="Join our team and help build the future of web development." />
</svelte:head>

<HeroSection label="// TEAM.JOIN" title="JOIN OUR TEAM" />

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-8 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">
				We're building the future of web development. Join a team that values craft, speed, and making a real impact.
			</p>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card px-6 py-12 md:col-span-4 md:px-12 lg:px-16">
			<div class="text-center">
				<span class="font-display text-4xl font-black text-primary">{data.positions.length}</span>
				<p class="font-mono mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">OPEN POSITIONS</p>
			</div>
		</div>
	</div>
</section>

<!-- Values Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — OUR VALUES</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">WHAT WE BELIEVE</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each values as { title, desc } (title)}
			<div class="col-span-12 bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
				<h3 class="font-ui text-sm font-semibold tracking-wider text-primary">{title}</h3>
				<p class="font-body mt-3 text-sm text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Benefits Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — BENEFITS</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">WHY JOIN US</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each benefits as { title, desc } (title)}
			<div class="col-span-12 bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
				<h3 class="font-ui text-sm font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-3 text-sm text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Open Positions Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — POSITIONS</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">OPEN ROLES</h2>
	</div>
	<div class="border-t border-border">
		{#each data.positions as position (position.slug)}
			<a 
				href={localizeHref(`/careers/${position.slug}`)}
				class="group flex flex-col gap-4 border-b border-border bg-background px-6 py-8 transition-colors hover:bg-card md:flex-row md:items-center md:justify-between md:px-12 lg:px-16"
			>
				<div class="flex-1">
					<div class="flex flex-wrap items-center gap-3">
						<h3 class="font-ui text-base font-semibold tracking-wider">{position.title}</h3>
						<span class="font-mono border border-primary bg-primary/10 px-2 py-0.5 text-[10px] tracking-wider text-primary">{position.department}</span>
					</div>
					<p class="font-body mt-2 text-sm text-muted-foreground">{position.summary}</p>
					<div class="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
						<span class="flex items-center gap-1">
							<Briefcase class="h-3 w-3" />
							{position.type}
						</span>
						<span class="flex items-center gap-1">
							<MapPin class="h-3 w-3" />
							{position.location}
						</span>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-ui text-xs tracking-wider text-primary">VIEW DETAILS</span>
					<ArrowRight class="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
				</div>
			</a>
		{/each}
	</div>
</section>

<!-- No Position CTA -->
<LinkCTASection
	title="DON'T SEE YOUR ROLE?"
	description="We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities."
	buttonText="GET IN TOUCH"
	buttonHref="mailto:careers@mostlywhat.systems"
/>
