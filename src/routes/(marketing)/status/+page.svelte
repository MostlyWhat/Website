<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import SectionHeader from '$lib/components/layout/SectionHeader.svelte';
	import LinkCTASection from '$lib/components/layout/LinkCTASection.svelte';
	import { CheckCircle, AlertTriangle, XCircle, Clock, ChevronDown } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Service status types
	type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';
	type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

	const statusConfig: Record<ServiceStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
		operational: { icon: CheckCircle, color: 'text-green-500', label: 'OPERATIONAL' },
		degraded: { icon: AlertTriangle, color: 'text-yellow-500', label: 'DEGRADED' },
		outage: { icon: XCircle, color: 'text-red-500', label: 'OUTAGE' },
		maintenance: { icon: Clock, color: 'text-blue-500', label: 'MAINTENANCE' }
	};

	const incidentStatusConfig: Record<IncidentStatus, { color: string; label: string }> = {
		investigating: { color: 'text-red-500 border-red-500', label: 'Investigating' },
		identified: { color: 'text-orange-500 border-orange-500', label: 'Identified' },
		monitoring: { color: 'text-blue-500 border-blue-500', label: 'Monitoring' },
		resolved: { color: 'text-green-500 border-green-500', label: 'Resolved' }
	};

	// Use data from server or fallback
	const services = $derived(data.services ?? []);
	const incidents = $derived(data.incidents ?? []);
	const uptimePercentage = $derived(data.uptimePercentage ?? '99.9');
	const lastUpdated = $derived(data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : new Date().toLocaleString());

	function getOverallStatus(): ServiceStatus {
		if (services.some((s: { status: string }) => s.status === 'outage')) return 'outage';
		if (services.some((s: { status: string }) => s.status === 'degraded')) return 'degraded';
		if (services.some((s: { status: string }) => s.status === 'maintenance')) return 'maintenance';
		return 'operational';
	}

	const overallStatus = $derived(getOverallStatus());
	const overallConfig = $derived(statusConfig[overallStatus]);

	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateTime(dateStr: string | Date | null): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Track expanded incidents
	let expandedIncidents = $state<Set<string>>(new Set());
	
	function toggleIncident(id: string) {
		if (expandedIncidents.has(id)) {
			expandedIncidents.delete(id);
		} else {
			expandedIncidents.add(id);
		}
		expandedIncidents = new Set(expandedIncidents);
	}
</script>

<svelte:head>
	<title>Status — {m.site_name()}</title>
	<meta name="description" content="Check the current status of MostlyWhat Systems services." />
</svelte:head>

<HeroSection label="// SYSTEM.HEALTH" title="SERVICE STATUS" />

