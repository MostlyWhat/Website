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
		FileText,
		Mail,
		Phone,
		ExternalLink,
		CheckCircle,
		AlertTriangle,
		HelpCircle,
		LifeBuoy,
		MessagesSquare
	} from '@lucide/svelte';

	// Main support options - large tiles
	const supportOptions = [
		{
			icon: MessageCircleQuestion,
			title: 'TROUBLESHOOTER',
			desc: 'Diagnose your issue step by step with our interactive guide. Get solutions tailored to your specific problem.',
			href: '/support/troubleshooter',
			highlight: true
		},
		{
			icon: BookOpen,
			title: 'KNOWLEDGE BASE',
			desc: 'Browse our comprehensive documentation and help articles for detailed guides and tutorials.',
			href: '/support/articles',
			highlight: false
		},
		{
			icon: Ticket,
			title: 'SUBMIT TICKET',
			desc: 'Can\'t find what you need? Submit a support ticket and our team will get back to you within 24 hours.',
			href: '/support/submit-ticket',
			highlight: false
		}
	];

	// Quick help categories
	const categories = [
		{ icon: Rocket, title: 'GETTING STARTED', desc: 'New to the platform? Start here.', href: '/support/getting-started' },
		{ icon: Bug, title: 'TROUBLESHOOTING', desc: 'Common issues & fixes.', href: '/support/reporting-bugs' },
		{ icon: Clock, title: 'RESPONSE TIMES', desc: 'Our support SLAs.', href: '/support/response-times' },
		{ icon: CreditCard, title: 'BILLING', desc: 'Invoices & payments.', href: '/support/billing-payments' },
		{ icon: Settings, title: 'PROJECT UPDATES', desc: 'Change requests & revisions.', href: '/support/project-updates' },
		{ icon: FileText, title: 'PROJECT HANDOFF', desc: 'Delivery & documentation.', href: '/support/project-handoff' }
	];

	// FAQ items
	const faq = [
		{
			q: 'What is your typical response time?',
			a: 'We aim to respond to all support requests within 24 hours during business days. Critical issues are prioritized and addressed within 2 hours. Our average response time is under 4 hours for standard requests.'
		},
		{
			q: 'How do I report a bug or issue?',
			a: 'Use the ticket form with detailed steps to reproduce the issue. Include screenshots, browser info, affected URL, and any error messages. The more detail you provide, the faster we can resolve your issue.'
		},
		{
			q: 'Do you offer phone support?',
			a: 'We provide scheduled calls for active clients. Contact us to arrange a call for complex issues that require real-time discussion. Emergency support is available for critical production issues.'
		},
		{
			q: 'What information should I include in my support request?',
			a: 'Include your project name, affected URL, browser/device info, steps to reproduce, expected vs actual behavior, and any error messages or screenshots. This helps us diagnose issues quickly.'
		},
		{
			q: 'How can I check the status of my support ticket?',
			a: 'You\'ll receive email updates at each stage of resolution. For urgent matters, you can reply to the ticket email or submit a new ticket referencing your original case number.'
		},
		{
			q: 'What\'s covered under maintenance support?',
			a: 'Maintenance plans include bug fixes, security updates, CMS content updates, and minor UI adjustments. Feature additions and major changes are quoted separately.'
		}
	];

	// Support stats
	const supportStats = [
		{ value: '<4H', label: 'AVG RESPONSE' },
		{ value: '98%', label: 'RESOLUTION' },
		{ value: '24/7', label: 'MONITORING' }
	];
</script>

<svelte:head>
	<title>Support — {m.site_name()}</title>
	<meta name="description" content="Get technical support and assistance from the MostlyWhat Systems team. Browse documentation, use our troubleshooter, or submit a ticket." />
</svelte:head>

<!-- Hero Section -->
<HeroSection
	label="// HELP.CENTER"
	title="SUPPORT"
	description="How can we help you today?"
/>

<!-- Description Section -->
<DescriptionSection
	description="Get technical support and assistance from our team. Browse our knowledge base, use our guided troubleshooter, or submit a ticket for personalized help."
	stats={supportStats}
/>

<!-- Search Bar Section -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<a 
			href={localizeHref('/search')} 
			class="mx-auto flex h-14 max-w-2xl items-center gap-4 border border-border bg-background px-6 text-muted-foreground transition-all hover:border-primary hover:bg-primary/5"
		>
			<Search class="h-5 w-5 text-primary" />
			<span class="font-body text-sm">Search for help articles, guides, and more...</span>
			<span class="font-mono ml-auto hidden text-[10px] tracking-wider text-muted-foreground sm:block">PRESS / TO SEARCH</span>
		</a>
	</div>
</section>

<!-- Main Support Options - Large Tiles -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — GET HELP</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">CHOOSE YOUR PATH</h2>
		<p class="font-body mt-4 max-w-xl text-muted-foreground">Select the option that best fits your needs. We're here to help you succeed.</p>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each supportOptions as { icon: Icon, title, desc, href, highlight } (title)}
			<a
				href={localizeHref(href)}
				class="col-span-12 flex flex-col bg-background px-6 py-10 transition-colors hover:bg-card md:col-span-4 md:px-12 lg:px-16 {highlight ? 'border-l-2 border-l-primary' : ''}"
			>
				<div class="flex items-start justify-between">
					<div class="flex h-14 w-14 items-center justify-center border border-border bg-card {highlight ? 'border-primary bg-primary/10' : ''}">
						<Icon class="h-6 w-6 text-primary" />
					</div>
					<ArrowRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
				<span class="font-mono mt-6 flex items-center gap-2 text-xs tracking-wider text-primary">
					{highlight ? 'RECOMMENDED' : 'GET STARTED'}
					<ArrowRight class="h-3.5 w-3.5" />
				</span>
			</a>
		{/each}
	</div>
