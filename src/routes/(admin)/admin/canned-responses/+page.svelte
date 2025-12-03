<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		MessageSquare, Plus, Edit2, Trash2, Search, 
		Globe, User, Hash, AlertCircle, X, Save
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';

	let { data, form } = $props();

	let searchQuery = $state('');
	let categoryFilter = $state('all');
	let showCreateDialog = $state(false);
	let editingResponse = $state<typeof data.responses[0] | null>(null);
	let isSubmitting = $state(false);

	// Form fields
	let title = $state('');
	let shortcut = $state('');
	let content = $state('');
	let category = $state('');
	let isGlobal = $state(true);

	const filteredResponses = $derived(
		data.responses.filter(response => {
			const matchesSearch = searchQuery === '' || 
				response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(response.shortcut?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
			const matchesCategory = categoryFilter === 'all' || response.category === categoryFilter;
			return matchesSearch && matchesCategory;
		})
	);

	function openCreateDialog() {
		title = '';
		shortcut = '';
		content = '';
		category = '';
		isGlobal = true;
		editingResponse = null;
		showCreateDialog = true;
	}

	function openEditDialog(response: typeof data.responses[0]) {
		title = response.title;
		shortcut = response.shortcut ?? '';
		content = response.content;
		category = response.category ?? '';
		isGlobal = response.isGlobal;
		editingResponse = response;
		showCreateDialog = true;
	}

	function closeDialog() {
		showCreateDialog = false;
		editingResponse = null;
	}
</script>

<svelte:head>
	<title>Canned Responses | Admin</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// TICKET TEMPLATES</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Canned Responses</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Pre-defined response templates for faster ticket replies.
				</p>
			</div>
			<Button onclick={openCreateDialog} size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW RESPONSE
			</Button>
		</div>
	</section>

	<!-- Messages -->
	{#if form?.error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-2">
				<AlertCircle class="h-4 w-4 text-destructive" />
				<p class="font-body text-sm text-destructive">{form.error}</p>
			</div>
		</div>
	{/if}
	{#if form?.success}
		<div class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-2">
				<AlertCircle class="h-4 w-4 text-green-500" />
				<p class="font-body text-sm text-green-500">{form.message}</p>
			</div>
		</div>
	{/if}

	<!-- Filters Bar -->
	<section class="border-b border-border bg-card">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search responses..."
					bind:value={searchQuery}
					class="font-body h-10 w-full border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<div class="flex items-center gap-3">
				<label for="categoryFilter" class="sr-only">Category Filter</label>
				<select
					id="categoryFilter"
					bind:value={categoryFilter}
					class="font-mono h-10 border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL CATEGORIES</option>
					{#each data.categories as cat}
						<option value={cat}>{cat.toUpperCase()}</option>
					{/each}
				</select>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-4 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{data.responses.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
			</div>
			<div class="col-span-4 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-blue-500">{data.responses.filter(r => r.isGlobal).length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">GLOBAL</p>
			</div>
			<div class="col-span-4 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-green-500">{data.responses.filter(r => r.isOwn).length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">YOUR OWN</p>
			</div>
		</div>
	</section>

	<!-- Responses List -->
	<section class="border-b border-border bg-background">
		{#if filteredResponses.length > 0}
			<div class="divide-y divide-border">
				{#each filteredResponses as response}
					<div class="px-6 py-4 md:px-12 lg:px-16 hover:bg-card/50 transition-colors">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-3 flex-wrap">
									<h3 class="font-ui text-sm font-semibold tracking-wider">{response.title}</h3>
									{#if response.shortcut}
										<span class="flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground border border-border">
											<Hash class="h-3 w-3" />
											<span class="font-mono text-[10px]">{response.shortcut}</span>
										</span>
									{/if}
									{#if response.isGlobal}
										<span class="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/30">
											<Globe class="h-3 w-3" />
											<span class="font-mono text-[10px]">GLOBAL</span>
										</span>
									{:else}
										<span class="flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground border border-border">
											<User class="h-3 w-3" />
											<span class="font-mono text-[10px]">PERSONAL</span>
										</span>
									{/if}
									{#if response.category}
										<span class="px-2 py-0.5 bg-primary/10 text-primary border border-primary/30">
											<span class="font-mono text-[10px]">{response.category.toUpperCase()}</span>
										</span>
									{/if}
								</div>
								<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">{response.content}</p>
								<div class="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
									<span>Created by {response.createdBy}</span>
									<span>•</span>
									<span>Used {response.usageCount} times</span>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={() => openEditDialog(response)}
									class="p-2 text-muted-foreground hover:text-foreground transition-colors"
									title="Edit"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								{#if response.isOwn || data.responses.some(() => true)}
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={response.id} />
										<button
											type="submit"
											class="p-2 text-muted-foreground hover:text-destructive transition-colors"
											title="Delete"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</form>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="px-6 py-16 text-center md:px-12 lg:px-16">
				<MessageSquare class="mx-auto h-12 w-12 text-muted-foreground/50" />
				<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider">No responses found</h3>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					{searchQuery || categoryFilter !== 'all' 
						? 'Try adjusting your search or filter.' 
						: 'Create your first canned response to speed up ticket replies.'}
				</p>
				{#if !searchQuery && categoryFilter === 'all'}
					<Button onclick={openCreateDialog} class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						CREATE RESPONSE
					</Button>
				{/if}
			</div>
		{/if}
	</section>
</div>

<!-- Create/Edit Dialog -->
<Dialog.Root bind:open={showCreateDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="font-display text-lg font-bold uppercase">
				{editingResponse ? 'Edit Response' : 'New Canned Response'}
			</Dialog.Title>
			<Dialog.Description class="font-body text-sm text-muted-foreground">
				{editingResponse ? 'Update your canned response.' : 'Create a new response template for tickets.'}
			</Dialog.Description>
		</Dialog.Header>
		
		<form 
			method="POST" 
			action={editingResponse ? '?/update' : '?/create'} 
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
					closeDialog();
				};
			}}
			class="space-y-4"
		>
			{#if editingResponse}
				<input type="hidden" name="id" value={editingResponse.id} />
			{/if}
			
			<div>
				<label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					TITLE <span class="text-destructive">*</span>
				</label>
				<Input
					id="title"
					name="title"
					type="text"
					bind:value={title}
					placeholder="e.g., Greeting Response"
					required
					class="mt-2"
				/>
			</div>

			<div>
				<label for="shortcut" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					SHORTCUT
				</label>
				<Input
					id="shortcut"
					name="shortcut"
					type="text"
					bind:value={shortcut}
					placeholder="e.g., /greeting"
					class="mt-2"
				/>
				<p class="mt-1 text-xs text-muted-foreground">Type this in the reply box to quickly insert</p>
			</div>

			<div>
				<label for="content" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					CONTENT <span class="text-destructive">*</span>
				</label>
				<Textarea
					id="content"
					name="content"
					bind:value={content}
					rows={6}
					placeholder="Enter your response template..."
					required
					class="mt-2 resize-none"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="category" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						CATEGORY
					</label>
					<Input
						id="category"
						name="category"
						type="text"
						bind:value={category}
						placeholder="e.g., greeting"
						class="mt-2"
					/>
				</div>
				<div>
					<label class="font-mono text-[10px] tracking-widest text-muted-foreground">
						VISIBILITY
					</label>
					<div class="mt-2 flex items-center gap-3">
						<label class="flex items-center gap-2 cursor-pointer">
							<input 
								type="radio" 
								name="isGlobal" 
								value="true"
								checked={isGlobal}
								onchange={() => isGlobal = true}
								class="h-4 w-4"
							/>
							<span class="text-sm">Global</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input 
								type="radio" 
								name="isGlobal" 
								value="false"
								checked={!isGlobal}
								onchange={() => isGlobal = false}
								class="h-4 w-4"
							/>
							<span class="text-sm">Personal</span>
						</label>
					</div>
				</div>
			</div>

			<Dialog.Footer class="gap-2">
				<Button type="button" variant="outline" onclick={closeDialog}>
					<X class="mr-2 h-4 w-4" />
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					<Save class="mr-2 h-4 w-4" />
					{isSubmitting ? 'Saving...' : editingResponse ? 'Update' : 'Create'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
