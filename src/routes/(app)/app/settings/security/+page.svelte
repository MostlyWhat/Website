<script lang="ts">
	/**
	 * Security Settings Page
	 * 
	 * Two-Factor Authentication setup and management
	 */
	import { enhance } from '$app/forms';
	import { ShieldCheck, Smartphone, Loader2, AlertTriangle, Check, Copy, Key, X, Info } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { PageSection } from '$lib/components/ui/layouts';

	let { data, form } = $props();

	let enrollLoading = $state(false);
	let verifyLoading = $state(false);
	let disableLoading = $state(false);
	let verificationCode = $state('');
	let disableCode = $state('');
	let showDisableForm = $state(false);
	let secretCopied = $state(false);
	let magicLinkLoading = $state(false);
	let magicLinkEnabled = $state(data.magicLinkEnabled ?? true);

	// Enrollment data from form response
	let enrollData = $derived(form?.enrollData ?? null);

	function copySecret() {
		if (enrollData?.secret) {
			navigator.clipboard.writeText(enrollData.secret);
			secretCopied = true;
			setTimeout(() => (secretCopied = false), 2000);
		}
	}

	function handleEnrollSubmit() {
		enrollLoading = true;
		return async () => {
			enrollLoading = false;
		};
	}

	function handleVerifySubmit() {
		verifyLoading = true;
		return async ({ result }: { result: { type: string } }) => {
			verifyLoading = false;
			if (result.type === 'success') {
				verificationCode = '';
			}
		};
	}

	function handleDisableSubmit() {
		disableLoading = true;
		return async ({ result }: { result: { type: string } }) => {
			disableLoading = false;
			if (result.type === 'success') {
				disableCode = '';
				showDisableForm = false;
			}
		};
	}

	function handleMagicLinkToggle() {
		magicLinkLoading = true;
		return async ({ result }: { result: any }) => {
			magicLinkLoading = false;
			if (result.type === 'success' && result.data?.magicLinkEnabled !== undefined) {
				magicLinkEnabled = result.data.magicLinkEnabled;
			}
		};
	}
</script>

