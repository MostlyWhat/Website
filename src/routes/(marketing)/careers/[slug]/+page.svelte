<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import WideNavSection from '$lib/components/layout/WideNavSection.svelte';
	import MarkdownRenderer from '$lib/components/layout/MarkdownRenderer.svelte';
	import { ArrowLeft, ArrowRight, MapPin, Briefcase, Mail } from '@lucide/svelte';
	import { siteConfig, getMailtoLink } from '$lib/config/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	
	const position = $derived(data.position);
</script>

<svelte:head>
	<title>{position.title} — Careers — {m.site_name()}</title>
	<meta name="description" content={position.summary} />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<div class="flex flex-wrap items-center gap-3">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CAREERS</span>
				<span class="text-muted-foreground">/</span>
				<span class="font-mono border border-primary bg-primary/10 px-2 py-0.5 text-[10px] tracking-wider text-primary">{position.department}</span>
			</div>
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.9] tracking-tight md:text-4xl lg:text-5xl">
				{position.title}
			</h1>
			<div class="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
				<span class="flex items-center gap-2">
					<Briefcase class="h-4 w-4" />
					{position.type}
				</span>
				<span class="flex items-center gap-2">
					<MapPin class="h-4 w-4" />
					{position.location}
				</span>
			</div>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-16 lg:py-16">
			<a 
				href="{getMailtoLink('careers')}?subject=Application%3A%20{encodeURIComponent(position.title)}"
				class="group flex items-center justify-center gap-3 border border-primary bg-primary px-6 py-4 text-primary-foreground transition-colors hover:bg-primary/90"
			>
				<Mail class="h-5 w-5" />
				<span class="font-ui text-sm tracking-widest">APPLY NOW</span>
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</a>
			<p class="font-body mt-4 text-center text-xs text-muted-foreground">
				Send your resume and portfolio to {siteConfig.emails.careers}
			</p>
		</div>
	</div>
</section>

<!-- Content Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sticky Sidebar - Left -->
		<div class="col-span-12 border-b border-border bg-background lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="lg:sticky lg:top-24">
				<!-- Quick Info -->
				<div class="border-b border-border px-6 py-8 md:px-12 lg:px-16 lg:py-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK INFO</span>
					<div class="mt-4 space-y-4">
						<div>
							<span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Department</span>
							<p class="font-ui mt-1 text-sm font-semibold tracking-wider">{position.department}</p>
						</div>
						<div>
							<span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Type</span>
							<p class="font-ui mt-1 text-sm font-semibold tracking-wider">{position.type}</p>
						</div>
						<div>
							<span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Location</span>
							<p class="font-ui mt-1 text-sm font-semibold tracking-wider">{position.location}</p>
						</div>
					</div>
				</div>
				<!-- On This Page -->
				<div class="px-6 py-8 md:px-12 lg:px-16 lg:py-12" use:scrollAnimate={{ animation: 'fade' }}>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ON THIS PAGE</span>
					<nav class="mt-4 flex flex-col gap-3">
						{#each position.sections as section, i (section.id)}
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
				<!-- Back link at bottom -->
				<div class="border-t border-border">
					<a href={localizeHref('/careers')} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-card hover:text-primary md:px-12 lg:px-16">
						<ArrowLeft class="h-3 w-3" />
						BACK TO CAREERS
					</a>
				</div>
			</div>
		</div>

		<!-- Main Content - Right -->
		<div class="col-span-12 bg-background lg:col-span-9">
			<article class="px-6 py-12 md:px-12 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade' }}>
				<MarkdownRenderer content={position.content} />
			</article>

			<!-- Apply Section - Under Article -->
			<div class="border-t border-border bg-card px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
				<div class="max-w-3xl">
					<h2 class="font-display text-2xl font-bold uppercase">HOW TO APPLY</h2>
					<div class="font-body mt-4 space-y-3 text-sm text-muted-foreground">
						<p><strong class="text-foreground">1.</strong> Send your resume and portfolio to <a href={getMailtoLink('careers')} class="text-primary hover:underline">{siteConfig.emails.careers}</a></p>
						<p><strong class="text-foreground">2.</strong> Include a brief note about why you're interested in this role</p>
						<p><strong class="text-foreground">3.</strong> We'll review your application and get back to you within 5 business days</p>
					</div>
					<a 
						href="{getMailtoLink('careers')}?subject=Application%3A%20{encodeURIComponent(position.title)}"
						class="group mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
					>
						<Mail class="h-4 w-4" />
						<span class="font-ui text-sm tracking-widest">APPLY NOW</span>
						<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Other Positions -->
<WideNavSection
	label="EXPLORE MORE"
	title="VIEW ALL OPEN POSITIONS"
	description="Check out other opportunities on our team."
	buttonText="VIEW CAREERS"
	buttonHref="/careers"
/>
