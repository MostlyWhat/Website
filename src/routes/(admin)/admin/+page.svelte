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

	// Get stats from server data
	const stats = $derived([
		{ label: 'TOTAL USERS', value: String(data.stats?.totalUsers ?? 0), icon: Users, href: '/admin/users' },
		{ label: 'ORGANIZATIONS', value: String(data.stats?.organizations ?? 0), icon: Building2, href: '/admin/organizations' },
		{ label: 'ACTIVE PROJECTS', value: String(data.stats?.activeProjects ?? 0), icon: FolderKanban, href: '/admin/projects' },
		{ label: 'OPEN TICKETS', value: String(data.stats?.openTickets ?? 0), icon: Ticket, href: '/admin/tickets' }
	]);

	// Get pending items from server data
	const pendingItems = $derived(data.pendingItems ?? []);

	// Get recent activity from server data
	const recentActivity = $derived(data.recentActivity ?? []);

	// Format time ago
	function formatTimeAgo(dateStr: string | Date | null): string {
		if (!dateStr) return 'Unknown';
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return `${diffDays}d ago`;
		if (diffHours > 0) return `${diffHours}h ago`;
		if (diffMins > 0) return `${diffMins}m ago`;
		return 'Just now';
	}

	// Get icon component for activity type
	function getActivityIcon(iconName: string) {
		switch (iconName) {
			case 'Users': return Users;
			case 'FolderKanban': return FolderKanban;
			case 'Receipt': return Receipt;
			case 'CheckCircle': return CheckCircle;
			case 'Ticket': return Ticket;
			default: return Activity;
		}
	}

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
			{#each stats as { label, value, icon: Icon, href }}
				<a
					{href}
					class="group col-span-6 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-3 md:px-12 lg:px-16"
				>
					<div class="flex items-start justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary">
							<Icon class="h-5 w-5 text-primary" />
						</div>
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
			{#if recentActivity.length > 0}
				<div class="grid grid-cols-12 gap-4">
					{#each recentActivity as activity}
						{@const Icon = getActivityIcon(activity.icon)}
						<div class="col-span-12 flex items-start gap-4 md:col-span-6 lg:col-span-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Icon class="h-4 w-4 text-primary" />
							</div>
							<div class="min-w-0 flex-1">
								<p class="font-ui text-sm font-medium truncate">{activity.title}</p>
								<p class="font-body text-xs text-muted-foreground">{activity.subtitle}</p>
								<p class="font-mono mt-1 text-[10px] tracking-wider text-muted-foreground/70">{formatTimeAgo(activity.time)}</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<Activity class="h-5 w-5 text-muted-foreground" />
					</div>
					<p class="font-body mt-4 text-sm text-muted-foreground">No recent activity to show.</p>
				</div>
			{/if}
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
