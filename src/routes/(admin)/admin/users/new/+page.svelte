<script lang="ts">
	/**
	 * Create/Edit User Page
	 */
	import { User, Shield, Mail, Phone, Save, Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import CrudCreateLayout from '$lib/components/layout/CrudCreateLayout.svelte';

	type FormReturn = {
		error?: string;
		success?: boolean;
		message?: string;
		firstName?: string;
		lastName?: string;
		email?: string;
		phone?: string;
		role?: string;
	} | null;

	let { data, form }: { data: Record<string, unknown>; form: FormReturn } = $props();
	
	let loading = $state(false);
	let firstName = $state(form?.firstName || '');
	let lastName = $state(form?.lastName || '');
	let email = $state(form?.email || '');
	let phone = $state(form?.phone || '');
	let role = $state(form?.role || 'customer');
	let sendInvite = $state(true);
	
	// Show success toast on form success
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			// Optionally redirect to users list after brief delay
			setTimeout(() => goto('/admin/users'), 1500);
		}
	});
</script>

<svelte:head>
	<title>Add User | Admin | MostlyWhat Systems</title>
</svelte:head>

<CrudCreateLayout
	title="Add New User"
	description="Create a new user account and assign their role."
	backHref="/admin/users"
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form 
			method="POST" 
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-8"
		>
			<!-- Basic Information -->
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — BASIC INFORMATION</span>
				
				<div class="mt-6 grid gap-6 md:grid-cols-2">
					<!-- First Name -->
					<div>
						<label for="firstName" class="font-ui text-xs font-medium tracking-wider text-foreground">
							FIRST NAME
						</label>
						<div class="relative mt-2">
							<User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="text"
								id="firstName"
								name="firstName"
								bind:value={firstName}
								placeholder="John"
								class="font-body h-12 w-full border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
								required
							/>
						</div>
					</div>

					<!-- Last Name -->
					<div>
						<label for="lastName" class="font-ui text-xs font-medium tracking-wider text-foreground">
							LAST NAME
						</label>
						<div class="relative mt-2">
							<User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="text"
								id="lastName"
								name="lastName"
								bind:value={lastName}
								placeholder="Doe"
								class="font-body h-12 w-full border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
								required
							/>
						</div>
					</div>

					<!-- Email -->
					<div class="md:col-span-2">
						<label for="email" class="font-ui text-xs font-medium tracking-wider text-foreground">
							EMAIL ADDRESS
						</label>
						<div class="relative mt-2">
							<Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="email"
								id="email"
								name="email"
								bind:value={email}
								placeholder="john@example.com"
								class="font-body h-12 w-full border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
								required
							/>
						</div>
					</div>

					<!-- Phone -->
					<div class="md:col-span-2">
						<label for="phone" class="font-ui text-xs font-medium tracking-wider text-foreground">
							PHONE NUMBER <span class="text-muted-foreground">(OPTIONAL)</span>
						</label>
						<div class="relative mt-2">
							<Phone class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="tel"
								id="phone"
								name="phone"
								bind:value={phone}
								placeholder="+1 (555) 000-0000"
								class="font-body h-12 w-full border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Form Actions -->
			<div class="flex items-center justify-end gap-4 border-t border-border pt-6">
				<Button variant="outline" href="/admin/users" class="font-ui text-xs tracking-wider">
					CANCEL
				</Button>
				<Button type="submit" disabled={loading} class="font-ui text-xs tracking-wider">
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						CREATING...
					{:else}
						<Save class="mr-2 h-4 w-4" />
						CREATE USER
					{/if}
				</Button>
			</div>
		</form>
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<!-- Role Selection -->
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — ROLE & PERMISSIONS</span>
				
				<div class="mt-6 space-y-3">
					{#each [
						{ value: 'customer', label: 'Customer', desc: 'Can view projects and submit tickets' },
						{ value: 'staff', label: 'Staff', desc: 'Can manage projects and respond to tickets' },
						{ value: 'admin', label: 'Admin', desc: 'Full access to admin dashboard' },
						{ value: 'super_admin', label: 'Super Admin', desc: 'System-wide access and user management' }
					] as { value, label, desc }}
						<label
							class="group flex cursor-pointer items-start gap-4 border p-4 transition-colors {role === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
						>
							<input
								type="radio"
								name="role"
								{value}
								bind:group={role}
								class="sr-only"
							/>
							<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center border {role === value ? 'border-primary bg-primary' : 'border-border bg-background'}">
								{#if role === value}
									<div class="h-2 w-2 bg-background"></div>
								{/if}
							</div>
							<div>
								<div class="flex items-center gap-2">
									<Shield class="h-4 w-4 text-primary" />
									<span class="font-ui text-xs font-semibold tracking-wider uppercase">{label}</span>
								</div>
								<p class="font-body mt-1 text-xs text-muted-foreground">{desc}</p>
							</div>
						</label>
					{/each}
				</div>
			</div>

			<!-- Send Invite Option -->
			<div class="border-t border-border pt-6">
				<label class="flex items-start gap-4 cursor-pointer">
					<input
						type="checkbox"
						name="sendInvite"
						bind:checked={sendInvite}
						value="true"
						class="sr-only"
					/>
					<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center border {sendInvite ? 'border-primary bg-primary' : 'border-border bg-background'}">
						{#if sendInvite}
							<svg class="h-4 w-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
							</svg>
						{/if}
					</div>
					<div>
						<span class="font-ui text-xs font-semibold tracking-wider">SEND INVITE EMAIL</span>
						<p class="font-body mt-1 text-xs text-muted-foreground">User will receive an email with login instructions.</p>
					</div>
				</label>
			</div>
		</div>
	{/snippet}
</CrudCreateLayout>
