<script lang="ts">
	/**
	 * Admin Status Page Management
	 * 
	 * Manage service status and incidents for the public status page.
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { 
		Plus, 
		CheckCircle, 
		AlertTriangle, 
		XCircle, 
		Clock,
		Edit,
		Trash2,
		Activity,
		Server,
		Calendar,
		AlertOctagon,
		Info,
		Settings2,
		MoreVertical
	} from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import type { ServiceStatus, IncidentStatus, IncidentSeverity } from '$lib/server/db/schema';

	let { data } = $props();

	let activeTab = $state<'services' | 'incidents'>(data.filters?.tab as 'services' | 'incidents' ?? 'services');
	let serviceDialogOpen = $state(false);
	let incidentDialogOpen = $state(false);
	let updateDialogOpen = $state(false);
	let selectedIncident = $state<typeof data.incidents[0] | null>(null);
	let deleteConfirm = $state<string | null>(null);

	// Status configurations
	const serviceStatusConfig = {
		operational: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Operational' },
		degraded: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Degraded' },
		outage: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Outage' },
		maintenance: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Maintenance' }
	};

	const incidentStatusConfig = {
		investigating: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Investigating' },
		identified: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Identified' },
		monitoring: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Monitoring' },
		resolved: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Resolved' }
	};

	const severityConfig = {
		minor: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Minor' },
		major: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Major' },
		critical: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Critical' }
	};

	// Stats
	const stats = $derived.by(() => {
		const services = data.services ?? [];
		const incidents = data.incidents ?? [];
		return {
			totalServices: services.length,
			operational: services.filter((s: { status: string }) => s.status === 'operational').length,
			issues: services.filter((s: { status: string }) => s.status !== 'operational').length,
			activeIncidents: incidents.filter((i: { status: string }) => i.status !== 'resolved').length,
			resolvedIncidents: incidents.filter((i: { status: string }) => i.status === 'resolved').length
		};
	});

	// Format date
	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Get service name by ID
	function getServiceName(id: string): string {
		const service = (data.services ?? []).find((s: { id: string }) => s.id === id);
		return service?.name ?? 'Unknown';
	}
</script>

<svelte:head>
	<title>Status Page | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// SYSTEM STATUS</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Status Page
				</h1>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Manage service status and incidents for the public status page.
				</p>
			</div>
			<div class="flex items-center gap-3">
				{#if activeTab === 'services'}
					<Button variant="outline" onclick={() => serviceDialogOpen = true}>
						<Plus class="mr-2 h-4 w-4" />
						Add Service
					</Button>
				{:else}
					<Button variant="outline" onclick={() => incidentDialogOpen = true}>
						<Plus class="mr-2 h-4 w-4" />
						Report Incident
					</Button>
				{/if}
				<a href="/status" target="_blank" class="text-xs text-muted-foreground hover:text-foreground">
					View Public Page →
				</a>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="grid grid-cols-2 gap-px border-b border-border bg-border md:grid-cols-5">
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<Server class="h-5 w-5 text-muted-foreground" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">SERVICES</p>
				<p class="font-display text-xl font-bold">{stats.totalServices}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<CheckCircle class="h-5 w-5 text-green-500" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">OPERATIONAL</p>
				<p class="font-display text-xl font-bold text-green-500">{stats.operational}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<AlertTriangle class="h-5 w-5 text-yellow-500" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">ISSUES</p>
				<p class="font-display text-xl font-bold text-yellow-500">{stats.issues}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<AlertOctagon class="h-5 w-5 text-red-500" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">ACTIVE</p>
				<p class="font-display text-xl font-bold text-red-500">{stats.activeIncidents}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<Activity class="h-5 w-5 text-primary" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">RESOLVED</p>
				<p class="font-display text-xl font-bold">{stats.resolvedIncidents}</p>
			</div>
		</div>
	</section>

	<!-- Tab Navigation -->
	<section class="border-b border-border bg-card">
		<div class="flex">
			<button
				onclick={() => activeTab = 'services'}
				class="px-6 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'services' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Server class="mr-2 inline-block h-4 w-4" />
				SERVICES
			</button>
			<button
				onclick={() => activeTab = 'incidents'}
				class="px-6 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'incidents' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<AlertOctagon class="mr-2 inline-block h-4 w-4" />
				INCIDENTS
			</button>
		</div>
	</section>

	<!-- Content -->
	<section class="border-b border-border">
		{#if activeTab === 'services'}
			<!-- Services List -->
			{#if (data.services ?? []).length === 0}
				<div class="flex flex-col items-center justify-center px-6 py-16">
					<Server class="h-12 w-12 text-muted-foreground/30" />
					<p class="mt-4 text-sm text-muted-foreground">No services configured yet.</p>
					<Button variant="outline" class="mt-4" onclick={() => serviceDialogOpen = true}>
						<Plus class="mr-2 h-4 w-4" />
						Add First Service
					</Button>
				</div>
			{:else}
				{#each data.services as service (service.id)}
					{@const config = serviceStatusConfig[service.status as ServiceStatus]}
					<div class="flex items-center justify-between border-b border-border bg-background px-6 py-4 last:border-b-0">
						<div class="flex items-center gap-4">
							<div class="flex h-10 w-10 items-center justify-center border border-border {config.bg}">
								<config.icon class="h-5 w-5 {config.color}" />
							</div>
							<div>
								<h3 class="font-ui text-sm font-semibold tracking-wider">{service.name}</h3>
								{#if service.description}
									<p class="font-body text-xs text-muted-foreground">{service.description}</p>
								{/if}
							</div>
						</div>
						<div class="flex items-center gap-4">
							<span class="font-mono border px-2 py-1 text-[10px] tracking-wider {config.color} border-current">
								{config.label.toUpperCase()}
							</span>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button variant="ghost" size="sm">
										<MoreVertical class="h-4 w-4" />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<form method="POST" action="?/updateServiceStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={service.id} />
										<input type="hidden" name="status" value="operational" />
										<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<CheckCircle class="mr-2 h-4 w-4 text-green-500" /> Operational
										</DropdownMenu.Item>
									</form>
									<form method="POST" action="?/updateServiceStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={service.id} />
										<input type="hidden" name="status" value="degraded" />
										<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<AlertTriangle class="mr-2 h-4 w-4 text-yellow-500" /> Degraded
										</DropdownMenu.Item>
									</form>
									<form method="POST" action="?/updateServiceStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={service.id} />
										<input type="hidden" name="status" value="outage" />
										<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<XCircle class="mr-2 h-4 w-4 text-red-500" /> Outage
										</DropdownMenu.Item>
									</form>
									<form method="POST" action="?/updateServiceStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={service.id} />
										<input type="hidden" name="status" value="maintenance" />
										<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<Clock class="mr-2 h-4 w-4 text-blue-500" /> Maintenance
										</DropdownMenu.Item>
									</form>
									<DropdownMenu.Separator />
									{#if deleteConfirm === service.id}
										<form method="POST" action="?/deleteService" use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													deleteConfirm = null;
													invalidateAll();
												}
											};
										}}>
											<input type="hidden" name="id" value={service.id} />
											<DropdownMenu.Item class="cursor-pointer text-destructive" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
												<Trash2 class="mr-2 h-4 w-4" /> Confirm Delete
											</DropdownMenu.Item>
										</form>
									{:else}
										<DropdownMenu.Item class="cursor-pointer text-destructive" onclick={() => deleteConfirm = service.id}>
											<Trash2 class="mr-2 h-4 w-4" /> Delete
										</DropdownMenu.Item>
									{/if}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				{/each}
			{/if}
		{:else}
			<!-- Incidents List -->
			{#if (data.incidents ?? []).length === 0}
				<div class="flex flex-col items-center justify-center px-6 py-16">
					<AlertOctagon class="h-12 w-12 text-muted-foreground/30" />
					<p class="mt-4 text-sm text-muted-foreground">No incidents recorded yet.</p>
					<Button variant="outline" class="mt-4" onclick={() => incidentDialogOpen = true}>
						<Plus class="mr-2 h-4 w-4" />
						Report Incident
					</Button>
				</div>
			{:else}
				{#each data.incidents as incident (incident.id)}
					{@const statusConf = incidentStatusConfig[incident.status as IncidentStatus]}
					{@const severityConf = severityConfig[incident.severity as IncidentSeverity]}
					<div class="border-b border-border bg-background px-6 py-4 last:border-b-0">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="flex flex-wrap items-center gap-2">
									{#if incident.isScheduled}
										<span class="font-mono border border-blue-500 bg-blue-500/10 px-2 py-0.5 text-[10px] tracking-wider text-blue-500">
											SCHEDULED
										</span>
									{/if}
									<span class="font-mono border px-2 py-0.5 text-[10px] tracking-wider {statusConf.color} border-current {statusConf.bg}">
										{statusConf.label.toUpperCase()}
									</span>
									<span class="font-mono border px-2 py-0.5 text-[10px] tracking-wider {severityConf.color} border-current {severityConf.bg}">
										{severityConf.label.toUpperCase()}
									</span>
								</div>
								<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">{incident.title}</h3>
								{#if incident.description}
									<p class="font-body mt-1 text-xs text-muted-foreground">{incident.description}</p>
								{/if}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each (incident.affectedServices ?? []) as serviceId}
										<span class="font-mono border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
											{getServiceName(serviceId)}
										</span>
									{/each}
								</div>
								<p class="font-mono mt-2 text-[10px] text-muted-foreground">
									Started: {formatDate(incident.startedAt)}
									{#if incident.resolvedAt}
										 · Resolved: {formatDate(incident.resolvedAt)}
									{/if}
								</p>
							</div>
							<div class="flex items-center gap-2">
								{#if incident.status !== 'resolved'}
									<Button variant="outline" size="sm" onclick={() => { selectedIncident = incident; updateDialogOpen = true; }}>
										<Edit class="mr-2 h-3 w-3" />
										Update
									</Button>
								{/if}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Button variant="ghost" size="sm">
											<MoreVertical class="h-4 w-4" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										{#if deleteConfirm === incident.id}
											<form method="POST" action="?/deleteIncident" use:enhance={() => {
												return async ({ result }) => {
													if (result.type === 'success') {
														deleteConfirm = null;
														invalidateAll();
													}
												};
											}}>
												<input type="hidden" name="id" value={incident.id} />
												<DropdownMenu.Item class="cursor-pointer text-destructive" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
													<Trash2 class="mr-2 h-4 w-4" /> Confirm Delete
												</DropdownMenu.Item>
											</form>
										{:else}
											<DropdownMenu.Item class="cursor-pointer text-destructive" onclick={() => deleteConfirm = incident.id}>
												<Trash2 class="mr-2 h-4 w-4" /> Delete
											</DropdownMenu.Item>
										{/if}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		{/if}
	</section>
</div>

<!-- Add Service Dialog -->
<Dialog.Root bind:open={serviceDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Service</Dialog.Title>
			<Dialog.Description>Add a new service to the status page.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createService" use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					serviceDialogOpen = false;
					toast.success('Service created successfully');
					invalidateAll();
				} else if (result.type === 'failure') {
					const message = (result.data as { message?: string })?.message ?? 'Failed to create service';
					toast.error(message);
				}
			};
		}}>
			<Dialog.Body class="space-y-4">
				<div>
					<Label for="name">Service Name</Label>
					<Input id="name" name="name" placeholder="e.g., Website, API, Database" required />
				</div>
				<div>
					<Label for="description">Description</Label>
					<Input id="description" name="description" placeholder="Brief description of the service" />
				</div>
			</Dialog.Body>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => serviceDialogOpen = false}>Cancel</Button>
				<Button type="submit">Add Service</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Report Incident Dialog -->
<Dialog.Root bind:open={incidentDialogOpen}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Report Incident</Dialog.Title>
			<Dialog.Description>Create a new incident or scheduled maintenance.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createIncident" use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					incidentDialogOpen = false;
					toast.success('Incident reported successfully');
					invalidateAll();
				} else if (result.type === 'failure') {
					const message = (result.data as { message?: string })?.message ?? 'Failed to report incident';
					toast.error(message);
				}
			};
		}}>
			<Dialog.Body class="space-y-4">
				<div>
					<Label for="title">Title</Label>
					<Input id="title" name="title" placeholder="Brief incident title" required />
				</div>
				<div>
					<Label for="incidentDescription">Description</Label>
					<Textarea id="incidentDescription" name="description" placeholder="Describe the incident..." rows={3} />
				</div>
				<div>
					<Label for="severity">Severity</Label>
					<select name="severity" id="severity" class="w-full rounded border border-border bg-background px-3 py-2 text-sm">
						<option value="minor">Minor</option>
						<option value="major">Major</option>
						<option value="critical">Critical</option>
					</select>
				</div>
				<div>
					<Label>Affected Services</Label>
					<div class="mt-2 space-y-2 rounded border border-border p-3">
						{#each (data.services ?? []) as service}
							<label class="flex items-center gap-2">
								<input type="checkbox" name="affectedServices" value={service.id} class="rounded border-border" />
								<span class="text-sm">{service.name}</span>
							</label>
						{/each}
						{#if (data.services ?? []).length === 0}
							<p class="text-sm text-muted-foreground">No services configured. Add services first.</p>
						{/if}
					</div>
				</div>
				<div>
					<label class="flex items-center gap-2">
						<input type="checkbox" name="isScheduled" value="true" class="rounded border-border" />
						<span class="text-sm">Scheduled Maintenance</span>
					</label>
				</div>
			</Dialog.Body>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => incidentDialogOpen = false}>Cancel</Button>
				<Button type="submit">Report Incident</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Update Incident Dialog -->
<Dialog.Root bind:open={updateDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Incident</Dialog.Title>
			<Dialog.Description>Post an update for: {selectedIncident?.title}</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateIncidentStatus" use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					updateDialogOpen = false;
					selectedIncident = null;
					toast.success('Incident updated successfully');
					invalidateAll();
				} else if (result.type === 'failure') {
					const message = (result.data as { message?: string })?.message ?? 'Failed to update incident';
					toast.error(message);
				}
			};
		}}>
			<input type="hidden" name="id" value={selectedIncident?.id} />
			<Dialog.Body class="space-y-4">
				<div>
					<Label for="updateStatus">New Status</Label>
					<select name="status" id="updateStatus" class="w-full rounded border border-border bg-background px-3 py-2 text-sm">
						<option value="investigating">Investigating</option>
						<option value="identified">Identified</option>
						<option value="monitoring">Monitoring</option>
						<option value="resolved">Resolved</option>
					</select>
				</div>
				<div>
					<Label for="updateMessage">Update Message</Label>
					<Textarea id="updateMessage" name="message" placeholder="Describe the current status..." rows={3} />
				</div>
			</Dialog.Body>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => { updateDialogOpen = false; selectedIncident = null; }}>Cancel</Button>
				<Button type="submit">Post Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
