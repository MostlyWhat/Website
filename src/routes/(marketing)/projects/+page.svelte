<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { ArrowUpRight } from '@lucide/svelte';
	import { siteConfig, getMailtoLink } from '$lib/config/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state('All');
	let projects = $state<Array<{
		slug: string;
		title: string;
		client: string;
		description: string | null;
		category: string;
		tags: string[] | null;
		year: string | null;
	}>>([]);
	let categories = $state<string[]>(['All']);

	// Load streamed data
	const streamedData = $derived(data.streamed.projectData);

	$effect(() => {
		streamedData.then(result => {
			projects = result.projects;
			categories = result.categories;
		}).catch(err => {
			console.error('Failed to load projects:', err);
		});
	});

	const filteredProjects = $derived(
		selectedCategory === 'All' ? projects : projects.filter(p => p.category === selectedCategory)
	);
</script>

<svelte:head>
	<title>{m.projects_title()} — {m.site_name()}</title>
	<meta name="description" content={m.projects_subtitle()} />
</svelte:head>

<HeroSection label="// PORTFOLIO.SHOWCASE" title={m.projects_title()} />

<!-- Description Section -->
{#await streamedData}
	<DescriptionSection
		description={m.projects_subtitle()}
		stats={[
			{ value: '...', label: 'PROJECTS' },
			{ value: '100%', label: 'SATISFACTION' },
			{ value: '5+', label: 'YEARS' }
		]}
	/>
{:then result}
	<DescriptionSection
		description={m.projects_subtitle()}
		stats={[
			{ value: `${result.projects.length}+`, label: 'PROJECTS' },
			{ value: '100%', label: 'SATISFACTION' },
			{ value: '5+', label: 'YEARS' }
		]}
	/>
{/await}

<!-- Filter Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Sort By Label - Fixed 2/12 width -->
		<div class="col-span-2 flex items-center bg-card px-6 py-3 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SORT BY</span>
		</div>
		<!-- Filter Options - 10/12 width -->
		<div class="col-span-10 flex overflow-x-auto">
			{#await streamedData}
				<div class="flex flex-1 items-center justify-center border-l border-border bg-background px-3 py-3">
					<Skeleton class="h-4 w-20" />
				</div>
			{:then}
				{#each categories as category (category)}
					<button
						type="button"
						onclick={() => selectedCategory = category}
						class="font-mono flex flex-1 items-center justify-center border-l border-border bg-background px-3 py-3 text-[10px] uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
					>
						{category}
					</button>
				{/each}
			{/await}
		</div>
	</div>
</section>

<!-- Projects Grid - Minimum Height Section -->
<section class="min-h-dvh border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		{#await streamedData}
			<!-- Skeleton loading state -->
			{#each Array(6) as _, i}
				<div class="col-span-12 flex flex-col bg-background md:col-span-6 lg:col-span-4">
					<div class="aspect-video border-b border-border bg-card">
						<Skeleton class="h-full w-full" />
					</div>
					<div class="flex flex-1 flex-col px-6 py-6 md:px-12 lg:px-16">
						<div class="flex items-center justify-between">
							<Skeleton class="h-3 w-16" />
							<Skeleton class="h-3 w-10" />
						</div>
						<Skeleton class="mt-3 h-5 w-3/4" />
						<Skeleton class="mt-1 h-3 w-1/2" />
						<Skeleton class="mt-3 h-4 w-full" />
						<Skeleton class="mt-1 h-4 w-2/3" />
						<div class="mt-4 flex gap-1">
							<Skeleton class="h-5 w-12" />
							<Skeleton class="h-5 w-14" />
							<Skeleton class="h-5 w-10" />
						</div>
					</div>
				</div>
			{/each}
		{:then}
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
							{#each (project.tags ?? []) as tag}
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
		{:catch error}
			<div class="col-span-12 flex min-h-[40vh] items-center justify-center bg-background px-6 py-12 md:px-12 lg:px-16">
				<p class="font-body text-center text-destructive">Failed to load projects.</p>
			</div>
		{/await}
	</div>
</section>

<!-- CTA Section -->
<CTASection
	variant="split"
	label="START BUILDING"
	title="HAVE A PROJECT?"
	description="Let's discuss how we can bring your vision to life."
	buttonText="GET IN TOUCH"
	buttonHref="/contact"
>
	{#snippet children()}
		<div class="text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT</span>
			<a href={getMailtoLink('hello')} class="font-display mt-2 block text-xl text-primary transition-colors hover:text-primary/80 md:text-2xl">
				{siteConfig.emails.hello.toUpperCase()}
			</a>
		</div>
	{/snippet}
</CTASection>
