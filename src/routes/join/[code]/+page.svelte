<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Building2, Check, Clock, AlertCircle, LogIn } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Join {data.invite.organizationName} | MostlyWhat</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background p-4">
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="text-center mb-8">
			<div class="h-16 w-16 border border-border bg-card flex items-center justify-center mx-auto mb-4">
				<Building2 class="h-8 w-8 text-primary" />
			</div>
			<h1 class="font-mono text-xl tracking-tight mb-2">
				Join {data.invite.organizationName}
			</h1>
			<p class="text-muted-foreground">
				You've been invited to join this organization
			</p>
		</div>

		<!-- Card -->
		<div class="border border-border bg-background">
			<!-- Status Messages -->
			{#if form?.success && form.pending}
				<div class="p-6 text-center">
					<div class="h-12 w-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
						<Clock class="h-6 w-6 text-yellow-500" />
					</div>
					<h2 class="font-medium mb-2">Request Submitted</h2>
					<p class="text-sm text-muted-foreground mb-4">
						Your request to join {data.invite.organizationName} has been submitted. 
						An administrator will review your request.
					</p>
					<Button href="/app" variant="outline">
						Go to Dashboard
					</Button>
				</div>
			{:else if form?.success && !form.pending}
				<div class="p-6 text-center">
					<div class="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
						<Check class="h-6 w-6 text-green-500" />
					</div>
					<h2 class="font-medium mb-2">Welcome!</h2>
					<p class="text-sm text-muted-foreground mb-4">
						You've successfully joined {data.invite.organizationName}.
					</p>
					<Button href="/app">
						Go to Dashboard
					</Button>
				</div>
			{:else if data.alreadyMember}
				<div class="p-6 text-center">
					<div class="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
						<Check class="h-6 w-6 text-green-500" />
					</div>
					<h2 class="font-medium mb-2">Already a Member</h2>
					<p class="text-sm text-muted-foreground mb-4">
						You're already a member of {data.invite.organizationName}.
					</p>
					<Button href="/app">
						Go to Dashboard
					</Button>
				</div>
			{:else if data.pendingApproval}
				<div class="p-6 text-center">
					<div class="h-12 w-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
						<Clock class="h-6 w-6 text-yellow-500" />
					</div>
					<h2 class="font-medium mb-2">Pending Approval</h2>
					<p class="text-sm text-muted-foreground mb-4">
						Your request to join {data.invite.organizationName} is still pending approval.
					</p>
					<Button href="/app" variant="outline">
						Go to Dashboard
					</Button>
				</div>
			{:else}
				<!-- Invite Details -->
				<div class="p-6 border-b border-border">
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-sm text-muted-foreground">Organization</span>
							<span class="font-medium">{data.invite.organizationName}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-muted-foreground">Your Role</span>
							<span class="capitalize">{data.invite.role}</span>
						</div>
						{#if data.invite.requiresApproval}
							<div class="flex items-center gap-2 text-sm text-yellow-500">
								<Clock class="h-4 w-4" />
								<span>Requires admin approval</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Error Message -->
				{#if form?.error}
					<div class="px-6 pt-4">
						<div class="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
							<AlertCircle class="h-4 w-4 flex-shrink-0" />
							{form.error}
						</div>
					</div>
				{/if}

				<!-- Email Restriction Notice -->
				{#if data.invite.email && data.isLoggedIn && data.userEmail !== data.invite.email}
					<div class="px-6 pt-4">
						<div class="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm flex items-center gap-2">
							<AlertCircle class="h-4 w-4 flex-shrink-0" />
							<span>This invite is for {data.invite.email}. You're logged in as {data.userEmail}.</span>
						</div>
					</div>
				{/if}

				<!-- Action -->
				<div class="p-6">
					{#if data.isLoggedIn}
						<form method="POST" action="?/join" use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								await update();
								isSubmitting = false;
							};
						}}>
							<Button type="submit" class="w-full" disabled={isSubmitting}>
								{#if isSubmitting}
									Joining...
								{:else if data.invite.requiresApproval}
									Request to Join
								{:else}
									Join Organization
								{/if}
							</Button>
						</form>
					{:else}
						<div class="space-y-3">
							<p class="text-sm text-center text-muted-foreground">
								Sign in or create an account to accept this invite
							</p>
							<div class="flex gap-2">
								<Button href="/auth/login?redirect=/join/{data.invite.code}" variant="outline" class="flex-1">
									<LogIn class="h-4 w-4 mr-2" />
									Sign In
								</Button>
								<Button href="/auth/signup?redirect=/join/{data.invite.code}" class="flex-1">
									Create Account
								</Button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Back Link -->
		<div class="text-center mt-6">
			<a href="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
				← Back to Home
			</a>
		</div>
	</div>
</div>
