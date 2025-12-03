<script lang="ts">
	/**
	 * Reset Password Page
	 * 
	 * Allows users to set a new password using the reset token
	 */
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2, KeyRound, CheckCircle, ArrowRight } from '@lucide/svelte';

	let { form } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let timeoutError = $state('');
	let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleSubmit() {
		isLoading = true;
		timeoutError = '';
		
		// Safety timeout - reset loading state after 30 seconds if no response
		loadingTimeout = setTimeout(() => {
			if (isLoading) {
				isLoading = false;
				timeoutError = 'Request timed out. Please check your connection and try again.';
				console.error('Form submission timed out');
			}
		}, 30000);
		
		return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
			// Clear the timeout since we got a response
			if (loadingTimeout) {
				clearTimeout(loadingTimeout);
				loadingTimeout = null;
			}
			
			// Always reset loading state after form submission completes
			isLoading = false;
			
			// Update form state for all result types
			await update();
		};
	}
</script>

<svelte:head>
	<title>Set New Password | MostlyWhat Systems</title>
</svelte:head>

<!-- Full height section with grid layout -->
<section class="h-full">
	<div class="grid h-full grid-cols-12 gap-px bg-border">
		<!-- Left Panel - Branding -->
		<div class="col-span-12 hidden flex-col justify-between bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:flex lg:px-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.NEW_PASSWORD</span>
				<h1 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl">
					SET NEW<br />PASSWORD
				</h1>
				<p class="font-body mt-6 max-w-md text-muted-foreground">
					Choose a strong password that you haven't used before. Make sure it's at least 8 characters long.
				</p>
			</div>
			
			<div class="space-y-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<KeyRound class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui text-sm font-semibold tracking-wider">STRONG PASSWORD</h3>
						<p class="font-body text-xs text-muted-foreground">8+ characters recommended</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Panel - Form -->
		<div class="col-span-12 flex flex-col justify-center overflow-y-auto bg-background px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<!-- Mobile Header -->
			<div class="mb-8 lg:hidden">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.NEW_PASSWORD</span>
				<h1 class="font-display mt-4 text-3xl font-bold uppercase">SET NEW PASSWORD</h1>
			</div>

			<!-- Error Message -->
			{#if form?.error || timeoutError}
				<div class="mb-6 border border-destructive/50 bg-destructive/10 px-6 py-4">
					<p class="font-mono text-sm text-destructive">{form?.error || timeoutError}</p>
				</div>
			{/if}

			<!-- Success Message -->
			{#if form?.success}
				<div class="max-w-md space-y-6">
					<div class="border border-primary/50 bg-primary/10 px-6 py-8">
						<div class="flex items-center gap-4">
							<div class="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/20">
								<CheckCircle class="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 class="font-ui text-sm font-semibold tracking-wider text-primary">PASSWORD UPDATED</h3>
								<p class="font-body mt-1 text-xs text-primary/80">Your password has been successfully reset.</p>
							</div>
						</div>
					</div>
					<a
						href={localizeHref('/auth/login')}
						class="group flex w-full items-center justify-center gap-2 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
					>
						<span class="font-ui text-sm tracking-wider">CONTINUE TO LOGIN</span>
						<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			{:else}
				<div class="max-w-md space-y-8">
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE NEW PASSWORD</span>
						<p class="font-body mt-2 text-sm text-muted-foreground">
							Enter your new password below. Make sure it's something secure and memorable.
						</p>
					</div>

					<form
						method="POST"
						action="?/updatePassword"
						use:enhance={handleSubmit}
						class="space-y-6"
					>
						<div class="space-y-2">
							<Label for="password" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								NEW PASSWORD
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autocomplete="new-password"
								required
								minlength={8}
								bind:value={password}
								placeholder="••••••••"
								class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
							/>
						</div>

						<div class="space-y-2">
							<Label for="confirmPassword" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								CONFIRM PASSWORD
							</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autocomplete="new-password"
								required
								bind:value={confirmPassword}
								placeholder="••••••••"
								class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
							/>
						</div>

						<Button type="submit" size="lg" class="font-ui w-full tracking-wider" disabled={isLoading}>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								UPDATING PASSWORD...
							{:else}
								<KeyRound class="mr-2 h-4 w-4" />
								UPDATE PASSWORD
							{/if}
						</Button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</section>
