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
		Send,
		Zap,
		Bug,
		Clock,
		CreditCard,
		Rocket,
		Settings,
		FileText
	} from '@lucide/svelte';

	let searchQuery = $state('');

	// Main action tiles
	const mainTiles = [
		{
			icon: MessageCircleQuestion,
			title: 'GUIDED TROUBLESHOOTER',
			desc: 'Answer a few questions and we\'ll help diagnose your issue step by step.',
			action: 'START DIAGNOSIS',
			href: '/support/troubleshooter',
			featured: true
		},
		{
			icon: BookOpen,
			title: 'BROWSE DOCUMENTATION',
			desc: 'Search through our complete help center and support articles.',
			action: 'BROWSE ARTICLES',
			href: '/support/articles'
		},
		{
			icon: Ticket,
			title: 'SUBMIT A TICKET',
			desc: 'Can\'t find what you need? Create a support ticket for personalized help.',
			action: 'CREATE TICKET',
			href: '/support/submit-ticket'
		}
	];

	// Category tiles
	const categories = [
		{
			icon: Rocket,
			title: 'GETTING STARTED',
			desc: 'Onboarding, project kickoff, and initial setup guides.',
			href: '/support/getting-started',
			articles: 2
		},
		{
			icon: Bug,
			title: 'TROUBLESHOOTING',
			desc: 'Bug reports, browser issues, and common problems.',
			href: '/support/reporting-bugs',
			articles: 3
		},
		{
			icon: Clock,
			title: 'RESPONSE TIMES',
			desc: 'SLAs, priority levels, and what to expect.',
			href: '/support/response-times',
			articles: 1
		},
		{
			icon: CreditCard,
			title: 'BILLING & PAYMENTS',
			desc: 'Invoices, payment methods, and refund policy.',
			href: '/support/billing-payments',
			articles: 1
		},
		{
			icon: Settings,
			title: 'PROJECT UPDATES',
			desc: 'Request changes, content updates, and maintenance.',
			href: '/support/project-updates',
			articles: 1
		},
		{
			icon: FileText,
			title: 'PROJECT HANDOFF',
			desc: 'Completion, deliverables, and post-launch support.',
			href: '/support/project-handoff',
			articles: 1
		}
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

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
		}
	}
</script>

<svelte:head>
	<title>Support — {m.site_name()}</title>
	<meta name="description" content="Get technical support and assistance from the MostlyWhat Systems team." />
</svelte:head>

<!-- Hero Section - Full Screen with Video -->
<HeroSection
	label="// HELP.CENTER"
	title="SUPPORT"
	description="How can we help you today?"
	stats={[
		{ value: '<24H', label: 'RESPONSE' },
		{ value: '98%', label: 'RESOLVED' },
		{ value: '24/7', label: 'MONITORING' }
	]}
/>

<!-- Description Section -->
<DescriptionSection
	description="Get technical support and assistance from the MostlyWhat Systems team. Browse our knowledge base, use our guided troubleshooter, or submit a ticket for personalized help."
	stats={[
		{ value: 'DOCS', label: 'ARTICLES' },
		{ value: 'LIVE', label: 'STATUS' }
	]}
/>

<!-- Search Bar Section -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<div class="mx-auto max-w-2xl">
			<form onsubmit={handleSearch}>
				<div class="relative">
					<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for help articles, guides, and documentation..."
						class="font-body h-14 w-full border border-border bg-background pl-12 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:text-base"
					/>
					<button
						type="submit"
						class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
					>
						SEARCH
					</button>
				</div>
			</form>

			<!-- Quick Links -->
			<div class="font-mono mt-4 flex flex-wrap justify-center gap-4 text-[10px] tracking-wider text-muted-foreground">
				<span>POPULAR:</span>
				<a href={localizeHref('/support/reporting-bugs')} class="text-primary hover:underline">BUG REPORTS</a>
				<a href={localizeHref('/support/response-times')} class="text-primary hover:underline">RESPONSE TIMES</a>
				<a href={localizeHref('/support/billing-payments')} class="text-primary hover:underline">BILLING</a>
			</div>
		</div>
	</div>
