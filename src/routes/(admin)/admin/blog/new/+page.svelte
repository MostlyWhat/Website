<script lang="ts">
	/**
	 * Admin - New Blog Post
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Save, FileText, Image, Tag, Settings, Clock, Eye } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { TextField, TextareaField, SelectField, CheckboxField } from '$lib/components/ui/form-fields';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';
	import { toast } from 'svelte-sonner';
	import CreatePageLayout from '$lib/components/layout/CreatePageLayout.svelte';

	let { data, form } = $props();

	// Form state
	let title = $state('');
	let slug = $state('');
	let excerpt = $state('');
	let content = $state('');
	let category = $state('development');
	let tags = $state('');
	let featuredImage = $state('');
	let metaTitle = $state('');
	let metaDescription = $state('');
	let readTime = $state('5 min read');
	let status = $state<'draft' | 'published'>('draft');
	let isFeatured = $state(false);

	let isSubmitting = $state(false);

	// Auto-generate slug from title
	function generateSlug() {
		slug = title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/blog'), 1500);
		}
	});
</script>

<svelte:head>
	<title>New Blog Post | Admin | MostlyWhat Systems</title>
</svelte:head>

<CreatePageLayout
	title="New Blog Post"
	description="Create a new blog post for the website."
	backHref={localizeHref('/admin/blog')}
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					await update();
					isSubmitting = false;
					if (result.type === 'failure') {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}
				};
			}}
			class="space-y-8"
		>
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
					oninput={generateSlug}
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
				<RichTextEditor
					bind:value={content}
					name="content"
					id="content"
					placeholder="Write your post content using Markdown..."
					rows={20}
					required
				/>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-4 border-t border-border pt-8">
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
				>
					<Save class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">
						{isSubmitting ? 'SAVING...' : 'SAVE POST'}
					</span>
				</button>
				<a
					href={localizeHref('/admin/blog')}
					class="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-card"
				>
					<span class="font-mono text-xs tracking-wider">CANCEL</span>
				</a>
			</div>
		</form>
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<!-- Publish Settings -->
			<div>
				<div class="flex items-center gap-2 mb-3">
					<Settings class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PUBLISH SETTINGS</span>
				</div>

				<div class="space-y-4">
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
						</select>
					</div>

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
			</div>

			<!-- Category -->
			<div class="border-t border-border pt-6">
				<div class="flex items-center gap-2 mb-3">
					<Tag class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORIZATION</span>
				</div>

				<div class="space-y-4">
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
			</div>

			<!-- Media -->
			<div class="border-t border-border pt-6">
				<div class="flex items-center gap-2 mb-3">
					<Image class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MEDIA</span>
				</div>

				<div class="space-y-4">
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
			</div>

			<!-- SEO -->
			<div class="border-t border-border pt-6">
				<div class="flex items-center gap-2 mb-3">
					<FileText class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SEO</span>
				</div>

				<div class="space-y-4">
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
			</div>
		</div>
	{/snippet}
</CreatePageLayout>
