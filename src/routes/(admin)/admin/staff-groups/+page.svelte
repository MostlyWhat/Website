<script lang="ts">
	/**
	 * Staff Groups Management
	 * 
	 * Create and manage staff/admin teams.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { 
		Users, 
		Plus, 
		Trash2, 
		Shield, 
		Headphones, 
		Code, 
		Settings, 
		CheckCircle,
		XCircle,
		ChevronRight
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';

	let { data, form } = $props();

	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			resetForm();
		}
	});

	let showCreateForm = $state(false);
	let newGroupName = $state('');
	let newGroupDescription = $state('');
	let newGroupColor = $state('#6b7280');
	let newGroupIcon = $state('users');

	const iconOptions = [
		{ value: 'users', label: 'Users', icon: Users },
		{ value: 'shield', label: 'Shield', icon: Shield },
		{ value: 'headphones', label: 'Support', icon: Headphones },
		{ value: 'code', label: 'Development', icon: Code },
		{ value: 'settings', label: 'Settings', icon: Settings }
	];

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

	function getIcon(iconName: string) {
		const option = iconOptions.find(o => o.value === iconName);
		return option?.icon ?? Users;
	}

	function resetForm() {
		newGroupName = '';
		newGroupDescription = '';
		newGroupColor = '#6b7280';
		newGroupIcon = 'users';
		showCreateForm = false;
	}
</script>

<svelte:head>
	<title>Staff Groups | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// STAFF MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Staff Groups
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Organize your team into groups for easier management and assignment.
				</p>
			</div>
			<Button onclick={() => (showCreateForm = !showCreateForm)}>
				<Plus class="h-4 w-4 mr-2" />
				<span class="font-mono text-xs tracking-wider">NEW GROUP</span>
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

	<!-- Create Form -->
	{#if showCreateForm}
		<section class="border-b border-border bg-muted/30 px-6 py-6 md:px-12 lg:px-16">
			<form
				method="POST"
				action="?/createGroup"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							resetForm();
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
							bind:value={newGroupName}
							required
							class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
							placeholder="e.g., Support Team"
						/>
					</div>
					<div>
						<label for="icon" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ICON
						</label>
						<select
							id="icon"
							name="icon"
							bind:value={newGroupIcon}
							class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
						>
							{#each iconOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
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
						bind:value={newGroupDescription}
						rows="2"
						class="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none"
						placeholder="Brief description of this group's purpose..."
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
									bind:group={newGroupColor}
									class="sr-only"
								/>
								<div
									class="h-8 w-8 border-2 transition-all {newGroupColor === option.value ? 'border-foreground scale-110' : 'border-transparent'}"
									style="background-color: {option.value}"
									title={option.label}
								></div>
							</label>
						{/each}
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<Button type="button" variant="outline" onclick={() => (showCreateForm = false)}>
						Cancel
					</Button>
					<Button type="submit">
						Create Group
					</Button>
				</div>
			</form>
		</section>
	{/if}

	<!-- Groups List -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		{#if data.groups.length === 0}
			<div class="border border-dashed border-border p-12 text-center">
				<Users class="mx-auto h-12 w-12 text-muted-foreground/30" />
				<h3 class="font-ui mt-4 text-sm font-semibold text-muted-foreground">No Staff Groups</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground/70">
					Create groups to organize your team members.
				</p>
				<Button onclick={() => (showCreateForm = true)} class="mt-4">
					<Plus class="h-4 w-4 mr-2" />
					Create First Group
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.groups as group}
					{@const IconComponent = getIcon(group.icon ?? 'users')}
					<div class="border border-border bg-background hover:border-primary/50 transition-colors">
						<div class="p-4 border-b border-border">
							<div class="flex items-start justify-between">
								<div class="flex items-center gap-3">
									<div 
										class="flex h-10 w-10 items-center justify-center"
										style="background-color: {group.color}20; border: 1px solid {group.color}50"
									>
										<IconComponent class="h-5 w-5" style="color: {group.color}" />
									</div>
									<div>
										<h3 class="font-ui text-sm font-semibold">{group.name}</h3>
										<p class="font-mono text-[10px] text-muted-foreground">{group.memberCount} members</p>
									</div>
								</div>
								<div class="flex items-center gap-1">
									{#if group.isActive}
										<span class="flex items-center gap-1 text-green-500">
											<CheckCircle class="h-4 w-4" />
										</span>
									{:else}
										<span class="flex items-center gap-1 text-muted-foreground">
											<XCircle class="h-4 w-4" />
										</span>
									{/if}
								</div>
							</div>
							{#if group.description}
								<p class="font-body mt-2 text-xs text-muted-foreground line-clamp-2">
									{group.description}
								</p>
							{/if}
						</div>
						<div class="flex">
							<a
								href="/admin/staff-groups/{group.id}"
								class="flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors hover:bg-muted"
							>
								<span class="font-mono text-xs tracking-wider">MANAGE</span>
								<ChevronRight class="h-4 w-4" />
							</a>
							<form method="POST" action="?/toggleGroup" use:enhance class="border-l border-border">
								<input type="hidden" name="groupId" value={group.id} />
								<input type="hidden" name="isActive" value={group.isActive.toString()} />
								<button
									type="submit"
									class="flex items-center justify-center px-4 py-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									title={group.isActive ? 'Disable group' : 'Enable group'}
								>
									{#if group.isActive}
										<XCircle class="h-4 w-4" />
									{:else}
										<CheckCircle class="h-4 w-4" />
									{/if}
								</button>
							</form>
							<form method="POST" action="?/deleteGroup" use:enhance class="border-l border-border">
								<input type="hidden" name="groupId" value={group.id} />
								<button
									type="submit"
									class="flex items-center justify-center px-4 py-3 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
									title="Delete group"
									onclick={(e) => {
										if (!confirm('Are you sure you want to delete this group?')) {
											e.preventDefault();
										}
									}}
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
