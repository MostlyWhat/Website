<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Accordion from '$lib/components/ui/accordion';
	import {
		MessageSquare,
		Mail,
		Clock,
		CheckCircle,
		ArrowRight,
		Send,
		Ticket,
		FileQuestion,
		BookOpen,
		Zap
	} from '@lucide/svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let priority = $state('normal');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	const stats = [
		{ value: '<24H', label: 'RESPONSE TIME' },
		{ value: '98%', label: 'RESOLVED' },
		{ value: '24/7', label: 'MONITORING' }
	];

	const supportChannels = [
		{
			icon: Ticket,
			title: 'SUBMIT A TICKET',
			desc: 'Create a support ticket for detailed issues',
			action: 'OPEN FORM',
			href: '#ticket-form'
		},
		{
			icon: Mail,
			title: 'EMAIL SUPPORT',
			desc: 'Reach us directly at support@mostlywhat.com',
			action: 'SEND EMAIL',
			href: 'mailto:support@mostlywhat.com'
		},
		{
			icon: BookOpen,
			title: 'DOCUMENTATION',
			desc: 'Browse our technical documentation',
			action: 'VIEW DOCS',
			href: '/docs'
		},
		{
			icon: FileQuestion,
			title: 'FAQ',
			desc: 'Find answers to common questions',
			action: 'BROWSE FAQ',
			href: '#faq'
		}
	];

	const faq = [
		{
			q: 'What is your typical response time?',
			a: 'We aim to respond to all support requests within 24 hours during business days. Critical issues are prioritized.'
		},
		{
			q: 'How do I report a bug or issue?',
			a: 'Use the ticket form below with detailed steps to reproduce the issue. Include screenshots if possible.'
		},
		{
			q: 'Do you offer phone support?',
			a: 'We provide scheduled calls for active clients. Contact us to arrange a call for complex issues.'
		},
		{
			q: 'What information should I include in my support request?',
			a: 'Include your project name, affected URL, browser/device info, steps to reproduce, and any error messages.'
		}
	];

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

<HeroSection label="// HELP.CENTER" title="SUPPORT" />

<!-- Description Section -->
<DescriptionSection
	description="Technical support and assistance for your projects. We're here to help."
	{stats}
/>

<!-- Support Channels -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each supportChannels as { icon: Icon, title, desc, action, href } (title)}
			<a
				{href}
				class="col-span-12 flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:col-span-3 lg:px-16"
			>
				<Icon class="mb-4 h-6 w-6 text-primary" />
				<h3 class="font-ui text-xs font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-2 flex-1 text-[11px] text-muted-foreground">{desc}</p>
				<span class="font-mono mt-4 flex items-center gap-2 text-[10px] tracking-wider text-primary">
					{action}
					<ArrowRight class="h-3 w-3" />
				</span>
			</a>
		{/each}
	</div>
</section>

<!-- Ticket Form Section -->
<section id="ticket-form" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Form Side -->
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-7 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE TICKET</span>
			<h2 class="font-display mt-2 text-3xl font-bold uppercase md:text-4xl">SUBMIT A REQUEST</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">
				Fill out the form below and we'll get back to you as soon as possible.
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
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">WHAT TO EXPECT</span>
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

<!-- FAQ Section - 50/50 Layout -->
<section id="faq" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Title -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK ANSWERS</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-muted-foreground">Common questions about our support process.</p>
		</div>
		<!-- Right: Accordion -->
		<div class="col-span-12 bg-card lg:col-span-6">
			<Accordion.Root type="single" class="w-full">
				{#each faq as { q, a }, i (i)}
					<Accordion.Item value="item-{i}" class="bg-card">
						<Accordion.Trigger class="font-ui text-xs">{q}</Accordion.Trigger>
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
