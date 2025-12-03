<script lang="ts">
	/**
	 * Create/Edit User Page
	 */
	import { ArrowLeft, User, Shield, Mail, Phone, Save, Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	
	let loading = $state(false);
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let role = $state('customer');
	let sendInvite = $state(true);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		// TODO: Implement user creation
		await new Promise(resolve => setTimeout(resolve, 1000));
		loading = false;
	}
</script>

<svelte:head>
	<title>Add User | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/admin/users"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO USERS</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Add New User</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Create a new user account and assign their role.
		</p>
	</section>

	<!-- Form Section -->
	<section class="border-b border-border bg-background">
		<form onsubmit={handleSubmit} class="grid grid-cols-12 gap-px bg-border">
			<!-- Basic Information -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
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
								bind:value={phone}
								placeholder="+1 (555) 000-0000"
								class="font-body h-12 w-full border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Role Selection -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
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

				<!-- Send Invite Option -->
				<div class="mt-6 border-t border-border pt-6">
					<label class="flex items-start gap-4 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={sendInvite}
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

			<!-- Form Actions -->
			<div class="col-span-12 flex items-center justify-end gap-4 bg-card px-6 py-4 md:px-12 lg:px-16">
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
	</section>
</div>
