<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import { ArrowRight, FileText, Shield, Cookie } from '@lucide/svelte';

	const documents = [
		{
			icon: Shield,
			title: 'PRIVACY POLICY',
			description: 'How we collect, use, and protect your personal information.',
			href: '/legal/privacy',
			updated: 'JANUARY 2024'
		},
		{
			icon: FileText,
			title: 'TERMS OF SERVICE',
			description: 'The terms and conditions that govern our services.',
			href: '/legal/terms',
			updated: 'JANUARY 2024'
		},
		{
			icon: Cookie,
			title: 'COOKIE POLICY',
			description: 'How we use cookies and similar technologies.',
			href: '/legal/cookies',
			updated: 'JANUARY 2024'
		}
	];
</script>

<svelte:head>
	<title>Legal — {m.site_name()}</title>
	<meta name="description" content="Legal documents including Privacy Policy, Terms of Service, and Cookie Policy for MostlyWhat Systems." />
</svelte:head>

<HeroSection label="DOCUMENTS" title="LEGAL" />

<DescriptionSection
	description="Transparency matters. Find all our legal documents and policies here."
	stats={[
		{ value: '3', label: 'DOCUMENTS' },
		{ value: '2024', label: 'LAST UPDATED' },
		{ value: 'GDPR', label: 'COMPLIANT' }
	]}
/>

<!-- Documents Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each documents as { icon: Icon, title, description, href, updated } (title)}
			<a
				href={localizeHref(href)}
				class="group col-span-12 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:col-span-4 lg:px-16 lg:py-12"
			>
				<div class="flex items-start justify-between">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<Icon class="h-6 w-6 text-primary" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{updated}</span>
				</div>
				<h2 class="font-ui mt-6 text-sm font-semibold tracking-wider">{title}</h2>
				<p class="font-body mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
				<div class="mt-6 flex items-center gap-2 text-primary">
					<span class="font-mono text-xs tracking-wider">READ DOCUMENT</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
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
