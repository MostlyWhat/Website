<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Check, X, Download, Clock, FileText, Calendar, DollarSign } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	// Sample proposal data
	let proposal = $state({
		id: 'PROP-2024-0018',
		title: 'E-Commerce Platform Development',
		status: 'sent',
		organization: 'TechCorp Solutions',
		created_at: '2024-01-10',
		valid_until: '2024-02-10',
		total_amount: 150000,
		currency: 'THB',
		summary: 'A comprehensive e-commerce solution with custom product management, shopping cart, secure checkout, and integration with major payment gateways.',
		scope: [
			{
				phase: 'Discovery & Planning',
				duration: '2 weeks',
				items: [
					'Requirements gathering and analysis',
					'User research and persona development',
					'Technical architecture planning',
					'Project timeline and milestones'
				]
			},
			{
				phase: 'UI/UX Design',
				duration: '3 weeks',
				items: [
					'Wireframing and prototyping',
					'Visual design system creation',
					'Responsive design for all devices',
					'User testing and iterations'
				]
			},
			{
				phase: 'Development',
				duration: '8 weeks',
				items: [
					'Frontend development (SvelteKit)',
					'Backend API development',
					'Database design and implementation',
					'Payment gateway integration',
					'Admin dashboard development'
				]
			},
			{
				phase: 'Testing & Launch',
				duration: '2 weeks',
				items: [
					'Quality assurance testing',
					'Performance optimization',
					'Security audit',
					'Deployment and go-live support'
				]
			}
		],
		pricing: [
			{ description: 'Discovery & Planning', amount: 15000 },
			{ description: 'UI/UX Design', amount: 25000 },
			{ description: 'Frontend Development', amount: 45000 },
			{ description: 'Backend Development', amount: 40000 },
			{ description: 'Testing & QA', amount: 15000 },
			{ description: 'Project Management', amount: 10000 }
		],
		terms: [
			'50% deposit required to begin work',
			'25% due upon design approval',
			'25% due upon project completion',
			'Proposal valid for 30 days from issue date',
			'All prices in Thai Baht (THB), exclusive of VAT'
		]
	});

	let isExpired = $derived(new Date(proposal.valid_until) < new Date() && proposal.status === 'sent');

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'accepted':
				return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'ACCEPTED' };
			case 'rejected':
				return { bg: 'bg-red-500/10', text: 'text-red-500', label: 'REJECTED' };
			case 'sent':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'AWAITING RESPONSE' };
			case 'draft':
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'DRAFT' };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase() };
		}
	}

	let status = $derived(isExpired ? { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'EXPIRED' } : getStatusBadge(proposal.status));
</script>

