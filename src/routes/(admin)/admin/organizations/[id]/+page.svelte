<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { 
		ArrowLeft, Building2, Users, Mail, Phone, Globe, 
		Plus, Trash2, UserPlus, UserX, Check, X, 
		Copy, Link, Clock, Shield, FolderKanban, 
		ChevronDown, AlertTriangle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PageHeader, PageSection, ActionButtons } from '$lib/components/ui/layouts';

	let { data, form } = $props();

	let showCreateInvite = $state(false);
	let showRejectModal = $state<string | null>(null);
	let rejectionReason = $state('');
	let copiedCode = $state<string | null>(null);

	// Invite form state
	let inviteEmail = $state('');
	let inviteRole = $state('member');
	let inviteMaxUses = $state('1');
	let inviteExpiresIn = $state('7days');
	let inviteRequiresApproval = $state(false);

	function getInviteUrl(code: string): string {
		return `${page.url.origin}/join/${code}`;
	}

	async function copyToClipboard(text: string, code: string) {
		await navigator.clipboard.writeText(text);
		copiedCode = code;
		setTimeout(() => copiedCode = null, 2000);
	}

	function isInviteExpired(expiresAt: Date | null): boolean {
		if (!expiresAt) return false;
		return new Date(expiresAt) < new Date();
	}

	function isInviteExhausted(usedCount: number, maxUses: number | null): boolean {
		if (!maxUses) return false;
		return usedCount >= maxUses;
	}

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function resetInviteForm() {
		inviteEmail = '';
		inviteRole = 'member';
		inviteMaxUses = '1';
		inviteExpiresIn = '7days';
		inviteRequiresApproval = false;
		showCreateInvite = false;
	}
</script>

<svelte:head>
	<title>{data.organization.name} | Organizations | Admin</title>
</svelte:head>

