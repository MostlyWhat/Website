<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import * as Accordion from '$lib/components/ui/accordion';
	import { 
		Send, CheckCircle, MessageSquare, FileText, HelpCircle, Headphones,
		ArrowRight, Mail, MapPin, Clock, ExternalLink
	} from '@lucide/svelte';

	// Contact form state
	let name = $state('');
	let email = $state('');
	let company = $state('');
	let message = $state('');
	let selectedTopic = $state<string | null>(null);
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let error = $state<string | null>(null);

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
			id: 'help', 
			icon: HelpCircle, 
			title: 'HELP CENTER', 
			desc: 'Browse FAQs and documentation',
			action: 'VIEW ARTICLES',
			href: '/help'
		}
	];

	// FAQ data
	const faqs = [
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
		}
	];

	// Contact info
	const contactInfo = [
		{ icon: Mail, label: 'EMAIL', value: 'hello@mostlywhat.systems', href: 'mailto:hello@mostlywhat.systems' },
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
		if (id === 'help') return; // Help center has its own page
		selectedTopic = id;
	}
</script>

<svelte:head>
	<title>{m.contact_title()} — {m.site_name()}</title>
	<meta name="description" content={m.contact_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<section class="relative flex h-[calc(100dvh-6rem)] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Positioned at Bottom -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-xs tracking-widest text-muted-foreground">CONTACT</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.contact_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.contact_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Contact Options Grid -->
	<div class="grid grid-cols-2 gap-px border-t border-border bg-border lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each contactOptions as { id, icon: Icon, title, desc, action, href } (id)}
			{#if href}
				<a
					{href}
					class="stagger-children group flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6"
				>
					<Icon class="mb-3 h-5 w-5 text-primary" />
					<h3 class="font-ui text-xs font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-1 flex-1 text-[11px] text-muted-foreground">{desc}</p>
					<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
						{action}
						<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
					</span>
				</a>
			{:else}
				<button
					type="button"
					onclick={() => selectTopic(id)}
					class="stagger-children group flex flex-col bg-background p-4 text-left transition-colors hover:bg-card md:p-6 {selectedTopic === id ? 'bg-primary/10 ring-1 ring-primary' : ''}"
				>
					<Icon class="mb-3 h-5 w-5 text-primary" />
					<h3 class="font-ui text-xs font-semibold tracking-wider">{title}</h3>
					<p class="font-body mt-1 flex-1 text-[11px] text-muted-foreground">{desc}</p>
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
{#if selectedTopic}
	<section class="border-b border-border" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Form -->
			<div class="col-span-12 bg-background p-4 md:p-6 lg:col-span-7 lg:p-8">
				{#if isSubmitted}
					<div class="flex min-h-[400px] flex-col items-center justify-center text-center">
						<div class="mb-4 flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
							<CheckCircle class="h-6 w-6 text-primary" />
						</div>
						<h3 class="font-display text-xl uppercase">MESSAGE SENT</h3>
						<p class="font-body mt-2 text-sm text-muted-foreground">{m.contact_form_success()}</p>
						<Button variant="outline" class="font-ui mt-6 tracking-wider" onclick={() => { isSubmitted = false; selectedTopic = null; }}>
							SEND ANOTHER
						</Button>
					</div>
				{:else}
					<div class="mb-6">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{selectedTopic?.toUpperCase()} FORM</span>
						<h2 class="font-display mt-2 text-2xl font-bold uppercase">TELL US ABOUT YOUR PROJECT</h2>
					</div>
					
					<form onsubmit={handleSubmit} class="space-y-4">
						<div class="grid grid-cols-2 gap-px bg-border">
							<div class="bg-background p-3">
								<Label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">NAME *</Label>
								<Input id="name" bind:value={name} required placeholder="John Doe" class="font-body mt-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
							</div>
							<div class="bg-background p-3">
								<Label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">EMAIL *</Label>
								<Input id="email" type="email" bind:value={email} required placeholder="john@company.com" class="font-body mt-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
							</div>
						</div>
						<div class="border border-border bg-background p-3">
							<Label for="company" class="font-mono text-[10px] tracking-widest text-muted-foreground">COMPANY</Label>
							<Input id="company" bind:value={company} placeholder="Company Inc. (optional)" class="font-body mt-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
						</div>
						<div class="border border-border bg-background p-3">
							<Label for="message" class="font-mono text-[10px] tracking-widest text-muted-foreground">MESSAGE *</Label>
							<Textarea id="message" bind:value={message} required rows={6} placeholder="Tell us about your project, timeline, and budget..." class="font-body mt-1 resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0" />
						</div>
						{#if error}
							<div class="font-mono border border-red-500 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>
						{/if}
						<div class="flex gap-2">
							<Button type="submit" class="font-ui flex-1 tracking-wider" disabled={isSubmitting}>
								{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
								<Send class="ml-2 h-4 w-4" />
							</Button>
							<Button type="button" variant="outline" class="font-ui tracking-wider" onclick={() => selectedTopic = null}>
								CANCEL
							</Button>
						</div>
					</form>
				{/if}
			</div>

			<!-- Contact Info Sidebar -->
			<div class="col-span-12 bg-card p-4 md:p-6 lg:col-span-5 lg:p-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT INFO</span>
				
				<div class="mt-6 space-y-4">
					{#each contactInfo as { icon: Icon, label, value, href } (label)}
						<div class="border border-border bg-background p-4">
							<div class="flex items-start gap-3">
								<Icon class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</p>
									{#if href}
										<a {href} class="font-ui mt-1 block text-sm text-foreground hover:text-primary">{value}</a>
									{:else}
										<p class="font-ui mt-1 text-sm text-foreground">{value}</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Social Links -->
				<div class="mt-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONNECT</span>
					<div class="mt-3 grid grid-cols-3 gap-px bg-border">
						<a href="https://github.com/MostlyWhat" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 bg-background py-3 transition-colors hover:bg-primary/10">
							<span class="font-mono text-xs text-muted-foreground">GH</span>
						</a>
						<a href="https://twitter.com/MostlyWhat" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 bg-background py-3 transition-colors hover:bg-primary/10">
							<span class="font-mono text-xs text-muted-foreground">X</span>
						</a>
						<a href="https://linkedin.com/company/mostlywhat" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 bg-background py-3 transition-colors hover:bg-primary/10">
							<span class="font-mono text-xs text-muted-foreground">LI</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- FAQ Section with Accordion -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border lg:grid-cols-2">
		<!-- FAQ Info (Left) -->
		<div class="bg-background p-4 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FAQ</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COMMON QUESTIONS</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Find answers to frequently asked questions about our process, pricing, and services. 
				Can't find what you're looking for?
			</p>
			<Button href={localizeHref('/help')} variant="outline" class="font-ui mt-6 tracking-wider">
				VISIT HELP CENTER
				<ExternalLink class="ml-2 h-4 w-4" />
			</Button>
			
			<!-- Quick Stats -->
			<div class="mt-8 grid grid-cols-2 gap-px bg-border">
				<div class="bg-card p-4">
					<p class="font-display text-2xl font-bold text-primary">50+</p>
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECTS DELIVERED</p>
				</div>
				<div class="bg-card p-4">
					<p class="font-display text-2xl font-bold text-primary">24H</p>
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">AVG. RESPONSE TIME</p>
				</div>
			</div>
		</div>

		<!-- FAQ Accordion (Right) -->
		<div class="bg-card" use:scrollAnimate={{ animation: 'fade' }}>
			<Accordion.Root class="space-y-px">
				{#each faqs as { id, q, a } (id)}
					<Accordion.Item value={id} class="border-0">
						<Accordion.Trigger class="font-ui w-full bg-background px-4 py-4 text-left text-xs tracking-wider hover:bg-muted [&[data-state=open]]:bg-primary/10 [&[data-state=open]]:text-primary">
							{q}
						</Accordion.Trigger>
						<Accordion.Content class="font-body bg-background px-4 pb-4 text-sm text-muted-foreground">
							{a}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="col-span-12 bg-background p-4 md:col-span-8 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">READY TO START?</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">LET'S BUILD SOMETHING GREAT</h2>
			<p class="font-body mt-4 max-w-lg text-muted-foreground">
				Whether you have a detailed brief or just a rough idea, we'd love to hear about it.
			</p>
			<div class="mt-6 flex gap-2">
				<Button onclick={() => selectTopic('quote')} class="font-ui tracking-wider">
					GET A QUOTE
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
				<Button href="mailto:hello@mostlywhat.systems" variant="outline" class="font-ui tracking-wider">
					EMAIL US
				</Button>
			</div>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-primary/10 p-4 md:col-span-4 md:p-8">
			<div class="text-center">
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK CONTACT</p>
				<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 block text-lg uppercase text-primary hover:underline">
					HELLO@MOSTLYWHAT.SYSTEMS
				</a>
			</div>
		</div>
	</div>
</section>
