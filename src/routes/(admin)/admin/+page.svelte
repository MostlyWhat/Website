<script lang="ts">
	/**
	 * Admin Dashboard
	 * 
	 * Overview of system metrics and management quick actions.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { 
		Users, Building2, FolderKanban, FileText, Receipt, Ticket, 
		TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, Plus, Activity
	} from '@lucide/svelte';

	let { data } = $props();

	// Placeholder stats - will be replaced with real data from database
	const stats = [
		{ label: 'TOTAL USERS', value: '127', change: '+12%', icon: Users, href: '/admin/users' },
		{ label: 'ORGANIZATIONS', value: '34', change: '+5%', icon: Building2, href: '/admin/organizations' },
		{ label: 'ACTIVE PROJECTS', value: '18', change: '+3%', icon: FolderKanban, href: '/admin/projects' },
		{ label: 'OPEN TICKETS', value: '7', change: '-15%', icon: Ticket, href: '/admin/tickets' }
	];

	const pendingItems = [
		{ type: 'proposal', label: 'Proposals pending approval', count: 3, href: '/admin/proposals?status=pending' },
		{ type: 'invoice', label: 'Invoices awaiting payment', count: 5, href: '/admin/invoices?status=pending' },
		{ type: 'ticket', label: 'Tickets awaiting response', count: 4, href: '/admin/tickets?status=open' },
		{ type: 'user', label: 'Users awaiting approval', count: 2, href: '/admin/users?status=pending' }
	];

	const recentActivity = [
		{ title: 'New user registered', subtitle: 'john@example.com', time: '5 min ago', icon: Users },
		{ title: 'Project "Alpha" completed', subtitle: 'Marked as delivered', time: '1 hour ago', icon: CheckCircle },
		{ title: 'Invoice #INV-042 paid', subtitle: '$4,500.00', time: '2 hours ago', icon: Receipt },
		{ title: 'New ticket submitted', subtitle: 'Priority: High', time: '3 hours ago', icon: Ticket }
	];

	const quickActions = [
		{ label: 'NEW USER', icon: Users, href: '/admin/users/new' },
		{ label: 'NEW PROJECT', icon: FolderKanban, href: '/admin/projects/new' },
		{ label: 'NEW PROPOSAL', icon: FileText, href: '/admin/proposals/new' },
		{ label: 'NEW INVOICE', icon: Receipt, href: '/admin/invoices/new' }
	];
</script>

<svelte:head>
	<title>Admin Dashboard | MostlyWhat Systems</title>
</svelte:head>

<!-- Dashboard Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ADMIN DASHBOARD</span>
		<h1 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">
			System Overview
		</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Monitor activity, manage users, and track business metrics.
		</p>
	</section>

	<!-- Stats Grid -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			{#each stats as { label, value, change, icon: Icon, href }}
				<a
					{href}
					class="group col-span-6 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-3 md:px-12 lg:px-16"
				>
					<div class="flex items-start justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary">
							<Icon class="h-5 w-5 text-primary" />
						</div>
						<span class="font-mono flex items-center gap-1 text-[10px] tracking-wider {change.startsWith('+') ? 'text-green-500' : 'text-red-500'}">
							<TrendingUp class="h-3 w-3 {change.startsWith('-') ? 'rotate-180' : ''}" />
							{change}
						</span>
					</div>
					<span class="font-display mt-6 text-3xl font-bold text-foreground md:text-4xl">{value}</span>
					<span class="font-mono mt-2 text-[10px] tracking-widest text-muted-foreground">{label}</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- Pending Items & Quick Actions -->
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Pending Items -->
		<div class="col-span-12 bg-background lg:col-span-6">
			<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PENDING ITEMS</span>
			</div>
			<div class="px-6 py-8 md:px-12 lg:px-16">
				<div class="space-y-3">
					{#each pendingItems as { label, count, href }}
						<a
							{href}
							class="group flex items-center justify-between border border-border bg-card p-4 transition-colors hover:bg-card/80"
						>
							<div class="flex items-center gap-4">
								<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
									<AlertCircle class="h-4 w-4 text-yellow-500" />
								</div>
								<span class="font-body text-sm">{label}</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="font-display text-xl font-bold text-primary">{count}</span>
								<ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
							</div>
						</a>
					{/each}
				</div>
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
								<Plus class="h-4 w-4 text-primary" />
							</div>
							<span class="font-ui mt-4 text-xs font-semibold tracking-wider">{label}</span>
							<ArrowRight class="mt-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Activity -->
	<section class="border-b border-border bg-background">
		<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — RECENT ACTIVITY</span>
		</div>
		<div class="px-6 py-8 md:px-12 lg:px-16">
			<div class="grid grid-cols-12 gap-4">
				{#each recentActivity as { title, subtitle, time, icon: Icon }}
					<div class="col-span-12 flex items-start gap-4 md:col-span-6 lg:col-span-3">
						<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
							<Icon class="h-4 w-4 text-primary" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="font-ui text-sm font-medium truncate">{title}</p>
							<p class="font-body text-xs text-muted-foreground">{subtitle}</p>
							<p class="font-mono mt-1 text-[10px] tracking-wider text-muted-foreground/70">{time}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- System Status Bar -->
	<section class="bg-card">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-4 flex items-center gap-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">SYSTEM ONLINE</span>
			</div>
			<div class="col-span-4 flex items-center justify-center gap-2 bg-background px-6 py-4">
				<Activity class="h-4 w-4 text-primary" />
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">API HEALTHY</span>
			</div>
			<div class="col-span-4 flex items-center justify-end gap-2 bg-background px-6 py-4 md:px-12 lg:px-16">
				<Clock class="h-4 w-4 text-muted-foreground" />
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST SYNC: NOW</span>
			</div>
		</div>
	</section>
</div>
