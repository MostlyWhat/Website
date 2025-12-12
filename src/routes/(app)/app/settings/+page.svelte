<script lang="ts">
	/**
	 * Account Settings Page
	 * 
	 * Manage profile information
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { User, Loader2, AlertTriangle, Check, Key } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import ApiKeysSettings from '$lib/components/settings/ApiKeysSettings.svelte';	import { PageSection } from '$lib/components/ui/layouts';
	let { data, form } = $props();

	let profileLoading = $state(false);

	// Profile form state
	let firstName = $state(data.profile?.firstName ?? '');
	let lastName = $state(data.profile?.lastName ?? '');
	let displayName = $state(data.profile?.displayName ?? '');
	let phone = $state(data.profile?.phone ?? '');

	function handleProfileSubmit() {
		return async ({ result }: { result: unknown }) => {
			profileLoading = false;
			if ((result as { type: string }).type === 'success') {
				await invalidateAll();
			}
		};
	}
</script>

<svelte:head>
	<title>Account Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
			<User class="h-5 w-5 text-primary" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SETTINGS</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Personal Information</h2>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">{form.message ?? 'Changes saved successfully.'}</p>
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
		action="?/updateProfile"
		use:enhance={() => {
			profileLoading = true;
			return handleProfileSubmit();
		}}
		class="mt-8 max-w-xl space-y-6"
	>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<div class="space-y-2">
				<label for="firstName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					FIRST NAME
				</label>
				<Input
					id="firstName"
					name="firstName"
					type="text"
					bind:value={firstName}
					placeholder="John"
					class="h-12 border-border bg-card px-4 font-body"
				/>
			</div>
			<div class="space-y-2">
				<label for="lastName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					LAST NAME
				</label>
				<Input
					id="lastName"
					name="lastName"
					type="text"
					bind:value={lastName}
					placeholder="Doe"
					class="h-12 border-border bg-card px-4 font-body"
				/>
			</div>
		</div>

		<div class="space-y-2">
			<label for="displayName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				DISPLAY NAME
			</label>
			<Input
				id="displayName"
				name="displayName"
				type="text"
				bind:value={displayName}
				placeholder="How should we call you?"
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<div class="space-y-2">
			<label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				EMAIL ADDRESS
			</label>
			<Input
				id="email"
				type="email"
				value={data.user?.email ?? ''}
				disabled
				class="h-12 border-border bg-muted px-4 font-body text-muted-foreground"
			/>
			<p class="font-mono text-[10px] text-muted-foreground">Email cannot be changed.</p>
		</div>

		<div class="space-y-2">
			<label for="phone" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				PHONE NUMBER <span class="text-muted-foreground/50">(OPTIONAL)</span>
			</label>
			<Input
				id="phone"
				name="phone"
				type="tel"
				bind:value={phone}
				placeholder="+66 XXX XXX XXXX"
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<div class="flex justify-end pt-4">
			<Button type="submit" disabled={profileLoading} class="font-ui text-xs tracking-wider">
				{#if profileLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					SAVING...
				{:else}
					SAVE CHANGES
				{/if}
			</Button>
		</div>
	</form>

	<!-- API Keys Section -->
	<div class="mt-16 border-t border-border pt-8">
		<div class="flex items-center gap-4">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<Key class="h-5 w-5 text-primary" />
			</div>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">API ACCESS</span>
				<h2 class="font-ui text-lg font-semibold tracking-wider">API Keys</h2>
			</div>
		</div>

		<div class="mt-8">
			<ApiKeysSettings />
		</div>
	</div>
</div>
