<script lang="ts">
	/**
	 * Create New Organization Page
	 */
	import { ArrowLeft, Building2, Loader2, AlertCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { enhance } from '$app/forms';

	type FormReturn = {
		error?: string;
		name?: string;
		email?: string;
		phone?: string;
		website?: string;
		address?: string;
	} | null;

	let { form }: { form: FormReturn } = $props();

	let loading = $state(false);
	let name = $state(form?.name || '');
	let email = $state(form?.email || '');
	let phone = $state(form?.phone || '');
	let website = $state(form?.website || '');
	let address = $state(form?.address || '');
</script>

<svelte:head>
	<title>New Organization | Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Back Link -->
	<a
		href="/app/settings/organizations"
		class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
	>
		<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
		<span class="font-mono text-[10px] tracking-widest">BACK TO ORGANIZATIONS</span>
	</a>

	<!-- Section Header -->
	<div class="mt-6 flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
			<Building2 class="h-5 w-5 text-primary" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">New Organization</h2>
		</div>
	</div>

	<p class="mt-4 font-body text-sm text-muted-foreground">
		Create a new organization to collaborate with your team on projects and support tickets.
	</p>

	<!-- Error Message -->
	{#if form?.error}
		<div class="mt-6 flex items-center gap-3 border border-destructive/30 bg-destructive/10 px-4 py-3">
			<AlertCircle class="h-5 w-5 text-destructive" />
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		class="mt-8 max-w-xl space-y-6"
	>
		<!-- Organization Name -->
		<div class="space-y-2">
			<label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				ORGANIZATION NAME <span class="text-destructive">*</span>
			</label>
			<Input
				id="name"
				name="name"
				type="text"
				bind:value={name}
				placeholder="Acme Corp"
				required
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<!-- Email -->
		<div class="space-y-2">
			<label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				CONTACT EMAIL
			</label>
			<Input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				placeholder="contact@acme.com"
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<!-- Phone -->
		<div class="space-y-2">
			<label for="phone" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				PHONE NUMBER
			</label>
			<Input
				id="phone"
				name="phone"
				type="tel"
				bind:value={phone}
				placeholder="+1 (555) 123-4567"
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<!-- Website -->
		<div class="space-y-2">
			<label for="website" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				WEBSITE
			</label>
			<Input
				id="website"
				name="website"
				type="url"
				bind:value={website}
				placeholder="https://acme.com"
				class="h-12 border-border bg-card px-4 font-body"
			/>
		</div>

		<!-- Address -->
		<div class="space-y-2">
			<label for="address" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				ADDRESS
			</label>
			<textarea
				id="address"
				name="address"
				bind:value={address}
				rows="3"
				placeholder="123 Main St, Suite 100&#10;San Francisco, CA 94102"
				class="w-full resize-none border border-border bg-card p-4 font-body text-sm focus:border-primary focus:outline-none"
			></textarea>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-4 pt-4">
			<Button type="submit" disabled={loading || !name.trim()} class="font-ui text-xs tracking-wider">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					CREATING...
				{:else}
					<Building2 class="mr-2 h-4 w-4" />
					CREATE ORGANIZATION
				{/if}
			</Button>
			<Button href="/app/settings/organizations" variant="outline" class="font-ui text-xs tracking-wider">
				CANCEL
			</Button>
		</div>
	</form>
</div>
