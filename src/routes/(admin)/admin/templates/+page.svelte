<script lang="ts">
	/**
	 * Ticket Templates Admin Page
	 */
	import { enhance } from '$app/forms';
	import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, FileText, TrendingUp, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data, form } = $props();

	let showDialog = $state(false);
	let editingTemplate = $state<any>(null);
	let formName = $state('');
	let formSlug = $state('');
	let formDescription = $state('');
	let formCategoryId = $state('');
	let formPriority = $state('medium');
	let formSubject = $state('');
	let formBody = $state('');
	let formAssigneeId = $state('');
	let formGroupId = $state('');
	let formTags = $state('');
	let formIsPublic = $state(true);

	function openCreateDialog() {
		editingTemplate = null;
		resetForm();
		showDialog = true;
	}

	function openEditDialog(template: any) {
		editingTemplate = template;
		formName = template.name;
		formSlug = template.slug;
		formDescription = template.description || '';
		formCategoryId = template.categoryId || '';
		formPriority = template.defaultPriority;
		formSubject = template.subjectTemplate;
		formBody = template.descriptionTemplate;
		formAssigneeId = template.defaultAssigneeId || '';
		formGroupId = template.defaultStaffGroupId || '';
		formTags = template.tags?.join(', ') || '';
		formIsPublic = template.isPublic;
		showDialog = true;
	}

	function resetForm() {
		formName = '';
		formSlug = '';
		formDescription = '';
		formCategoryId = '';
		formPriority = 'medium';
		formSubject = '';
		formBody = '';
		formAssigneeId = '';
		formGroupId = '';
		formTags = '';
		formIsPublic = true;
	}

	function generateSlug() {
		formSlug = formName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}
</script>