</section>

<!-- Main Action Tiles - 3 Big Tiles -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each mainTiles as { icon: Icon, title, desc, action, href, featured }, i (title)}
			<a
				href={localizeHref(href)}
				class="col-span-12 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-4 md:px-8 lg:px-12 {featured ? 'border-l-4 border-l-primary' : ''}"
			>
				<div class="mb-4 flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border {featured ? 'border-primary bg-primary/10' : 'border-border bg-card'}">
						<Icon class="h-5 w-5 {featured ? 'text-primary' : 'text-muted-foreground'}" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">0{i + 1}</span>
				</div>
				<h3 class="font-ui text-sm font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
				<span class="font-mono mt-6 flex items-center gap-2 text-[10px] tracking-wider text-primary">
					{action}
					<ArrowRight class="h-3 w-3" />
				</span>
			</a>
		{/each}
	</div>
</section>

<!-- Category Tiles -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// BROWSE.TOPICS</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">HELP CATEGORIES</h2>
		</div>
		
		<!-- Category Grid -->
		{#each categories as { icon: Icon, title, desc, href, articles } (title)}
			<a
				href={localizeHref(href)}
				class="col-span-12 flex items-start gap-4 bg-background px-6 py-6 transition-colors hover:bg-card sm:col-span-6 md:px-12 lg:col-span-4 lg:px-16"
				use:scrollAnimate={{ animation: 'fade' }}
			>
				<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<h3 class="font-ui text-xs font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">{desc}</p>
					<span class="font-mono mt-2 inline-flex items-center gap-1 text-[10px] tracking-wider text-primary">
						{articles} {articles === 1 ? 'ARTICLE' : 'ARTICLES'}
						<ArrowRight class="h-2.5 w-2.5" />
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>

<!-- Quick Help CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Submit Ticket Card -->
		<a 
			href={localizeHref('/support/submit-ticket')} 
			class="col-span-12 flex flex-col justify-between bg-background px-6 py-12 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:px-16"
			use:scrollAnimate={{ animation: 'fade' }}
		>
			<div>
				<div class="flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
					<Send class="h-6 w-6 text-primary" />
				</div>
				<h3 class="font-display mt-6 text-2xl font-bold uppercase">SUBMIT A TICKET</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Can't find what you're looking for? Submit a support ticket and our team will get back to you within 24 hours.
				</p>
			</div>
			<span class="font-mono mt-6 flex items-center gap-2 text-[10px] tracking-wider text-primary">
				CREATE TICKET
				<ArrowRight class="h-3 w-3" />
			</span>
		</a>

		<!-- Urgent Contact Card -->
		<div class="col-span-12 flex flex-col justify-between bg-card px-6 py-12 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div>
				<div class="flex h-12 w-12 items-center justify-center border border-destructive bg-destructive/10">
					<Zap class="h-6 w-6 text-destructive" />
				</div>
				<h3 class="font-display mt-6 text-2xl font-bold uppercase">URGENT ISSUES</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					For critical issues like site outages or security concerns, contact our emergency support line directly.
				</p>
			</div>
			<div class="mt-6">
				<a
					href="mailto:urgent@mostlywhat.com"
					class="font-mono flex items-center gap-2 text-[10px] tracking-wider text-primary hover:underline"
				>
					urgent@mostlywhat.com
					<ArrowRight class="h-3 w-3" />
				</a>
				<p class="font-body mt-2 text-[11px] text-muted-foreground">Response within 2 hours</p>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section id="faq" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Title -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FAQ.SUPPORT</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">Quick answers to frequently asked questions about our support.</p>
		</div>
		<!-- Right: Accordion -->
		<div class="col-span-12 bg-background lg:col-span-6">
			<Accordion.Root type="single" class="w-full divide-y divide-border border-t border-border lg:border-t-0">
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
