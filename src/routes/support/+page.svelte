<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Accordion from '$lib/components/ui/accordion';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import {
		Search,
		MessageCircleQuestion,
		BookOpen,
		Ticket,
		ArrowRight,
		Send,
		CheckCircle,
		Zap,
		Bug,
		Clock,
		CreditCard,
		Rocket,
		Settings,
		FileText
	} from '@lucide/svelte';

	let searchQuery = $state('');
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let priority = $state('normal');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	// Main action tiles
	const mainTiles = [
		{
			icon: MessageCircleQuestion,
			title: 'GUIDED TROUBLESHOOTER',
			desc: 'Answer a few questions and we\'ll help diagnose your issue step by step.',
			action: 'START DIAGNOSIS',
			href: '/support/troubleshooting-guide',
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
			href: '#ticket-form'
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

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		isSubmitted = true;
		isSubmitting = false;
	}
</script>

<svelte:head>
	<title>Support — {m.site_name()}</title>
	<meta name="description" content="Get technical support and assistance from the MostlyWhat Systems team." />
</svelte:head>

<!-- Hero Section with Search -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Video Background -->
	<VideoBackground src={MARATHON_VIDEO} class="brightness-[0.60]" />
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col items-center justify-center px-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="w-full max-w-2xl text-center">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// HELP.CENTER</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
				<GlitchText text="SUPPORT" scrambledStart={true} hoverOnly={false} />
			</h1>
			<p class="font-body mt-4 text-sm text-muted-foreground md:text-base">
				How can we help you today?
			</p>

			<!-- Search Bar -->
			<form class="mt-8" onsubmit={handleSearch}>
				<div class="relative">
					<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for help articles, guides, and documentation..."
						class="font-body h-14 w-full border border-border bg-background/90 pl-12 pr-4 text-sm backdrop-blur-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:text-base"
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
				<a href="/support/reporting-bugs" class="text-primary hover:underline">BUG REPORTS</a>
				<a href="/support/response-times" class="text-primary hover:underline">RESPONSE TIMES</a>
				<a href="/support/billing-payments" class="text-primary hover:underline">BILLING</a>
			</div>
		</div>
	</div>

	<!-- Stats Bar at Bottom -->
	<div class="border-t border-border">
		<div class="grid grid-cols-3 divide-x divide-border">
			<div class="bg-background/80 px-6 py-4 text-center backdrop-blur-sm">
				<span class="font-display block text-2xl font-bold text-primary">&lt;24H</span>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RESPONSE TIME</span>
			</div>
			<div class="bg-background/80 px-6 py-4 text-center backdrop-blur-sm">
				<span class="font-display block text-2xl font-bold text-primary">98%</span>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RESOLVED</span>
			</div>
			<div class="bg-background/80 px-6 py-4 text-center backdrop-blur-sm">
				<span class="font-display block text-2xl font-bold text-primary">24/7</span>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MONITORING</span>
			</div>
		</div>
	</div>
</section>

<!-- Main Action Tiles - 3 Big Tiles -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each mainTiles as { icon: Icon, title, desc, action, href, featured }, i (title)}
			<a
				{href}
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
				{href}
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

