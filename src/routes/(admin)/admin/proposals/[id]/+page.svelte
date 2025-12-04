<script lang="ts">
	/**
	 * Admin Proposal Detail Page
	 * 
	 * View and manage a specific proposal.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, FileText, Send, Eye, CheckCircle, X, Clock,
		Building2, FolderKanban, Calendar, User, Download, Trash2, Loader2, RotateCcw, Pencil
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { generateProposalPDF, downloadPDF, type ProposalPDFData } from '$lib/utils/pdf';

	let { data, form } = $props();

	let loading = $state(false);
	let pdfLoading = $state(false);

	const proposal = data.proposal;

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: proposal.currency || 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', { 
			year: 'numeric',
			month: 'short', 
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'draft': return { icon: Clock, class: 'bg-muted text-muted-foreground', label: 'DRAFT' };
			case 'sent': return { icon: Send, class: 'bg-blue-500/10 text-blue-500', label: 'SENT' };
			case 'viewed': return { icon: Eye, class: 'bg-purple-500/10 text-purple-500', label: 'VIEWED' };
			case 'accepted': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'ACCEPTED' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'REJECTED' };
			case 'expired': return { icon: Clock, class: 'bg-orange-500/10 text-orange-500', label: 'EXPIRED' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status.toUpperCase() };
		}
	}

	const statusConfig = getStatusConfig(proposal.status);

	// Parse content
	const content = proposal.content as { 
		sections?: Array<{ title: string; content: string; order: number }>;
		lineItems?: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
	} | null;
	const sections = content?.sections ?? [];
	const lineItems = content?.lineItems ?? [];

	async function handleDownloadPDF() {
		pdfLoading = true;
		try {
			const pdfData: ProposalPDFData = {
				proposalNumber: proposal.proposalNumber,
				title: proposal.title,
				organization: proposal.organization,
				orgNumber: proposal.orgNumber ?? 'N/A',
				createdAt: proposal.createdAt,
				validUntil: proposal.expiresAt,
				description: proposal.summary,
				scope: null,
				timeline: null,
				deliverables: null,
				terms: null,
				subtotal: proposal.subtotal,
				taxRate: proposal.taxRate,
				taxAmount: proposal.taxAmount,
				total: proposal.total,
				currency: proposal.currency || 'USD',
				lineItems: lineItems.map(item => ({
					description: item.description,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					amount: item.total
				})),
				sections: sections
			};
			
			const doc = generateProposalPDF(pdfData);
			downloadPDF(doc, `${proposal.proposalNumber}.pdf`);
		} catch (error) {
			console.error('Failed to generate PDF:', error);
		} finally {
			pdfLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{proposal.title} | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/admin/proposals"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO PROPOSALS</span>
				</a>
				<h1 class="font-display mt-6 text-xl font-bold md:text-2xl">{proposal.title}</h1>
				<p class="font-mono mt-2 text-xs tracking-widest text-muted-foreground">
					{proposal.project} • {proposal.organization}
				</p>
			</div>
			<span class="font-mono text-[10px] tracking-widest px-3 py-1 {statusConfig.class}">
				{statusConfig.label}
			</span>
		</div>
	</section>

	<!-- Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-green-500">{form.message ?? 'Action completed successfully'}</p>
		</div>
	{/if}
	{#if form?.error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Content -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Summary -->
				{#if proposal.summary}
					<div class="border border-border p-6 mb-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">EXECUTIVE SUMMARY</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">{proposal.summary}</p>
					</div>
				{/if}

				<!-- Sections -->
				{#if sections.length > 0}
					<div class="space-y-6">
						{#each sections.sort((a, b) => a.order - b.order) as section, i}
							<div class="border border-border p-6">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SECTION {i + 1}</span>
								<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">{section.title}</h3>
								<p class="font-body mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Line Items -->
				{#if lineItems.length > 0}
					<div class="mt-8 border border-border">
						<div class="border-b border-border px-6 py-4">
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LINE ITEMS</span>
						</div>
						<table class="w-full">
							<thead>
								<tr class="border-b border-border">
									<th class="px-6 py-3 text-left font-mono text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</th>
									<th class="px-4 py-3 text-center font-mono text-[10px] tracking-widest text-muted-foreground">QTY</th>
									<th class="px-4 py-3 text-right font-mono text-[10px] tracking-widest text-muted-foreground">UNIT PRICE</th>
									<th class="px-6 py-3 text-right font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL</th>
								</tr>
							</thead>
							<tbody>
								{#each lineItems as item}
									<tr class="border-b border-border last:border-b-0">
										<td class="px-6 py-4 font-body text-sm">{item.description}</td>
										<td class="px-4 py-4 font-mono text-sm text-center">{item.quantity}</td>
										<td class="px-4 py-4 font-mono text-sm text-right">{formatCurrency(item.unitPrice)}</td>
										<td class="px-6 py-4 font-mono text-sm text-right">{formatCurrency(item.total)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}

				<!-- Rejection Reason -->
				{#if proposal.status === 'rejected' && proposal.rejectionReason}
					<div class="mt-8 border border-destructive/30 bg-destructive/5 p-6">
						<span class="font-mono text-[10px] tracking-widest text-destructive">REJECTION REASON</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">{proposal.rejectionReason}</p>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Pricing -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PRICING</span>
					<div class="mt-6 space-y-3">
						<div class="flex justify-between">
							<span class="font-body text-sm text-muted-foreground">Subtotal</span>
							<span class="font-mono text-sm">{formatCurrency(proposal.subtotal)}</span>
						</div>
						{#if proposal.taxRate > 0}
							<div class="flex justify-between">
								<span class="font-body text-sm text-muted-foreground">Tax ({proposal.taxRate}%)</span>
								<span class="font-mono text-sm">{formatCurrency(proposal.taxAmount)}</span>
							</div>
						{/if}
						{#if proposal.discount > 0}
							<div class="flex justify-between">
								<span class="font-body text-sm text-muted-foreground">Discount</span>
								<span class="font-mono text-sm text-green-500">-{formatCurrency(proposal.discount)}</span>
							</div>
						{/if}
						<div class="border-t border-border pt-3">
							<div class="flex justify-between">
								<span class="font-ui text-sm font-semibold">Total</span>
								<span class="font-mono text-lg font-semibold text-primary">{formatCurrency(proposal.total)}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Details -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">DETAILS</span>
					<div class="mt-6 space-y-4">
						<div class="flex items-center gap-3">
							<FolderKanban class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT</p>
								<p class="font-body text-sm">{proposal.project}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Building2 class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">ORGANIZATION</p>
								<p class="font-body text-sm">{proposal.organization}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<User class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATED BY</p>
								<p class="font-body text-sm">{proposal.createdBy}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Calendar class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATED</p>
								<p class="font-body text-sm">{formatDate(proposal.createdAt)}</p>
							</div>
						</div>
						{#if proposal.sentAt}
							<div class="flex items-center gap-3">
								<Send class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SENT</p>
									<p class="font-body text-sm">{formatDate(proposal.sentAt)}</p>
								</div>
							</div>
						{/if}
						{#if proposal.viewedAt}
							<div class="flex items-center gap-3">
								<Eye class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">VIEWED</p>
									<p class="font-body text-sm">{formatDate(proposal.viewedAt)}</p>
								</div>
							</div>
						{/if}
						{#if proposal.respondedAt}
							<div class="flex items-center gap-3">
								{#if proposal.status === 'accepted'}
									<CheckCircle class="h-4 w-4 text-green-500" />
								{:else}
									<X class="h-4 w-4 text-red-500" />
								{/if}
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">RESPONDED</p>
									<p class="font-body text-sm">{formatDate(proposal.respondedAt)}</p>
								</div>
							</div>
						{/if}
						{#if proposal.expiresAt}
							<div class="flex items-center gap-3">
								<Clock class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">EXPIRES</p>
									<p class="font-body text-sm">{formatDate(proposal.expiresAt)}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Assignment -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ASSIGNMENT</span>
					<form method="POST" action="?/assign" use:enhance class="mt-4">
						<label for="assignedToId" class="sr-only">Assigned To</label>
						<select
							id="assignedToId"
							name="assignedToId"
							class="font-body h-10 w-full border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
							value={proposal.assignedTo?.id ?? ''}
							onchange={(e) => e.currentTarget.form?.requestSubmit()}
						>
							<option value="">Unassigned</option>
							{#each data.staffMembers as staff}
								<option value={staff.id}>
									{staff.displayName} ({staff.role})
								</option>
							{/each}
						</select>
					</form>
					{#if proposal.assignedTo}
						<p class="font-body mt-2 text-xs text-muted-foreground">
							Currently assigned to {proposal.assignedTo.name}
						</p>
					{/if}
				</div>

				<!-- Actions -->
				<div class="mt-6 space-y-3">
					{#if proposal.status === 'draft'}
						<form method="POST" action="?/send" use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								loading = false;
								await update();
							};
						}}>
							<Button type="submit" disabled={loading} class="font-ui w-full text-xs tracking-wider">
								{#if loading}
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									SENDING...
								{:else}
									<Send class="mr-2 h-4 w-4" />
									SEND TO CLIENT
								{/if}
							</Button>
						</form>
						<Button href="/admin/proposals/{proposal.id}/edit" variant="outline" class="font-ui w-full text-xs tracking-wider">
							<Pencil class="mr-2 h-4 w-4" />
							EDIT PROPOSAL
						</Button>
					{:else if proposal.status === 'sent' || proposal.status === 'viewed'}
						<form method="POST" action="?/withdraw" use:enhance>
							<Button type="submit" variant="outline" class="font-ui w-full text-xs tracking-wider">
								<RotateCcw class="mr-2 h-4 w-4" />
								WITHDRAW PROPOSAL
							</Button>
						</form>
					{:else if proposal.status === 'accepted'}
						<Button href="/admin/projects/{proposal.projectId}" class="font-ui w-full text-xs tracking-wider">
							<FolderKanban class="mr-2 h-4 w-4" />
							VIEW PROJECT
						</Button>
					{/if}

					<Button onclick={handleDownloadPDF} disabled={pdfLoading} variant="outline" class="font-ui w-full text-xs tracking-wider">
						{#if pdfLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							GENERATING...
						{:else}
							<Download class="mr-2 h-4 w-4" />
							DOWNLOAD PDF
						{/if}
					</Button>

					{#if proposal.status === 'draft'}
						<form method="POST" action="?/delete" use:enhance>
							<Button type="submit" variant="outline" class="font-ui w-full border-destructive/50 text-xs tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground">
								<Trash2 class="mr-2 h-4 w-4" />
								DELETE PROPOSAL
							</Button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</section>
</div>
