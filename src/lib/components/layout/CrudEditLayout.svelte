<script lang="ts">
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { ArrowLeft, AlertCircle, CheckCircle, AlertTriangle, Save, Trash2, ExternalLink } from '@lucide/svelte';

	/**
	 * CrudEditLayout - Standardized layout for editing existing entities
	 * 
	 * Features:
	 * - Entity name display in header with last updated timestamp
	 * - Optional "View Live" link when entity is published
	 * - Main content area (lg:grid-cols-3 → 2/3) + Sidebar (1/3)
	 * - Integrated save/delete actions in sidebar
	 * - Delete confirmation flow
	 * - Error/success message display
	 * - Responsive layout (mobile stacks)
	 * 
	 * @example
	 * <CrudEditLayout
	 *   entityName="My Blog Post"
	 *   entityType="blog post"
	 *   backHref="/admin/blog"
	 *   deleteAction="?/delete"
	 *   deleteWarning="This will permanently delete this blog post."
	 *   updateAction="?/update"
	 *   form={form}
	 *   showViewLink={data.post.status === 'published'}
	 *   viewHref="/blog/my-post"
	 *   lastUpdated={data.post.updatedAt}
	 * >
	 *   {#snippet main()}
	 *     <div class="space-y-6">
	 *       <!-- form fields -->
	 *     </div>
	 *   {/snippet}
	 *   {#snippet sidebar()}
	 *     <div class="space-y-6">
	 *       <!-- sidebar content -->
	 *     </div>
	 *   {/snippet}
	 * </CrudEditLayout>
	 */
	interface Props {
		/** Entity name (e.g., "My Blog Post Title") */
		entityName: string;
		/** Entity type for messages (e.g., "blog post", "user", "project") */
		entityType: string;
		/** Back button link */
		backHref: string;
		/** Delete form action */
		deleteAction: string;
		/** Warning message for delete confirmation */
		deleteWarning: string;
		/** Update form action */
		updateAction: string;
		/** Form object from +page.svelte */
		form: any;
		/** Show view link button */
		showViewLink?: boolean;
		/** View link href */
		viewHref?: string;
		/** Last updated timestamp */
		lastUpdated?: string | Date | null;
		/** Main content area */
		main: Snippet;
		/** Sidebar content */
		sidebar: Snippet;
		/** Custom class */
		class?: string;
	}

	let {
		entityName,
		entityType,
		backHref,
		deleteAction,
		deleteWarning,
		updateAction,
		form,
		showViewLink = false,
		viewHref,
		lastUpdated,
		main,
		sidebar,
		class: className = ''
	}: Props = $props();

	let showDeleteConfirm = $state(false);
	let isSubmitting = $state(false);

	// Auto-generate back label
	const backLabel = $derived(() => {
		const parts = backHref.split('/').filter(Boolean);
		const lastPart = parts[parts.length - 1];
		return `BACK TO ${lastPart.toUpperCase()}`;
	});

	// Format date
	function formatDate(dateStr: string | Date | null | undefined): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="min-h-[calc(100dvh-4rem)] {className}">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div>
				<a
					href={backHref}
					class="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary"
				>
					<ArrowLeft class="h-3 w-3" />
					{backLabel()}
				</a>
				<h1 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">
					Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Last updated: {formatDate(lastUpdated)}
				</p>
			</div>

			{#if showViewLink && viewHref}
				<a
					href={viewHref}
					target="_blank"
					class="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
				>
					<ExternalLink class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">VIEW LIVE</span>
				</a>
			{/if}
		</div>
	</section>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/20 bg-green-500/10 px-6 py-4 md:px-12">
			<div class="flex items-center gap-3">
				<CheckCircle class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-green-500">{entityType.charAt(0).toUpperCase() + entityType.slice(1)} saved successfully!</p>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="border-b border-red-500/20 bg-red-500/10 px-6 py-4 md:px-12">
			<div class="flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-red-500" />
				<p class="font-body text-sm text-red-500">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		action={updateAction}
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
		class="pb-12"
	>
		<div class="grid gap-px bg-border lg:grid-cols-3">
			<!-- Main Content -->
			<div class="col-span-2 space-y-6 bg-background p-6 md:p-12">
				{@render main()}
			</div>

			<!-- Sidebar -->
			<div class="space-y-6 bg-card p-6 md:p-8">
				{@render sidebar()}

				<hr class="border-border" />

				<!-- Actions -->
				<div class="flex flex-col gap-2">
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-4 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						<Save class="h-4 w-4" />
						<span class="font-mono text-xs tracking-wider">
							{isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
						</span>
					</button>

					{#if showDeleteConfirm}
						<button
							type="button"
							onclick={async () => {
								const form = document.createElement('form');
								form.method = 'POST';
								form.action = deleteAction;
								document.body.appendChild(form);
								form.submit();
							}}
							class="inline-flex w-full items-center justify-center gap-2 border border-red-500 bg-red-500 px-4 py-3 text-sm text-white transition-colors hover:bg-red-600"
						>
							<Trash2 class="h-4 w-4" />
							<span class="font-mono text-xs tracking-wider">CONFIRM DELETE</span>
						</button>
						<button
							type="button"
							onclick={() => showDeleteConfirm = false}
							class="inline-flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card"
						>
							<span class="font-mono text-xs tracking-wider">CANCEL</span>
						</button>
						<p class="font-body text-xs text-muted-foreground">
							{deleteWarning}
						</p>
					{:else}
						<button
							type="button"
							onclick={() => showDeleteConfirm = true}
							class="inline-flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-3 text-sm text-red-500 transition-colors hover:border-red-500 hover:bg-red-500/10"
						>
							<Trash2 class="h-4 w-4" />
							<span class="font-mono text-xs tracking-wider">DELETE {entityType.toUpperCase()}</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</form>
</div>
