<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { 
		ArrowRight, ArrowLeft, Rocket, Code,  
		ChevronRight, Sparkles, Users, Clock
	} from '@lucide/svelte';

	// Step-based navigation state
	let currentStep = $state<number>(0);
	let selectedPath = $state<string | null>(null);

	// Quick paths based on user situation
	const quickPaths = [
		{
			id: 'new-client',
			icon: Rocket,
			title: "I'M NEW HERE",
			subtitle: 'First time learning about us',
			color: 'text-green-400',
			articles: [
				{ title: 'What Does MostlyWhat Do?', href: '/help/what-we-do', time: '3 min' },
				{ title: 'Our Services Overview', href: '/help/services-overview', time: '4 min' },
				{ title: 'How to Start a Project', href: '/help/starting-project', time: '4 min' }
			]
		},
		{
			id: 'want-project',
			icon: Sparkles,
			title: 'I WANT A PROJECT',
			subtitle: 'Ready to work together',
			color: 'text-primary',
			articles: [
				{ title: 'How Our Process Works', href: '/help/project-process', time: '5 min' },
				{ title: 'Pricing & Estimates', href: '/help/pricing', time: '4 min' },
				{ title: 'Project Timelines', href: '/help/timeline', time: '3 min' }
			]
		},
		{
			id: 'existing-client',
			icon: Users,
			title: "I'M A CLIENT",
			subtitle: 'Already working with us',
			color: 'text-blue-400',
			articles: [
				{ title: 'Communication & Updates', href: '/help/communication', time: '4 min' },
				{ title: 'Post-Launch Support', href: '/help/maintenance', time: '4 min' },
				{ title: 'Invoicing & Payment', href: '/help/invoicing', time: '3 min' }
			]
		},
		{
			id: 'technical',
			icon: Code,
			title: 'TECHNICAL QUESTIONS',
			subtitle: 'Stack, tools, and methods',
			color: 'text-yellow-400',
			articles: [
				{ title: 'Our Technology Stack', href: '/help/tech-stack', time: '4 min' },
				{ title: 'Third-Party Integrations', href: '/help/integrations', time: '5 min' },
				{ title: 'Design Systems Approach', href: '/help/design-systems', time: '5 min' }
			]
		}
	];

	// Common questions (quick answers)
	const commonQuestions = [
		{ q: 'How long does a typical project take?', a: '6-12 weeks from kickoff to launch, depending on scope.' },
		{ q: 'Do you work with startups?', a: 'Yes! We have flexible engagement models for different budgets.' },
		{ q: 'What technologies do you use?', a: 'SvelteKit, TypeScript, TailwindCSS, deployed on Cloudflare.' },
		{ q: 'Do you provide ongoing support?', a: 'We offer maintenance packages for monitoring and updates.' }
	];

	function selectPath(id: string) {
		selectedPath = id;
		currentStep = 1;
	}

	function goBack() {
		currentStep = 0;
		selectedPath = null;
	}

	const selectedPathData = $derived(quickPaths.find(p => p.id === selectedPath));
</script>

<svelte:head>
	<title>Help Center — {m.site_name()}</title>
	<meta name="description" content="Find answers to common questions about working with MostlyWhat Systems." />
</svelte:head>

<!-- Hero Section -->
<section class="relative flex h-dvh flex-col border-b border-border">
	<!-- Video Background -->
	<VideoBackground 
		src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-circuit-board-29766-large.mp4"
		class="brightness-[0.15]"
	/>
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Right-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-end justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl text-right">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">KNOWLEDGE BASE</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				HOW CAN WE<br />HELP YOU?
			</h1>
		</div>
	</div>
</section>

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">
				Select your situation below to find the most relevant information.
			</p>
		</div>
		<div class="col-span-12 grid grid-cols-3 gap-px bg-border md:col-span-6">
			<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
				<span class="font-display text-lg font-bold text-primary md:text-xl">QUICK</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">ANSWERS</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
				<span class="font-display text-lg font-bold text-primary md:text-xl">4</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">PATHS</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
				<span class="font-display text-lg font-bold text-primary md:text-xl">24H</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">RESPONSE</p>
			</div>
		</div>
	</div>
</section>

