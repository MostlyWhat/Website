<script lang="ts">
	/**
	 * Notification Settings Page
	 * 
	 * Manage notification preferences
	 */
	import { enhance } from '$app/forms';
	import { Bell, Mail, Loader2, Check, AlertTriangle, Ticket, FolderKanban, Receipt, Megaphone } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';

	let { data, form } = $props();

	let loading = $state(false);

	// Notification preferences
	let emailNotifications = $state(data.profile?.preferences?.emailNotifications ?? true);
	let ticketUpdates = $state(true);
	let projectUpdates = $state(true);
	let invoiceReminders = $state(true);
	let marketingEmails = $state(false);

	function handleSubmit() {
		return async ({ result }: { result: unknown }) => {
			loading = false;
		};
	}
</script>

<svelte:head>
	<title>Notification Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
			<Bell class="h-5 w-5 text-primary" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SETTINGS</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Notifications</h2>
		</div>
	</div>

	<p class="font-body mt-4 text-sm text-muted-foreground">
		Choose how you want to be notified about updates.
	</p>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">Preferences saved successfully.</p>
		</div>
	{/if}

	{#if form?.error}
		<div class="mt-6 flex items-center gap-3 border border-destructive/30 bg-destructive/10 px-4 py-3">
			<AlertTriangle class="h-5 w-5 text-destructive" />
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<form
		method="POST"
		action="?/updateNotifications"
		use:enhance={() => {
			loading = true;
			return handleSubmit();
		}}
		class="mt-8 max-w-2xl space-y-6"
	>
		<!-- Email Notifications Master Toggle -->
		<div class="border border-border bg-card">
			<div class="flex items-center justify-between gap-4 p-6">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
						<Mail class="h-5 w-5 text-muted-foreground" />
					</div>
					<div>
						<p class="font-ui text-sm font-semibold tracking-wider">Email Notifications</p>
						<p class="font-body text-xs text-muted-foreground">Receive updates via email</p>
					</div>
				</div>
				<Switch bind:checked={emailNotifications} />
				<input type="hidden" name="emailNotifications" value={emailNotifications ? 'true' : 'false'} />
			</div>
		</div>

		<!-- Individual Notification Types -->
		{#if emailNotifications}
			<div class="border border-border bg-card divide-y divide-border">
				<div class="px-4 py-3 bg-muted/30">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NOTIFICATION TYPES</span>
				</div>
				
				<div class="flex items-center justify-between gap-4 p-4">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
							<Ticket class="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<p class="font-ui text-sm tracking-wider">Ticket Updates</p>
							<p class="font-body text-xs text-muted-foreground">New replies and status changes</p>
						</div>
					</div>
					<Switch bind:checked={ticketUpdates} />
					<input type="hidden" name="ticketUpdates" value={ticketUpdates ? 'true' : 'false'} />
				</div>

				<div class="flex items-center justify-between gap-4 p-4">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
							<FolderKanban class="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<p class="font-ui text-sm tracking-wider">Project Updates</p>
							<p class="font-body text-xs text-muted-foreground">Progress and milestone notifications</p>
						</div>
					</div>
					<Switch bind:checked={projectUpdates} />
					<input type="hidden" name="projectUpdates" value={projectUpdates ? 'true' : 'false'} />
				</div>

				<div class="flex items-center justify-between gap-4 p-4">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
							<Receipt class="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<p class="font-ui text-sm tracking-wider">Invoice Reminders</p>
							<p class="font-body text-xs text-muted-foreground">Payment due dates and receipts</p>
						</div>
					</div>
					<Switch bind:checked={invoiceReminders} />
					<input type="hidden" name="invoiceReminders" value={invoiceReminders ? 'true' : 'false'} />
				</div>

				<div class="flex items-center justify-between gap-4 p-4">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
							<Megaphone class="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<p class="font-ui text-sm tracking-wider">Marketing</p>
							<p class="font-body text-xs text-muted-foreground">News and promotional content</p>
						</div>
					</div>
					<Switch bind:checked={marketingEmails} />
					<input type="hidden" name="marketingEmails" value={marketingEmails ? 'true' : 'false'} />
				</div>
			</div>
		{/if}

		<div class="flex justify-start pt-4">
			<Button type="submit" disabled={loading} class="font-ui text-xs tracking-wider">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					SAVING...
				{:else}
					SAVE PREFERENCES
				{/if}
			</Button>
		</div>
	</form>
</div>
