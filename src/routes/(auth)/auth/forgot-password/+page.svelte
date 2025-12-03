<script lang="ts">
	/**
	 * Forgot Password Page
	 * 
	 * Allows users to request a password reset email
	 */
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Mail, Loader2, ArrowLeft, KeyRound } from '@lucide/svelte';

	let { form } = $props();

	let email = $state('');
	let isLoading = $state(false);

	function handleSubmit() {
		return () => {
			isLoading = true;
		};
	}
</script>

<svelte:head>
	<title>Reset Password | MostlyWhat Systems</title>
</svelte:head>

<!-- Full height section with grid layout -->
<section class="min-h-[calc(100dvh-4rem)] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Left Panel - Branding -->
		<div class="col-span-12 hidden flex-col justify-between bg-background px-6 py-16 md:px-12 lg:col-span-5 lg:flex lg:px-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.RESET</span>
				<h1 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl">
					FORGOT<br />PASSWORD?
				</h1>
				<p class="font-body mt-6 max-w-md text-muted-foreground">
					No worries, we'll send you a secure link to reset your password. Check your email after submitting.
				</p>
			</div>
			
			<div class="space-y-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<KeyRound class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui text-sm font-semibold tracking-wider">SECURE RESET</h3>
						<p class="font-body text-xs text-muted-foreground">One-time link expires in 24 hours</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Panel - Form -->
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-7 lg:px-16">
			<!-- Mobile Header -->
			<div class="mb-8 lg:hidden">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.RESET</span>
				<h1 class="font-display mt-4 text-3xl font-bold uppercase">FORGOT PASSWORD?</h1>
			</div>

			<!-- Back Link -->
			<a
				href={localizeHref('/auth/login')}
				class="group mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
				<span class="font-mono text-xs tracking-wider">BACK TO LOGIN</span>
			</a>

			<!-- Error Message -->
			{#if form?.error}
				<div class="mb-6 border border-destructive/50 bg-destructive/10 px-6 py-4">
					<p class="font-mono text-sm text-destructive">{form.error}</p>
				</div>
			{/if}

			<!-- Success Message -->
			{#if form?.success}
				<div class="max-w-md border border-primary/50 bg-primary/10 px-6 py-8">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/20">
							<Mail class="h-5 w-5 text-primary" />
						</div>
						<div>
							<h3 class="font-ui text-sm font-semibold tracking-wider text-primary">CHECK YOUR EMAIL</h3>
							<p class="font-body mt-1 text-xs text-primary/80">{form.message}</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="max-w-md space-y-8">
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ENTER YOUR EMAIL</span>
						<p class="font-body mt-2 text-sm text-muted-foreground">
							We'll send you a link to reset your password. The link will expire in 24 hours.
						</p>
					</div>

					<form
						method="POST"
						action="?/resetPassword"
						use:enhance={handleSubmit}
						class="space-y-6"
					>
						<div class="space-y-2">
							<Label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								EMAIL ADDRESS
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autocomplete="email"
								required
								bind:value={email}
								placeholder="you@example.com"
								class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
							/>
						</div>

						<Button type="submit" size="lg" class="font-ui w-full tracking-wider" disabled={isLoading}>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								SENDING LINK...
							{:else}
								<Mail class="mr-2 h-4 w-4" />
								SEND RESET LINK
							{/if}
						</Button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</section>
