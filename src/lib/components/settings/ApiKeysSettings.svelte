<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Plus, Key, Trash2, Copy, Calendar } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface ApiKey {
		id: string;
		name: string;
		keyPrefix: string;
		scopes: string[];
		isActive: boolean;
		lastUsedAt: Date | null;
		usageCount: number;
		expiresAt: Date | null;
		createdAt: Date;
	}

	interface Props {
		apiKeys?: ApiKey[];
		onCreateKey?: (data: { name: string; scopes: string[]; expiresIn: number | null }) => Promise<string>;
		onRevokeKey?: (keyId: string) => Promise<void>;
		onDeleteKey?: (keyId: string) => Promise<void>;
	}

	let { apiKeys = [], onCreateKey, onRevokeKey, onDeleteKey }: Props = $props();

	// New API key dialog state
	let showCreateDialog = $state(false);
	let newKeyName = $state('');
	let newKeyScopes = $state<string[]>([]);
	let newKeyExpiry = $state<string | null>(null);
	let generatedKey = $state<string | null>(null);

	const availableScopes = [
		{ value: 'read:tickets', label: 'Read Tickets' },
		{ value: 'write:tickets', label: 'Write Tickets' },
		{ value: 'read:projects', label: 'Read Projects' },
		{ value: 'write:projects', label: 'Write Projects' },
		{ value: 'read:invoices', label: 'Read Invoices' },
		{ value: 'write:invoices', label: 'Write Invoices' },
		{ value: 'read:customers', label: 'Read Customers' },
		{ value: 'write:customers', label: 'Write Customers' },
		{ value: 'read:analytics', label: 'Read Analytics' },
		{ value: 'admin:all', label: 'Admin (All Access)' }
	];

	const expiryOptions = [
		{ value: 'never', label: 'Never' },
		{ value: '30', label: '30 days' },
		{ value: '90', label: '90 days' },
		{ value: '180', label: '180 days' },
		{ value: '365', label: '1 year' }
	];

	function toggleScope(scope: string) {
		if (newKeyScopes.includes(scope)) {
			newKeyScopes = newKeyScopes.filter(s => s !== scope);
		} else {
			newKeyScopes = [...newKeyScopes, scope];
		}
	}

	async function createKey() {
		if (!newKeyName.trim() || newKeyScopes.length === 0 || !onCreateKey) return;

		try {
		const key = await onCreateKey({
			name: newKeyName,
			scopes: newKeyScopes,
			expiresIn: newKeyExpiry === 'never' ? null : Number(newKeyExpiry)
		});			generatedKey = key;
			newKeyName = '';
			newKeyScopes = [];
			newKeyExpiry = null;
			toast.success('API key created');
		} catch (err) {
			toast.error('Failed to create API key');
		}
	}

	function copyKey(key: string) {
		navigator.clipboard.writeText(key);
		toast.success('API key copied to clipboard');
	}

	async function revokeKey(keyId: string) {
		if (!onRevokeKey) return;
		try {
			await onRevokeKey(keyId);
			toast.success('API key revoked');
		} catch (err) {
			toast.error('Failed to revoke API key');
		}
	}

	async function deleteKey(keyId: string) {
		if (!onDeleteKey) return;
		try {
			await onDeleteKey(keyId);
			toast.success('API key deleted');
		} catch (err) {
			toast.error('Failed to delete API key');
		}
	}

	function formatDate(date: Date | null) {
		if (!date) return 'Never';
		return new Date(date).toLocaleDateString();
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>API Keys</CardTitle>
		<CardDescription>
			Manage API keys for programmatic access to your organization
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Create API Key Button -->
		<Dialog bind:open={showCreateDialog}>
		<DialogTrigger>
			<Button variant="outline" class="w-full">
				<Plus class="h-4 w-4 mr-2" />
				Create API Key
			</Button>
		</DialogTrigger>
			<DialogContent class="sm:max-w-[500px]">
				{#if generatedKey}
					<!-- Show generated key -->
					<DialogHeader>
						<DialogTitle>API Key Created</DialogTitle>
						<DialogDescription>
							Copy this key now - you won't be able to see it again
						</DialogDescription>
					</DialogHeader>
					<div class="space-y-4">
						<div class="rounded-lg border bg-muted p-4">
							<code class="text-sm break-all">{generatedKey}</code>
						</div>
						<Button onclick={() => generatedKey && copyKey(generatedKey)} class="w-full">
							<Copy class="h-4 w-4 mr-2" />
							Copy Key
						</Button>
						<Button
							variant="outline"
							onclick={() => {
								generatedKey = null;
								showCreateDialog = false;
							}}
							class="w-full"
						>
							Done
						</Button>
					</div>
				{:else}
					<!-- Create form -->
					<DialogHeader>
						<DialogTitle>Create API Key</DialogTitle>
						<DialogDescription>
							Generate a new API key with specific permissions
						</DialogDescription>
					</DialogHeader>
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="key-name">Key Name</Label>
							<Input
								id="key-name"
								bind:value={newKeyName}
								placeholder="e.g., Production API"
							/>
						</div>

						<div class="space-y-2">
							<Label>Permissions</Label>
							<div class="grid grid-cols-2 gap-2">
								{#each availableScopes as scope}
									<div class="flex items-center space-x-2">
										<Checkbox
											id={scope.value}
											checked={newKeyScopes.includes(scope.value)}
											onCheckedChange={() => toggleScope(scope.value)}
										/>
										<Label for={scope.value} class="text-sm font-normal cursor-pointer">
											{scope.label}
										</Label>
									</div>
								{/each}
							</div>
						</div>

					<div class="space-y-2">
						<Label for="expiry">Expiry</Label>
						<select
							id="expiry"
							bind:value={newKeyExpiry}
							class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#each expiryOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<Button
						onclick={createKey}
						disabled={!newKeyName.trim() || newKeyScopes.length === 0}
							class="w-full"
						>
							Create Key
						</Button>
					</div>
				{/if}
			</DialogContent>
		</Dialog>

		<!-- API Keys List -->
		<div class="space-y-2">
			{#if apiKeys.length === 0}
				<div class="text-center py-8 text-muted-foreground">
					<Key class="h-8 w-8 mx-auto mb-2 opacity-50" />
					<p>No API keys yet</p>
				</div>
			{:else}
				{#each apiKeys as key (key.id)}
					<div class="flex items-center justify-between rounded-lg border p-4">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="font-medium">{key.name}</span>
								{#if !key.isActive}
									<Badge variant="secondary">Revoked</Badge>
								{/if}
								{#if key.expiresAt && new Date() > new Date(key.expiresAt)}
									<Badge variant="destructive">Expired</Badge>
								{/if}
							</div>
							<code class="text-xs text-muted-foreground">{key.keyPrefix}</code>
							<div class="flex items-center gap-4 text-xs text-muted-foreground">
								<span>Used {key.usageCount} times</span>
								{#if key.lastUsedAt}
									<span>Last used {formatDate(key.lastUsedAt)}</span>
								{/if}
								{#if key.expiresAt}
									<div class="flex items-center gap-1">
										<Calendar class="h-3 w-3" />
										Expires {formatDate(key.expiresAt)}
									</div>
								{/if}
							</div>
							<div class="flex gap-1 flex-wrap">
								{#each key.scopes as scope}
									<Badge variant="outline" class="text-xs">{scope}</Badge>
								{/each}
							</div>
						</div>
						<div class="flex gap-2">
							{#if key.isActive}
								<Button variant="outline" size="sm" onclick={() => revokeKey(key.id)}>
									Revoke
								</Button>
							{/if}
							<Button variant="destructive" size="sm" onclick={() => deleteKey(key.id)}>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</CardContent>
</Card>