<!-- Overall Status Banner -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex items-center gap-4 bg-background px-6 py-8 md:col-span-9 md:px-12 lg:px-16">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<overallConfig.icon class="h-6 w-6 {overallConfig.color}" />
			</div>
			<div>
				<h2 class="font-display text-xl font-bold uppercase md:text-2xl">ALL SYSTEMS {overallConfig.label}</h2>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">
					Last updated: {lastUpdated}
				</p>
			</div>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card px-6 py-8 md:col-span-3 md:px-12 lg:px-16">
			<div class="text-center">
				<span class="font-display text-4xl font-black text-primary">{uptimePercentage}%</span>
				<p class="font-mono mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">UPTIME (30 DAYS)</p>
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — SERVICES</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">CURRENT STATUS</h2>
	</div>
	<div class="border-t border-border">
		{#each services as service (service.id)}
			{@const config = statusConfig[service.status as ServiceStatus] ?? statusConfig.operational}
			<div class="flex items-center justify-between border-b border-border bg-background px-6 py-6 md:px-12 lg:px-16">
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<config.icon class="h-4 w-4 {config.color}" />
						<h3 class="font-ui text-sm font-semibold tracking-wider">{service.name}</h3>
					</div>
					{#if service.description}
						<p class="font-body mt-1 pl-7 text-xs text-muted-foreground">{service.description}</p>
					{/if}
				</div>
				<div class="flex items-center gap-6">
					{#if service.uptime}
						<div class="hidden text-right sm:block">
							<p class="font-mono text-xs tracking-wider text-muted-foreground">UPTIME</p>
							<p class="font-display text-sm font-bold text-primary">{service.uptime}%</p>
						</div>
					{/if}
					<span class="font-mono border border-current px-2 py-1 text-[10px] tracking-wider {config.color}">{config.label}</span>
				</div>
			</div>
		{/each}
		{#if services.length === 0}
			<div class="flex items-center gap-4 bg-background px-6 py-8 md:px-12 lg:px-16">
				<CheckCircle class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-muted-foreground">All systems operational.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Recent Incidents Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — HISTORY</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">RECENT INCIDENTS</h2>
	</div>
	<div class="border-t border-border">
		{#if incidents.length === 0}
			<div class="flex items-center gap-4 bg-background px-6 py-8 md:px-12 lg:px-16">
				<CheckCircle class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-muted-foreground">No incidents reported in the last 90 days.</p>
			</div>
		{:else}
			{#each incidents as incident (incident.id)}
				{@const statusConf = incidentStatusConfig[incident.status as IncidentStatus] ?? incidentStatusConfig.resolved}
				<div class="border-b border-border bg-background">
					<button 
						class="flex w-full items-start justify-between gap-4 px-6 py-6 text-left md:px-12 lg:px-16"
						onclick={() => toggleIncident(incident.id)}
					>
						<div class="flex-1">
							<div class="flex flex-wrap items-center gap-3">
								{#if incident.isScheduled}
									<span class="font-mono border border-blue-500 bg-blue-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-blue-500">
										SCHEDULED
									</span>
								{/if}
								<span class="font-mono border px-2 py-0.5 text-[10px] uppercase tracking-wider {statusConf.color}">
									{statusConf.label}
								</span>
								<span class="font-mono text-[10px] tracking-wider text-muted-foreground">{formatDate(incident.startedAt)}</span>
							</div>
							<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">{incident.title}</h3>
							{#if incident.description}
								<p class="font-body mt-2 text-sm text-muted-foreground">{incident.description}</p>
							{/if}
						</div>
						{#if incident.updates && incident.updates.length > 0}
							<ChevronDown class="h-5 w-5 text-muted-foreground transition-transform {expandedIncidents.has(incident.id) ? 'rotate-180' : ''}" />
						{/if}
					</button>
					{#if expandedIncidents.has(incident.id) && incident.updates && incident.updates.length > 0}
						<div class="border-t border-border/50 bg-card/50 px-6 py-4 md:px-12 lg:px-16">
							<p class="font-mono mb-3 text-[10px] tracking-widest text-muted-foreground">INCIDENT TIMELINE</p>
							<div class="space-y-3">
								{#each incident.updates as update (update.id)}
									{@const updateStatusConf = incidentStatusConfig[update.status as IncidentStatus] ?? incidentStatusConfig.investigating}
									<div class="flex gap-3 border-l-2 border-border pl-4">
										<div class="flex-1">
											<div class="flex items-center gap-2">
												<span class="font-mono text-[10px] uppercase tracking-wider {updateStatusConf.color}">{update.status}</span>
												<span class="font-mono text-[10px] text-muted-foreground">{formatDateTime(update.createdAt)}</span>
											</div>
											<p class="font-body mt-1 text-sm text-muted-foreground">{update.message}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</section>

<!-- Subscribe Section -->
<LinkCTASection
	title="STAY INFORMED"
	description="Subscribe to receive notifications about system status updates and scheduled maintenance."
	buttonText="SUBSCRIBE"
	buttonHref="mailto:status@mostlywhat.systems?subject=Status%20Updates%20Subscription"
/>
