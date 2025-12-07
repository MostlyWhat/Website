<script lang="ts">
	/**
	 * Admin - New Portfolio Project
	 */
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ChevronLeft, Save, Briefcase, Image, Tag, Settings, Link } from '@lucide/svelte';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';

	let { data, form } = $props();

	// Form state
	let title = $state('');
	let slug = $state('');
	let client = $state('');
	let description = $state('');
	let content = $state('');
	let category = $state('web-app');
	let tags = $state('');
	let year = $state(new Date().getFullYear().toString());
	let featuredImage = $state('');
	let liveUrl = $state('');
	let metaTitle = $state('');
	let metaDescription = $state('');
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
</script>

<svelte:head>
	<title>New Portfolio Project | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<a
			href={localizeHref('/admin/portfolio')}
			class="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary"
		>
			<ChevronLeft class="h-3 w-3" />
			BACK TO PORTFOLIO
		</a>
		<h1 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">
			New Portfolio Project
		</h1>
	</section>

	<!-- Form -->
	<form
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
		class="pb-12"
	>
		{#if form?.error}
			<div class="border-b border-red-500/20 bg-red-500/10 px-6 py-4 md:px-12">
				<p class="font-body text-sm text-red-500">{form.error}</p>
			</div>
		{/if}

		<div class="grid gap-px bg-border lg:grid-cols-3">
			<!-- Main Content -->
			<div class="col-span-2 space-y-6 bg-background p-6 md:p-12">
				<!-- Title -->
				<div class="space-y-2">
					<label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						PROJECT TITLE *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						bind:value={title}
						oninput={generateSlug}
						required
						class="font-ui w-full border border-border bg-card px-4 py-3 text-lg focus:border-primary focus:outline-none"
						placeholder="Enter project title..."
					/>
				</div>

				<!-- Slug -->
				<div class="space-y-2">
					<label for="slug" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						URL SLUG *
					</label>
					<div class="flex items-center gap-2">
						<span class="font-mono text-xs text-muted-foreground">/projects/</span>
						<input
							type="text"
							id="slug"
							name="slug"
							bind:value={slug}
							required
							class="font-ui flex-1 border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="project-url-slug"
						/>
					</div>
				</div>

				<!-- Client -->
				<div class="space-y-2">
					<label for="client" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						CLIENT NAME *
					</label>
					<input
						type="text"
						id="client"
						name="client"
						bind:value={client}
						required
						class="font-ui w-full border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
						placeholder="Client or company name..."
					/>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						SHORT DESCRIPTION
					</label>
					<textarea
						id="description"
						name="description"
						bind:value={description}
						rows="2"
						class="font-body w-full resize-none border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
						placeholder="Brief description for project cards..."
					></textarea>
				</div>

				<!-- Content -->
				<div class="space-y-2">
					<label for="content" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						PROJECT DETAILS (MARKDOWN) *
					</label>
					<RichTextEditor
						bind:value={content}
						name="content"
						id="content"
						placeholder="Full project description, challenges, solutions, results..."
						rows={16}
						required
					/>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6 bg-card p-6 md:p-8">
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
						<span class="font-ui text-sm">Featured project</span>
					</label>

					<!-- Year -->
					<div class="space-y-2">
						<label for="year" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							YEAR
						</label>
						<input
							type="text"
							id="year"
							name="year"
							bind:value={year}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="2024"
						/>
					</div>
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
							placeholder="svelte, tailwind, postgresql"
						/>
					</div>
				</div>

				<hr class="border-border" />

				<!-- Media & Links -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<Image class="h-4 w-4 text-primary" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MEDIA & LINKS</span>
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
						<label for="liveUrl" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							LIVE PROJECT URL
						</label>
						<input
							type="url"
							id="liveUrl"
							name="liveUrl"
							bind:value={liveUrl}
							class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
							placeholder="https://..."
						/>
					</div>
				</div>

				<hr class="border-border" />

				<!-- SEO -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<Link class="h-4 w-4 text-primary" />
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
							{isSubmitting ? 'SAVING...' : 'SAVE PROJECT'}
						</span>
					</button>
					<a
						href={localizeHref('/admin/portfolio')}
						class="inline-flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card"
					>
						<span class="font-mono text-xs tracking-wider">CANCEL</span>
					</a>
				</div>
			</div>
		</div>
	</form>
</div>
