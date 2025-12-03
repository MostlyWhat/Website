<script lang="ts">
	/**
	 * Create New Organization Page
	 * 
	 * Admin form to create new client organizations.
	 */
	import { enhance } from '$app/forms';
	import { ArrowLeft, Building2, Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';

	let { data, form } = $props();

	let isLoading = $state(false);
	let selectedOwnerId = $state<string>('');

	// Get display name for selected owner
	let selectedOwnerDisplay = $derived(
		selectedOwnerId 
			? data.users.find(u => u.id === selectedOwnerId)
			: null
	);

	function handleSubmit() {
		isLoading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			isLoading = false;
			await update();
		};
	}
</script>

<svelte:head>
	<title>Create Organization | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/admin/organizations"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO ORGANIZATIONS</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Create Organization</h1>
		<p class="font-body mt-2 text-sm text-muted-foreground">
			Add a new client organization to the system.
		</p>
	</section>

	<!-- Form Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		{#if form?.error}
			<div class="mb-6 max-w-2xl border border-destructive/50 bg-destructive/10 px-6 py-4">
				<p class="font-mono text-sm text-destructive">{form.error}</p>
			</div>
		{/if}

		<form method="POST" use:enhance={handleSubmit} class="max-w-2xl space-y-8">
			<!-- Organization Details -->
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<Building2 class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ORGANIZATION DETAILS</span>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2 md:col-span-2">
						<Label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ORGANIZATION NAME *
						</Label>
						<Input
							id="name"
							name="name"
							required
							placeholder="Acme Corporation"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2">
						<Label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							EMAIL ADDRESS
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="contact@acme.com"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2">
						<Label for="phone" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							PHONE NUMBER
						</Label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="+1 (555) 000-0000"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2 md:col-span-2">
						<Label for="website" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							WEBSITE
						</Label>
						<Input
							id="website"
							name="website"
							type="url"
							placeholder="https://acme.com"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2 md:col-span-2">
						<Label for="billingAddressLine1" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ADDRESS
						</Label>
						<Input
							id="billingAddressLine1"
							name="billingAddressLine1"
							placeholder="123 Business Ave, Suite 100"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2">
						<Label for="billingCity" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							CITY
						</Label>
						<Input
							id="billingCity"
							name="billingCity"
							placeholder="Bangkok"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2">
						<Label for="billingCountry" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							COUNTRY
						</Label>
						<Input
							id="billingCountry"
							name="billingCountry"
							placeholder="Thailand"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>
				</div>
			</div>

			<!-- Owner Assignment -->
			<div class="space-y-6 border-t border-border pt-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INITIAL OWNER (OPTIONAL)</span>
				
				<div class="space-y-2">
					<Label for="ownerId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						ASSIGN OWNER
					</Label>
					<input type="hidden" name="ownerId" value={selectedOwnerId} />
					<Select.Root type="single" bind:value={selectedOwnerId}>
						<Select.Trigger class="h-12 border-border bg-card px-4 font-body">
							{selectedOwnerDisplay ? `${selectedOwnerDisplay.displayName || 'Unnamed'} (${selectedOwnerDisplay.email})` : 'Select a user (optional)'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">No owner</Select.Item>
							{#each data.users as user}
								<Select.Item value={user.id}>
									{user.displayName || 'Unnamed'} ({user.email})
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<p class="font-mono text-[10px] text-muted-foreground">
						The owner will have full control over this organization. You can add more members later.
					</p>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-4 border-t border-border pt-8">
				<Button type="submit" disabled={isLoading} class="font-ui tracking-wider">
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						CREATING...
					{:else}
						CREATE ORGANIZATION
					{/if}
				</Button>
				<Button variant="outline" href="/admin/organizations" class="font-ui tracking-wider">
					CANCEL
				</Button>
			</div>
		</form>
	</section>
</div>
