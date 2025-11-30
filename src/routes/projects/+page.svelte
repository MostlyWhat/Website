<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import { ArrowRight, ArrowUpRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state('All');

	const filteredProjects = $derived(
		selectedCategory === 'All' ? data.projects : data.projects.filter(p => p.category === selectedCategory)
	);

	const stats: { value: string; label: string }[] = [
		{ value: `${data.projects.length}+`, label: 'PROJECTS' },
		{ value: '100%', label: 'SATISFACTION' },
		{ value: '5+', label: 'YEARS' }
	];
</script>

<svelte:head>
	<title>{m.projects_title()} — {m.site_name()}</title>
	<meta name="description" content={m.projects_subtitle()} />
</svelte:head>

<!-- Hero Section -->
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
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SELECTED WORK</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				<GlitchText text={m.projects_title()} scrambledStart={true} />
			</h1>
		</div>
	</div>
</section>

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">{m.projects_subtitle()}</p>
		</div>
		<div class="col-span-12 grid grid-cols-3 gap-px bg-border md:col-span-6">
			{#each stats as { value, label } (label)}
				<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
					<span class="font-display text-lg font-bold text-primary md:text-xl">{value}</span>
					<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Filter Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Sort By Label - Fixed 2/12 width -->
		<div class="col-span-2 flex items-center bg-card px-6 py-3 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SORT BY</span>
		</div>
		<!-- Filter Options - 10/12 width -->
		<div class="col-span-10 flex overflow-x-auto">
			{#each data.categories as category (category)}
				<button
					type="button"
					onclick={() => selectedCategory = category}
					class="font-mono flex flex-1 items-center justify-center border-l border-border bg-background px-3 py-3 text-[10px] uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Projects Grid - Minimum Height Section -->
<section class="min-h-dvh border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		{#each filteredProjects as project (project.slug)}
			<a 
				href={localizeHref(`/projects/${project.slug}`)} 
				class="group col-span-12 flex flex-col bg-background transition-colors hover:bg-card md:col-span-6 lg:col-span-4"
			>
				<!-- Image placeholder -->
				<div class="aspect-video border-b border-border bg-card">
					<div class="flex h-full items-center justify-center">
						<span class="font-mono text-xs uppercase text-muted-foreground">[ {project.category} ]</span>
					</div>
				</div>
				
				<div class="flex flex-1 flex-col px-6 py-6 md:px-12 lg:px-16">
					<div class="flex items-center justify-between text-xs">
						<span class="font-mono uppercase text-primary">{project.category}</span>
						<span class="font-mono text-muted-foreground">{project.year}</span>
					</div>
					
					<h2 class="font-ui mt-3 text-base font-semibold transition-colors group-hover:text-primary">{project.title}</h2>
					<p class="font-mono mt-1 text-xs text-muted-foreground">{project.client}</p>
					<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{project.description}</p>
					
					<div class="mt-4 flex flex-wrap gap-1">
						{#each project.tags as tag}
							<span class="font-mono border border-border bg-card px-2 py-0.5 text-[10px]">{tag}</span>
						{/each}
					</div>
				</div>
			</a>
		{:else}
			<div class="col-span-12 flex min-h-[40vh] items-center justify-center bg-background px-6 py-12 md:px-12 lg:px-16">
				<p class="font-body text-center text-muted-foreground">No projects found.</p>
			</div>
		{/each}
	</div>
</section>

<!-- CTA Section -->
<section class="min-h-dvh border-b border-border">
	<div class="grid h-full min-h-dvh grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-16 md:px-12 lg:col-span-6 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">START BUILDING</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">HAVE A PROJECT?</h2>
			<p class="font-body mt-4 max-w-md text-muted-foreground">Let's discuss how we can bring your vision to life.</p>
			<Button href={localizeHref('/contact')} class="font-ui mt-6 w-fit uppercase tracking-wider">
				GET IN TOUCH
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-16 md:px-12 lg:col-span-6 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT</span>
			<a href="mailto:hello@mostlywhat.systems" class="font-display mt-4 block text-xl text-primary transition-colors hover:text-primary/80 md:text-2xl">
				HELLO@MOSTLYWHAT.SYSTEMS
			</a>
		</div>
	</div>
</section>
