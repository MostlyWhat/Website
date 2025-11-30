<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import WideNavSection from '$lib/components/layout/WideNavSection.svelte';
	import {
		Send,
		CheckCircle,
		ArrowLeft,
		AlertCircle,
		Upload,
		Zap,
		Clock,
		MessageCircle,
		FileText
	} from '@lucide/svelte';

	// Form state
	let name = $state('');
	let email = $state('');
	let projectId = $state('');
	let subject = $state('');
	let category = $state('');
	let priority = $state('normal');
	let message = $state('');
	let browserInfo = $state('');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	const categories = [
		{ value: '', label: 'Select a category...' },
		{ value: 'bug', label: 'Bug Report - Something isn\'t working' },
		{ value: 'feature', label: 'Feature Request - New functionality' },
		{ value: 'content', label: 'Content Update - Text, images, or media' },
		{ value: 'hosting', label: 'Hosting/Performance - Speed or uptime issues' },
		{ value: 'billing', label: 'Billing/Account - Invoices or payments' },
		{ value: 'general', label: 'General Inquiry - Other questions' }
	];

	const priorities = [
		{ value: 'low', label: 'Low', desc: 'General inquiry, no rush' },
		{ value: 'normal', label: 'Normal', desc: 'Non-critical, standard response' },
		{ value: 'high', label: 'High', desc: 'Affecting productivity' },
		{ value: 'critical', label: 'Critical', desc: 'Site is down or broken' }
	];

	// Support process steps
	const processSteps = [
		{
			num: '01',
			title: 'SUBMIT TICKET',
			desc: 'Complete the form with as much detail as possible about your issue.'
		},
		{
			num: '02',
			title: 'CONFIRMATION',
			desc: 'Receive an email confirmation with your unique ticket ID.'
		},
		{
			num: '03',
			title: 'TEAM REVIEW',
			desc: 'Our team reviews, prioritizes, and assigns your ticket.'
		},
		{
			num: '04',
			title: 'RESOLUTION',
			desc: 'We work on your issue and keep you updated throughout.'
		}
	];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		isSubmitted = true;
		isSubmitting = false;
	}

	function resetForm() {
		isSubmitted = false;
		name = '';
		email = '';
		projectId = '';
		subject = '';
		category = '';
		priority = 'normal';
		message = '';
		browserInfo = '';
	}
</script>

<svelte:head>
	<title>Submit a Ticket — {m.site_name()}</title>
	<meta
		name="description"
		content="Submit a support ticket for technical assistance, bug reports, or general inquiries."
	/>
</svelte:head>

<!-- Hero Section -->
<HeroSection
	label="// SUPPORT.TICKET"
	title="SUBMIT A TICKET"
	description="Need help? Submit a detailed ticket and our team will get back to you within 24 hours."
/>

<!-- Description Section -->
<DescriptionSection
	description="Fill out the form below with as much detail as possible about your issue. Include screenshots, error messages, and steps to reproduce the problem for the fastest resolution."
	stats={[
		{ value: '<24H', label: 'RESPONSE' },
		{ value: '98%', label: 'RESOLVED' },
		{ value: 'PRIORITY', label: 'ROUTING' }
	]}
/>

