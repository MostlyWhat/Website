<script lang="ts">
	/**
	 * Admin Settings Page
	 * 
	 * System-wide settings management for super admins.
	 */
	import { enhance } from '$app/forms';
	import { 
		Settings, Save, RotateCcw, Check, AlertCircle, Loader2,
		Globe, Ticket, Receipt, Mail, Shield, ChevronRight
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';

	let { data } = $props();
	
	let activeCategory = $state('general');
	let editingKey = $state<string | null>(null);
	let editValue = $state('');
	let isSubmitting = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	const categoryIcons: Record<string, typeof Globe> = {
		general: Globe,
		tickets: Ticket,
		billing: Receipt,
		email: Mail,
		security: Shield
	};

	function getCategoryIcon(key: string) {
		return categoryIcons[key] ?? Settings;
	}

	function startEdit(key: string, value: unknown) {
		editingKey = key;
		editValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
	}

	function cancelEdit() {
		editingKey = null;
		editValue = '';
	}

	function formatValue(value: unknown, isSecret: boolean): string {
		if (isSecret) return '••••••••';
		if (typeof value === 'boolean') return value ? 'Yes' : 'No';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return 'Never';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	const currentSettings = $derived(
		data.settingsByCategory[activeCategory] ?? []
	);

	const hasSettings = $derived(data.settings.length > 0);
</script>

<svelte:head>
	<title>Settings | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// SYSTEM CONFIGURATION</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Settings</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Configure system-wide settings and preferences.
				</p>
			</div>
			{#if !hasSettings}
				<form method="POST" action="?/initialize" use:enhance>
					<Button type="submit" variant="outline" size="sm" class="font-ui text-xs tracking-wider">
						<RotateCcw class="mr-2 h-4 w-4" />
						INITIALIZE DEFAULTS
					</Button>
				</form>
			{/if}
		</div>
	</section>

	{#if message}
		<div class="mx-6 mt-4 md:mx-12 lg:mx-16">
			<div class="flex items-center gap-2 px-4 py-3 border {message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-red-500/30 bg-red-500/10 text-red-500'}">
				{#if message.type === 'success'}
					<Check class="h-4 w-4" />
				{:else}
					<AlertCircle class="h-4 w-4" />
				{/if}
				<span class="text-sm">{message.text}</span>
			</div>
		</div>
	{/if}

	<div class="flex flex-col lg:flex-row">
		<!-- Category Navigation -->
		<aside class="border-b lg:border-b-0 lg:border-r border-border lg:w-64 shrink-0">
			<nav class="p-4 lg:p-6">
				<h2 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">CATEGORIES</h2>
				<ul class="space-y-1">
					{#each data.categories as category}
						{@const Icon = getCategoryIcon(category.key)}
						<li>
							<button
								type="button"
								onclick={() => activeCategory = category.key}
								class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors {activeCategory === category.key
									? 'bg-primary/10 text-primary border border-primary/30'
									: 'hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent'}"
							>
								<Icon class="h-4 w-4" />
								<span class="font-ui text-xs tracking-wider flex-1">{category.label.toUpperCase()}</span>
								{#if activeCategory === category.key}
									<ChevronRight class="h-4 w-4" />
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>

		<!-- Settings Content -->
		<main class="flex-1 p-6 md:p-8 lg:p-12">
			{#if hasSettings}
				{@const activeCategoryData = data.categories.find((c: { key: string; label: string; description: string }) => c.key === activeCategory)}
				<div class="mb-8">
					<h2 class="font-display text-xl font-bold uppercase">{activeCategoryData?.label ?? 'Settings'}</h2>
					<p class="font-body text-sm text-muted-foreground mt-1">{activeCategoryData?.description ?? ''}</p>
				</div>

				<div class="space-y-6">
					{#each currentSettings as setting}
						<Card.Root class="border-border">
							<Card.Content class="p-6">
								<div class="flex flex-col md:flex-row md:items-start gap-4">
									<div class="flex-1">
										<h3 class="font-ui text-sm font-semibold">{setting.label}</h3>
										{#if setting.description}
											<p class="text-xs text-muted-foreground mt-1">{setting.description}</p>
										{/if}
										<div class="mt-2">
											<span class="font-mono text-xs text-muted-foreground">Key: </span>
											<code class="font-mono text-xs bg-muted px-1.5 py-0.5">{setting.key}</code>
										</div>
										{#if setting.updatedAt}
											<p class="text-xs text-muted-foreground mt-2">
												Last updated: {formatDate(setting.updatedAt)}
												{#if setting.updatedByName}
													by {setting.updatedByName}
												{/if}
											</p>
										{/if}
									</div>
									<div class="md:w-64 lg:w-80">
										{#if editingKey === setting.key}
											<form
												method="POST"
												action="?/update"
												use:enhance={() => {
													isSubmitting = true;
													return async ({ result, update }) => {
														isSubmitting = false;
														if (result.type === 'success') {
															editingKey = null;
															message = { type: 'success', text: 'Setting updated successfully' };
															setTimeout(() => message = null, 3000);
														} else if (result.type === 'failure') {
															message = { type: 'error', text: result.data?.error as string ?? 'Failed to update' };
														}
														await update();
													};
												}}
											>
												<input type="hidden" name="key" value={setting.key} />
												<input type="hidden" name="valueType" value={setting.valueType} />
												<div class="flex flex-col gap-2">
													{#if setting.valueType === 'boolean'}
														<select
															name="value"
															class="w-full px-3 py-2 border border-border bg-background text-sm focus:border-primary focus:outline-none"
														>
															<option value="true" selected={setting.value === true}>Yes</option>
															<option value="false" selected={setting.value === false}>No</option>
														</select>
													{:else if setting.valueType === 'json' || setting.valueType === 'array'}
														<Textarea
															name="value"
															value={editValue}
															class="font-mono text-xs"
															rows={4}
														/>
													{:else}
														<Input
															type={setting.valueType === 'number' ? 'number' : 'text'}
															name="value"
															value={editValue}
														/>
													{/if}
													<div class="flex gap-2">
														<Button type="submit" size="sm" disabled={isSubmitting}>
															{#if isSubmitting}
																<Loader2 class="mr-2 h-4 w-4 animate-spin" />
															{:else}
																<Save class="mr-2 h-4 w-4" />
															{/if}
															Save
														</Button>
														<Button type="button" variant="outline" size="sm" onclick={cancelEdit}>
															Cancel
														</Button>
													</div>
												</div>
											</form>
										{:else}
											<div class="flex items-center gap-2">
												<div class="flex-1 px-3 py-2 border border-border bg-muted/30 font-mono text-sm truncate">
													{formatValue(setting.value, setting.isSecret)}
												</div>
												<Button 
													variant="outline" 
													size="sm" 
													onclick={() => startEdit(setting.key, setting.value)}
												>
													Edit
												</Button>
											</div>
										{/if}
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}

					{#if currentSettings.length === 0}
						<div class="text-center py-12 border border-dashed border-border">
							<Settings class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
							<h3 class="font-ui text-sm font-semibold">No settings in this category</h3>
							<p class="text-sm text-muted-foreground mt-1">Settings will appear here when configured.</p>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Empty State -->
				<div class="text-center py-16">
					<Settings class="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
					<h2 class="font-display text-xl font-bold uppercase">No Settings Configured</h2>
					<p class="text-muted-foreground mt-2 max-w-md mx-auto">
						Click "Initialize Defaults" to set up the default system settings.
					</p>
				</div>
			{/if}
		</main>
	</div>
</div>
