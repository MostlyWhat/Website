<script lang="ts">
	/**
	 * Customer Dashboard
	 * 
	 * Overview of projects, invoices, and tickets for customers.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { FolderKanban, FileText, Receipt, Ticket, Clock, CheckCircle, ArrowRight, Plus } from '@lucide/svelte';

	let { data } = $props();

	// Placeholder stats - will be replaced with real data
	const stats = [
		{ label: 'ACTIVE PROJECTS', value: '03', icon: FolderKanban, href: '/app/projects' },
		{ label: 'PENDING PROPOSALS', value: '01', icon: FileText, href: '/app/proposals' },
		{ label: 'UNPAID INVOICES', value: '02', icon: Receipt, href: '/app/invoices' },
		{ label: 'OPEN TICKETS', value: '01', icon: Ticket, href: '/app/tickets' }
	];

	// Placeholder recent activity
	const recentActivity = [
		{ type: 'invoice_paid', title: 'Invoice #INV-001 paid', time: '2 hours ago', icon: CheckCircle },
		{ type: 'proposal', title: 'New proposal for Project Alpha', time: '1 day ago', icon: FileText },
		{ type: 'milestone', title: 'Project Beta milestone completed', time: '3 days ago', icon: FolderKanban }
	];

	const quickActions = [
		{ label: 'SUBMIT TICKET', icon: Ticket, href: '/app/tickets/new' },
		{ label: 'VIEW INVOICES', icon: Receipt, href: '/app/invoices' },
		{ label: 'REVIEW PROPOSALS', icon: FileText, href: '/app/proposals' },
		{ label: 'VIEW PROJECTS', icon: FolderKanban, href: '/app/projects' }
	];
</script>

<svelte:head>
	<title>Dashboard | MostlyWhat Systems</title>
</svelte:head>

<!-- Dashboard Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// DASHBOARD</span>
		<h1 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">
			Welcome back, {data.profile?.firstName ?? 'there'}
		</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Here's an overview of your account and recent activity.
		</p>
	</section>

	<!-- Stats Grid -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			{#each stats as { label, value, icon: Icon, href }}
				<a
					{href}
					class="group col-span-6 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-3 md:px-12 lg:px-16"
				>
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary">
						<Icon class="h-5 w-5 text-primary" />
					</div>
					<span class="font-display mt-6 text-3xl font-bold text-primary md:text-4xl">{value}</span>
					<span class="font-mono mt-2 text-[10px] tracking-widest text-muted-foreground">{label}</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- Activity & Actions Grid -->
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Recent Activity -->
		<div class="col-span-12 bg-background lg:col-span-6">
			<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — RECENT ACTIVITY</span>
			</div>
			<div class="px-6 py-8 md:px-12 lg:px-16">
				{#if recentActivity.length > 0}
					<div class="space-y-4">
						{#each recentActivity as { title, time, icon: Icon }}
							<div class="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
								<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
									<Icon class="h-4 w-4 text-primary" />
								</div>
								<div class="flex-1">
									<p class="font-ui text-sm font-medium">{title}</p>
									<p class="font-mono mt-1 text-[10px] tracking-wider text-muted-foreground">{time}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-8 text-center">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Clock class="h-5 w-5 text-muted-foreground" />
						</div>
						<p class="font-body mt-4 text-sm text-muted-foreground">No recent activity to show.</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="col-span-12 bg-background lg:col-span-6">
			<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — QUICK ACTIONS</span>
			</div>
			<div class="px-6 py-8 md:px-12 lg:px-16">
				<div class="grid grid-cols-2 gap-4">
					{#each quickActions as { label, icon: Icon, href }}
						<a
							{href}
							class="group flex flex-col items-start border border-border bg-card p-6 transition-colors hover:bg-card/80"
						>
							<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
								<Icon class="h-4 w-4 text-primary" />
							</div>
							<span class="font-ui mt-4 text-xs font-semibold tracking-wider">{label}</span>
							<ArrowRight class="mt-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom CTA -->
	<section class="border-b border-border bg-card">
		<div class="px-6 py-12 md:px-12 lg:px-16">
			<div class="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 class="font-display text-xl font-bold uppercase">Need Help?</h2>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						Submit a support ticket and our team will get back to you within 24 hours.
					</p>
				</div>
				<a
					href={localizeHref('/app/tickets/new')}
					class="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-ui text-sm tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<Plus class="h-4 w-4" />
					NEW TICKET
				</a>
			</div>
		</div>
	</section>
</div>