<svelte:head>
	<title>Ticket Templates | Admin</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<!-- Header -->
	<div class="border-b border-border bg-background">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin" class="text-muted-foreground hover:text-foreground transition-colors">
					<ArrowLeft class="h-5 w-5" />
				</a>
				<div class="flex-1">
					<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Ticket Templates</h1>
					<p class="text-sm text-muted-foreground mt-1">
						Manage pre-configured ticket templates for common support scenarios
					</p>
				</div>
				<Button onclick={openCreateDialog}>
					<Plus class="mr-2 h-4 w-4" />
					New Template
				</Button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Messages -->
		{#if form?.error}
			<div class="mb-6 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
				{form.message}
			</div>
		{/if}

		<!-- Templates Grid -->
		{#if data.templates.length === 0}
			<div class="border border-border bg-background p-12 text-center">
				<FileText class="mx-auto h-12 w-12 text-muted-foreground" />
				<h3 class="mt-4 text-lg font-medium">No templates yet</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					Create your first template to speed up ticket creation.
				</p>
				<Button class="mt-6" onclick={openCreateDialog}>
					<Plus class="mr-2 h-4 w-4" />
					Create Template
				</Button>
			</div>
		{:else}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.templates as template}
					<div class="border border-border bg-background">
						<div class="border-b border-border p-4">
							<div class="flex items-start justify-between gap-2">
								<div class="flex-1 min-w-0">
									<h3 class="font-medium truncate">{template.name}</h3>
									<div class="mt-1 flex items-center gap-2 flex-wrap">
										<span class="text-xs text-muted-foreground font-mono">
											{template.slug}
										</span>
										{#if template.categoryName}
											<span class="px-1.5 py-0.5 text-[10px] bg-muted border border-border">
												{template.categoryName}
											</span>
										{/if}
										<span class="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary border border-primary/30">
											{template.defaultPriority.toUpperCase()}
										</span>
									</div>
								</div>
								<div class="flex items-center gap-1">
									{#if template.isActive}
										<Eye class="h-4 w-4 text-green-500" />
									{:else}
										<EyeOff class="h-4 w-4 text-muted-foreground" />
									{/if}
									{#if template.isPublic}
										<FileText class="h-4 w-4 text-blue-500" title="Public template" />
									{/if}
								</div>
							</div>
						</div>

						<div class="p-4 space-y-3">
							{#if template.description}
								<p class="text-sm text-muted-foreground line-clamp-2">
									{template.description}
								</p>
							{/if}

							<div class="text-xs text-muted-foreground">
								<div><strong>Subject:</strong> {template.subjectTemplate}</div>
								<div class="mt-1 line-clamp-2">
									<strong>Body:</strong> {template.descriptionTemplate.substring(0, 100)}...
								</div>
							</div>

							{#if template.tags && template.tags.length > 0}
								<div class="flex flex-wrap gap-1">
									{#each template.tags as tag}
										<span class="px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground">
											#{tag}
										</span>
									{/each}
								</div>
							{/if}

							<div class="flex items-center gap-2 pt-2 border-t border-border">
								<TrendingUp class="h-3 w-3 text-muted-foreground" />
								<span class="text-xs text-muted-foreground">
									Used {template.usageCount} times
								</span>
							</div>
						</div>

						<div class="border-t border-border p-3 flex items-center gap-2">
							<Button size="sm" variant="outline" onclick={() => openEditDialog(template)}>
								<Edit2 class="mr-1 h-3 w-3" />
								Edit
							</Button>
							<form method="POST" action="?/toggleActive" use:enhance class="flex-1">
								<input type="hidden" name="id" value={template.id} />
								<Button type="submit" size="sm" variant="outline" class="w-full">
									{template.isActive ? 'Deactivate' : 'Activate'}
								</Button>
							</form>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={template.id} />
								<Button type="submit" size="sm" variant="ghost">
									<Trash2 class="h-3 w-3 text-destructive" />
								</Button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Create/Edit Dialog -->
{#if showDialog}
	<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onclick={() => showDialog = false}>
		<div class="bg-background border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onclick={(e) => e.stopPropagation()}>
			<div class="border-b border-border p-6">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">
						{editingTemplate ? 'Edit Template' : 'New Template'}
					</h2>
					<button onclick={() => showDialog = false} class="text-muted-foreground hover:text-foreground">
						<X class="h-5 w-5" />
					</button>
				</div>
			</div>

			<form 
				method="POST" 
				action={editingTemplate ? '?/update' : '?/create'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showDialog = false;
						resetForm();
					};
				}}
				class="p-6 space-y-4"
			>
				{#if editingTemplate}
					<input type="hidden" name="id" value={editingTemplate.id} />
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div class="col-span-2">
						<label class="text-xs font-medium">TEMPLATE NAME</label>
						<input
							type="text"
							name="name"
							bind:value={formName}
							oninput={generateSlug}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
							required
						/>
					</div>

					<div class="col-span-2">
						<label class="text-xs font-medium">SLUG</label>
						<input
							type="text"
							name="slug"
							bind:value={formSlug}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm font-mono"
							required
						/>
					</div>

					<div class="col-span-2">
						<label class="text-xs font-medium">DESCRIPTION</label>
						<Textarea
							name="description"
							bind:value={formDescription}
							rows={2}
							class="mt-1"
							placeholder="Brief description of when to use this template"
						/>
					</div>

					<div>
						<label class="text-xs font-medium">CATEGORY</label>
						<select
							name="categoryId"
							bind:value={formCategoryId}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
						>
							<option value="">No Category</option>
							{#each data.categories as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="text-xs font-medium">DEFAULT PRIORITY</label>
						<select
							name="defaultPriority"
							bind:value={formPriority}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
							required
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
						</select>
					</div>

					<div class="col-span-2">
						<label class="text-xs font-medium">SUBJECT TEMPLATE</label>
						<input
							type="text"
							name="subjectTemplate"
							bind:value={formSubject}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
							required
						/>
					</div>

					<div class="col-span-2">
						<label class="text-xs font-medium">DESCRIPTION TEMPLATE</label>
						<Textarea
							name="descriptionTemplate"
							bind:value={formBody}
							rows={6}
							class="mt-1"
							required
						/>
					</div>

					<div>
						<label class="text-xs font-medium">DEFAULT ASSIGNEE (OPTIONAL)</label>
						<select
							name="defaultAssigneeId"
							bind:value={formAssigneeId}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
						>
							<option value="">None</option>
							{#each data.staffMembers as staff}
								<option value={staff.id}>{staff.displayName}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="text-xs font-medium">DEFAULT STAFF GROUP (OPTIONAL)</label>
						<select
							name="defaultStaffGroupId"
							bind:value={formGroupId}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
						>
							<option value="">None</option>
							{#each data.groups as group}
								<option value={group.id}>{group.name}</option>
							{/each}
						</select>
					</div>

					<div class="col-span-2">
						<label class="text-xs font-medium">TAGS (COMMA-SEPARATED)</label>
						<input
							type="text"
							name="tags"
							bind:value={formTags}
							class="mt-1 h-10 w-full border border-border bg-card px-3 text-sm"
							placeholder="bug, technical, urgent"
						/>
					</div>

					<div class="col-span-2">
						<label class="flex items-center gap-2">
							<input
								type="checkbox"
								name="isPublic"
								value="true"
								bind:checked={formIsPublic}
								class="h-4 w-4"
							/>
							<span class="text-sm">Make this template publicly available to all users</span>
						</label>
					</div>
				</div>

				<div class="flex items-center gap-2 pt-4 border-t border-border">
					<Button type="submit">
						{editingTemplate ? 'Update Template' : 'Create Template'}
					</Button>
					<Button type="button" variant="outline" onclick={() => showDialog = false}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
