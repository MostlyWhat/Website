<script lang="ts">
	/**
	 * StaffAssignmentSelect - A clean staff assignment selector with groups
	 */
	import { cn } from '$lib/utils';
	import { User, Users, ChevronDown, Check } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';

	interface StaffMember {
		id: string;
		displayName: string | null;
		email: string | null;
		role: string | null;
		groupId?: string | null;
		groupName?: string | null;
	}

	interface Props {
		value: string;
		staffMembers: StaffMember[];
		staffGroups?: Array<{ id: string; name: string; type: string }>;
		onchange: (staffId: string) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		value,
		staffMembers,
		staffGroups = [],
		onchange,
		disabled = false,
		class: className = ''
	}: Props = $props();

	let open = $state(false);
	let selectedGroup = $state<string | null>(null);

	// Get selected staff member
	const selectedStaff = $derived(staffMembers.find(s => s.id === value));

	// Group staff by their groups
	const groupedStaff = $derived.by(() => {
		const groups: Record<string, StaffMember[]> = {
			'ungrouped': []
		};

		// Initialize groups
		for (const group of staffGroups) {
			groups[group.id] = [];
		}

		// Sort staff into groups (for simplicity, we'll group by role if no group info)
		for (const staff of staffMembers) {
			if (staff.groupId && groups[staff.groupId]) {
				groups[staff.groupId].push(staff);
			} else {
				groups['ungrouped'].push(staff);
			}
		}

		return groups;
	});

	// Staff filtered by selected group
	const filteredStaff = $derived.by(() => {
		if (!selectedGroup) return staffMembers;
		return groupedStaff[selectedGroup] || [];
	});

	function getRoleBadgeColor(role: string | null) {
		switch (role) {
			case 'super_admin': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'staff': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}

	function formatRole(role: string | null) {
		if (!role) return 'User';
		return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}

	function selectStaff(staffId: string) {
		onchange(staffId);
		open = false;
		selectedGroup = null;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class={cn('w-full justify-between', className)}
				{disabled}
			>
				{#if selectedStaff}
					<div class="flex items-center gap-2 truncate">
						<div class="flex h-6 w-6 items-center justify-center border border-border bg-background">
							<User class="h-3 w-3" />
						</div>
						<div class="flex flex-col items-start text-left truncate">
							<span class="text-sm truncate">{selectedStaff.displayName || selectedStaff.email || 'Unknown'}</span>
						</div>
						<span class={cn('px-1.5 py-0.5 text-[9px] font-medium border ml-auto', getRoleBadgeColor(selectedStaff.role))}>
							{formatRole(selectedStaff.role)}
						</span>
					</div>
				{:else}
					<span class="text-muted-foreground">Unassigned</span>
				{/if}
				<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[300px] p-0" align="start">
		<div class="max-h-[300px] overflow-y-auto">
			<!-- Unassigned option -->
			<button
				type="button"
				onclick={() => selectStaff('')}
				class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
			>
				<div class="flex h-6 w-6 items-center justify-center border border-dashed border-border bg-background">
					<User class="h-3 w-3 text-muted-foreground" />
				</div>
				<span class="text-muted-foreground">Unassigned</span>
				{#if !value}
					<Check class="ml-auto h-4 w-4 text-primary" />
				{/if}
			</button>

			<div class="border-t border-border"></div>

			<!-- Group filters -->
			{#if staffGroups.length > 0}
				<div class="p-2 border-b border-border">
					<div class="flex flex-wrap gap-1">
						<button
							type="button"
							onclick={() => selectedGroup = null}
							class={cn(
								'px-2 py-1 text-[10px] font-mono tracking-wider border transition-colors',
								!selectedGroup ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'
							)}
						>
							ALL
						</button>
						{#each staffGroups as group}
							<button
								type="button"
								onclick={() => selectedGroup = group.id}
								class={cn(
									'px-2 py-1 text-[10px] font-mono tracking-wider border transition-colors',
									selectedGroup === group.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'
								)}
							>
								{group.name.toUpperCase()}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Staff list -->
			<div class="py-1">
				{#each filteredStaff as staff (staff.id)}
					<button
						type="button"
						onclick={() => selectStaff(staff.id)}
						class="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted transition-colors"
					>
						<div class="flex h-6 w-6 items-center justify-center border border-border bg-background">
							<User class="h-3 w-3" />
						</div>
						<div class="flex-1 min-w-0 text-left">
							<p class="text-sm truncate">{staff.displayName || staff.email || 'Unknown'}</p>
							{#if staff.email && staff.displayName}
								<p class="text-[10px] text-muted-foreground truncate">{staff.email}</p>
							{/if}
						</div>
						<span class={cn('px-1.5 py-0.5 text-[9px] font-medium border', getRoleBadgeColor(staff.role))}>
							{formatRole(staff.role)}
						</span>
						{#if value === staff.id}
							<Check class="h-4 w-4 text-primary" />
						{/if}
					</button>
				{/each}
				{#if filteredStaff.length === 0}
					<p class="px-3 py-4 text-center text-sm text-muted-foreground">No staff in this group</p>
				{/if}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
