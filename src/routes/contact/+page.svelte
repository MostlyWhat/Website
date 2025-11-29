<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Send, Clock, Mail, MapPin, CheckCircle } from '@lucide/svelte';

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, company, message })
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}

			isSubmitted = true;
			name = '';
			email = '';
			company = '';
			message = '';
		} catch (err) {
			error = 'Something went wrong. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	const contactInfo = [
		{
			icon: Clock,
			label: 'Response Time',
			value: '~24 hours',
			desc: 'We aim to respond within one business day'
		},
		{
			icon: Mail,
			label: 'Email',
			value: 'hello@mostlywhat.systems',
			desc: 'For general inquiries'
		},
		{
			icon: MapPin,
			label: 'Location',
			value: 'Remote • Global',
			desc: 'We work with clients worldwide'
		}
	];

	const faqs = [
		{
			q: 'What is your typical project timeline?',
			a: 'Most projects take 6-12 weeks from kickoff to launch, depending on scope and complexity.'
		},
		{
			q: 'Do you work with startups?',
			a: 'Yes! We love working with early-stage companies. We have flexible engagement models for different budgets.'
		},
		{
			q: 'What technologies do you use?',
			a: 'Our primary stack is SvelteKit, TypeScript, and TailwindCSS, deployed on Cloudflare Workers.'
		},
		{
			q: 'Do you provide ongoing support?',
			a: 'Absolutely. We offer maintenance packages and can continue as your technical partner post-launch.'
		}
	];
</script>

<svelte:head>
	<title>{m.contact_title()} — {m.site_name()}</title>
	<meta name="description" content={m.contact_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Contact</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl lg:text-6xl">{m.contact_title()}</h1>
		<p class="font-body text-lg text-muted-foreground md:text-xl">{m.contact_subtitle()}</p>
	</div>
</Section>

<!-- Contact Form & Info -->
<Section background="card">
	<div class="grid gap-12 lg:grid-cols-2">
		<!-- Contact Form -->
		<div use:scrollAnimate={{ animation: 'slide-left' }}>
			{#if isSubmitted}
				<Tile padding="xl" class="text-center">
					<div class="mb-4 flex justify-center">
						<div class="flex h-16 w-16 items-center justify-center border border-primary bg-primary/10">
							<CheckCircle class="h-8 w-8 text-primary" />
						</div>
					</div>
					<h3 class="font-display mb-2 text-2xl">Message Sent!</h3>
					<p class="font-body text-muted-foreground">{m.contact_form_success()}</p>
					<Button 
						variant="outline" 
						class="font-ui mt-6"
						onclick={() => isSubmitted = false}
					>
						Send Another Message
					</Button>
				</Tile>
			{:else}
				<form onsubmit={handleSubmit} class="space-y-6">
					<div class="grid gap-6 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="name" class="font-ui">{m.contact_form_name()}</Label>
							<Input 
								id="name" 
								bind:value={name}
								required
								placeholder="John Doe"
								class="font-body"
							/>
						</div>
						<div class="space-y-2">
							<Label for="email" class="font-ui">{m.contact_form_email()}</Label>
							<Input 
								id="email" 
								type="email"
								bind:value={email}
								required
								placeholder="john@company.com"
								class="font-body"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="company" class="font-ui">{m.contact_form_company()}</Label>
						<Input 
							id="company" 
							bind:value={company}
							placeholder="Company Inc. (optional)"
							class="font-body"
						/>
					</div>

					<div class="space-y-2">
						<Label for="message" class="font-ui">{m.contact_form_message()}</Label>
						<Textarea 
							id="message" 
							bind:value={message}
							required
							rows={6}
							placeholder="Tell us about your project..."
							class="font-body resize-none"
						/>
					</div>

					{#if error}
						<div class="font-body border border-red-500 bg-red-500/10 p-4 text-sm text-red-400">
							{error}
						</div>
					{/if}

					<Button 
						type="submit" 
						size="lg" 
						class="font-ui w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Sending...' : m.contact_form_submit()}
						<Send class="ml-2 h-5 w-5" />
					</Button>
				</form>
			{/if}
		</div>

		<!-- Contact Info -->
		<div class="space-y-6" use:scrollAnimate={{ animation: 'slide-right' }}>
			<div class="stagger-children space-y-4">
				{#each contactInfo as { icon: Icon, label, value, desc }}
					<Tile padding="lg" class="flex items-start gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border">
							<Icon class="h-6 w-6 text-primary" />
						</div>
						<div>
							<p class="font-ui text-sm text-muted-foreground">{label}</p>
							<p class="font-body text-lg font-semibold">{value}</p>
							<p class="font-body text-sm text-muted-foreground">{desc}</p>
						</div>
					</Tile>
				{/each}
			</div>

			<!-- Social Links -->
			<Tile padding="lg">
				<h3 class="font-ui mb-4 text-sm uppercase tracking-wider text-primary">Connect With Us</h3>
				<div class="flex gap-4">
					<a 
						href="https://github.com/MostlyWhat" 
						target="_blank" 
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:bg-muted"
					>
						<span class="font-mono text-xs">GH</span>
					</a>
					<a 
						href="https://twitter.com/MostlyWhat" 
						target="_blank" 
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:bg-muted"
					>
						<span class="font-mono text-xs">X</span>
					</a>
					<a 
						href="https://linkedin.com/company/mostlywhat" 
						target="_blank" 
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:bg-muted"
					>
						<span class="font-mono text-xs">LI</span>
					</a>
				</div>
			</Tile>
		</div>
	</div>
</Section>

<!-- FAQ Section -->
<Section>
	<div class="mb-12" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">FAQ</p>
		<h2 class="h2 text-3xl md:text-4xl">Common Questions</h2>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each faqs as { q, a }}
			<Tile padding="lg">
				<h3 class="font-ui mb-2 font-semibold">{q}</h3>
				<p class="font-body text-sm text-muted-foreground">{a}</p>
			</Tile>
		{/each}
	</div>
</Section>
