<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { siteConfig, getMailtoLink } from '$lib/config/site';
	import {
		MessageCircleQuestion,
		Ticket,
		ArrowRight,
		Clock,
		Mail,
		LifeBuoy,
		CheckCircle,
		HelpCircle,
		LogIn,
		ExternalLink
	} from '@lucide/svelte';

	// FAQ items - simplified
	const faq = [
		{
			q: 'What is your typical response time?',
			a: 'We aim to respond to all support requests within 24 hours during business days. Critical issues are prioritized and addressed within 2 hours.'
		},
		{
			q: 'How do I report a bug or issue?',
			a: 'Log into your client portal and submit a support ticket with detailed steps to reproduce the issue, including screenshots and browser info.'
		},
		{
			q: 'Do you offer phone support?',
			a: 'We provide scheduled calls for active clients. Contact us through your client portal to arrange a call for complex issues.'
		},
		{
			q: 'What\'s covered under maintenance support?',
			a: 'Maintenance plans include bug fixes, security updates, CMS content updates, and minor UI adjustments. Feature additions are quoted separately.'
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
	<meta name="description" content="Get technical support and assistance from the MostlyWhat Systems team." />
</svelte:head>

<!-- Hero Section -->
<HeroSection
	label="// HELP.CENTER"
	title="SUPPORT"
	description="How can we help you today?"
/>

<!-- Description Section -->
<DescriptionSection
	description="Get technical support and assistance from our team. For the best support experience, please log into your client portal."
	stats={supportStats}
/>

<!-- Client Portal Section - Primary CTA -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Header -->
		<div class="col-span-12 bg-primary/5 px-6 py-12 md:px-12 lg:col-span-5 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex h-16 w-16 items-center justify-center border border-primary/30 bg-primary/10">
				<LogIn class="h-8 w-8 text-primary" />
			</div>
			<h2 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">CLIENT PORTAL</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Sign in to access your personalized support experience with faster response times and project context.
			</p>
			<div class="mt-8 flex flex-wrap items-center gap-4">
				<a
					href={localizeHref('/auth/login?redirectTo=/app/help')}
					class="font-mono inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-xs tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<LogIn class="h-4 w-4" />
					SIGN IN
				</a>
				<a
					href={localizeHref('/auth/register')}
					class="font-mono inline-flex items-center gap-2 border border-border bg-background px-6 py-3 text-xs tracking-wider transition-colors hover:bg-card"
				>
					CREATE ACCOUNT
				</a>
			</div>
		</div>
		<!-- Quick Access Cards -->
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-7" use:scrollAnimate={{ animation: 'stagger' }}>
			<a
				href={localizeHref('/auth/login?redirectTo=/app/help')}
				class="col-span-2 flex items-center gap-4 bg-background px-6 py-6 transition-colors hover:bg-card sm:col-span-1"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-card">
					<HelpCircle class="h-5 w-5 text-primary" />
				</div>
				<div class="min-w-0">
					<h3 class="font-ui text-sm font-semibold tracking-wider">KNOWLEDGE BASE</h3>
					<p class="font-body mt-1 truncate text-xs text-muted-foreground">Browse help articles</p>
				</div>
				<ArrowRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
			</a>
			<a
				href={localizeHref('/auth/login?redirectTo=/app/help/troubleshooter')}
				class="col-span-2 flex items-center gap-4 bg-card px-6 py-6 transition-colors hover:bg-background sm:col-span-1"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background">
					<MessageCircleQuestion class="h-5 w-5 text-primary" />
				</div>
				<div class="min-w-0">
					<h3 class="font-ui text-sm font-semibold tracking-wider">TROUBLESHOOTER</h3>
					<p class="font-body mt-1 truncate text-xs text-muted-foreground">Guided problem solving</p>
				</div>
				<ArrowRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
			</a>
			<a
				href={localizeHref('/auth/login?redirectTo=/app/tickets')}
				class="col-span-2 flex items-center gap-4 bg-card px-6 py-6 transition-colors hover:bg-background sm:col-span-1"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background">
					<Ticket class="h-5 w-5 text-primary" />
				</div>
				<div class="min-w-0">
					<h3 class="font-ui text-sm font-semibold tracking-wider">SUPPORT TICKETS</h3>
					<p class="font-body mt-1 truncate text-xs text-muted-foreground">Submit & track requests</p>
				</div>
				<ArrowRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
			</a>
			<a
				href={localizeHref('/auth/login?redirectTo=/app/projects')}
				class="col-span-2 flex items-center gap-4 bg-background px-6 py-6 transition-colors hover:bg-card sm:col-span-1"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-card">
					<LifeBuoy class="h-5 w-5 text-primary" />
				</div>
				<div class="min-w-0">
					<h3 class="font-ui text-sm font-semibold tracking-wider">MY PROJECTS</h3>
					<p class="font-body mt-1 truncate text-xs text-muted-foreground">View project status</p>
				</div>
				<ArrowRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
			</a>
		</div>
	</div>
</section>

<!-- What You Get Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PORTAL FEATURES</span>
		<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">WHAT YOU GET</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		<div class="col-span-12 flex flex-col bg-background px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<MessageCircleQuestion class="h-5 w-5 text-primary" />
			</div>
			<h3 class="font-ui mt-6 text-sm font-semibold tracking-wider">GUIDED TROUBLESHOOTER</h3>
			<p class="font-body mt-2 text-sm text-muted-foreground">Interactive step-by-step diagnosis to quickly identify and resolve common issues.</p>
		</div>
		<div class="col-span-12 flex flex-col bg-card px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
				<Ticket class="h-5 w-5 text-primary" />
			</div>
			<h3 class="font-ui mt-6 text-sm font-semibold tracking-wider">SUPPORT TICKETS</h3>
			<p class="font-body mt-2 text-sm text-muted-foreground">Submit and track tickets with your project context automatically included.</p>
		</div>
		<div class="col-span-12 flex flex-col bg-background px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<Clock class="h-5 w-5 text-primary" />
			</div>
			<h3 class="font-ui mt-6 text-sm font-semibold tracking-wider">PRIORITY RESPONSE</h3>
			<p class="font-body mt-2 text-sm text-muted-foreground">Logged-in clients receive faster response times and personalized support.</p>
		</div>
	</div>
</section>

<!-- Quick Help Links -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — QUICK LINKS</span>
		<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">PUBLIC RESOURCES</h2>
	</div>
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		<a
			href={localizeHref('/status')}
			class="col-span-12 flex items-center justify-between bg-background px-6 py-6 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:px-16"
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
			<ExternalLink class="h-4 w-4 text-muted-foreground" />
		</a>
		<a
			href={localizeHref('/docs')}
			class="col-span-12 flex items-center justify-between bg-card px-6 py-6 transition-colors hover:bg-background md:col-span-6 md:px-12 lg:px-16"
		>
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
					<HelpCircle class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h3 class="font-ui text-sm font-semibold tracking-wider">DOCUMENTATION</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">Technical docs & guides</p>
				</div>
			</div>
			<ExternalLink class="h-4 w-4 text-muted-foreground" />
		</a>
	</div>
</section>

<!-- FAQ Section -->
<section id="faq" class="border-b border-border">
	<div class="grid grid-cols-12">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-4 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — FAQ</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">Quick answers to frequently asked questions.</p>
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

<!-- Contact Section - Minimal -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex items-center justify-between bg-background px-6 py-8 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
					<Mail class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h3 class="font-ui text-sm font-semibold tracking-wider">GENERAL INQUIRIES</h3>
					<a href={getMailtoLink('support')} class="font-mono mt-1 block text-xs text-primary hover:underline">{siteConfig.emails.support}</a>
				</div>
			</div>
		</div>
		<div class="col-span-12 flex items-center justify-between bg-card px-6 py-8 md:col-span-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
					<LifeBuoy class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h3 class="font-ui text-sm font-semibold tracking-wider">ACTIVE CLIENTS</h3>
					<span class="font-mono mt-1 block text-xs text-muted-foreground">Login for priority support</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<CTASection
	variant="split"
	label="GET STARTED"
	title="ACCESS YOUR PORTAL"
	description="Sign in to access the full support experience including troubleshooter, tickets, and knowledge base."
	buttonText="SIGN IN"
	buttonHref="/auth/login?redirectTo=/app/help"
	secondaryButtonText="CREATE ACCOUNT"
	secondaryButtonHref="/auth/register"
	stats={[
		{ value: '<24H', label: 'AVG RESPONSE' },
		{ value: '98%', label: 'SATISFACTION' }
	]}
/>
