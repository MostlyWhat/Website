<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
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

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-dvh flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Positioned at Bottom -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SELECTED WORK</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.projects_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.projects_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		{#each stats as { value, label } (label)}
			<div class="col-span-4 bg-card/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-2xl">{value}</span>
				<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Filter Bar -->
<section class="border-b border-border">
	<div class="flex">
		<!-- Filter Label -->
		<div class="flex w-24 shrink-0 items-center justify-center border-r border-border bg-card">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FILTER</span>
		</div>
		<!-- Filter Options -->
		<div class="flex flex-1 overflow-x-auto">
			{#each data.categories as category (category)}
				<button
					type="button"
					onclick={() => selectedCategory = category}
					class="font-mono flex flex-1 items-center justify-center border-r border-border px-4 py-4 text-xs uppercase tracking-wider transition-colors last:border-r-0 {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-card hover:text-foreground'}"
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
