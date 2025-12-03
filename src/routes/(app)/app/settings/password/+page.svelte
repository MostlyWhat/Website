<script lang="ts">
	/**
	 * Password Settings Page
	 * 
	 * Change password functionality
	 */
	import { enhance } from '$app/forms';
	import { KeyRound, Loader2, AlertTriangle, Check } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { form } = $props();

	let passwordLoading = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	function handlePasswordSubmit() {
		return async ({ result }: { result: unknown }) => {
			passwordLoading = false;
			if ((result as { type: string }).type === 'success') {
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			}
		};
	}
</script>

<svelte:head>
	<title>Password Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
			<KeyRound class="h-5 w-5 text-primary" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SECURITY</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Change Password</h2>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">{form.message ?? 'Password updated successfully.'}</p>
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
		action="?/changePassword"
		use:enhance={() => {
			passwordLoading = true;
			return handlePasswordSubmit();
		}}
		class="mt-8 max-w-md space-y-6"
	>
		<div class="space-y-2">
			<label for="currentPassword" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				CURRENT PASSWORD
			</label>
			<Input
				id="currentPassword"
				name="currentPassword"
				type="password"
				bind:value={currentPassword}
				required
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<div class="space-y-2">
			<label for="newPassword" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				NEW PASSWORD
			</label>
			<Input
				id="newPassword"
				name="newPassword"
				type="password"
				bind:value={newPassword}
				required
				minlength={8}
				class="h-12 border-border bg-card px-4 font-body"
			/>
			<p class="font-mono text-[10px] text-muted-foreground">Minimum 8 characters</p>
		</div>

		<div class="space-y-2">
			<label for="confirmPassword" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				CONFIRM NEW PASSWORD
			</label>
			<Input
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				bind:value={confirmPassword}
				required
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<div class="flex justify-start pt-4">
			<Button 
				type="submit" 
				disabled={passwordLoading || !currentPassword || !newPassword || newPassword !== confirmPassword} 
				class="font-ui text-xs tracking-wider"
			>
				{#if passwordLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					UPDATING...
				{:else}
					UPDATE PASSWORD
				{/if}
			</Button>
		</div>
	</form>
</div>
