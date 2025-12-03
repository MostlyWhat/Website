<script lang="ts">
	/**
	 * Account Settings Page
	 * 
	 * Manage profile, preferences, and account deletion
	 */
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { ArrowLeft, User, Mail, Bell, Shield, Trash2, Loader2, AlertTriangle, Check, KeyRound } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';

	let { data, form } = $props();

	let profileLoading = $state(false);
	let passwordLoading = $state(false);
	let deleteLoading = $state(false);
	let showDeleteDialog = $state(false);
	let deleteConfirmText = $state('');

	// Profile form state
	let firstName = $state(data.profile?.firstName ?? '');
	let lastName = $state(data.profile?.lastName ?? '');
	let displayName = $state(data.profile?.displayName ?? '');
	let phone = $state(data.profile?.phone ?? '');

	// Password form state
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	const canDelete = $derived(deleteConfirmText === 'DELETE MY ACCOUNT');

	function handleProfileSubmit() {
		return async ({ result }: { result: any }) => {
			profileLoading = false;
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	}

	function handlePasswordSubmit() {
		return async ({ result }: { result: any }) => {
			passwordLoading = false;
			if (result.type === 'success') {
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			}
		};
	}

	function handleDeleteSubmit() {
		return async ({ result }: { result: any }) => {
			deleteLoading = false;
			if (result.type === 'redirect') {
				goto('/');
			}
		};
	}
</script>

<svelte:head>
	<title>Account Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/app"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO DASHBOARD</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Account Settings</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Manage your profile information and account preferences.
		</p>
	</section>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<section class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<Check class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-green-500">{form.message ?? 'Changes saved successfully.'}</p>
			</div>
		</section>
	{/if}

	{#if form?.error}
		<section class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<AlertTriangle class="h-5 w-5 text-destructive" />
				<p class="font-body text-sm text-destructive">{form.error}</p>
			</div>
		</section>
	{/if}

	<!-- Settings Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Profile Settings -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<User class="h-5 w-5 text-primary" />
					</div>
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PROFILE</span>
						<h2 class="font-ui text-lg font-semibold tracking-wider">Personal Information</h2>
					</div>
				</div>

				<form
					method="POST"
					action="?/updateProfile"
					use:enhance={() => {
						profileLoading = true;
						return handleProfileSubmit();
					}}
					class="mt-8 space-y-6"
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
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Account Info -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACCOUNT INFO</span>
					
					<div class="mt-4 space-y-3">
						<div class="flex items-center gap-3">
							<Mail class="h-4 w-4 text-muted-foreground" />
							<span class="font-body text-sm truncate">{data.user?.email}</span>
						</div>
						<div class="flex items-center gap-3">
							<Shield class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-xs tracking-wider uppercase text-muted-foreground">
								{data.profile?.role ?? 'CUSTOMER'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Change Password Section -->
	<section class="border-b border-border bg-background">
		<div class="px-6 py-8 md:px-12 lg:px-16">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
					<KeyRound class="h-5 w-5 text-primary" />
				</div>
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — SECURITY</span>
					<h2 class="font-ui text-lg font-semibold tracking-wider">Change Password</h2>
				</div>
			</div>

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
					<Button type="submit" disabled={passwordLoading || !currentPassword || !newPassword || newPassword !== confirmPassword} class="font-ui text-xs tracking-wider">
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
	</section>

	<!-- Danger Zone -->
	<section class="border-b border-destructive/30 bg-destructive/5">
		<div class="px-6 py-8 md:px-12 lg:px-16">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center border border-destructive/50 bg-destructive/10">
					<Trash2 class="h-5 w-5 text-destructive" />
				</div>
				<div>
					<span class="font-mono text-[10px] tracking-widest text-destructive">DANGER ZONE</span>
					<h2 class="font-ui text-lg font-semibold tracking-wider">Delete Account</h2>
				</div>
			</div>

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
	</section>
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