<svelte:head>
	<title>Security Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
			<ShieldCheck class="h-5 w-5 text-primary" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACCOUNT SECURITY</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Two-Factor Authentication</h2>
		</div>
	</div>

	<!-- Description -->
	<div class="mt-6 flex items-start gap-3 border border-border bg-muted/30 p-4">
		<Info class="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
		<div class="text-sm text-muted-foreground">
			<p>Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a code from your authenticator app in addition to your password when signing in.</p>
		</div>
	</div>

	<!-- Success Messages -->
	{#if form?.verified}
		<div class="mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">{form.message}</p>
		</div>
	{/if}

	{#if form?.disabled}
		<div class="mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">{form.message}</p>
		</div>
	{/if}

	<!-- Error Messages -->
	{#if form?.error && !enrollData}
		<div class="mt-6 flex items-center gap-3 border border-destructive/30 bg-destructive/10 px-4 py-3">
			<AlertTriangle class="h-5 w-5 text-destructive" />
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<div class="mt-8 max-w-xl">
		{#if data.isMfaEnabled}
			<!-- 2FA is Enabled -->
			<div class="border border-green-500/30 bg-green-500/5 p-6">
				<div class="flex items-center gap-3 mb-4">
					<div class="flex h-10 w-10 items-center justify-center border border-green-500/30 bg-green-500/10">
						<ShieldCheck class="h-5 w-5 text-green-500" />
					</div>
					<div>
						<h3 class="font-ui font-semibold text-green-500">2FA Enabled</h3>
						<p class="text-sm text-muted-foreground">Your account is protected with two-factor authentication</p>
					</div>
				</div>

				{#if showDisableForm}
					<!-- Disable Form -->
					<form
						method="POST"
						action="?/disableTotp"
						use:enhance={handleDisableSubmit}
						class="mt-6 space-y-4"
					>
						<input type="hidden" name="factorId" value={data.factorId} />
						
						<div class="p-4 border border-destructive/30 bg-destructive/5">
							<p class="text-sm text-muted-foreground mb-4">
								To disable two-factor authentication, enter a code from your authenticator app.
							</p>
							<div class="space-y-2">
								<label for="disableCode" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									VERIFICATION CODE
								</label>
								<Input
									id="disableCode"
									name="code"
									type="text"
									inputmode="numeric"
									pattern="[0-9]*"
									maxlength={6}
									bind:value={disableCode}
									placeholder="000000"
									class="h-12 text-center font-mono text-xl tracking-widest"
								/>
							</div>
							{#if form?.error && showDisableForm}
								<p class="mt-2 text-sm text-destructive">{form.error}</p>
							{/if}
						</div>

						<div class="flex gap-3">
							<Button
								type="button"
								variant="outline"
								onclick={() => {
									showDisableForm = false;
									disableCode = '';
								}}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="destructive"
								disabled={disableLoading || disableCode.length !== 6}
							>
								{#if disableLoading}
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								{/if}
								Disable 2FA
							</Button>
						</div>
					</form>
				{:else}
					<Button
						variant="outline"
						onclick={() => (showDisableForm = true)}
						class="text-destructive border-destructive/30 hover:bg-destructive/10"
					>
						<X class="mr-2 h-4 w-4" />
						Disable Two-Factor Authentication
					</Button>
				{/if}
			</div>

		{:else if enrollData}
			<!-- Enrollment in Progress - Show QR Code -->
			<div class="border border-border p-6 space-y-6">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-primary/10">
						<Smartphone class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui font-semibold">Set Up Authenticator App</h3>
						<p class="text-sm text-muted-foreground">Scan the QR code or enter the secret key</p>
					</div>
				</div>

				<!-- QR Code -->
				<div class="flex justify-center p-6 bg-white border border-border">
					<img src={enrollData.qrCode} alt="QR Code for 2FA setup" class="w-48 h-48" />
				</div>

				<!-- Manual Entry -->
				<div class="space-y-2">
					<span class="block font-mono text-[10px] tracking-widest text-muted-foreground">
						SECRET KEY (if you can't scan)
					</span>
					<div class="flex items-center gap-2">
						<code class="flex-1 px-4 py-3 bg-muted font-mono text-sm break-all">{enrollData.secret}</code>
						<Button
							variant="outline"
							size="icon"
							onclick={copySecret}
							class="flex-shrink-0"
						>
							{#if secretCopied}
								<Check class="h-4 w-4 text-green-500" />
							{:else}
								<Copy class="h-4 w-4" />
							{/if}
						</Button>
					</div>
				</div>

				<!-- Verification Form -->
				<form
					method="POST"
					action="?/verifyTotp"
					use:enhance={handleVerifySubmit}
					class="space-y-4"
				>
					<input type="hidden" name="factorId" value={enrollData.id} />
					
					<div class="space-y-2">
						<label for="verificationCode" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ENTER CODE FROM AUTHENTICATOR APP
						</label>
						<Input
							id="verificationCode"
							name="code"
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength={6}
							bind:value={verificationCode}
							placeholder="000000"
							class="h-12 text-center font-mono text-xl tracking-widest"
						/>
						{#if form?.error && enrollData}
							<p class="text-sm text-destructive">{form.error}</p>
						{/if}
					</div>

					<Button
						type="submit"
						disabled={verifyLoading || verificationCode.length !== 6}
						class="w-full"
					>
						{#if verifyLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Verify and Enable 2FA
					</Button>
				</form>
			</div>

		{:else}
			<!-- 2FA Not Enabled - Show Setup Button -->
			<div class="border border-border p-6">
				<div class="flex items-center gap-3 mb-6">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-muted">
						<Key class="h-5 w-5 text-muted-foreground" />
					</div>
					<div>
						<h3 class="font-ui font-semibold">2FA Not Enabled</h3>
						<p class="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
					</div>
				</div>

				<div class="space-y-4 mb-6 text-sm text-muted-foreground">
					<p>To set up two-factor authentication, you'll need:</p>
					<ul class="list-disc list-inside space-y-1 pl-4">
						<li>An authenticator app like Google Authenticator, Authy, or 1Password</li>
						<li>Access to your mobile device</li>
					</ul>
				</div>

				<form method="POST" action="?/enrollTotp" use:enhance={handleEnrollSubmit}>
					<Button type="submit" disabled={enrollLoading}>
						{#if enrollLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							<ShieldCheck class="mr-2 h-4 w-4" />
						{/if}
						Set Up Two-Factor Authentication
					</Button>
				</form>
			</div>
		{/if}
	</div>

	<!-- Magic Link Preference -->
	<div class="mt-8 max-w-xl border-t border-border pt-8">
		<div class="flex items-center gap-4 mb-6">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<Key class="h-5 w-5 text-primary" />
			</div>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LOGIN PREFERENCES</span>
				<h2 class="font-ui text-lg font-semibold tracking-wider">Magic Link Authentication</h2>
			</div>
		</div>

		<div class="border border-border p-6">
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<h3 class="font-ui font-semibold mb-2">Email Magic Links</h3>
					<p class="text-sm text-muted-foreground mb-4">
						Allow passwordless sign-in via email magic links. When enabled, you can log in by clicking a secure link sent to your email instead of entering your password.
					</p>
					{#if !magicLinkEnabled}
						<div class="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 p-3 text-sm text-amber-600">
							<AlertTriangle class="h-4 w-4 flex-shrink-0 mt-0.5" />
							<span>Magic link authentication is currently disabled. You will not be able to use passwordless login.</span>
						</div>
					{/if}
				</div>
				<form method="POST" action="?/toggleMagicLink" use:enhance={handleMagicLinkToggle}>
					<input type="hidden" name="enabled" value={magicLinkEnabled ? 'false' : 'true'} />
					<Button
						type="submit"
						variant={magicLinkEnabled ? 'outline' : 'default'}
						disabled={magicLinkLoading}
						class="min-w-[100px]"
					>
						{#if magicLinkLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{:else if magicLinkEnabled}
							Disable
						{:else}
							Enable
						{/if}
					</Button>
				</form>
			</div>
		</div>
	</div>

	<!-- Additional Security Info -->
	<div class="mt-8 max-w-xl border-t border-border pt-8">
		<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">PASSWORD SETTINGS</h3>
		<p class="text-sm text-muted-foreground mb-4">
			To change your password, visit the password settings page.
		</p>
		<Button variant="outline" href="/app/settings/password">
			Change Password
		</Button>
	</div>
</div>
