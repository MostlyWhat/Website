<script lang="ts">
	/**
	 * Magic Link Sign In Page
	 * 
	 * Dedicated page for passwordless email authentication.
	 * Shows email input form, then confirmation message after sending.
	 */
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Mail, Loader2, ArrowLeft, CheckCircle, RefreshCw } from '@lucide/svelte';

	let { data, form } = $props();

	let email = $state(data.email ?? '');
	let isLoading = $state(false);
	let timeoutSeconds = $state(0);
	let isTimedOut = $state(false);
	let timeoutInterval: ReturnType<typeof setInterval> | null = null;
	let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

	const TIMEOUT_DURATION = 30; // 30 seconds

	function startTimeout() {
		timeoutSeconds = TIMEOUT_DURATION;
		isTimedOut = false;
		
		// Live countdown
		timeoutInterval = setInterval(() => {
			timeoutSeconds--;
			if (timeoutSeconds <= 0) {
				if (timeoutInterval) clearInterval(timeoutInterval);
				timeoutInterval = null;
				if (isLoading) {
					isTimedOut = true;
					isLoading = false;
				}
			}
		}, 1000);
	}

	function clearTimeouts() {
		if (timeoutInterval) {
			clearInterval(timeoutInterval);
			timeoutInterval = null;
		}
		if (loadingTimeout) {
			clearTimeout(loadingTimeout);
			loadingTimeout = null;
		}
	}

	function handleSubmit() {
		return () => {
			isLoading = true;
			isTimedOut = false;
			startTimeout();
			
			return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
				clearTimeouts();
				isLoading = false;
				timeoutSeconds = 0;
				await update();
			};
		};
	}

	function resetTimeout() {
		isTimedOut = false;
		timeoutSeconds = 0;
	}

	$effect(() => {
		return () => {
			clearTimeouts();
		};
	});
</script>

<svelte:head>
	<title>Magic Link Sign In | MostlyWhat Systems</title>
</svelte:head>

<!-- Full height section with grid layout -->
<section class="h-full">
	<div class="grid h-full grid-cols-12 gap-px bg-border">
		<!-- Left Panel - Branding -->
		<div class="col-span-12 hidden flex-col justify-between bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:flex lg:px-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.MAGIC_LINK</span>
				<h1 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl">
					PASSWORDLESS<br />SIGN IN
				</h1>
				<p class="font-body mt-6 max-w-md text-muted-foreground">
					No password needed. We'll send a secure link to your email that logs you in instantly.
				</p>
			</div>
			
			<div class="space-y-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<Mail class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui text-sm font-semibold tracking-wider">SECURE & SIMPLE</h3>
						<p class="font-body text-xs text-muted-foreground">Click the link in your email to sign in</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Panel - Magic Link Form -->
		<div class="col-span-12 flex flex-col items-center justify-center overflow-y-auto bg-background px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<div class="w-full max-w-md">
				<!-- Mobile Header -->
				<div class="mb-8 lg:hidden">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.MAGIC_LINK</span>
					<h1 class="font-display mt-4 text-3xl font-bold uppercase">MAGIC LINK</h1>
				</div>

				{#if data.sent}
					<!-- Success State - Email Sent -->
					<div class="text-center">
						<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-primary/30 bg-primary/10">
							<CheckCircle class="h-10 w-10 text-primary" />
						</div>
						
						<span class="font-mono text-[10px] tracking-widest text-primary">CHECK YOUR EMAIL</span>
						<h2 class="font-display mt-4 text-2xl font-bold uppercase">LINK SENT</h2>
						<p class="font-body mt-4 text-muted-foreground">
							We've sent a magic link to
						</p>
						<p class="font-mono mt-2 text-sm text-foreground">
							{data.email}
						</p>
						<p class="font-body mt-4 text-sm text-muted-foreground">
							Click the link in your email to sign in. The link will expire in 1 hour.
						</p>

						<div class="mt-8 space-y-4">
							<p class="font-body text-xs text-muted-foreground">
								Didn't receive the email? Check your spam folder or
							</p>
							<a 
								href={localizeHref(`/auth/magic-link?email=${encodeURIComponent(data.email ?? '')}&redirectTo=${encodeURIComponent(data.redirectTo)}`)}
								class="font-ui inline-flex items-center text-sm text-primary hover:underline"
							>
								<RefreshCw class="mr-2 h-4 w-4" />
								TRY AGAIN
							</a>
						</div>

						<div class="mt-8 border-t border-border pt-6">
							<a 
								href={localizeHref('/auth/login')}
								class="font-ui inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft class="mr-2 h-4 w-4" />
								BACK TO SIGN IN
							</a>
						</div>
					</div>
				{:else if isTimedOut}
					<!-- Timed Out State -->
					<div class="text-center">
						<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-destructive/30 bg-destructive/10">
							<RefreshCw class="h-10 w-10 text-destructive" />
						</div>
						
						<span class="font-mono text-[10px] tracking-widest text-destructive">REQUEST TIMEOUT</span>
						<h2 class="font-display mt-4 text-2xl font-bold uppercase">TIMED OUT</h2>
						<p class="font-body mt-4 text-muted-foreground">
							The request took too long to process. This could be due to a network issue.
						</p>

						<div class="mt-8 space-y-4">
							<Button 
								size="lg" 
								class="font-ui w-full tracking-wider"
								onclick={resetTimeout}
							>
								<RefreshCw class="mr-2 h-4 w-4" />
								TRY AGAIN
							</Button>
							
							<a 
								href={localizeHref('/auth/login')}
								class="font-ui inline-flex w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft class="mr-2 h-4 w-4" />
								BACK TO SIGN IN
							</a>
						</div>
					</div>
				{:else}
					<!-- Email Input Form -->
					<!-- Error Message -->
					{#if form?.error}
						<div class="mb-6 border border-destructive/50 bg-destructive/10 px-6 py-4">
							<p class="font-mono text-sm text-destructive">{form.error}</p>
						</div>
					{/if}

					<form
						method="POST"
						use:enhance={handleSubmit()}
						class="space-y-6"
					>
						<input type="hidden" name="redirectTo" value={data.redirectTo} />

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
								disabled={isLoading}
							/>
							<p class="font-body text-xs text-muted-foreground">
								We'll send a secure sign-in link to this email address.
							</p>
						</div>

						<Button 
							type="submit" 
							size="lg" 
							class="font-ui w-full tracking-wider" 
							disabled={isLoading || !email}
						>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								SENDING... ({timeoutSeconds}s)
							{:else}
								<Mail class="mr-2 h-4 w-4" />
								SEND MAGIC LINK
							{/if}
						</Button>
					</form>

					<div class="mt-8 border-t border-border pt-6">
						<a 
							href={localizeHref('/auth/login')}
							class="font-ui inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft class="mr-2 h-4 w-4" />
							BACK TO SIGN IN
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
