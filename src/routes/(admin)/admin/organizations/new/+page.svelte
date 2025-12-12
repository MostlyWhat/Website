<script lang="ts">
	/**
	 * Create New Organization Page
	 * 
	 * Admin form to create new client organizations.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Building2, Loader2, User, Mail } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { TextField, SelectField } from '$lib/components/ui/form-fields';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';
	import { CreatePageLayout } from '$lib/components/layout';

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

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/organizations'), 1500);
		}
	});
</script>

<svelte:head>
	<title>Create Organization | Admin | MostlyWhat Systems</title>
</svelte:head>

<CreatePageLayout
	title="Create Organization"
	description="Add a new client organization to the system."
	backHref="/admin/organizations"
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form method="POST" use:enhance={handleSubmit} class="space-y-8">
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
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK GUIDE</span>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Organizations represent client companies or groups. Each organization can have multiple members and projects.
				</p>
			</div>
			
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEXT STEPS</span>
				<ul class="font-body mt-2 space-y-2 text-sm text-muted-foreground">
					<li class="flex gap-2">
						<span>1.</span>
						<span>Create the organization</span>
					</li>
					<li class="flex gap-2">
						<span>2.</span>
						<span>Add team members</span>
					</li>
					<li class="flex gap-2">
						<span>3.</span>
						<span>Set up projects</span>
					</li>
				</ul>
			</div>
		</div>
	{/snippet}
</CreatePageLayout>
