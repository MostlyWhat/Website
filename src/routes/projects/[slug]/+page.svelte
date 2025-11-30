<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { project } = data;
</script>

<svelte:head>
	<title>{project.title} — {m.site_name()}</title>
	<meta name="description" content={project.description} />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<div class="flex items-center gap-4 text-xs">
				<span class="font-mono uppercase text-primary">{project.category}</span>
				<span class="font-mono text-muted-foreground">{project.year}</span>
			</div>
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl lg:text-5xl">
				{project.title}
			</h1>
			<p class="font-body mt-4 text-lg text-muted-foreground">{project.description}</p>
		</div>
		<div class="col-span-12 flex flex-col justify-between bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-16 lg:py-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CLIENT</span>
				<p class="font-ui mt-1 text-sm font-semibold">{project.client}</p>
			</div>
			{#if project.tags && project.tags.length > 0}
				<div class="mt-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TECHNOLOGIES</span>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each project.tags as tag (tag)}
							<span class="font-mono border border-border px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Project Content -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sticky Sidebar - Left -->
		<div class="col-span-12 border-b border-border bg-card lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="sticky top-24 px-6 py-8 md:px-12 lg:px-16 lg:py-12">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENTS</span>
				<nav class="mt-4 flex flex-col gap-3">
					{#each project.sections as section, i (section.id)}
						<a 
							href="#{section.id}" 
							class="font-ui group flex items-start gap-3 text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
						>
							<span class="font-mono text-[10px] text-primary/50 group-hover:text-primary">{String(i + 1).padStart(2, '0')}</span>
							<span class="border-b border-transparent group-hover:border-primary">{section.title}</span>
						</a>
					{/each}
				</nav>
			</div>
			<!-- Back link as full-width grid row -->
			<div class="border-t border-border">
				<a href={localizeHref('/projects')} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-card hover:text-primary md:px-12 lg:px-16">
					<ArrowLeft class="h-3 w-3" />
					BACK TO PROJECTS
				</a>
			</div>
		</div>

		<!-- Project Body - Right -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16">
			<div class="max-w-3xl">
				{@html project.content}
			</div>
		</article>
	</div>
</section>

<!-- More Projects CTA -->
<CTASection
	variant="compact"
	label="MORE WORK"
	title="EXPLORE MORE PROJECTS"
	description="Check out our other case studies and work samples."
	buttonText="VIEW ALL PROJECTS"
	buttonHref="/projects"
/>
