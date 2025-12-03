<script lang="ts">
	/**
	 * Create New Organization Page (Client)
	 * 
	 * Allows users to create their own organizations.
	 */
	import { enhance } from '$app/forms';
	import { ArrowLeft, Building2, Loader2, Mail, Phone, Globe } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { form } = $props();

	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Create Organization | MostlyWhat Systems</title>
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
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SETTINGS</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Create Organization</h2>
		</div>
	</div>

	<p class="font-body mt-4 text-sm text-muted-foreground">
		Create a new organization and invite team members to collaborate.
	</p>

	<!-- Error Message -->
	{#if form?.error}
		<div class="mt-6 max-w-lg border border-destructive/50 bg-destructive/10 px-6 py-4">
			<p class="font-mono text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				isLoading = false;
				await update();
			};
		}}
		class="mt-8 max-w-lg space-y-6"
	>
		<!-- Organization Name -->
		<div class="space-y-2">
			<Label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				ORGANIZATION NAME *
			</Label>
			<Input
				id="name"
				name="name"
				required
				placeholder="My Company"
				class="h-12 border-border bg-card px-4 font-body"
			/>
			<p class="font-body text-xs text-muted-foreground">
				This will be displayed to your team and in projects.
			</p>
		</div>

		<!-- Contact Email -->
		<div class="space-y-2">
			<Label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				CONTACT EMAIL
			</Label>
			<div class="relative">
				<Mail class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="contact@company.com"
					class="h-12 border-border bg-card pl-12 pr-4 font-body"
				/>
			</div>
		</div>

		<!-- Phone -->
		<div class="space-y-2">
			<Label for="phone" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				PHONE NUMBER
			</Label>
			<div class="relative">
				<Phone class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					id="phone"
					name="phone"
					type="tel"
					placeholder="+1 (555) 123-4567"
					class="h-12 border-border bg-card pl-12 pr-4 font-body"
				/>
			</div>
		</div>

		<!-- Website -->
		<div class="space-y-2">
			<Label for="website" class="font-mono text-[10px] tracking-widest text-muted-foreground">
				WEBSITE
			</Label>
			<div class="relative">
				<Globe class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					id="website"
					name="website"
					type="url"
					placeholder="https://company.com"
					class="h-12 border-border bg-card pl-12 pr-4 font-body"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-4 pt-4 border-t border-border">
			<Button type="submit" disabled={isLoading} class="font-ui text-xs tracking-wider">
				{#if isLoading}
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
