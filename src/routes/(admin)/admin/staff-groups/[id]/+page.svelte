<script lang="ts">
	/**
	 * Staff Group Detail Page
	 * 
	 * Manage members of a specific staff group.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, 
		Users, 
		Plus, 
		Trash2, 
		UserPlus, 
		Shield, 
		Star,
		User,
		Edit2,
		Save
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	let isEditing = $state(false);
	let editName = $state(data.group.name);
	let editDescription = $state(data.group.description ?? '');
	let editColor = $state(data.group.color ?? '#6b7280');
	let editIcon = $state(data.group.icon ?? 'users');

	let showAddMember = $state(false);
	let selectedMember = $state('');
	let selectedRole = $state('member');

	const colorOptions = [
		{ value: '#ef4444', label: 'Red' },
		{ value: '#f97316', label: 'Orange' },
		{ value: '#eab308', label: 'Yellow' },
		{ value: '#22c55e', label: 'Green' },
		{ value: '#3b82f6', label: 'Blue' },
		{ value: '#8b5cf6', label: 'Purple' },
		{ value: '#ec4899', label: 'Pink' },
		{ value: '#6b7280', label: 'Gray' }
	];

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getRoleBadgeClass(role: string) {
		switch (role) {
			case 'leader':
				return 'bg-primary/10 text-primary border-primary/30';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	}
</script>

<svelte:head>
	<title>{data.group.name} | Staff Groups | Admin</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/admin/staff-groups"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO STAFF GROUPS</span>
		</a>

		<div class="mt-6 flex items-start gap-4">
			<div 
				class="flex h-14 w-14 items-center justify-center"
				style="background-color: {data.group.color}20; border: 1px solid {data.group.color}50"
			>
				<Users class="h-7 w-7" style="color: {data.group.color}" />
			</div>
			<div class="flex-1">
				<h1 class="font-display text-2xl font-bold uppercase md:text-3xl">
					{data.group.name}
				</h1>
				{#if data.group.description}
					<p class="font-body mt-1 text-muted-foreground">{data.group.description}</p>
				{/if}
				<div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
					<span class="font-mono text-xs">{data.members.length} members</span>
					<span>•</span>
					<span class="font-mono text-xs">Created {formatDate(data.group.createdAt)}</span>
				</div>
			</div>
			<Button variant="outline" onclick={() => (isEditing = !isEditing)}>
				<Edit2 class="h-4 w-4 mr-2" />
				Edit
			</Button>
		</div>
	</section>

	<!-- Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-ui text-sm text-green-500">{form.message}</p>
		</div>
	{/if}
	{#if form?.error}
		<div class="border-b border-red-500/30 bg-red-500/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-ui text-sm text-red-500">{form.error}</p>
		</div>
	{/if}

	<!-- Edit Form -->
	{#if isEditing}
		<section class="border-b border-border bg-muted/30 px-6 py-6 md:px-12 lg:px-16">
			<form
				method="POST"
				action="?/updateGroup"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							isEditing = false;
						}
					};
				}}
				class="max-w-2xl space-y-4"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							GROUP NAME *
						</label>
						<input
							type="text"
							id="name"
							name="name"
							bind:value={editName}
							required
							class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
						/>
					</div>
					<div>
						<label for="icon" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ICON
						</label>
						<select
							id="icon"
							name="icon"
							bind:value={editIcon}
							class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
						>
							<option value="users">Users</option>
							<option value="shield">Shield</option>
							<option value="headphones">Support</option>
							<option value="code">Development</option>
							<option value="settings">Settings</option>
						</select>
					</div>
				</div>

				<div>
					<label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						DESCRIPTION
					</label>
					<textarea
						id="description"
						name="description"
						bind:value={editDescription}
						rows="2"
						class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none"
					></textarea>
				</div>

				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
						COLOR
					</span>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each colorOptions as option}
							<label class="cursor-pointer">
								<input
									type="radio"
									name="color"
									value={option.value}
									bind:group={editColor}
									class="sr-only"
								/>
								<div
									class="h-8 w-8 border-2 transition-all {editColor === option.value ? 'border-foreground scale-110' : 'border-transparent'}"
									style="background-color: {option.value}"
									title={option.label}
								></div>
							</label>
						{/each}
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<Button type="button" variant="outline" onclick={() => (isEditing = false)}>
						Cancel
					</Button>
					<Button type="submit">
						<Save class="h-4 w-4 mr-2" />
						Save Changes
					</Button>
				</div>
			</form>
		</section>
	{/if}

	<!-- Members Section -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		<div class="flex items-center justify-between mb-6">
			<h2 class="font-mono text-xs tracking-widest text-muted-foreground">GROUP MEMBERS</h2>
			<Button size="sm" onclick={() => (showAddMember = !showAddMember)}>
				<UserPlus class="h-4 w-4 mr-2" />
				Add Member
			</Button>
		</div>

		<!-- Add Member Form -->
		{#if showAddMember}
			<div class="mb-6 border border-border bg-muted/30 p-4">
				<form
					method="POST"
					action="?/addMember"
					use:enhance={() => {
						return async ({ result, update }) => {
							await update();
							if (result.type === 'success') {
								selectedMember = '';
								selectedRole = 'member';
								showAddMember = false;
							}
						};
					}}
					class="flex flex-wrap gap-4 items-end"
				>
					<div class="flex-1 min-w-[200px]">
						<label for="profileId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							SELECT STAFF MEMBER
						</label>
						<select
							id="profileId"
							name="profileId"
							bind:value={selectedMember}
							required
							class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
						>
							<option value="">Choose a member...</option>
							{#each data.availableStaff as staff}
								<option value={staff.id}>
									{staff.displayName || staff.email} ({staff.role})
								</option>
							{/each}
						</select>
					</div>
					<div class="min-w-[150px]">
						<label for="memberRole" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ROLE IN GROUP
						</label>
						<select
							id="memberRole"
							name="memberRole"
							bind:value={selectedRole}
							class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
						>
							<option value="member">Member</option>
							<option value="leader">Leader</option>
						</select>
					</div>
					<div class="flex gap-2">
						<Button type="button" variant="outline" onclick={() => (showAddMember = false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!selectedMember}>
							<Plus class="h-4 w-4 mr-2" />
							Add
						</Button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Members List -->
		{#if data.members.length === 0}
			<div class="border border-dashed border-border p-12 text-center">
				<Users class="mx-auto h-12 w-12 text-muted-foreground/30" />
				<h3 class="font-ui mt-4 text-sm font-semibold text-muted-foreground">No Members</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground/70">
					Add staff members to this group.
				</p>
			</div>
		{:else}
			<div class="border border-border divide-y divide-border">
				{#each data.members as member}
					<div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
						<div class="flex items-center gap-4">
							<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
								{#if member.avatarUrl}
									<img src={member.avatarUrl} alt="" class="h-10 w-10 object-cover" />
								{:else}
									<User class="h-5 w-5 text-muted-foreground" />
								{/if}
							</div>
							<div>
								<p class="font-ui text-sm font-medium">{member.displayName || member.email}</p>
								<div class="flex items-center gap-2 mt-0.5">
									<span class="font-mono text-[10px] text-muted-foreground uppercase">
										{member.profileRole}
									</span>
									{#if member.role === 'leader'}
										<span class="inline-flex items-center gap-1 px-1.5 py-0.5 border {getRoleBadgeClass(member.role)}">
											<Star class="h-3 w-3" />
											<span class="font-mono text-[9px] uppercase">Leader</span>
										</span>
									{/if}
								</div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<form method="POST" action="?/updateMemberRole" use:enhance>
								<input type="hidden" name="profileId" value={member.profileId} />
								<select
									name="role"
									value={member.role}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
									class="h-9 px-3 text-xs border border-border bg-card focus:border-primary focus:outline-none"
								>
									<option value="member">Member</option>
									<option value="leader">Leader</option>
								</select>
							</form>
							<form method="POST" action="?/removeMember" use:enhance>
								<input type="hidden" name="profileId" value={member.profileId} />
								<Button 
									type="submit" 
									variant="ghost" 
									size="sm"
									class="text-muted-foreground hover:text-destructive"
									onclick={(e) => {
										if (!confirm('Remove this member from the group?')) {
											e.preventDefault();
										}
									}}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
