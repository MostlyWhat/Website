<script lang="ts">
	/**
	 * Admin - Edit Blog Post
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ChevronLeft, Save, Trash2, Eye, ExternalLink, FileText, Image, Tag, Settings, Calendar } from '@lucide/svelte';

	let { data, form } = $props();

	// Form state (initialized from loaded data)
	let title = $state(data.post.title);
	let slug = $state(data.post.slug);
	let excerpt = $state(data.post.excerpt ?? '');
	let content = $state(data.post.content);
	let category = $state(data.post.category);
	let tags = $state((data.post.tags as string[] ?? []).join(', '));
	let featuredImage = $state(data.post.featuredImage ?? '');
	let metaTitle = $state(data.post.metaTitle ?? '');
	let metaDescription = $state(data.post.metaDescription ?? '');
	let readTime = $state(data.post.readTime ?? '5 min read');
	let status = $state(data.post.status);
	let isFeatured = $state(data.post.isFeatured);

	let isSubmitting = $state(false);
	let showDeleteConfirm = $state(false);

	// Format date
	function formatDate(dateStr: string | Date | null): string {
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

<svelte:head>
	<title>Edit: {data.post.title} | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div>
				<a
					href={localizeHref('/admin/blog')}
					class="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary"
				>
					<ChevronLeft class="h-3 w-3" />
					BACK TO BLOG POSTS
				</a>
				<h1 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">
					Edit Post
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Last updated: {formatDate(data.post.updatedAt)}
				</p>
			</div>

			{#if data.post.status === 'published'}
				<a
					href={localizeHref(`/blog/${data.post.slug}`)}
					target="_blank"
					class="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
				>
					<ExternalLink class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">VIEW POST</span>
				</a>
			{/if}
		</div>
	</section>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/20 bg-green-500/10 px-6 py-4 md:px-12">
			<p class="font-body text-sm text-green-500">Post saved successfully!</p>
		</div>
	{/if}

	{#if form?.error}
		<div class="border-b border-red-500/20 bg-red-500/10 px-6 py-4 md:px-12">
			<p class="font-body text-sm text-red-500">{form.error}</p>
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		action="?/update"
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
				<!-- Title -->
				<div class="space-y-2">
					<label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						TITLE *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						bind:value={title}
						required
						class="font-ui w-full border border-border bg-card px-4 py-3 text-lg focus:border-primary focus:outline-none"
						placeholder="Enter post title..."
					/>
				</div>

				<!-- Slug -->
				<div class="space-y-2">
					<label for="slug" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						URL SLUG *
					</label>
					<div class="flex items-center gap-2">
						<span class="font-mono text-xs text-muted-foreground">/blog/</span>
						<input
							type="text"
							id="slug"
							name="slug"
							bind:value={slug}
							required
							class="font-ui flex-1 border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="post-url-slug"
						/>
					</div>
				</div>

				<!-- Excerpt -->
				<div class="space-y-2">
					<label for="excerpt" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						EXCERPT
					</label>
					<textarea
						id="excerpt"
						name="excerpt"
						bind:value={excerpt}
						rows="2"
						class="font-body w-full resize-none border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
						placeholder="Brief summary for post listings..."
					></textarea>
				</div>

				<!-- Content -->
				<div class="space-y-2">
					<label for="content" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						CONTENT (MARKDOWN) *
					</label>
					<textarea
						id="content"
						name="content"
						bind:value={content}
						required
						rows="20"
						class="font-body w-full resize-y border border-border bg-card px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none"
						placeholder="Write your post content in Markdown..."
					></textarea>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6 bg-card p-6 md:p-8">
				<!-- Stats -->
				<div class="space-y-4">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">POST STATS</span>
					<div class="grid grid-cols-2 gap-4">
						<div class="border border-border bg-background p-3">
							<span class="font-mono text-[10px] text-muted-foreground">VIEWS</span>
							<p class="font-display mt-1 text-xl font-bold">{data.post.viewCount}</p>
						</div>
						<div class="border border-border bg-background p-3">
							<span class="font-mono text-[10px] text-muted-foreground">PUBLISHED</span>
							<p class="font-body mt-1 text-xs text-muted-foreground">{formatDate(data.post.publishedAt)}</p>
						</div>
					</div>
				</div>

				<hr class="border-border" />

				<!-- Publish Settings -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<Settings class="h-4 w-4 text-primary" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PUBLISH SETTINGS</span>
					</div>

					<!-- Status -->
					<div class="space-y-2">
						<label for="status" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							STATUS
						</label>
						<select
							id="status"
							name="status"
							bind:value={status}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="archived">Archived</option>
						</select>
					</div>

					<!-- Featured -->
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							name="isFeatured"
							value="true"
							bind:checked={isFeatured}
							class="h-4 w-4 border border-border bg-background text-primary focus:ring-primary"
						/>
						<span class="font-ui text-sm">Featured post</span>
					</label>
				</div>

				<hr class="border-border" />

				<!-- Category -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<Tag class="h-4 w-4 text-primary" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORIZATION</span>
					</div>

					<div class="space-y-2">
						<label for="category" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							CATEGORY *
						</label>
						<select
							id="category"
							name="category"
							bind:value={category}
							required
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
						>
							{#each data.categories as cat}
								<option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-2">
						<label for="tags" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							TAGS (comma separated)
						</label>
						<input
							type="text"
							id="tags"
							name="tags"
							bind:value={tags}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="svelte, web, tutorial"
						/>
					</div>
				</div>

				<hr class="border-border" />

				<!-- Media -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<Image class="h-4 w-4 text-primary" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MEDIA</span>
					</div>

					<div class="space-y-2">
						<label for="featuredImage" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							FEATURED IMAGE URL
						</label>
						<input
							type="url"
							id="featuredImage"
							name="featuredImage"
							bind:value={featuredImage}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="https://..."
						/>
					</div>

					<div class="space-y-2">
						<label for="readTime" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							READ TIME
						</label>
						<input
							type="text"
							id="readTime"
							name="readTime"
							bind:value={readTime}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="5 min read"
						/>
					</div>
				</div>

				<hr class="border-border" />

				<!-- SEO -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<FileText class="h-4 w-4 text-primary" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SEO</span>
					</div>

					<div class="space-y-2">
						<label for="metaTitle" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							META TITLE
						</label>
						<input
							type="text"
							id="metaTitle"
							name="metaTitle"
							bind:value={metaTitle}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="Custom title for search engines"
						/>
					</div>

					<div class="space-y-2">
						<label for="metaDescription" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							META DESCRIPTION
						</label>
						<textarea
							id="metaDescription"
							name="metaDescription"
							bind:value={metaDescription}
							rows="3"
							class="font-body w-full resize-none border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="Description for search engines..."
						></textarea>
					</div>
				</div>

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
						<form method="POST" action="?/delete" use:enhance>
							<button
								type="submit"
								class="inline-flex w-full items-center justify-center gap-2 border border-red-500 bg-red-500 px-4 py-3 text-sm text-white transition-colors hover:bg-red-600"
							>
								<Trash2 class="h-4 w-4" />
								<span class="font-mono text-xs tracking-wider">CONFIRM DELETE</span>
							</button>
						</form>
						<button
							type="button"
							onclick={() => showDeleteConfirm = false}
							class="inline-flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card"
						>
							<span class="font-mono text-xs tracking-wider">CANCEL</span>
						</button>
					{:else}
						<button
							type="button"
							onclick={() => showDeleteConfirm = true}
							class="inline-flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-3 text-sm text-red-500 transition-colors hover:border-red-500 hover:bg-red-500/10"
						>
							<Trash2 class="h-4 w-4" />
							<span class="font-mono text-xs tracking-wider">DELETE POST</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</form>
</div>
