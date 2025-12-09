<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import {
		Plus,
		Megaphone,
		Edit,
		Trash2,
		Power,
		PowerOff,
		AlertTriangle,
		Info,
		CheckCircle,
		XCircle,
		Users,
		UsersRound,
		Building2,
		Globe
	} from '@lucide/svelte';

	let { data, form } = $props();

	$effect(() => {
		if (form?.success) {
			toast.success('Announcement created successfully!');
			window.scrollTo({ top: 0, behavior: 'smooth' });
			showCreateModal = false;
			resetForm();
		}
	});

	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let editingAnnouncement = $state<typeof data.announcements[0] | null>(null);

	// Form states
	let formTitle = $state('');
	let formContent = $state('');
	let formType = $state('info');
	let formIsDismissible = $state(true);
	let formExpiresAt = $state('');
	let formTargetType = $state('all');
	let formTargetIds = $state<string[]>([]);

	function resetForm() {
		formTitle = '';
		formContent = '';
		formType = 'info';
		formIsDismissible = true;
		formExpiresAt = '';
		formTargetType = 'all';
		formTargetIds = [];
	}

	function openEditModal(announcement: typeof data.announcements[0]) {
		editingAnnouncement = announcement;
		formTitle = announcement.title;
		formContent = announcement.message || '';
		formType = announcement.type;
		formIsDismissible = announcement.dismissible;
		formExpiresAt = announcement.endsAt ? new Date(announcement.endsAt).toISOString().slice(0, 16) : '';
		showEditModal = true;
	}

	function getTypeIcon(type: string) {
		switch (type) {
			case 'warning': return AlertTriangle;
			case 'success': return CheckCircle;
			case 'error': return XCircle;
			default: return Info;
		}
	}

	function getTypeStyle(type: string) {
		switch (type) {
			case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600';
			case 'success': return 'bg-green-500/10 border-green-500/30 text-green-600';
			case 'error': return 'bg-red-500/10 border-red-500/30 text-red-600';
			default: return 'bg-blue-500/10 border-blue-500/30 text-blue-600';
		}
	}

	function getTargetLabel(announcement: typeof data.announcements[0]) {
		if (announcement.targetUserId) {
			return '1 user';
		}
		if (announcement.targetStaffGroupId) {
			return '1 group';
		}
		if (announcement.targetOrganizationId) {
			return '1 org';
		}
		return 'Everyone';
	}

	function formatDate(date: string | Date | null) {
		if (!date) return 'Never';
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center border border-primary bg-primary/10">
				<Megaphone class="h-5 w-5 text-primary" />
			</div>
			<div>
				<h1 class="font-display text-xl font-black uppercase tracking-wider">Announcements</h1>
				<p class="font-mono text-xs text-muted-foreground">Broadcast messages to users and staff</p>
			</div>
		</div>
		<Button onclick={() => { resetForm(); showCreateModal = true; }}>
			<Plus class="mr-2 h-4 w-4" />
			New Announcement
		</Button>
	</div>

	<!-- Announcements List -->
	<div class="border border-border bg-card">
		{#if data.announcements.length === 0}
			<div class="p-12 text-center">
				<Megaphone class="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
				<p class="font-mono text-sm text-muted-foreground">No announcements yet</p>
				<p class="font-mono text-xs text-muted-foreground/60 mt-1">Create one to broadcast to your users</p>
			</div>
		{:else}
			<div class="divide-y divide-border">
				{#each data.announcements as announcement (announcement.id)}
					{@const TypeIcon = getTypeIcon(announcement.type)}
					<div class="flex items-start gap-4 p-4 hover:bg-card/50 transition-colors {!announcement.isActive ? 'opacity-50' : ''}">
						<div class="flex h-10 w-10 items-center justify-center border {getTypeStyle(announcement.type)}">
							<TypeIcon class="h-5 w-5" />
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<h3 class="font-mono text-sm font-medium">{announcement.title}</h3>
								{#if !announcement.isActive}
									<span class="px-2 py-0.5 bg-muted text-muted-foreground font-mono text-[9px] tracking-wider">INACTIVE</span>
								{/if}
								{#if announcement.dismissible}
									<span class="px-2 py-0.5 bg-muted text-muted-foreground font-mono text-[9px] tracking-wider">DISMISSIBLE</span>
								{/if}
							</div>
							{#if announcement.message}
								<p class="font-mono text-xs text-muted-foreground mt-1 line-clamp-2">{announcement.message}</p>
							{/if}
							<div class="flex items-center gap-4 mt-2">
								<span class="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
									<Globe class="h-3 w-3" />
									{getTargetLabel(announcement)}
								</span>
								<span class="font-mono text-[10px] text-muted-foreground">
									Created: {formatDate(announcement.createdAt)}
								</span>
								{#if announcement.endsAt}
									<span class="font-mono text-[10px] text-muted-foreground">
										Expires: {formatDate(announcement.endsAt)}
									</span>
								{/if}
							</div>
						</div>
						<div class="flex items-center gap-2">
							<form method="POST" action="?/toggleActive" use:enhance>
								<input type="hidden" name="id" value={announcement.id} />
								<input type="hidden" name="isActive" value={!announcement.isActive} />
								<Button type="submit" variant="ghost" size="sm">
									{#if announcement.isActive}
										<PowerOff class="h-4 w-4 text-muted-foreground" />
									{:else}
										<Power class="h-4 w-4 text-green-600" />
									{/if}
								</Button>
							</form>
							<Button variant="ghost" size="sm" onclick={() => openEditModal(announcement)}>
								<Edit class="h-4 w-4" />
							</Button>
							<form method="POST" action="?/delete" use:enhance onsubmit={(e) => {
								if (!confirm('Are you sure you want to delete this announcement?')) {
									e.preventDefault();
								}
							}}>
								<input type="hidden" name="id" value={announcement.id} />
								<Button type="submit" variant="ghost" size="sm">
									<Trash2 class="h-4 w-4 text-destructive" />
								</Button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
		<div class="w-full max-w-lg border border-border bg-card p-6">
			<h2 class="font-display text-lg font-black uppercase tracking-wider mb-6">Create Announcement</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						showCreateModal = false;
						resetForm();
					}
				};
			}}>
				<div class="space-y-4">
					<div>
						<Label for="title" class="font-mono text-[10px] tracking-wider">TITLE *</Label>
						<Input
							id="title"
							name="title"
							bind:value={formTitle}
							placeholder="Announcement title"
							required
						/>
					</div>

					<div>
						<Label for="content" class="font-mono text-[10px] tracking-wider">CONTENT</Label>
						<textarea
							id="content"
							name="content"
							bind:value={formContent}
							placeholder="Additional details (optional)"
							class="w-full border border-border bg-background px-3 py-2 font-mono text-sm resize-none"
							rows="3"
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label class="font-mono text-[10px] tracking-wider">TYPE</Label>
							<select name="type" bind:value={formType} class="w-full border border-border bg-background px-3 py-2 font-mono text-sm">
								<option value="info">Info</option>
								<option value="warning">Warning</option>
								<option value="success">Success</option>
								<option value="error">Error</option>
							</select>
						</div>
						<div>
							<Label for="expiresAt" class="font-mono text-[10px] tracking-wider">EXPIRES AT</Label>
							<Input
								id="expiresAt"
								name="expiresAt"
								type="datetime-local"
								bind:value={formExpiresAt}
							/>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							id="isDismissible"
							name="isDismissible"
							checked={formIsDismissible}
							value="true"
							class="rounded border-border"
						/>
						<Label for="isDismissible" class="font-mono text-xs">Allow users to dismiss</Label>
					</div>

					<div>
						<Label class="font-mono text-[10px] tracking-wider">TARGET AUDIENCE</Label>
						<select name="targetType" bind:value={formTargetType} class="w-full border border-border bg-background px-3 py-2 font-mono text-sm mb-2">
							<option value="all">Everyone</option>
							<option value="users">Specific Users</option>
							<option value="staff_groups">Staff Groups</option>
							<option value="organizations">Organizations</option>
						</select>
						
						{#if formTargetType === 'users'}
							<select name="targetIds" multiple bind:value={formTargetIds} class="w-full border border-border bg-background px-3 py-2 font-mono text-sm h-32">
								{#each data.users as user}
									<option value={user.id}>{user.displayName || user.email}</option>
								{/each}
							</select>
							<p class="font-mono text-[10px] text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple</p>
						{:else if formTargetType === 'staff_groups'}
							<select name="targetIds" multiple bind:value={formTargetIds} class="w-full border border-border bg-background px-3 py-2 font-mono text-sm h-32">
								{#each data.staffGroups as group}
									<option value={group.id}>{group.name}</option>
								{/each}
							</select>
							<p class="font-mono text-[10px] text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple</p>
						{:else if formTargetType === 'organizations'}
							<select name="targetIds" multiple bind:value={formTargetIds} class="w-full border border-border bg-background px-3 py-2 font-mono text-sm h-32">
								{#each data.organizations as org}
									<option value={org.id}>{org.name}</option>
								{/each}
							</select>
							<p class="font-mono text-[10px] text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple</p>
						{/if}
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-2">
					<Button type="button" variant="outline" onclick={() => showCreateModal = false}>Cancel</Button>
					<Button type="submit">Create Announcement</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingAnnouncement}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
		<div class="w-full max-w-lg border border-border bg-card p-6">
			<h2 class="font-display text-lg font-black uppercase tracking-wider mb-6">Edit Announcement</h2>
			<form method="POST" action="?/update" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						showEditModal = false;
						editingAnnouncement = null;
					}
				};
			}}>
				<input type="hidden" name="id" value={editingAnnouncement.id} />
				
				<div class="space-y-4">
					<div>
						<Label for="edit-title" class="font-mono text-[10px] tracking-wider">TITLE *</Label>
						<Input
							id="edit-title"
							name="title"
							bind:value={formTitle}
							placeholder="Announcement title"
							required
						/>
					</div>

					<div>
						<Label for="edit-content" class="font-mono text-[10px] tracking-wider">CONTENT</Label>
						<textarea
							id="edit-content"
							name="content"
							bind:value={formContent}
							placeholder="Additional details (optional)"
							class="w-full border border-border bg-background px-3 py-2 font-mono text-sm resize-none"
							rows="3"
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label class="font-mono text-[10px] tracking-wider">TYPE</Label>
							<select name="type" bind:value={formType} class="w-full border border-border bg-background px-3 py-2 font-mono text-sm">
								<option value="info">Info</option>
								<option value="warning">Warning</option>
								<option value="success">Success</option>
								<option value="error">Error</option>
							</select>
						</div>
						<div>
							<Label for="edit-expiresAt" class="font-mono text-[10px] tracking-wider">EXPIRES AT</Label>
							<Input
								id="edit-expiresAt"
								name="expiresAt"
								type="datetime-local"
								bind:value={formExpiresAt}
							/>
						</div>
					</div>

					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="edit-isActive"
								name="isActive"
								checked={editingAnnouncement.isActive}
								value="true"
								class="rounded border-border"
							/>
							<Label for="edit-isActive" class="font-mono text-xs">Active</Label>
						</div>
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="edit-isDismissible"
								name="isDismissible"
								checked={formIsDismissible}
								value="true"
								class="rounded border-border"
							/>
							<Label for="edit-isDismissible" class="font-mono text-xs">Dismissible</Label>
						</div>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-2">
					<Button type="button" variant="outline" onclick={() => { showEditModal = false; editingAnnouncement = null; }}>Cancel</Button>
					<Button type="submit">Save Changes</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
