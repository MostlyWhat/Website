<script lang="ts">
	/**
	 * Legal Pages Management
	 * 
	 * Manage legal documents (Privacy Policy, Terms, EULA, etc.)
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { 
		Plus, Edit2, Trash2, Eye, EyeOff, FileText, Calendar, 
		CheckCircle, XCircle, GripVertical
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data, form } = $props();

	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			showCreateModal = false;
			showEditModal = false;
			resetForm();
		}
	});

	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let editingPage = $state<typeof data.pages[0] | null>(null);

	// Form state
	let formSlug = $state('');
	let formTitle = $state('');
	let formContent = $state('');
	let formSummary = $state('');
	let formVersion = $state('1.0');
	let formEffectiveDate = $state(new Date().toISOString().split('T')[0]);
	let formIsPublished = $state(true);
	let formSortOrder = $state(0);

	function resetForm() {
		formSlug = '';
		formTitle = '';
		formContent = '';
		formSummary = '';
		formVersion = '1.0';
		formEffectiveDate = new Date().toISOString().split('T')[0];
		formIsPublished = true;
		formSortOrder = 0;
	}

	function openEditModal(page: typeof data.pages[0]) {
		editingPage = page;
		formSlug = page.slug;
		formTitle = page.title;
		formContent = ''; // Load separately if needed
		formSummary = page.summary || '';
		formVersion = page.version;
		formEffectiveDate = new Date(page.effectiveDate).toISOString().split('T')[0];
		formIsPublished = page.isPublished;
		formSortOrder = page.sortOrder;
		showEditModal = true;
	}

	function formatDate(date: Date | null) {
		if (!date) return 'Never';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Legal Pages | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ADMIN</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Legal Pages
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage legal documents and policies
				</p>
			</div>
			<Button onclick={() => (showCreateModal = true)}>
				<Plus class="mr-2 h-4 w-4" />
				New Page
			</Button>
		</div>
	</section>

	<!-- Success/Error Messages -->
	{#if form?.error}
		<div class="mx-6 mt-6 flex items-center gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 md:mx-12 lg:mx-16">
			<XCircle class="h-5 w-5 text-red-500" />
			<p class="font-body text-sm text-red-500">{form.error}</p>
		</div>
	{/if}

	<!-- Pages List -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		{#if data.pages.length === 0}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-20 w-20 items-center justify-center border border-border bg-card">
					<FileText class="h-10 w-10 text-muted-foreground opacity-50" />
				</div>
				<h2 class="font-ui mt-6 text-lg font-semibold tracking-wider">No legal pages yet</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Create your first legal document to get started.
				</p>
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.pages as page}
					<div class="border border-border bg-card p-6">
						<div class="flex items-start justify-between gap-4">
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<h3 class="font-ui text-lg font-semibold tracking-wide">
										{page.title}
									</h3>
									{#if page.isPublished}
										<Eye class="h-4 w-4 text-green-500" />
									{:else}
										<EyeOff class="h-4 w-4 text-muted-foreground" />
									{/if}
								</div>
								<p class="font-mono mt-1 text-xs text-muted-foreground">
									/{page.slug} • v{page.version}
								</p>
								{#if page.summary}
									<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">
										{page.summary}
									</p>
								{/if}
							</div>
						</div>

						<div class="mt-4 space-y-2 border-t border-border pt-4">
							<div class="flex items-center gap-2 text-xs text-muted-foreground">
								<Calendar class="h-3 w-3" />
								<span>Effective: {formatDate(page.effectiveDate)}</span>
							</div>
							{#if page.lastReviewedAt}
								<div class="flex items-center gap-2 text-xs text-muted-foreground">
									<CheckCircle class="h-3 w-3" />
									<span>Reviewed: {formatDate(page.lastReviewedAt)}</span>
								</div>
							{/if}
							{#if page.lastEditedByName}
								<div class="flex items-center gap-2 text-xs text-muted-foreground">
									<span>Last edited by {page.lastEditedByName}</span>
								</div>
							{/if}
						</div>

						<div class="mt-4 flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onclick={() => goto(`/admin/legal/${page.id}/edit`)}
								class="flex-1"
							>
								<Edit2 class="mr-2 h-3 w-3" />
								Edit
							</Button>
							<form method="POST" action="?/togglePublish" use:enhance class="flex-1">
								<input type="hidden" name="id" value={page.id} />
								<input type="hidden" name="isPublished" value={page.isPublished} />
								<Button type="submit" variant="outline" size="sm" class="w-full">
									{#if page.isPublished}
										<EyeOff class="mr-2 h-3 w-3" />
										Unpublish
									{:else}
										<Eye class="mr-2 h-3 w-3" />
										Publish
									{/if}
								</Button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
		<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-card p-6 shadow-lg">
			<h2 class="font-ui text-xl font-semibold tracking-wider">Create Legal Page</h2>
			
			<form method="POST" action="?/create" use:enhance class="mt-6 space-y-4">
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<Label for="slug">Slug</Label>
						<Input
							id="slug"
							name="slug"
							bind:value={formSlug}
							placeholder="privacy-policy"
							required
						/>
					</div>
					<div>
						<Label for="version">Version</Label>
						<Input id="version" name="version" bind:value={formVersion} placeholder="1.0" />
					</div>
				</div>

				<div>
					<Label for="title">Title</Label>
					<Input
						id="title"
						name="title"
						bind:value={formTitle}
						placeholder="Privacy Policy"
						required
					/>
				</div>

				<div>
					<Label for="summary">Summary</Label>
					<Textarea
						id="summary"
						name="summary"
						bind:value={formSummary}
						placeholder="Brief description..."
						rows={2}
					/>
				</div>

				<div>
					<Label for="content">Content (Markdown)</Label>
					<Textarea
						id="content"
						name="content"
						bind:value={formContent}
						placeholder="# Privacy Policy\n\n..."
						rows={10}
						required
					/>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<Label for="effectiveDate">Effective Date</Label>
						<Input
							id="effectiveDate"
							name="effectiveDate"
							type="date"
							bind:value={formEffectiveDate}
							required
						/>
					</div>
					<div>
						<Label for="sortOrder">Sort Order</Label>
						<Input
							id="sortOrder"
							name="sortOrder"
							type="number"
							bind:value={formSortOrder}
							min="0"
						/>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						id="isPublished"
						name="isPublished"
						bind:checked={formIsPublished}
						class="h-4 w-4"
					/>
					<Label for="isPublished">Published</Label>
					<input type="hidden" name="isPublished" value={formIsPublished} />
				</div>

				<div class="flex gap-2">
					<Button type="submit" class="flex-1">Create Page</Button>
					<Button type="button" variant="outline" onclick={() => (showCreateModal = false)}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
