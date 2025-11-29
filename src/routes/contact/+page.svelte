<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Send, CheckCircle } from '@lucide/svelte';

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

			if (!response.ok) throw new Error('Failed to send message');
			isSubmitted = true;
			name = ''; email = ''; company = ''; message = '';
		} catch (err) {
			error = 'Something went wrong. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	const contactInfo = [
		{ label: 'Response', value: '~24 hours' },
		{ label: 'Email', value: 'hello@mostlywhat.systems' },
		{ label: 'Location', value: 'Remote • Global' }
	];

	const faqs = [
		{ q: 'What is your typical project timeline?', a: 'Most projects take 6-12 weeks from kickoff to launch.' },
		{ q: 'Do you work with startups?', a: 'Yes! We have flexible engagement models for different budgets.' },
		{ q: 'What technologies do you use?', a: 'SvelteKit, TypeScript, TailwindCSS, deployed on Cloudflare.' },
		{ q: 'Do you provide ongoing support?', a: 'We offer maintenance packages and can continue post-launch.' }
	];
</script>

<svelte:head>
	<title>{m.contact_title()} — {m.site_name()}</title>
	<meta name="description" content={m.contact_subtitle()} />
</svelte:head>

<!-- Hero Section - Full Screen -->
<section class="relative flex min-h-[50vh] flex-col border-b border-border">
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
		<div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<div class="flex flex-1 items-end p-4 pb-12 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid w-full gap-4 lg:grid-cols-12">
			<div class="lg:col-span-7">
				<p class="font-mono text-xs uppercase tracking-wider text-primary">Contact</p>
				<h1 class="font-display mt-2 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
					{m.contact_title()}
				</h1>
			</div>
			<div class="lg:col-span-5 lg:flex lg:flex-col lg:justify-end">
				<p class="font-body text-muted-foreground">{m.contact_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Contact Info Bar -->
	<div class="border-t border-border bg-card/50 backdrop-blur-sm">
		<div class="grid grid-cols-3 divide-x divide-border">
			{#each contactInfo as { label, value }}
				<div class="p-4 md:p-6">
					<p class="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
					<p class="font-display mt-1 text-sm font-bold md:text-base">{value}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Contact Form & Info Grid -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-2">
		<!-- Form Side -->
		<div class="border-b border-border p-4 md:p-6 lg:border-b-0 lg:border-r lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			{#if isSubmitted}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<div class="mb-4 flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
						<CheckCircle class="h-6 w-6 text-primary" />
					</div>
					<h3 class="font-display text-xl">Message Sent!</h3>
					<p class="font-body mt-2 text-sm text-muted-foreground">{m.contact_form_success()}</p>
					<Button variant="outline" class="font-ui mt-4" onclick={() => isSubmitted = false}>Send Another</Button>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="space-y-4">
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-1">
							<Label for="name" class="font-mono text-xs uppercase">{m.contact_form_name()}</Label>
							<Input id="name" bind:value={name} required placeholder="John Doe" class="font-body" />
						</div>
						<div class="space-y-1">
							<Label for="email" class="font-mono text-xs uppercase">{m.contact_form_email()}</Label>
							<Input id="email" type="email" bind:value={email} required placeholder="john@company.com" class="font-body" />
						</div>
					</div>
					<div class="space-y-1">
						<Label for="company" class="font-mono text-xs uppercase">{m.contact_form_company()}</Label>
						<Input id="company" bind:value={company} placeholder="Company Inc. (optional)" class="font-body" />
					</div>
					<div class="space-y-1">
						<Label for="message" class="font-mono text-xs uppercase">{m.contact_form_message()}</Label>
						<Textarea id="message" bind:value={message} required rows={5} placeholder="Tell us about your project..." class="font-body resize-none" />
					</div>
					{#if error}
						<div class="font-body border border-red-500 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>
					{/if}
					<Button type="submit" class="font-ui w-full" disabled={isSubmitting}>
						{isSubmitting ? 'Sending...' : m.contact_form_submit()}
						<Send class="ml-2 h-4 w-4" />
					</Button>
				</form>
			{/if}
		</div>

		<!-- Social & Quick Info -->
		<div class="bg-card p-4 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="mb-6">
				<p class="font-mono text-xs uppercase tracking-wider text-primary">Quick Contact</p>
				<a href="mailto:hello@mostlywhat.systems" class="font-display mt-2 block text-lg text-foreground hover:text-primary">hello@mostlywhat.systems</a>
			</div>
			<div class="mb-6">
				<p class="font-mono text-xs uppercase tracking-wider text-muted-foreground">Connect</p>
				<div class="mt-2 flex gap-2">
					<a href="https://github.com/MostlyWhat" target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors hover:bg-muted">
						<span class="font-mono text-xs">GH</span>
					</a>
					<a href="https://twitter.com/MostlyWhat" target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors hover:bg-muted">
						<span class="font-mono text-xs">X</span>
					</a>
					<a href="https://linkedin.com/company/mostlywhat" target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors hover:bg-muted">
						<span class="font-mono text-xs">LI</span>
					</a>
				</div>
			</div>
			<div class="font-mono text-xs text-muted-foreground">
				<p class="text-primary">// Response time</p>
				<p class="mt-2">We typically respond within 24 hours.</p>
				<p class="mt-1">For urgent matters, reach out on Twitter.</p>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Grid -->
<section class="border-b border-border">
	<div class="grid lg:grid-cols-12">
		<div class="border-b border-border p-4 md:p-6 lg:col-span-3 lg:border-b-0 lg:border-r" use:scrollAnimate={{ animation: 'fade' }}>
			<p class="font-mono text-xs uppercase tracking-wider text-primary">FAQ</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Common Questions</h2>
		</div>
		<div class="grid gap-px bg-border sm:grid-cols-2 lg:col-span-9" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each faqs as { q, a }}
				<div class="stagger-children bg-background p-4 md:p-6">
					<h3 class="font-ui text-sm font-semibold">{q}</h3>
					<p class="font-body mt-1 text-xs text-muted-foreground">{a}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