<div class="container max-w-6xl mx-auto px-4 py-12">
	<!-- Back Link -->
	<a
		href="/admin/organizations"
		class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
	>
		<ArrowLeft class="h-4 w-4" />
		<span class="font-mono text-xs tracking-wider">BACK TO ORGANIZATIONS</span>
	</a>

	<!-- Organization Header -->
	<div class="border border-border bg-background mb-8">
		<div class="border-b border-border px-6 py-4 flex items-center gap-4">
			<div class="h-12 w-12 border border-border bg-muted flex items-center justify-center">
				<Building2 class="h-6 w-6 text-muted-foreground" />
			</div>
			<div class="flex-1">
				<div class="flex items-center gap-2">
					<h1 class="font-mono text-xl tracking-tight">{data.organization.name}</h1>
					<span class="font-mono text-xs text-muted-foreground">{data.organization.orgNumber}</span>
					{#if data.organization.customerType}
						<span class="font-mono text-[10px] px-1.5 py-0.5 {data.organization.customerType === 'enterprise' ? 'bg-purple-500/10 text-purple-500' : data.organization.customerType === 'business' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}">
							{data.organization.customerType.toUpperCase()}
						</span>
					{/if}
				</div>
				<p class="text-sm text-muted-foreground">@{data.organization.slug}</p>
			</div>
		</div>
		<div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">\n\t\t\t{#if data.organization.email}
				<div class="flex items-center gap-2 text-sm">
					<Mail class="h-4 w-4 text-muted-foreground" />
					<span>{data.organization.email}</span>
				</div>
			{/if}
			{#if data.organization.phone}
				<div class="flex items-center gap-2 text-sm">
					<Phone class="h-4 w-4 text-muted-foreground" />
					<span>{data.organization.phone}</span>
				</div>
			{/if}
			{#if data.organization.website}
				<div class="flex items-center gap-2 text-sm">
					<Globe class="h-4 w-4 text-muted-foreground" />
					<a href={data.organization.website} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
						{data.organization.website}
					</a>
				</div>
			{/if}
		</div>
	</div>

	<!-- Form Messages -->
	{#if form?.success}
		<div class="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-500 text-sm">
			{form.message}
			{#if form.code}
				<div class="mt-2 flex items-center gap-2">
					<code class="bg-background px-2 py-1 border border-border">{form.code}</code>
					<Button
						variant="outline"
						size="sm"
						onclick={() => copyToClipboard(getInviteUrl(form.code), form.code)}
					>
						<Copy class="h-4 w-4 mr-1" />
						{copiedCode === form.code ? 'Copied!' : 'Copy Link'}
					</Button>
				</div>
			{/if}
		</div>
	{/if}
	{#if form?.error}
		<div class="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
			{form.error}
		</div>
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-8">
			<!-- Members Section -->
			<div class="border border-border bg-background">
				<div class="border-b border-border px-6 py-4 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Users class="h-4 w-4 text-muted-foreground" />
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">MEMBERS</h2>
					</div>
					<span class="text-sm text-muted-foreground">{data.members.length} total</span>
				</div>

				{#if data.members.length === 0}
					<div class="p-6 text-center text-muted-foreground">
						<Users class="h-8 w-8 mx-auto mb-2 opacity-50" />
						<p>No members yet</p>
					</div>
				{:else}
					<div class="divide-y divide-border">
						{#each data.members as member}
							<div class="p-4 flex items-center justify-between">
								<div class="flex items-center gap-4">
									<div class="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
										<span class="text-sm font-medium">
											{(member.displayName || member.email).charAt(0).toUpperCase()}
										</span>
									</div>
									<div>
										<p class="font-medium">{member.displayName || 'Unknown'}</p>
										<p class="text-sm text-muted-foreground">{member.email}</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<form method="POST" action="?/updateMemberRole" use:enhance>
										<input type="hidden" name="profileId" value={member.profileId} />
										<select
											name="role"
											value={member.role}
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
											class="h-8 px-2 text-xs border border-border bg-card focus:border-primary focus:outline-none"
										>
											<option value="member">Member</option>
											<option value="admin">Admin</option>
										</select>
									</form>
									<form method="POST" action="?/removeMember" use:enhance>
										<input type="hidden" name="profileId" value={member.profileId} />
										<Button type="submit" variant="ghost" size="sm" class="text-muted-foreground hover:text-destructive">
											<Trash2 class="h-4 w-4" />
										</Button>
									</form>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Pending Members Section -->
			{#if data.pendingMembers.filter(p => p.status === 'pending').length > 0}
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<UserPlus class="h-4 w-4 text-yellow-500" />
							<h2 class="font-mono text-xs tracking-widest text-muted-foreground">PENDING APPROVAL</h2>
						</div>
						<span class="text-sm text-yellow-500">
							{data.pendingMembers.filter(p => p.status === 'pending').length} pending
						</span>
					</div>
					<div class="divide-y divide-border">
						{#each data.pendingMembers.filter(p => p.status === 'pending') as pending}
							<div class="p-4 flex items-center justify-between">
								<div class="flex items-center gap-4">
									<div class="h-10 w-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
										<span class="text-sm font-medium text-yellow-500">
											{(pending.displayName || pending.email).charAt(0).toUpperCase()}
										</span>
									</div>
									<div>
										<p class="font-medium">{pending.displayName || 'Unknown'}</p>
										<p class="text-sm text-muted-foreground">{pending.email}</p>
										<p class="text-xs text-muted-foreground mt-1">
											Requested role: {pending.requestedRole} • {formatDate(pending.createdAt)}
										</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<form method="POST" action="?/approveMember" use:enhance>
										<input type="hidden" name="pendingId" value={pending.id} />
										<Button type="submit" size="sm" class="bg-green-600 hover:bg-green-700">
											<Check class="h-4 w-4 mr-1" />
											Approve
										</Button>
									</form>
									<Button
										variant="outline"
										size="sm"
										class="text-destructive border-destructive/30"
										onclick={() => showRejectModal = pending.id}
									>
										<X class="h-4 w-4 mr-1" />
										Reject
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Invites Section -->
			<div class="border border-border bg-background">
				<div class="border-b border-border px-6 py-4 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Link class="h-4 w-4 text-muted-foreground" />
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">INVITE LINKS</h2>
					</div>
					<Button
						size="sm"
						onclick={() => showCreateInvite = !showCreateInvite}
					>
						<Plus class="h-4 w-4 mr-1" />
						Create Invite
					</Button>
				</div>

				{#if showCreateInvite}
					<div class="p-6 border-b border-border bg-muted/30">
						<form
							method="POST"
							action="?/createInvite"
							use:enhance={() => {
								return async ({ result, update }) => {
									await update();
									if (result.type === 'success') {
										resetInviteForm();
									}
								};
							}}
							class="space-y-4"
						>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label for="invite-email" class="block text-sm font-medium text-muted-foreground mb-1">
										Email (optional)
									</label>
									<input
										id="invite-email"
										type="email"
										name="email"
										bind:value={inviteEmail}
										placeholder="Restrict to specific email"
										class="w-full px-3 py-2 border border-border bg-card focus:border-primary focus:outline-none"
									/>
								</div>
								<div>
									<label for="invite-role" class="block text-sm font-medium text-muted-foreground mb-1">
										Role
									</label>
									<select
										id="invite-role"
										name="role"
										bind:value={inviteRole}
										class="w-full px-3 py-2 border border-border bg-card focus:border-primary focus:outline-none"
									>
										<option value="member">Member</option>
										<option value="admin">Admin</option>
									</select>
								</div>
								<div>
									<label for="invite-max-uses" class="block text-sm font-medium text-muted-foreground mb-1">
										Max Uses
									</label>
									<select
										id="invite-max-uses"
										name="maxUses"
										bind:value={inviteMaxUses}
										class="w-full px-3 py-2 border border-border bg-card focus:border-primary focus:outline-none"
									>
										<option value="1">1 use</option>
										<option value="5">5 uses</option>
										<option value="10">10 uses</option>
										<option value="25">25 uses</option>
										<option value="100">100 uses</option>
									</select>
								</div>
								<div>
									<label for="invite-expires" class="block text-sm font-medium text-muted-foreground mb-1">
										Expires
									</label>
									<select
										id="invite-expires"
										name="expiresIn"
										bind:value={inviteExpiresIn}
										class="w-full px-3 py-2 border border-border bg-card focus:border-primary focus:outline-none"
									>
										<option value="1day">1 day</option>
										<option value="7days">7 days</option>
										<option value="30days">30 days</option>
										<option value="never">Never</option>
									</select>
								</div>
							</div>

							<label class="flex items-center gap-2">
								<input
									type="checkbox"
									name="requiresApproval"
									bind:checked={inviteRequiresApproval}
									value="true"
									class="rounded border-border"
								/>
								<span class="text-sm">Require approval before joining</span>
							</label>

							<div class="flex justify-end gap-2">
								<Button type="button" variant="outline" onclick={() => showCreateInvite = false}>
									Cancel
								</Button>
								<Button type="submit">
									Create Invite
								</Button>
							</div>
						</form>
					</div>
				{/if}

				{#if data.invites.length === 0}
					<div class="p-6 text-center text-muted-foreground">
						<Link class="h-8 w-8 mx-auto mb-2 opacity-50" />
						<p>No invites created yet</p>
					</div>
				{:else}
					<div class="divide-y divide-border">
						{#each data.invites as invite}
							{@const expired = isInviteExpired(invite.expiresAt)}
							{@const exhausted = isInviteExhausted(invite.usedCount, invite.maxUses)}
							{@const inactive = expired || exhausted}
							<div class="p-4 {inactive ? 'opacity-50' : ''}">
								<div class="flex items-start justify-between">
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-1">
											<code class="text-sm font-mono bg-muted px-2 py-0.5 border border-border">
												{invite.code}
											</code>
											{#if !inactive}
												<button
													type="button"
													onclick={() => copyToClipboard(getInviteUrl(invite.code), invite.code)}
													class="text-muted-foreground hover:text-primary transition-colors"
													title="Copy invite link"
												>
													{#if copiedCode === invite.code}
														<Check class="h-4 w-4 text-green-500" />
													{:else}
														<Copy class="h-4 w-4" />
													{/if}
												</button>
											{/if}
										</div>
										<div class="flex items-center gap-4 text-xs text-muted-foreground mt-2">
											{#if invite.email}
												<span class="flex items-center gap-1">
													<Mail class="h-3 w-3" />
													{invite.email}
												</span>
											{/if}
											<span class="flex items-center gap-1">
												<Shield class="h-3 w-3" />
												{invite.role}
											</span>
											<span class="flex items-center gap-1">
												<Users class="h-3 w-3" />
												{invite.usedCount}/{invite.maxUses ?? '∞'}
											</span>
											{#if invite.expiresAt}
												<span class="flex items-center gap-1 {expired ? 'text-destructive' : ''}">
													<Clock class="h-3 w-3" />
													{expired ? 'Expired' : `Expires ${formatDate(invite.expiresAt)}`}
												</span>
											{/if}
											{#if invite.requiresApproval}
												<span class="flex items-center gap-1 text-yellow-500">
													<AlertTriangle class="h-3 w-3" />
													Approval required
												</span>
											{/if}
										</div>
									</div>
									<form method="POST" action="?/deleteInvite" use:enhance>
										<input type="hidden" name="inviteId" value={invite.id} />
										<Button type="submit" variant="ghost" size="sm" class="text-muted-foreground hover:text-destructive">
											<Trash2 class="h-4 w-4" />
										</Button>
									</form>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Projects -->
			<div class="border border-border bg-background">
				<div class="border-b border-border px-6 py-4 flex items-center gap-2">
					<FolderKanban class="h-4 w-4 text-muted-foreground" />
					<h2 class="font-mono text-xs tracking-widest text-muted-foreground">RECENT PROJECTS</h2>
				</div>
				{#if data.projects.length === 0}
					<div class="p-6 text-center text-muted-foreground">
						<FolderKanban class="h-8 w-8 mx-auto mb-2 opacity-50" />
						<p class="text-sm">No projects</p>
					</div>
				{:else}
					<div class="divide-y divide-border">
						{#each data.projects as project}
							<a
								href="/admin/projects/{project.id}"
								class="block p-4 hover:bg-muted/50 transition-colors"
							>
								<p class="font-medium text-sm">{project.name}</p>
								<p class="text-xs text-muted-foreground mt-1">
									{project.status} • {formatDate(project.createdAt)}
								</p>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Organization Info -->
			<div class="border border-border bg-background">
				<div class="border-b border-border px-6 py-4">
					<h2 class="font-mono text-xs tracking-widest text-muted-foreground">DETAILS</h2>
				</div>
				<div class="p-6 space-y-4 text-sm">
					<div>
						<p class="text-muted-foreground">Created</p>
						<p>{formatDate(data.organization.createdAt)}</p>
					</div>
					{#if data.organization.billingAddressLine1}
						<div>
							<p class="text-muted-foreground">Address</p>
							<p>{data.organization.billingAddressLine1}</p>
							{#if data.organization.billingCity}
								<p>{data.organization.billingCity}, {data.organization.billingState || ''} {data.organization.billingPostalCode || ''}</p>
							{/if}
						</div>
					{/if}
					{#if data.organization.taxId}
						<div>
							<p class="text-muted-foreground">Tax ID</p>
							<p>{data.organization.taxId}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Rejection Modal -->
{#if showRejectModal}
	<div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-background border border-border w-full max-w-md">
			<div class="border-b border-border px-6 py-4 flex items-center gap-2">
				<UserX class="h-4 w-4 text-destructive" />
				<h2 class="font-mono text-xs tracking-widest">REJECT MEMBER</h2>
			</div>
			<form
				method="POST"
				action="?/rejectMember"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showRejectModal = null;
						rejectionReason = '';
					};
				}}
				class="p-6"
			>
				<input type="hidden" name="pendingId" value={showRejectModal} />
				<div class="mb-4">
					<label for="rejection-reason" class="block text-sm font-medium text-muted-foreground mb-1">
						Reason (optional)
					</label>
					<textarea
						id="rejection-reason"
						name="reason"
						bind:value={rejectionReason}
						placeholder="Provide a reason for rejection..."
						rows="3"
						class="w-full px-3 py-2 border border-border bg-card focus:border-primary focus:outline-none resize-none"
					></textarea>
				</div>
				<div class="flex justify-end gap-2">
					<Button type="button" variant="outline" onclick={() => showRejectModal = null}>
						Cancel
					</Button>
					<Button type="submit" variant="destructive">
						Reject
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
