<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import SectionHeader from '$lib/components/layout/SectionHeader.svelte';
	import LinkCTASection from '$lib/components/layout/LinkCTASection.svelte';
	import { CheckCircle, AlertTriangle, XCircle, Clock } from '@lucide/svelte';

	// Service status types
	type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

	interface Service {
		name: string;
		description: string;
		status: ServiceStatus;
		uptime: string;
	}

	interface Incident {
		id: string;
		title: string;
		status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
		date: string;
		description: string;
	}

	const services: Service[] = [
		{ name: 'WEBSITE', description: 'Main website and landing pages', status: 'operational', uptime: '99.99%' },
		{ name: 'API', description: 'REST API endpoints', status: 'operational', uptime: '99.95%' },
		{ name: 'DASHBOARD', description: 'Client dashboard and portals', status: 'operational', uptime: '99.98%' },
		{ name: 'CDN', description: 'Content delivery network', status: 'operational', uptime: '100%' },
		{ name: 'DATABASE', description: 'Primary database clusters', status: 'operational', uptime: '99.97%' },
		{ name: 'EMAIL', description: 'Transactional email service', status: 'operational', uptime: '99.90%' }
	];

	const recentIncidents: Incident[] = [
		{
			id: '001',
			title: 'Scheduled Maintenance Complete',
			status: 'resolved',
			date: '2025-01-15',
			description: 'Database optimization completed successfully. No service interruption occurred.'
		}
	];

	const statusConfig: Record<ServiceStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
		operational: { icon: CheckCircle, color: 'text-green-500', label: 'OPERATIONAL' },
		degraded: { icon: AlertTriangle, color: 'text-yellow-500', label: 'DEGRADED' },
		outage: { icon: XCircle, color: 'text-red-500', label: 'OUTAGE' },
		maintenance: { icon: Clock, color: 'text-blue-500', label: 'MAINTENANCE' }
	};

	function getOverallStatus(): ServiceStatus {
		if (services.some(s => s.status === 'outage')) return 'outage';
		if (services.some(s => s.status === 'degraded')) return 'degraded';
		if (services.some(s => s.status === 'maintenance')) return 'maintenance';
		return 'operational';
	}

	const overallStatus = getOverallStatus();
	const overallConfig = $derived(statusConfig[overallStatus]);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Status — {m.site_name()}</title>
	<meta name="description" content="Check the current status of MostlyWhat Systems services." />
</svelte:head>

<HeroSection label="SYSTEM STATUS" title="SERVICE STATUS" />

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
					Last updated: {new Date().toLocaleString()}
				</p>
			</div>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card px-6 py-8 md:col-span-3 md:px-12 lg:px-16">
			<div class="text-center">
				<span class="font-display text-4xl font-black text-primary">99.9%</span>
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
		{#each services as service (service.name)}
			{@const config = statusConfig[service.status]}
			<div class="flex items-center justify-between border-b border-border bg-background px-6 py-6 md:px-12 lg:px-16">
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<config.icon class="h-4 w-4 {config.color}" />
						<h3 class="font-ui text-sm font-semibold tracking-wider">{service.name}</h3>
					</div>
					<p class="font-body mt-1 pl-7 text-xs text-muted-foreground">{service.description}</p>
				</div>
				<div class="flex items-center gap-6">
					<div class="hidden text-right sm:block">
						<p class="font-mono text-xs tracking-wider text-muted-foreground">UPTIME</p>
						<p class="font-display text-sm font-bold text-primary">{service.uptime}</p>
					</div>
					<span class="font-mono border border-current px-2 py-1 text-[10px] tracking-wider {config.color}">{config.label}</span>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Recent Incidents Section -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — HISTORY</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">RECENT INCIDENTS</h2>
	</div>
	<div class="border-t border-border">
		{#if recentIncidents.length === 0}
			<div class="flex items-center gap-4 bg-background px-6 py-8 md:px-12 lg:px-16">
				<CheckCircle class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-muted-foreground">No incidents reported in the last 90 days.</p>
			</div>
		{:else}
			{#each recentIncidents as incident (incident.id)}
				<div class="border-b border-border bg-background px-6 py-6 md:px-12 lg:px-16">
					<div class="flex items-start justify-between gap-4">
						<div>
							<div class="flex items-center gap-3">
								<span class="font-mono border border-green-500 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-500">{incident.status}</span>
								<span class="font-mono text-[10px] tracking-wider text-muted-foreground">{formatDate(incident.date)}</span>
							</div>
							<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">{incident.title}</h3>
							<p class="font-body mt-2 text-sm text-muted-foreground">{incident.description}</p>
						</div>
					</div>
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
