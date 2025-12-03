<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import * as Accordion from '$lib/components/ui/accordion';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import { siteConfig, getMailtoLink } from '$lib/config/site';
	import { 
		Send, CheckCircle, MessageSquare, FileText, HelpCircle, Headphones,
		ArrowRight, Mail, MapPin, Clock
	} from '@lucide/svelte';

	// Contact form state
	let name = $state('');
	let email = $state('');
	let company = $state('');
	let message = $state('');
	let projectType = $state('');
	let budget = $state('');
	let timeline = $state('');
	let orderId = $state('');
	let urgency = $state('');
	let selectedTopic = $state<string | null>(null);
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let error = $state<string | null>(null);

	// Form configs per topic
	const formConfigs: Record<string, { title: string; description: string; fields: { id: string; label: string; placeholder: string; type?: string; required?: boolean }[] }> = {
		quote: {
			title: 'REQUEST A QUOTE',
			description: 'Tell us about your project and we\'ll provide a detailed estimate.',
			fields: [
				{ id: 'projectType', label: 'PROJECT TYPE', placeholder: 'Website, Web App, Landing Page...', required: true },
				{ id: 'budget', label: 'BUDGET RANGE', placeholder: '$5k-10k, $10k-25k, $25k+...' },
				{ id: 'timeline', label: 'TIMELINE', placeholder: '2 weeks, 1 month, 3 months...' }
			]
		},
		support: {
			title: 'GET SUPPORT',
			description: 'Need help with an existing project? Describe your issue below.',
			fields: [
				{ id: 'orderId', label: 'PROJECT/ORDER ID', placeholder: 'PRJ-XXXX or contract reference' },
				{ id: 'urgency', label: 'URGENCY', placeholder: 'Low, Medium, High, Critical' }
			]
		},
		general: {
			title: 'SEND A MESSAGE',
			description: 'Questions, partnerships, or just want to say hi? We\'d love to hear from you.',
			fields: []
		}
	};

	// Contact options - first section
	const contactOptions = [
		{ 
			id: 'quote', 
			icon: FileText, 
			title: 'PROJECT QUOTE', 
			desc: 'Get a detailed estimate for your project',
			action: 'REQUEST QUOTE'
		},
		{ 
			id: 'support', 
			icon: Headphones, 
			title: 'SUPPORT', 
			desc: 'Technical help for existing clients',
			action: 'GET SUPPORT'
		},
		{ 
			id: 'general', 
			icon: MessageSquare, 
			title: 'GENERAL INQUIRY', 
			desc: 'Questions, partnerships, or just say hi',
			action: 'SEND MESSAGE'
		},
		{ 
			id: 'support-center', 
			icon: HelpCircle, 
			title: 'SUPPORT CENTER', 
			desc: 'Browse FAQs and documentation',
			action: 'VIEW ARTICLES',
			href: '/support'
		}
	];

	// FAQ data - expanded with more questions
	const faqs: { id: string; q: string; a: string }[] = [
		{ 
			id: 'timeline',
			q: 'What is your typical project timeline?', 
			a: 'Most projects take 6-12 weeks from kickoff to launch, depending on scope and complexity. We provide detailed timelines during our discovery phase.' 
		},
		{ 
			id: 'startups',
			q: 'Do you work with startups?', 
			a: 'Yes! We have flexible engagement models for different budgets. We offer phased approaches and MVP development for early-stage companies.' 
		},
		{ 
			id: 'tech',
			q: 'What technologies do you use?', 
			a: 'Our primary stack is SvelteKit, TypeScript, and TailwindCSS, deployed on Cloudflare. We also work with React, Next.js, and various backend technologies.' 
		},
		{ 
			id: 'support',
			q: 'Do you provide ongoing support?', 
			a: 'We offer maintenance packages and can continue post-launch with monitoring, updates, and feature development.' 
		},
		{ 
			id: 'process',
			q: 'What does your process look like?', 
			a: 'We follow a four-phase approach: Discovery & Strategy, Design & Prototyping, Development & Testing, and Launch & Support.' 
		},
		{ 
			id: 'remote',
			q: 'Can you work with remote clients?', 
			a: 'Absolutely! We work with clients globally using async communication, scheduled calls, and collaborative tools like Figma and GitHub.' 
		},
		{ 
			id: 'pricing',
			q: 'How do you price your services?', 
			a: 'We offer both fixed-price projects and time-and-materials engagements. Pricing depends on scope, timeline, and complexity. Contact us for a custom quote.' 
		},
		{ 
			id: 'revisions',
			q: 'How many revisions are included?', 
			a: 'Our projects include 2-3 revision rounds per phase. We collaborate closely throughout to minimize surprises and ensure alignment.' 
		}
	];

	// Contact info
	const contactInfo = [
		{ icon: Mail, label: 'EMAIL', value: siteConfig.emails.hello, href: getMailtoLink('hello') },
		{ icon: MapPin, label: 'LOCATION', value: 'Remote • Global', href: null },
		{ icon: Clock, label: 'RESPONSE', value: '~24 hours', href: null }
	];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, company, message, topic: selectedTopic })
			});

			if (!response.ok) throw new Error('Failed to send message');
			isSubmitted = true;
			name = ''; email = ''; company = ''; message = '';
		} catch (err) {
			error = 'Something went wrong. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function selectTopic(id: string) {
		selectedTopic = id;
	}
