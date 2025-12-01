<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import { ChevronRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Legal — {m.site_name()}</title>
	<meta name="description" content="Legal documents including Privacy Policy, Terms of Service, EULA, and Cookie Policy for MostlyWhat Systems." />
</svelte:head>

<HeroSection label="// DOCS.LEGAL" title="LEGAL" />

<DescriptionSection
	description="Transparency matters. Find all our legal documents and policies here."
	stats={[
		{ value: String(data.docs.length), label: 'DOCUMENTS' },
		{ value: '2024', label: 'LAST UPDATED' },
		{ value: 'GDPR', label: 'COMPLIANT' }
	]}
/>

<!-- Documents List -->
<section class="border-b border-border">
	<div class="divide-y divide-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each data.docs as doc (doc.slug)}
			<a
				href={localizeHref(`/legal/${doc.slug}`)}
				class="group flex items-center justify-between px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
			>
				<div class="flex-1">
					<div class="flex items-center gap-4">
						<h2 class="font-ui text-sm font-semibold tracking-wider uppercase group-hover:text-primary">
							{doc.title}
						</h2>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
							{doc.lastUpdated.toUpperCase()}
						</span>
					</div>
				</div>
				<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
			</a>
		{/each}
	</div>
</section>

<!-- Contact Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-8 lg:px-16 lg:py-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUESTIONS?</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">NEED CLARIFICATION?</h2>
			<p class="font-body mt-4 max-w-2xl text-muted-foreground">
				If you have any questions about our legal documents or how we handle your data, 
				please don't hesitate to reach out. We're here to help.
			</p>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-8 md:px-12 lg:col-span-4 lg:px-16 lg:py-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT</span>
			<a href="mailto:legal@mostlywhat.systems" class="font-display mt-2 text-lg text-primary hover:underline md:text-xl">
				LEGAL@MOSTLYWHAT.SYSTEMS
			</a>
			<p class="font-body mt-4 text-sm text-muted-foreground">
				We typically respond within 48 hours.
			</p>
		</div>
	</div>
</section>
