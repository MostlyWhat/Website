<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
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
			title: 'HELP CENTER',
			desc: 'Find answers to common questions',
			action: 'BROWSE FAQ',
			href: '/help'
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

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Grid Background -->
	<div class="pointer-events-none absolute inset-0 -z-10">
		<div class="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-end px-4 pb-8 md:px-6 lg:px-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ASSISTANCE</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					SUPPORT
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">
					Technical support and assistance for your projects. We're here to help.
				</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		{#each stats as { value, label }}
			<div class="col-span-4 bg-card/80 p-4 backdrop-blur-sm">
				<span class="font-display text-lg font-bold text-primary md:text-2xl">{value}</span>
				<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Support Channels -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each supportChannels as { icon: Icon, title, desc, action, href }}
			<a
				{href}
				class="stagger-children col-span-12 flex flex-col bg-background p-6 transition-colors hover:bg-card md:col-span-6 lg:col-span-3"
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
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-7 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
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
			<div class="flex-1 bg-card p-6 md:p-8" use:scrollAnimate={{ animation: 'fade' }}>
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

<!-- FAQ Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Heading -->
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-4 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK ANSWERS</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">FAQ</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">
				Common questions about our support process.
			</p>
			<Button href={localizeHref('/help')} variant="outline" class="font-ui mt-6 tracking-wider">
				VIEW ALL FAQ
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>

		<!-- Questions -->
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:col-span-8" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each faq as { q, a }}
				<div class="stagger-children bg-background p-6 md:p-8">
					<h3 class="font-ui text-sm font-semibold tracking-wider">{q}</h3>
					<p class="font-body mt-2 text-[11px] text-muted-foreground">{a}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="bg-background p-6 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED MORE HELP?</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase">START A CONVERSATION</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Can't find what you're looking for? Let's talk about your project needs.
			</p>
			<div class="mt-6 flex gap-2">
				<Button href={localizeHref('/contact')} class="font-ui tracking-wider">
					CONTACT US
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
				<Button href={localizeHref('/help')} variant="outline" class="font-ui tracking-wider">
					HELP CENTER
				</Button>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-px bg-border">
			<div class="flex flex-col justify-center bg-card p-6">
				<Clock class="mb-2 h-5 w-5 text-primary" />
				<span class="font-display text-2xl font-bold text-primary">&lt;24H</span>
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">AVG RESPONSE</p>
			</div>
			<div class="flex flex-col justify-center bg-card p-6">
				<CheckCircle class="mb-2 h-5 w-5 text-primary" />
				<span class="font-display text-2xl font-bold text-primary">98%</span>
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SATISFACTION</p>
			</div>
			<div class="col-span-2 flex items-center justify-center bg-primary/10 p-6">
				<div class="text-center">
					<MessageSquare class="mx-auto mb-2 h-6 w-6 text-primary" />
					<p class="font-ui text-xs font-semibold tracking-wider">RESPONSIVE SUPPORT</p>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">We're here when you need us</p>
				</div>
			</div>
		</div>
	</div>
</section>