</section>

<!-- Quick Help Categories -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — BROWSE TOPICS</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">QUICK HELP</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each categories as { icon: Icon, title, desc, href } (title)}
			<a
				href={localizeHref(href)}
				class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 transition-colors hover:bg-card sm:col-span-6 md:px-12 lg:col-span-4 lg:px-16"
			>
				<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-border bg-card">
					<Icon class="h-5 w-5 text-primary" />
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

<!-- Urgent Support Banner -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex items-center justify-between bg-card px-6 py-6 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-destructive/50 bg-destructive/10">
					<AlertTriangle class="h-5 w-5 text-destructive" />
				</div>
				<div>
					<h3 class="font-ui text-sm font-semibold tracking-wider">URGENT ISSUES</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">Critical issues, site outages, security concerns</p>
				</div>
			</div>
			<a href="mailto:urgent@mostlywhat.com" class="font-mono flex items-center gap-2 text-xs tracking-wider text-destructive hover:underline">
				<Mail class="h-4 w-4" />
				CONTACT
			</a>
		</div>
		<a 
			href={localizeHref('/status')}
			class="col-span-12 flex items-center justify-between bg-background px-6 py-6 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:px-16"
			use:scrollAnimate={{ animation: 'fade' }}
		>
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-green-500/50 bg-green-500/10">
					<CheckCircle class="h-5 w-5 text-green-500" />
				</div>
				<div>
					<h3 class="font-ui text-sm font-semibold tracking-wider">SYSTEM STATUS</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">All systems operational</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<span class="font-mono text-xs tracking-wider text-green-500">VIEW STATUS</span>
				<ExternalLink class="h-4 w-4 text-green-500" />
			</div>
		</a>
	</div>
</section>

<!-- FAQ Section -->
<section id="faq" class="border-b border-border">
	<div class="grid grid-cols-12">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-4 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — FAQ</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">Quick answers to frequently asked questions about our support services.</p>
			<div class="mt-8 flex flex-col gap-3">
				<div class="flex items-center gap-3">
					<HelpCircle class="h-4 w-4 text-primary" />
					<span class="font-mono text-xs text-muted-foreground">Can't find your answer?</span>
				</div>
				<a href={localizeHref('/support/submit-ticket')} class="font-ui inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-primary hover:underline">
					SUBMIT A TICKET
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
		</div>
		<div class="col-span-12 border-t border-border bg-background lg:col-span-8 lg:border-l lg:border-t-0">
			<Accordion.Root type="single" class="w-full divide-y divide-border">
				{#each faq as { q, a }, i (i)}
					<Accordion.Item value="item-{i}">
						<Accordion.Trigger class="px-6 md:px-12 lg:px-16">{q}</Accordion.Trigger>
						<Accordion.Content>
							<p class="font-body max-w-xl px-6 pb-6 text-sm leading-relaxed text-muted-foreground md:px-12 lg:px-16">{a}</p>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	</div>
</section>

<!-- Contact Methods -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">04 — CONTACT</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">REACH OUT</h2>
		<p class="font-body mt-4 max-w-xl text-muted-foreground">Multiple ways to get in touch with our team.</p>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="col-span-12 flex items-center gap-6 bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<Mail class="h-5 w-5 text-primary" />
			</div>
			<div>
				<h3 class="font-ui text-sm font-semibold tracking-wider">EMAIL</h3>
				<a href="mailto:support@mostlywhat.com" class="font-mono mt-1 block text-xs text-primary hover:underline">support@mostlywhat.com</a>
			</div>
		</div>
		<div class="col-span-12 flex items-center gap-6 bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
				<MessagesSquare class="h-5 w-5 text-primary" />
			</div>
			<div>
				<h3 class="font-ui text-sm font-semibold tracking-wider">LIVE CHAT</h3>
				<span class="font-mono mt-1 block text-xs text-muted-foreground">Mon-Fri, 9AM-6PM</span>
			</div>
		</div>
		<div class="col-span-12 flex items-center gap-6 bg-card px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
				<Phone class="h-5 w-5 text-primary" />
			</div>
			<div>
				<h3 class="font-ui text-sm font-semibold tracking-wider">PHONE</h3>
				<span class="font-mono mt-1 block text-xs text-muted-foreground">By appointment</span>
			</div>
		</div>
		<div class="col-span-12 flex items-center gap-6 bg-background px-6 py-8 sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<LifeBuoy class="h-5 w-5 text-primary" />
			</div>
			<div>
				<h3 class="font-ui text-sm font-semibold tracking-wider">PRIORITY</h3>
				<span class="font-mono mt-1 block text-xs text-muted-foreground">For active clients</span>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<CTASection
	variant="split"
	label="STILL NEED HELP?"
	title="START A CONVERSATION"
	description="Can't find what you're looking for? Our team is ready to help with your specific needs."
	buttonText="CONTACT US"
	buttonHref="/contact"
	secondaryButtonText="VIEW DOCS"
	secondaryButtonHref="/docs"
	stats={[
		{ value: '<24H', label: 'AVG RESPONSE' },
		{ value: '98%', label: 'SATISFACTION' }
	]}
/>