<!-- Ticket Form Section -->
<section id="ticket-form" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Form Side -->
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-7 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// TICKET.CREATE</span>
			<h2 class="font-display mt-2 text-3xl font-bold uppercase md:text-4xl">SUBMIT A REQUEST</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">
				Fill out the form below and we'll get back to you within 24 hours.
			</p>

			{#if isSubmitted}
				<div class="mt-8 border border-primary/20 bg-primary/5 p-6" use:scrollAnimate={{ animation: 'scale' }}>
					<div class="flex items-center gap-3">
						<CheckCircle class="h-6 w-6 text-primary" />
						<div>
							<h3 class="font-ui text-sm font-semibold tracking-wider">TICKET SUBMITTED</h3>
							<p class="font-body mt-1 text-sm text-muted-foreground">
								We've received your request. You'll hear from us within 24 hours.
							</p>
						</div>
					</div>
					<Button 
						variant="outline" 
						class="font-ui mt-4 tracking-wider" 
						onclick={() => {
							isSubmitted = false;
							name = '';
							email = '';
							subject = '';
							message = '';
						}}
					>
						SUBMIT ANOTHER
					</Button>
				</div>
			{:else}
				<form class="mt-8 space-y-6" onsubmit={handleSubmit}>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label class="font-mono text-[10px] tracking-widest text-muted-foreground" for="name">
								NAME
							</label>
							<Input
								id="name"
								type="text"
								bind:value={name}
								required
								class="font-body mt-2"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label class="font-mono text-[10px] tracking-widest text-muted-foreground" for="email">
								EMAIL
							</label>
							<Input
								id="email"
								type="email"
								bind:value={email}
								required
								class="font-body mt-2"
								placeholder="you@example.com"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label class="font-mono text-[10px] tracking-widest text-muted-foreground" for="subject">
								SUBJECT
							</label>
							<Input
								id="subject"
								type="text"
								bind:value={subject}
								required
								class="font-body mt-2"
								placeholder="Brief description of the issue"
							/>
						</div>
						<div>
							<label class="font-mono text-[10px] tracking-widest text-muted-foreground" for="priority">
								PRIORITY
							</label>
							<select
								id="priority"
								bind:value={priority}
								class="font-body mt-2 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<option value="low">Low - General inquiry</option>
								<option value="normal">Normal - Non-critical issue</option>
								<option value="high">High - Affecting production</option>
								<option value="critical">Critical - Site is down</option>
							</select>
						</div>
					</div>

					<div>
						<label class="font-mono text-[10px] tracking-widest text-muted-foreground" for="message">
							MESSAGE
						</label>
						<Textarea
							id="message"
							bind:value={message}
							required
							rows={6}
							class="font-body mt-2"
							placeholder="Describe your issue in detail. Include steps to reproduce, expected vs actual behavior, and any relevant URLs or error messages."
						/>
					</div>

					<Button type="submit" class="font-ui tracking-wider" disabled={isSubmitting}>
						{#if isSubmitting}
							SUBMITTING...
						{:else}
							SUBMIT TICKET
							<Send class="ml-2 h-4 w-4" />
						{/if}
					</Button>
				</form>
			{/if}
		</div>

		<!-- Info Side -->
		<div class="col-span-12 flex flex-col gap-px bg-border lg:col-span-5">
			<div class="flex-1 bg-card px-6 py-8 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PROCESS.FLOW</span>
				<h3 class="font-display mt-2 text-xl font-bold uppercase">SUPPORT PROCESS</h3>
				
				<div class="mt-6 space-y-4">
					<div class="flex items-start gap-3">
						<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-primary bg-primary/10">
							<span class="font-mono text-xs text-primary">1</span>
						</div>
						<div>
							<p class="font-ui text-xs font-semibold tracking-wider">SUBMIT REQUEST</p>
							<p class="font-body mt-1 text-[11px] text-muted-foreground">Fill out the form with details about your issue</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-primary bg-primary/10">
							<span class="font-mono text-xs text-primary">2</span>
						</div>
						<div>
							<p class="font-ui text-xs font-semibold tracking-wider">TICKET CREATED</p>
							<p class="font-body mt-1 text-[11px] text-muted-foreground">You'll receive a confirmation email with your ticket ID</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-primary bg-primary/10">
							<span class="font-mono text-xs text-primary">3</span>
						</div>
						<div>
							<p class="font-ui text-xs font-semibold tracking-wider">TEAM REVIEW</p>
							<p class="font-body mt-1 text-[11px] text-muted-foreground">Our team reviews and prioritizes your request</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-primary bg-primary/10">
							<span class="font-mono text-xs text-primary">4</span>
						</div>
						<div>
							<p class="font-ui text-xs font-semibold tracking-wider">RESOLUTION</p>
							<p class="font-body mt-1 text-[11px] text-muted-foreground">We work on your issue and keep you updated</p>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-primary/10 p-6">
				<div class="flex items-center gap-3">
					<Zap class="h-5 w-5 text-primary" />
					<div>
						<p class="font-ui text-xs font-semibold tracking-wider">URGENT ISSUES?</p>
						<p class="font-body mt-1 text-[11px] text-muted-foreground">
							For critical issues, email <a href="mailto:urgent@mostlywhat.com" class="text-primary hover:underline">urgent@mostlywhat.com</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section id="faq" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Title -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-5 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FAQ.SUPPORT</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">Quick answers to frequently asked questions about our support.</p>
		</div>
		<!-- Right: Accordion -->
		<div class="col-span-12 bg-background lg:col-span-7">
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
