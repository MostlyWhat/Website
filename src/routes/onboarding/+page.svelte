<script lang="ts">
	/**
	 * Onboarding Page
	 * 
	 * Collect user profile information and preferences after registration.
	 */
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2, User, Bell, Palette, ArrowRight, ArrowLeft, CheckCircle, Building2, UserCircle, Users, Link } from '@lucide/svelte';

	let { data, form } = $props();

	// Form state
	let firstName = $state(data.profile?.firstName ?? '');
	let lastName = $state(data.profile?.lastName ?? '');
	let phone = $state(data.profile?.phone ?? '');

	// Account type: 'personal' = skip org, 'join' = join existing org, 'create' = create new org
	let accountType = $state<'personal' | 'join' | 'create'>('personal');
	let organizationName = $state('');
	let inviteCode = $state('');

	// Preferences
	let emailNotifications = $state(data.profile?.preferences?.emailNotifications ?? true);
	let smsNotifications = $state(data.profile?.preferences?.smsNotifications ?? false);
	let theme = $state<'light' | 'dark' | 'system'>(data.profile?.preferences?.theme ?? 'system');
	let magicLinkEnabled = $state(data.profile?.preferences?.magicLinkEnabled ?? false);

	let isLoading = $state(false);
	let currentStep = $state(1);
	const totalSteps = 4;

	function nextStep() {
		if (currentStep < totalSteps) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	// Validation for step 2 (account type)
	const canProceedFromAccountType = $derived(
		accountType === 'personal' || 
		(accountType === 'create' && organizationName.trim().length > 0) ||
		(accountType === 'join' && inviteCode.trim().length > 0)
	);

	const steps = [
		{ number: 1, icon: User, title: 'PROFILE', desc: 'Personal information' },
		{ number: 2, icon: Building2, title: 'ORGANIZATION', desc: 'Skip, join, or create' },
		{ number: 3, icon: Bell, title: 'NOTIFICATIONS', desc: 'Communication preferences' },
		{ number: 4, icon: Palette, title: 'APPEARANCE', desc: 'Theme settings' }
	];
</script>

<svelte:head>
	<title>Complete Your Profile | MostlyWhat Systems</title>
</svelte:head>

<!-- Full height section with grid layout -->
<section class="h-full">
	<div class="grid h-full grid-cols-12 gap-px bg-border">
		<!-- Left Panel - Progress -->
		<div class="col-span-12 hidden flex-col justify-between bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:flex lg:px-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ONBOARDING</span>
				<h1 class="font-display mt-6 text-3xl font-bold uppercase md:text-4xl">
					COMPLETE<br />YOUR PROFILE
				</h1>
				<p class="font-body mt-6 max-w-md text-muted-foreground">
					Let's set up your account. This will only take a minute.
				</p>
			</div>
			
			<!-- Step indicators -->
			<div class="space-y-4">
				{#each steps as step}
					{@const isActive = currentStep === step.number}
					{@const isComplete = currentStep > step.number}
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center border transition-colors {isComplete ? 'border-primary bg-primary' : isActive ? 'border-primary bg-primary/10' : 'border-border bg-card'}">
							{#if isComplete}
								<CheckCircle class="h-5 w-5 text-primary-foreground" />
							{:else}
								<step.icon class="h-5 w-5 {isActive ? 'text-primary' : 'text-muted-foreground'}" />
							{/if}
						</div>
						<div>
							<h3 class="font-ui text-sm font-semibold tracking-wider {isActive ? 'text-foreground' : 'text-muted-foreground'}">{step.title}</h3>
							<p class="font-body text-xs text-muted-foreground">{step.desc}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Progress bar -->
			<div class="space-y-2">
				<div class="flex justify-between">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STEP {currentStep}/{totalSteps}</span>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
				</div>
				<div class="h-1 w-full bg-border">
					<div
						class="h-1 bg-primary transition-all duration-300"
						style="width: {(currentStep / totalSteps) * 100}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Right Panel - Form -->
		<div class="col-span-12 flex flex-col items-center justify-center overflow-y-auto bg-background px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<!-- Mobile Header -->
			<div class="mb-8 lg:hidden">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ONBOARDING — STEP {currentStep}/{totalSteps}</span>
				<h1 class="font-display mt-4 text-2xl font-bold uppercase">COMPLETE YOUR PROFILE</h1>
				
				<!-- Mobile progress bar -->
				<div class="mt-4 h-1 w-full bg-border">
					<div
						class="h-1 bg-primary transition-all duration-300"
						style="width: {(currentStep / totalSteps) * 100}%"
					></div>
				</div>
			</div>

			<!-- Error Message -->
			{#if form?.error}
				<div class="mb-6 border border-destructive/50 bg-destructive/10 px-6 py-4">
					<p class="font-mono text-sm text-destructive">{form.error}</p>
				</div>
			{/if}

			<div class="w-full max-w-lg">
				<form
					method="POST"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							isLoading = false;
							await update();
						};
					}}
				>
					<!-- Step 1: Personal Information -->
					{#if currentStep === 1}
						<div class="space-y-8">
							<div>
								<div class="flex items-center gap-4">
									<div class="flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
										<User class="h-5 w-5 text-primary" />
									</div>
									<div>
										<h2 class="font-display text-xl font-bold uppercase">Personal Information</h2>
										<p class="font-body text-sm text-muted-foreground">Tell us a bit about yourself</p>
									</div>
								</div>
							</div>

							<div class="space-y-6">
								<div class="grid grid-cols-2 gap-4">
									<div class="space-y-2">
										<Label for="firstName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
											FIRST NAME
										</Label>
										<Input
											id="firstName"
											name="firstName"
											type="text"
											required
											bind:value={firstName}
											placeholder="John"
											class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
										/>
									</div>
									<div class="space-y-2">
										<Label for="lastName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
											LAST NAME
										</Label>
										<Input
											id="lastName"
											name="lastName"
											type="text"
											required
											bind:value={lastName}
											placeholder="Doe"
											class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<Label for="phone" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										PHONE NUMBER <span class="text-muted-foreground/50">(OPTIONAL)</span>
									</Label>
									<Input
										id="phone"
										name="phone"
										type="tel"
										bind:value={phone}
										placeholder="+1 (555) 000-0000"
										class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
									/>
								</div>
							</div>

							<div class="flex justify-end border-t border-border pt-6">
								<Button type="button" size="lg" class="font-ui tracking-wider" onclick={nextStep} disabled={!firstName || !lastName}>
									CONTINUE
									<ArrowRight class="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					{/if}

					<!-- Step 2: Organization Setup -->
					{#if currentStep === 2}
						<div class="space-y-8">
							<div>
								<div class="flex items-center gap-4">
									<div class="flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
										<Building2 class="h-5 w-5 text-primary" />
									</div>
									<div>
										<h2 class="font-display text-xl font-bold uppercase">Organization Setup</h2>
										<p class="font-body text-sm text-muted-foreground">Choose how you'd like to get started</p>
									</div>
								</div>
							</div>

							<div class="space-y-4">
								<!-- Skip / Personal Option -->
								<label class="cursor-pointer">
									<input
										type="radio"
										name="accountTypeRadio"
										value="personal"
										bind:group={accountType}
										class="peer sr-only"
									/>
									<div class="flex items-start gap-4 border-2 border-border bg-card px-6 py-5 transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
										<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
											<UserCircle class="h-6 w-6 text-muted-foreground" />
										</div>
										<div class="flex-1">
											<span class="font-ui text-sm font-semibold tracking-wider">SKIP FOR NOW</span>
											<p class="font-body mt-1 text-xs text-muted-foreground">
												Continue without an organization. You can create or join one later from your dashboard.
											</p>
										</div>
									</div>
								</label>

								<!-- Join Organization Option -->
								<label class="cursor-pointer">
									<input
										type="radio"
										name="accountTypeRadio"
										value="join"
										bind:group={accountType}
										class="peer sr-only"
									/>
									<div class="flex items-start gap-4 border-2 border-border bg-card px-6 py-5 transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
										<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
											<Link class="h-6 w-6 text-muted-foreground" />
										</div>
										<div class="flex-1">
											<span class="font-ui text-sm font-semibold tracking-wider">JOIN AN ORGANIZATION</span>
											<p class="font-body mt-1 text-xs text-muted-foreground">
												Have an invite code? Enter it to join an existing organization.
											</p>
										</div>
									</div>
								</label>

								<!-- Create Organization Option -->
								<label class="cursor-pointer">
									<input
										type="radio"
										name="accountTypeRadio"
										value="create"
										bind:group={accountType}
										class="peer sr-only"
									/>
									<div class="flex items-start gap-4 border-2 border-border bg-card px-6 py-5 transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
										<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
											<Building2 class="h-6 w-6 text-muted-foreground" />
										</div>
										<div class="flex-1">
											<span class="font-ui text-sm font-semibold tracking-wider">CREATE AN ORGANIZATION</span>
											<p class="font-body mt-1 text-xs text-muted-foreground">
												For businesses and teams. Create your own organization to manage projects and invite members.
											</p>
										</div>
									</div>
								</label>
							</div>

							<!-- Invite code input (shown when join is selected) -->
							{#if accountType === 'join'}
								<div class="space-y-2 border-t border-border pt-6">
									<Label for="inviteCode" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										INVITE CODE
									</Label>
									<Input
										id="inviteCode"
										name="inviteCode"
										type="text"
										required
										bind:value={inviteCode}
										placeholder="Enter your invite code"
										class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
									/>
									<p class="font-body text-xs text-muted-foreground">
										Enter the code you received from your organization administrator.
									</p>
								</div>
							{/if}

							<!-- Organization name input (shown when create is selected) -->
							{#if accountType === 'create'}
								<div class="space-y-2 border-t border-border pt-6">
									<Label for="organizationName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										ORGANIZATION NAME
									</Label>
									<Input
										id="organizationName"
										name="organizationName"
										type="text"
										required
										bind:value={organizationName}
										placeholder="Acme Inc."
										class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
									/>
									<p class="font-body text-xs text-muted-foreground">
										You'll be the owner of this organization and can invite others later.
									</p>
								</div>
							{/if}

							<div class="flex justify-between border-t border-border pt-6">
								<Button type="button" variant="outline" size="lg" class="font-ui tracking-wider" onclick={prevStep}>
									<ArrowLeft class="mr-2 h-4 w-4" />
									BACK
								</Button>
								<Button type="button" size="lg" class="font-ui tracking-wider" onclick={nextStep} disabled={!canProceedFromAccountType}>
									CONTINUE
									<ArrowRight class="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					{/if}

					<!-- Step 3: Notification Preferences -->
					{#if currentStep === 3}
						<div class="space-y-8">
							<div>
								<div class="flex items-center gap-4">
									<div class="flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
										<Bell class="h-5 w-5 text-primary" />
									</div>
									<div>
										<h2 class="font-display text-xl font-bold uppercase">Notifications</h2>
										<p class="font-body text-sm text-muted-foreground">How would you like to be notified?</p>
									</div>
								</div>
							</div>

							<div class="space-y-4">
								<label class="group flex cursor-pointer items-start gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80">
									<input
										type="checkbox"
										name="emailNotifications"
										bind:checked={emailNotifications}
										class="mt-1 h-4 w-4 border-border bg-background text-primary accent-primary focus:ring-primary"
									/>
									<div class="flex-1">
										<span class="font-ui text-sm font-semibold tracking-wider">EMAIL NOTIFICATIONS</span>
										<p class="font-body mt-1 text-xs text-muted-foreground">
											Receive updates about your projects, invoices, and tickets via email.
										</p>
									</div>
								</label>

								<label class="group flex cursor-pointer items-start gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80">
									<input
										type="checkbox"
										name="smsNotifications"
										bind:checked={smsNotifications}
										class="mt-1 h-4 w-4 border-border bg-background text-primary accent-primary focus:ring-primary"
									/>
									<div class="flex-1">
										<span class="font-ui text-sm font-semibold tracking-wider">SMS NOTIFICATIONS</span>
										<p class="font-body mt-1 text-xs text-muted-foreground">
											Get important alerts via text message (requires phone number).
										</p>
									</div>
								</label>

								<label class="group flex cursor-pointer items-start gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80">
									<input
										type="checkbox"
										name="magicLinkEnabled"
										bind:checked={magicLinkEnabled}
										class="mt-1 h-4 w-4 border-border bg-background text-primary accent-primary focus:ring-primary"
									/>
									<div class="flex-1">
										<span class="font-ui text-sm font-semibold tracking-wider">MAGIC LINK LOGIN</span>
										<p class="font-body mt-1 text-xs text-muted-foreground">
											Enable passwordless login via email magic links.
										</p>
									</div>
								</label>
							</div>

							<div class="flex justify-between border-t border-border pt-6">
								<Button type="button" variant="outline" size="lg" class="font-ui tracking-wider" onclick={prevStep}>
									<ArrowLeft class="mr-2 h-4 w-4" />
									BACK
								</Button>
								<Button type="button" size="lg" class="font-ui tracking-wider" onclick={nextStep}>
									CONTINUE
									<ArrowRight class="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					{/if}

					<!-- Step 4: Theme & Submit -->
					{#if currentStep === 4}
						<div class="space-y-8">
							<div>
								<div class="flex items-center gap-4">
									<div class="flex h-12 w-12 items-center justify-center border border-primary bg-primary/10">
										<Palette class="h-5 w-5 text-primary" />
									</div>
									<div>
										<h2 class="font-display text-xl font-bold uppercase">Appearance</h2>
										<p class="font-body text-sm text-muted-foreground">Choose your preferred theme</p>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-3 gap-4">
								<label class="cursor-pointer">
									<input
										type="radio"
										name="themeRadio"
										value="light"
										bind:group={theme}
										class="peer sr-only"
									/>
									<div class="border-2 border-border p-6 text-center transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
										<div class="mx-auto mb-3 h-10 w-10 border border-border bg-white"></div>
										<span class="font-ui text-xs font-semibold tracking-wider">LIGHT</span>
									</div>
								</label>

								<label class="cursor-pointer">
									<input
										type="radio"
										name="themeRadio"
										value="dark"
										bind:group={theme}
										class="peer sr-only"
									/>
									<div class="border-2 border-border p-6 text-center transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
										<div class="mx-auto mb-3 h-10 w-10 border border-border bg-zinc-900"></div>
										<span class="font-ui text-xs font-semibold tracking-wider">DARK</span>
									</div>
								</label>

								<label class="cursor-pointer">
									<input
										type="radio"
										name="themeRadio"
										value="system"
										bind:group={theme}
										class="peer sr-only"
									/>
									<div class="border-2 border-border p-6 text-center transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
										<div class="mx-auto mb-3 h-10 w-10 border border-border bg-gradient-to-r from-white to-zinc-900"></div>
										<span class="font-ui text-xs font-semibold tracking-wider">SYSTEM</span>
									</div>
								</label>
							</div>

							<!-- Hidden inputs for form submission -->
							<input type="hidden" name="firstName" value={firstName} />
							<input type="hidden" name="lastName" value={lastName} />
							<input type="hidden" name="phone" value={phone} />
							<input type="hidden" name="accountType" value={accountType} />
							<input type="hidden" name="organizationName" value={organizationName} />
							<input type="hidden" name="inviteCode" value={inviteCode} />
							<input type="hidden" name="emailNotifications" value={emailNotifications.toString()} />
							<input type="hidden" name="smsNotifications" value={smsNotifications.toString()} />
							<input type="hidden" name="magicLinkEnabled" value={magicLinkEnabled.toString()} />
							<input type="hidden" name="theme" value={theme} />

							<div class="flex justify-between border-t border-border pt-6">
								<Button type="button" variant="outline" size="lg" class="font-ui tracking-wider" onclick={prevStep}>
									<ArrowLeft class="mr-2 h-4 w-4" />
									BACK
								</Button>
								<Button type="submit" size="lg" class="font-ui tracking-wider" disabled={isLoading}>
									{#if isLoading}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
										COMPLETING...
									{:else}
										COMPLETE SETUP
										<CheckCircle class="ml-2 h-4 w-4" />
									{/if}
								</Button>
							</div>
						</div>
					{/if}
				</form>
			</div>
		</div>
	</div>
</section>
