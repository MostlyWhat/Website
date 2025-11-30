<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import {
		Search,
		MessageCircleQuestion,
		BookOpen,
		Ticket,
		ArrowRight,
		Zap,
		Bug,
		Clock,
		CreditCard,
		Rocket,
		Settings,
		FileText
	} from '@lucide/svelte';

	// Main action tiles
	const mainTiles = [
		{
			icon: MessageCircleQuestion,
			title: 'TROUBLESHOOTER',
			desc: 'Diagnose your issue step by step.',
			href: '/support/troubleshooter'
		},
		{
			icon: BookOpen,
			title: 'DOCUMENTATION',
			desc: 'Browse help articles.',
			href: '/support/articles'
		},
		{
			icon: Ticket,
			title: 'SUBMIT TICKET',
			desc: 'Get personalized support.',
			href: '/support/submit-ticket'
		}
	];

	// Category tiles
	const categories = [
		{ icon: Rocket, title: 'GETTING STARTED', href: '/support/getting-started' },
		{ icon: Bug, title: 'TROUBLESHOOTING', href: '/support/reporting-bugs' },
		{ icon: Clock, title: 'RESPONSE TIMES', href: '/support/response-times' },
		{ icon: CreditCard, title: 'BILLING', href: '/support/billing-payments' },
		{ icon: Settings, title: 'PROJECT UPDATES', href: '/support/project-updates' },
		{ icon: FileText, title: 'PROJECT HANDOFF', href: '/support/project-handoff' }
	];

	const faq = [
		{
			q: 'What is your typical response time?',
			a: 'We aim to respond to all support requests within 24 hours during business days. Critical issues are prioritized and addressed within 2 hours.'
		},
		{
			q: 'How do I report a bug or issue?',
			a: 'Use the ticket form below with detailed steps to reproduce the issue. Include screenshots, browser info, and any error messages for faster resolution.'
		},
		{
			q: 'Do you offer phone support?',
			a: 'We provide scheduled calls for active clients. Contact us to arrange a call for complex issues that require real-time discussion.'
		},
		{
			q: 'What information should I include in my support request?',
			a: 'Include your project name, affected URL, browser/device info, steps to reproduce, and any error messages. The more detail, the faster we can help.'
		}
	];
</script>

<svelte:head>
	<title>Support — {m.site_name()}</title>
	<meta name="description" content="Get technical support and assistance from the MostlyWhat Systems team." />
</svelte:head>

<!-- Hero Section -->
<HeroSection
	label="// HELP.CENTER"
	title="SUPPORT"
	description="How can we help you today?"
	stats={[
		{ value: '<24H', label: 'RESPONSE' },
		{ value: '98%', label: 'RESOLVED' }
	]}
/>

<!-- Description Section -->
<DescriptionSection
	description="Get technical support and assistance. Browse our knowledge base, use our guided troubleshooter, or submit a ticket for personalized help."
	stats={[
		{ value: 'DOCS', label: 'ARTICLES' },
		{ value: 'LIVE', label: 'STATUS' }
	]}
/>

<!-- Search Bar -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-6 md:px-12 lg:px-16">
		<a 
			href={localizeHref('/search')} 
			class="mx-auto flex h-12 max-w-2xl items-center gap-3 border border-border bg-background px-4 text-muted-foreground transition-colors hover:border-primary"
		>
			<Search class="h-5 w-5" />
			<span class="font-body text-sm">Search for help articles...</span>
		</a>
	</div>
</section>

<!-- Main Actions - 3 Tiles -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each mainTiles as { icon: Icon, title, desc, href } (title)}
			<a
				href={localizeHref(href)}
				class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 transition-colors hover:bg-card sm:col-span-4 md:px-12 lg:px-16"
			>
				<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-border bg-card">
					<Icon class="h-6 w-6 text-primary" />
				</div>
				<div class="flex-1">
					<h3 class="font-ui text-sm font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
				</div>
				<ArrowRight class="h-4 w-4 text-muted-foreground" />
			</a>
		{/each}
	</div>
</section>

<!-- Category Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// BROWSE.TOPICS</span>
		</div>
		
		{#each categories as { icon: Icon, title, href } (title)}
			<a
				href={localizeHref(href)}
				class="col-span-6 flex items-center gap-3 bg-background px-6 py-4 transition-colors hover:bg-card sm:col-span-4 lg:col-span-2 md:px-8"
				use:scrollAnimate={{ animation: 'fade' }}
			>
				<Icon class="h-4 w-4 text-primary" />
				<span class="font-ui text-[10px] font-semibold tracking-wider">{title}</span>
			</a>
		{/each}
	</div>
</section>

<!-- Urgent Contact -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex items-center justify-between bg-card px-6 py-6 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex items-center gap-4">
				<div class="flex h-10 w-10 items-center justify-center border border-destructive/50 bg-destructive/10">
					<Zap class="h-5 w-5 text-destructive" />
				</div>
				<div>
					<h3 class="font-ui text-xs font-semibold tracking-wider">URGENT ISSUES</h3>
					<p class="font-body mt-0.5 text-[11px] text-muted-foreground">Critical issues, site outages</p>
				</div>
			</div>
			<a href="mailto:urgent@mostlywhat.com" class="font-mono text-[10px] tracking-wider text-primary hover:underline">
				CONTACT
			</a>
		</div>
		<a 
			href={localizeHref('/support/submit-ticket')}
			class="col-span-12 flex items-center justify-between bg-background px-6 py-6 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:px-16"
			use:scrollAnimate={{ animation: 'fade' }}
		>
			<div class="flex items-center gap-4">
				<div class="flex h-10 w-10 items-center justify-center border border-primary bg-primary/10">
					<Ticket class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h3 class="font-ui text-xs font-semibold tracking-wider">SUBMIT A TICKET</h3>
					<p class="font-body mt-0.5 text-[11px] text-muted-foreground">Get help within 24 hours</p>
				</div>
			</div>
			<ArrowRight class="h-4 w-4 text-primary" />
		</a>
	</div>
</section>

<!-- FAQ Section -->
<section id="faq" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-4 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FAQ</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase">COMMON QUESTIONS</h2>
		</div>
		<div class="col-span-12 bg-background lg:col-span-8">
			<Accordion.Root type="single" class="w-full divide-y divide-border">
				{#each faq as { q, a }, i (i)}
					<Accordion.Item value="item-{i}">
						<Accordion.Trigger>{q}</Accordion.Trigger>
						<Accordion.Content>
							<p class="font-body max-w-xl text-sm leading-relaxed text-muted-foreground">{a}</p>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	</div>
</section>

<!-- CTA Section -->
<CTASection
	variant="split"
	label="NEED MORE HELP?"
	title="START A CONVERSATION"
	description="Can't find what you're looking for? Let's talk about your project needs."
	buttonText="CONTACT US"
	buttonHref="/contact"
	secondaryButtonText="DOCUMENTATION"
	secondaryButtonHref="/docs"
	stats={[
		{ value: '<24H', label: 'AVG RESPONSE' },
		{ value: '98%', label: 'SATISFACTION' }
	]}
/>