<svelte:head>
	<title>Proposal: {proposal.title} | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/app/proposals"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO PROPOSALS</span>
				</a>
				<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">{proposal.title}</h1>
				<p class="font-mono mt-2 text-xs tracking-widest text-muted-foreground">{proposal.id}</p>
			</div>

			<span class="font-mono text-[10px] tracking-widest px-3 py-1 {status.bg} {status.text}">
				{status.label}
			</span>
		</div>
	</section>

	<!-- Proposal Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Summary -->
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PROJECT SUMMARY</span>
					<p class="font-body mt-4 text-base leading-relaxed text-muted-foreground">{proposal.summary}</p>
				</div>

				<!-- Scope of Work -->
				<div class="mt-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — SCOPE OF WORK</span>
					
					<div class="mt-6 space-y-6">
						{#each proposal.scope as phase, index}
							<div class="border border-border">
								<div class="flex items-center justify-between bg-card px-4 py-3">
									<div class="flex items-center gap-3">
										<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
											<span class="font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
										</div>
										<span class="font-ui text-sm font-semibold tracking-wider uppercase">{phase.phase}</span>
									</div>
									<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{phase.duration}</span>
								</div>
								<div class="px-4 py-4">
									<ul class="space-y-2">
										{#each phase.items as item}
											<li class="flex items-start gap-2">
												<div class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-primary"></div>
												<span class="font-body text-sm text-muted-foreground">{item}</span>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Pricing Breakdown -->
				<div class="mt-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — PRICING BREAKDOWN</span>
					
					<div class="mt-6 border border-border">
						{#each proposal.pricing as item}
							<div class="flex items-center justify-between border-b border-border px-4 py-4 last:border-b-0">
								<span class="font-body text-sm">{item.description}</span>
								<span class="font-mono text-sm">{formatCurrency(item.amount)}</span>
							</div>
						{/each}
						<div class="flex items-center justify-between bg-card px-4 py-4">
							<span class="font-ui text-sm font-semibold tracking-wider">TOTAL</span>
							<span class="font-display text-xl font-bold">{formatCurrency(proposal.total_amount)}</span>
						</div>
					</div>
				</div>

				<!-- Terms & Conditions -->
				<div class="mt-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">04 — TERMS & CONDITIONS</span>
					<ul class="mt-4 space-y-2">
						{#each proposal.terms as term}
							<li class="flex items-start gap-2">
								<div class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-muted-foreground"></div>
								<span class="font-body text-sm text-muted-foreground">{term}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Key Info Card -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROPOSAL SUMMARY</span>
					
					<div class="mt-6 space-y-4">
						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<DollarSign class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL VALUE</p>
								<p class="font-display text-lg font-bold">{formatCurrency(proposal.total_amount)}</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Calendar class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">VALID UNTIL</p>
								<p class="font-body text-sm {isExpired ? 'text-yellow-500 font-semibold' : ''}">{formatDate(proposal.valid_until)}</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Clock class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">ESTIMATED DURATION</p>
								<p class="font-body text-sm">15 weeks</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Actions -->
				{#if proposal.status === 'sent' && !isExpired}
					<div class="mt-6 border border-border p-6">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">YOUR RESPONSE</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">
							Please review the proposal carefully. Once you're ready, you can accept or decline below.
						</p>
						<div class="mt-6 space-y-3">
							<Button class="font-ui w-full text-xs tracking-wider bg-green-600 hover:bg-green-700">
								<Check class="mr-2 h-4 w-4" />
								ACCEPT PROPOSAL
							</Button>
							<Button variant="outline" class="font-ui w-full text-xs tracking-wider text-red-500 hover:bg-red-500/10 hover:text-red-500">
								<X class="mr-2 h-4 w-4" />
								DECLINE
							</Button>
						</div>
					</div>
				{:else if proposal.status === 'accepted'}
					<div class="mt-6 border border-green-500/20 bg-green-500/10 p-6">
						<div class="flex items-start gap-3">
							<Check class="h-5 w-5 flex-shrink-0 text-green-500" />
							<div>
								<p class="font-ui text-xs font-semibold text-green-500">PROPOSAL ACCEPTED</p>
								<p class="font-body mt-1 text-sm text-muted-foreground">
									Thank you for accepting this proposal. Our team will be in touch shortly to begin the project.
								</p>
							</div>
						</div>
					</div>
				{:else if proposal.status === 'rejected'}
					<div class="mt-6 border border-red-500/20 bg-red-500/10 p-6">
						<div class="flex items-start gap-3">
							<X class="h-5 w-5 flex-shrink-0 text-red-500" />
							<div>
								<p class="font-ui text-xs font-semibold text-red-500">PROPOSAL DECLINED</p>
								<p class="font-body mt-1 text-sm text-muted-foreground">
									This proposal was declined. If you'd like to discuss alternative options, please contact us.
								</p>
							</div>
						</div>
					</div>
				{:else if isExpired}
					<div class="mt-6 border border-yellow-500/20 bg-yellow-500/10 p-6">
						<div class="flex items-start gap-3">
							<Clock class="h-5 w-5 flex-shrink-0 text-yellow-500" />
							<div>
								<p class="font-ui text-xs font-semibold text-yellow-500">PROPOSAL EXPIRED</p>
								<p class="font-body mt-1 text-sm text-muted-foreground">
									This proposal has expired. Please contact us to request an updated proposal.
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Download -->
				<div class="mt-6">
					<Button variant="outline" class="font-ui w-full text-xs tracking-wider">
						<Download class="mr-2 h-4 w-4" />
						DOWNLOAD PDF
					</Button>
				</div>

				<!-- Questions -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">HAVE QUESTIONS?</span>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						If you have any questions about this proposal, our team is here to help.
					</p>
					<Button variant="outline" href="/app/tickets/new" class="font-ui mt-4 w-full text-xs tracking-wider">
						CONTACT US
					</Button>
				</div>
			</div>
		</div>
	</section>
</div>