<!-- Main Content -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sidebar - Process Info -->
		<div
			class="col-span-12 border-b border-border bg-card lg:col-span-4 lg:border-b-0 lg:border-r"
		>
			<div class="lg:sticky lg:top-24">
				<!-- Back to Support -->
				<div class="border-b border-border">
					<a
						href={localizeHref('/support')}
						class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-background hover:text-primary md:px-12 lg:px-16"
					>
						<ArrowLeft class="h-3 w-3" />
						BACK TO SUPPORT
					</a>
				</div>

				<!-- Process Steps -->
				<div
					class="px-6 py-8 md:px-12 lg:px-16 lg:py-12"
					use:scrollAnimate={{ animation: 'fade' }}
				>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>SUPPORT PROCESS</span
					>
					<div class="mt-6 space-y-6">
						{#each processSteps as step (step.num)}
							<div class="flex gap-4">
								<div
									class="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-primary bg-primary/10"
								>
									<span class="font-mono text-xs text-primary">{step.num}</span>
								</div>
								<div>
									<p class="font-ui text-xs font-semibold tracking-wider">{step.title}</p>
									<p class="font-body mt-1 text-[11px] text-muted-foreground">{step.desc}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Response Times -->
				<div
					class="border-t border-border px-6 py-8 md:px-12 lg:px-16"
					use:scrollAnimate={{ animation: 'fade' }}
				>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>RESPONSE TIMES</span
					>
					<div class="mt-4 space-y-3">
						<div class="flex items-center justify-between">
							<span class="font-ui text-xs tracking-wider">Critical</span>
							<span class="font-mono text-xs text-primary">&lt;2 hours</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-ui text-xs tracking-wider">High</span>
							<span class="font-mono text-xs text-primary">&lt;4 hours</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-ui text-xs tracking-wider">Normal</span>
							<span class="font-mono text-xs text-primary">&lt;24 hours</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-ui text-xs tracking-wider">Low</span>
							<span class="font-mono text-xs text-primary">&lt;48 hours</span>
						</div>
					</div>
				</div>

				<!-- Urgent CTA -->
				<div class="border-t border-border px-6 py-6 md:px-12 lg:px-16">
					<div class="border border-destructive/20 bg-destructive/5 p-4">
						<div class="flex items-start gap-3">
							<Zap class="h-4 w-4 flex-shrink-0 text-destructive" />
							<div>
								<p class="font-ui text-xs font-semibold tracking-wider text-destructive">
									URGENT ISSUES?
								</p>
								<p class="font-body mt-1 text-[11px] text-muted-foreground">
									For site-down emergencies, email
									<a
										href="mailto:urgent@mostlywhat.com"
										class="text-primary underline hover:no-underline">urgent@mostlywhat.com</a
									>
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Links -->
				<div class="border-t border-border px-6 py-6 md:px-12 lg:px-16">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK LINKS</span
					>
					<div class="mt-3 flex flex-col gap-2">
						<a
							href={localizeHref('/support/troubleshooting-guide')}
							class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary"
						>
							<FileText class="h-3 w-3" />
							Troubleshooting Guide
						</a>
						<a
							href={localizeHref('/support/response-times')}
							class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary"
						>
							<Clock class="h-3 w-3" />
							Response Time SLAs
						</a>
						<a
							href={localizeHref('/support/articles')}
							class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary"
						>
							<MessageCircle class="h-3 w-3" />
							Browse All Articles
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Form Section -->
		<div
			class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16"
			use:scrollAnimate={{ animation: 'fade' }}
		>
			{#if isSubmitted}
				<!-- Success State -->
				<div class="mx-auto max-w-xl text-center" use:scrollAnimate={{ animation: 'scale' }}>
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center border border-primary bg-primary/10"
					>
						<CheckCircle class="h-8 w-8 text-primary" />
					</div>
					<h2 class="font-display mt-6 text-2xl font-bold uppercase">TICKET SUBMITTED</h2>
					<p class="font-body mt-2 text-muted-foreground">
						Your support ticket has been received. You'll receive a confirmation email with your
						ticket ID shortly.
					</p>
					<div class="mt-6 border border-border bg-card p-6">
						<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TICKET DETAILS</p>
						<div class="mt-4 space-y-2 text-left">
							<div class="flex justify-between">
								<span class="font-ui text-xs tracking-wider text-muted-foreground">Subject</span>
								<span class="font-ui text-xs tracking-wider">{subject}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-ui text-xs tracking-wider text-muted-foreground">Priority</span>
								<span
									class="font-mono text-xs uppercase tracking-wider {priority === 'critical'
										? 'text-destructive'
										: priority === 'high'
											? 'text-orange-500'
											: 'text-primary'}">{priority}</span
								>
							</div>
							<div class="flex justify-between">
								<span class="font-ui text-xs tracking-wider text-muted-foreground"
									>Expected Response</span
								>
								<span class="font-mono text-xs tracking-wider text-primary">
									{priority === 'critical'
										? '<2 hours'
										: priority === 'high'
											? '<4 hours'
											: priority === 'normal'
												? '<24 hours'
												: '<48 hours'}
								</span>
							</div>
						</div>
					</div>
					<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Button onclick={resetForm} variant="outline" class="font-ui tracking-wider">
							SUBMIT ANOTHER
						</Button>
						<Button href={localizeHref('/support')} class="font-ui tracking-wider">
							BACK TO SUPPORT
						</Button>
					</div>
				</div>
			{:else}
				<!-- Form -->
				<div class="mx-auto max-w-2xl">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>// TICKET.FORM</span
					>
					<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
						DESCRIBE YOUR ISSUE
					</h2>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						The more detail you provide, the faster we can help. All fields marked with * are
						required.
					</p>

					<form class="mt-8 space-y-8" onsubmit={handleSubmit}>
						<!-- Contact Info -->
						<div class="space-y-6">
							<div class="border-b border-border pb-2">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
									>01 — CONTACT INFO</span
								>
							</div>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<label
										class="font-mono text-[10px] tracking-widest text-muted-foreground"
										for="name"
									>
										NAME *
									</label>
									<Input
										id="name"
										type="text"
										bind:value={name}
										required
										class="font-body mt-2"
										placeholder="Your full name"
									/>
								</div>
								<div>
									<label
										class="font-mono text-[10px] tracking-widest text-muted-foreground"
										for="email"
									>
										EMAIL *
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
							<div>
								<label
									class="font-mono text-[10px] tracking-widest text-muted-foreground"
									for="projectId"
								>
									PROJECT/ORDER ID
								</label>
								<Input
									id="projectId"
									type="text"
									bind:value={projectId}
									class="font-body mt-2"
									placeholder="PRJ-XXXX (if applicable)"
								/>
								<p class="font-body mt-1 text-[11px] text-muted-foreground">
									Found in your project dashboard or contract
								</p>
							</div>
						</div>

						<!-- Issue Details -->
						<div class="space-y-6">
							<div class="border-b border-border pb-2">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
									>02 — ISSUE DETAILS</span
								>
							</div>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<label
										class="font-mono text-[10px] tracking-widest text-muted-foreground"
										for="category"
									>
										CATEGORY *
									</label>
									<select
										id="category"
										bind:value={category}
										required
										class="font-body mt-2 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									>
										{#each categories as cat (cat.value)}
											<option value={cat.value}>{cat.label}</option>
										{/each}
									</select>
								</div>
								<div>
									<label
										class="font-mono text-[10px] tracking-widest text-muted-foreground"
										for="priority"
									>
										PRIORITY *
									</label>
									<select
										id="priority"
										bind:value={priority}
										class="font-body mt-2 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									>
										{#each priorities as p (p.value)}
											<option value={p.value}>{p.label} — {p.desc}</option>
										{/each}
									</select>
								</div>
							</div>
							<div>
								<label
									class="font-mono text-[10px] tracking-widest text-muted-foreground"
									for="subject"
								>
									SUBJECT *
								</label>
								<Input
									id="subject"
									type="text"
									bind:value={subject}
									required
									class="font-body mt-2"
									placeholder="Brief summary of your issue"
								/>
							</div>
							<div>
								<label
									class="font-mono text-[10px] tracking-widest text-muted-foreground"
									for="message"
								>
									DESCRIPTION *
								</label>
								<Textarea
									id="message"
									bind:value={message}
									required
									rows={6}
									class="font-body mt-2"
									placeholder="Please describe your issue in detail. Include:&#10;• What you were trying to do&#10;• What happened instead&#10;• Any error messages you saw&#10;• Steps to reproduce the issue"
								/>
							</div>
						</div>

						<!-- Technical Info -->
						<div class="space-y-6">
							<div class="border-b border-border pb-2">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
									>03 — TECHNICAL INFO (OPTIONAL)</span
								>
							</div>
							<div>
								<label
									class="font-mono text-[10px] tracking-widest text-muted-foreground"
									for="browserInfo"
								>
									BROWSER & DEVICE
								</label>
								<Input
									id="browserInfo"
									type="text"
									bind:value={browserInfo}
									class="font-body mt-2"
									placeholder="e.g., Chrome 120 on Windows 11"
								/>
								<p class="font-body mt-1 text-[11px] text-muted-foreground">
									Helps us reproduce browser-specific issues
								</p>
							</div>
							<div class="border border-dashed border-border p-6 text-center">
								<Upload class="mx-auto h-8 w-8 text-muted-foreground" />
								<p class="font-ui mt-2 text-xs tracking-wider text-muted-foreground">
									ATTACHMENTS COMING SOON
								</p>
								<p class="font-body mt-1 text-[11px] text-muted-foreground">
									Screenshots and files will be supported in a future update
								</p>
							</div>
						</div>

						<!-- Submit -->
						<div class="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
							<div class="flex items-start gap-2">
								<AlertCircle class="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
								<p class="font-body text-[11px] text-muted-foreground">
									By submitting, you agree to our support terms and privacy policy.
								</p>
							</div>
							<Button type="submit" class="font-ui tracking-wider" disabled={isSubmitting}>
								{#if isSubmitting}
									SUBMITTING...
								{:else}
									SUBMIT TICKET
									<Send class="ml-2 h-4 w-4" />
								{/if}
							</Button>
						</div>
					</form>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- CTA Section -->
<WideNavSection
	label="SELF-SERVICE"
	title="BROWSE HELP ARTICLES"
	description="Find answers in our documentation and troubleshooting guides."
	buttonText="VIEW ARTICLES"
	buttonHref="/support/articles"
/>