</script>

<svelte:head>
	<title>{m.contact_title()} — {m.site_name()}</title>
	<meta name="description" content={m.contact_subtitle()} />
</svelte:head>

<HeroSection label="// CONNECT.START" title={m.contact_title()} />

<!-- Description + Contact Options -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:col-span-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">GET IN TOUCH</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">SELECT YOUR<br />REASON</h2>
			<p class="font-body mt-4 text-sm leading-relaxed text-muted-foreground">
				Choose the option that best describes your needs. This helps us route your message to the right team.
			</p>
		</div>
		{#each contactOptions as { id, icon: Icon, title, desc, action, href } (id)}
			{#if href}
				<a
					href={localizeHref(href)}
					class="group col-span-6 flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:col-span-2 md:px-6"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<Icon class="h-4 w-4 text-primary" />
					</div>
					<h3 class="font-ui mt-4 text-xs font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-2 flex-1 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
					<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
						{action}
						<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
					</span>
				</a>
			{:else}
				<button
					type="button"
					onclick={() => selectTopic(id)}
					class="group col-span-6 flex flex-col bg-background px-6 py-6 text-left transition-colors hover:bg-card md:col-span-2 md:px-6 {selectedTopic === id ? 'bg-primary/10 ring-1 ring-inset ring-primary' : ''}"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<Icon class="h-4 w-4 text-primary" />
					</div>
					<h3 class="font-ui mt-4 text-xs font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-2 flex-1 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
					<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
						{action}
						<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
					</span>
				</button>
			{/if}
		{/each}
	</div>
</section>

<!-- Contact Form Section -->
{#if selectedTopic && formConfigs[selectedTopic]}
	{@const config = formConfigs[selectedTopic]}
	<section id="form" class="border-b border-border" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Form Header -->
			<div class="col-span-12 bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — {selectedTopic?.toUpperCase()} FORM</span>
				<h2 class="font-display mt-2 text-xl font-bold uppercase md:text-2xl">{config.title}</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">{config.description}</p>
			</div>
		</div>
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Form -->
			<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-8 lg:px-16">
				{#if isSubmitted}
					<div class="flex min-h-[300px] flex-col items-center justify-center text-center">
						<div class="mb-4 flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
							<CheckCircle class="h-5 w-5 text-primary" />
						</div>
						<h3 class="font-display text-xl uppercase">MESSAGE SENT</h3>
						<p class="font-body mt-2 text-sm text-muted-foreground">{m.contact_form_success()}</p>
						<Button variant="outline" size="lg" class="font-ui mt-6 tracking-wider" onclick={() => { isSubmitted = false; selectedTopic = null; }}>
							SEND ANOTHER
						</Button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-px">
						<div class="grid grid-cols-2 gap-px border border-border bg-border">
							<div class="bg-background p-4">
								<Label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">NAME *</Label>
								<Input id="name" bind:value={name} required placeholder="John Doe" class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
							</div>
							<div class="bg-background p-4">
								<Label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">EMAIL *</Label>
								<Input id="email" type="email" bind:value={email} required placeholder="john@company.com" class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
							</div>
						</div>
						<div class="border border-border bg-background p-4">
							<Label for="company" class="font-mono text-[10px] tracking-widest text-muted-foreground">COMPANY</Label>
							<Input id="company" bind:value={company} placeholder="Company Inc. (optional)" class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
						</div>
						
						<!-- Topic-specific fields -->
						{#if selectedTopic === 'quote'}
							<div class="grid grid-cols-3 gap-px border border-border bg-border">
								<div class="bg-background p-4">
									<Label for="projectType" class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT TYPE *</Label>
									<Input id="projectType" bind:value={projectType} required placeholder="Website, Web App, etc." class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
								</div>
								<div class="bg-background p-4">
									<Label for="budget" class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET RANGE</Label>
									<Input id="budget" bind:value={budget} placeholder="$5k-10k, $10k-25k..." class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
								</div>
								<div class="bg-background p-4">
									<Label for="timeline" class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMELINE</Label>
									<Input id="timeline" bind:value={timeline} placeholder="2 weeks, 1 month..." class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
								</div>
							</div>
						{:else if selectedTopic === 'support'}
							<div class="grid grid-cols-2 gap-px border border-border bg-border">
								<div class="bg-background p-4">
									<Label for="orderId" class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT/ORDER ID</Label>
									<Input id="orderId" bind:value={orderId} placeholder="PRJ-XXXX" class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
								</div>
								<div class="bg-background p-4">
									<Label for="urgency" class="font-mono text-[10px] tracking-widest text-muted-foreground">URGENCY</Label>
									<Input id="urgency" bind:value={urgency} placeholder="Low, Medium, High, Critical" class="font-body mt-2 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
								</div>
							</div>
						{/if}
						
						<div class="border border-border bg-background p-4">
							<Label for="message" class="font-mono text-[10px] tracking-widest text-muted-foreground">MESSAGE *</Label>
							<Textarea id="message" bind:value={message} required rows={6} placeholder={selectedTopic === 'quote' ? 'Describe your project, goals, and requirements...' : selectedTopic === 'support' ? 'Describe your issue in detail...' : 'What can we help you with?'} class="font-body mt-2 resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
						</div>
						{#if error}
							<div class="font-mono border border-red-500 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>
						{/if}
						<div class="flex gap-px pt-4">
							<Button type="submit" size="lg" class="font-ui flex-1 tracking-wider" disabled={isSubmitting}>
								{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
								<Send class="ml-2 h-4 w-4" />
							</Button>
							<Button type="button" variant="outline" size="lg" class="font-ui tracking-wider" onclick={() => selectedTopic = null}>
								CANCEL
							</Button>
						</div>
					</form>
				{/if}
			</div>

			<!-- Contact Info Sidebar -->
			<div class="col-span-12 bg-card px-6 py-8 md:px-12 lg:col-span-4 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT INFO</span>
				
				<div class="mt-6 space-y-6">
					{#each contactInfo as { icon: Icon, label, value, href } (label)}
						<div class="flex items-start gap-4">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background">
								<Icon class="h-4 w-4 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</p>
								{#if href}
									<a {href} class="font-ui mt-1 block text-sm text-foreground hover:text-primary">{value}</a>
								{:else}
									<p class="font-ui mt-1 text-sm text-foreground">{value}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Social Links -->
				<div class="mt-8 border-t border-border pt-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONNECT</span>
					<div class="mt-4 grid grid-cols-3 gap-px bg-border">
						<a href="https://github.com/MostlyWhat" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 bg-background py-3 transition-colors hover:bg-primary/10">
							<span class="font-mono text-sm font-bold">GH</span>
						</a>
						<a href="https://twitter.com/MostlyWhat" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 bg-background py-3 transition-colors hover:bg-primary/10">
							<span class="font-mono text-sm font-bold">X</span>
						</a>
						<a href="https://linkedin.com/company/mostlywhat" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 bg-background py-3 transition-colors hover:bg-primary/10">
							<span class="font-mono text-sm font-bold">LI</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- FAQ Section - 50/50 Layout -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left: Title -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// 02 — FAQ</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-sm text-muted-foreground">Find answers to frequently asked questions about working with us.</p>
			<a href={localizeHref('/support')} class="font-ui mt-6 flex items-center gap-2 text-xs tracking-wider text-primary hover:underline">
				<HelpCircle class="h-4 w-4" />
				BROWSE SUPPORT CENTER
				<ArrowRight class="h-3 w-3" />
			</a>
		</div>
		<!-- Right: Accordion -->
		<div class="col-span-12 bg-background lg:col-span-6">
			<Accordion.Root type="single" class="w-full divide-y divide-border border-t border-border lg:border-t-0">
				{#each faqs as { id, q, a } (id)}
					<Accordion.Item value={id}>
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

<!-- CTA Section - Large Variant -->
<CTASection
	variant="large"
	label="NEED HELP?"
	title="VISIT OUR SUPPORT CENTER"
	description="Browse our knowledge base, FAQs, and documentation. Can't find what you need? Submit a support ticket and we'll get back to you within 24 hours."
	buttonText="VIEW SUPPORT"
	buttonHref="/support"
/>
