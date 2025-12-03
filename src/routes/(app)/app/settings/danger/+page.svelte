<script lang="ts">
	/**
	 * Danger Zone Settings Page
	 * 
	 * Account deletion functionality
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Trash2, Loader2, AlertTriangle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';

	let { form } = $props();

	let deleteLoading = $state(false);
	let showDeleteDialog = $state(false);
	let deleteConfirmText = $state('');

	const canDelete = $derived(deleteConfirmText === 'DELETE MY ACCOUNT');

	function handleDeleteSubmit() {
		return async ({ result }: { result: unknown }) => {
			deleteLoading = false;
			if ((result as { type: string }).type === 'redirect') {
				goto('/');
			}
		};
	}
</script>

<svelte:head>
	<title>Danger Zone | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-destructive/50 bg-destructive/10">
			<Trash2 class="h-5 w-5 text-destructive" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-destructive">DANGER ZONE</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Delete Account</h2>
		</div>
	</div>

	{#if form?.error}
		<div class="mt-6 flex items-center gap-3 border border-destructive/30 bg-destructive/10 px-4 py-3">
			<AlertTriangle class="h-5 w-5 text-destructive" />
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<div class="mt-6 max-w-2xl">
		<p class="font-body text-sm text-muted-foreground">
			Once you delete your account, there is no going back. This will permanently delete:
		</p>
		<ul class="mt-4 space-y-2">
			{#each [
				'Your profile and personal information',
				'All tickets and support conversations',
				'Organizations where you are the only member (and all their data)',
				'Your membership in shared organizations'
			] as item}
				<li class="flex items-start gap-2 text-sm">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 bg-destructive"></span>
					<span class="font-body text-muted-foreground">{item}</span>
				</li>
			{/each}
		</ul>

		<Button
			variant="outline"
			onclick={() => showDeleteDialog = true}
			class="font-ui mt-6 border-destructive/50 text-xs tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground"
		>
			<Trash2 class="mr-2 h-4 w-4" />
			DELETE MY ACCOUNT
		</Button>
	</div>
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="max-w-md border-destructive/30 bg-background p-0">
		<div class="border-b border-border px-6 py-4">
			<Dialog.Title class="font-display text-lg font-bold uppercase">Confirm Deletion</Dialog.Title>
			<Dialog.Description class="font-body mt-1 text-sm text-muted-foreground">
				This action cannot be undone.
			</Dialog.Description>
		</div>

		<form
			method="POST"
			action="?/deleteAccount"
			use:enhance={() => {
				deleteLoading = true;
				return handleDeleteSubmit();
			}}
			class="px-6 py-6"
		>
			<div class="flex items-start gap-4 border border-destructive/30 bg-destructive/10 p-4">
				<AlertTriangle class="h-5 w-5 flex-shrink-0 text-destructive" />
				<div>
					<p class="font-ui text-sm font-semibold text-destructive">Warning</p>
					<p class="font-body mt-1 text-xs text-muted-foreground">
						All your data will be permanently deleted. Active projects and invoices associated with your organizations will also be removed if you are the only member.
					</p>
				</div>
			</div>

			<div class="mt-6 space-y-2">
				<label for="confirmDelete" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					TYPE "DELETE MY ACCOUNT" TO CONFIRM
				</label>
				<Input
					id="confirmDelete"
					type="text"
					bind:value={deleteConfirmText}
					placeholder="DELETE MY ACCOUNT"
					class="h-12 border-destructive/30 bg-card px-4 font-mono text-sm tracking-wider"
				/>
			</div>

			<div class="mt-6 flex gap-3">
				<Button
					type="button"
					variant="outline"
					onclick={() => {
						showDeleteDialog = false;
						deleteConfirmText = '';
					}}
					class="font-ui flex-1 text-xs tracking-wider"
				>
					CANCEL
				</Button>
				<Button
					type="submit"
					disabled={!canDelete || deleteLoading}
					class="font-ui flex-1 bg-destructive text-xs tracking-wider text-destructive-foreground hover:bg-destructive/90"
				>
					{#if deleteLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						DELETING...
					{:else}
						DELETE ACCOUNT
					{/if}
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