<!-- Quick Path Selection -->
{#if currentStep === 0}
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STEP 1 OF 2</span>
				<h2 class="font-display mt-2 text-lg font-bold uppercase">WHAT BRINGS YOU HERE TODAY?</h2>
				<p class="font-body mt-1 text-sm text-muted-foreground">Select the option that best describes your situation so we can guide you to the right resources.</p>
			</div>
		</div>
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each quickPaths as path (path.id)}
				<button
					type="button"
					onclick={() => selectPath(path.id)}
					class="group col-span-12 flex flex-col bg-background px-6 py-8 text-left transition-colors hover:bg-card md:px-12 lg:px-16"
				>
					<div class="flex items-start gap-6">
						<div class="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary group-hover:bg-primary/10">
							<path.icon class="h-6 w-6 {path.color}" />
						</div>
						<div class="flex-1">
							<h3 class="font-display text-lg font-bold tracking-wider group-hover:text-primary">{path.title}</h3>
							<p class="font-body mt-2 text-sm leading-relaxed text-muted-foreground">{path.subtitle}</p>
						</div>
						<ChevronRight class="mt-2 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- All Articles Section -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 flex items-center justify-between bg-card px-6 py-6 md:px-12 lg:px-16">
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ALL DOCUMENTATION</span>
					<p class="font-body mt-1 text-sm text-muted-foreground">Browse all available articles.</p>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-12 gap-px bg-border">
			{#each quickPaths as path (path.id)}
				<div class="col-span-12 md:col-span-6 lg:col-span-3">
					<div class="flex items-center gap-3 bg-background px-6 py-4 md:px-8">
						<path.icon class="h-4 w-4 {path.color}" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{path.title}</span>
					</div>
					{#each path.articles as article (article.href)}
						<a
							href={localizeHref(article.href)}
							class="group flex items-center justify-between bg-card px-6 py-3 transition-colors hover:bg-background md:px-8"
						>
							<span class="font-ui text-xs tracking-wider text-muted-foreground group-hover:text-primary">{article.title}</span>
							<span class="font-mono text-[10px] text-muted-foreground/50">{article.time}</span>
						</a>
					{/each}
				</div>
			{/each}
		</div>
	</section>

	<!-- Quick Answers -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK ANSWERS</span>
				<p class="font-body mt-1 text-sm text-muted-foreground">Common questions we get asked frequently.</p>
			</div>
		</div>
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each commonQuestions as { q, a } (q)}
				<div class="col-span-12 bg-background px-6 py-6 md:col-span-6 md:px-12 lg:px-16">
					<h4 class="font-ui text-sm font-semibold tracking-wider text-primary">{q}</h4>
					<p class="font-body mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
				</div>
			{/each}
		</div>
	</section>

{:else if currentStep === 1 && selectedPathData}
	<!-- Selected Path Articles -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<button 
				type="button"
				onclick={goBack}
				class="col-span-12 flex items-center gap-3 bg-card px-6 py-4 text-left transition-colors hover:bg-card/80 md:px-12 lg:px-16"
			>
				<ArrowLeft class="h-4 w-4 text-muted-foreground" />
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BACK TO STEP 1</span>
			</button>
		</div>
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STEP 2 OF 2</span>
				<div class="mt-4 flex items-center gap-4">
					<div class="flex h-14 w-14 items-center justify-center border border-primary bg-primary/10">
						<selectedPathData.icon class="h-6 w-6 text-primary" />
					</div>
					<div>
						<h2 class="font-display text-2xl font-bold uppercase">{selectedPathData.title}</h2>
						<p class="font-body mt-1 text-sm text-muted-foreground">Here are the most helpful articles for you.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each selectedPathData.articles as article, i (article.href)}
				<a
					href={localizeHref(article.href)}
					class="group col-span-12 flex items-center justify-between bg-background px-6 py-5 transition-colors hover:bg-card md:px-12 lg:px-16"
				>
					<div class="flex items-start gap-4">
						<span class="font-mono text-lg font-bold text-primary/50 group-hover:text-primary">{String(i + 1).padStart(2, '0')}</span>
						<div>
							<h3 class="font-ui text-sm font-semibold tracking-wider group-hover:text-primary">{article.title}</h3>
							<span class="font-mono mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
								<Clock class="h-3 w-3" />
								{article.time} read
							</span>
						</div>
					</div>
					<ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
				</a>
			{/each}
		</div>
	</section>
{/if}

<!-- Contact CTA -->
<CTASection
	variant="split"
	label="STILL NEED HELP?"
	title="CONTACT OUR TEAM"
	description="Can't find what you're looking for? Our team is here to help."
	buttonText="GET IN TOUCH"
	buttonHref="/contact"
	stats={[
		{ value: '24H', label: 'AVG. RESPONSE' },
		{ value: '100%', label: 'SATISFACTION' },
		{ value: 'GLOBAL', label: 'AVAILABILITY' },
		{ value: 'FREE', label: 'CONSULTATION' }
	]}
/>
