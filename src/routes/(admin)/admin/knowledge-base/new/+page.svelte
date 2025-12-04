<script lang="ts">
	/**
	 * New Support Article
	 * 
	 * Create a new knowledge base article.
	 */
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft, Save, Eye, Users, Shield, Globe } from '@lucide/svelte';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';

	let { data, form } = $props<{
		data: { categories?: string[]; defaultCategories?: string[] };
		form?: { error?: string; values?: Record<string, string> } | null;
	}>();

	let title = $state(form?.values?.title ?? '');
	let slug = $state(form?.values?.slug ?? '');
	let excerpt = $state(form?.values?.excerpt ?? '');
	let content = $state(form?.values?.content ?? '');
	let category = $state(form?.values?.category ?? '');
	let audience = $state<'user' | 'admin' | 'all'>((form?.values?.audience as 'user' | 'admin' | 'all') ?? 'user');
	let tags = $state(form?.values?.tagsInput ?? '');
	let isPublished = $state(false);
	let isFeatured = $state(false);

	let isSubmitting = $state(false);

	// Auto-generate slug from title
	function generateSlug() {
		if (!slug || slug === generateSlugFromTitle(title.slice(0, -1))) {
			slug = generateSlugFromTitle(title);
		}
	}

	function generateSlugFromTitle(t: string): string {
		return t
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}

	// All available categories (existing + defaults)
	const allCategories = $derived(() => {
		const existing = data.categories ?? [];
		const defaults = data.defaultCategories ?? [];
		return [...new Set([...existing, ...defaults])].sort();
	});
</script>

<svelte:head>
	<title>New Article | Knowledge Base | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Back Navigation -->
	<section class="border-b border-border bg-background px-6 py-4 md:px-12">
		<a 
			href={localizeHref('/admin/knowledge-base')} 
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-xs tracking-wider">BACK TO KNOWLEDGE BASE</span>
		</a>
	</section>

	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// NEW ARTICLE</span>
		<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
			Create Article
		</h1>
	</section>

	<!-- Error Display -->
	{#if form?.error}
		<div class="border-b border-red-500/30 bg-red-500/10 px-6 py-4 md:px-12">
			<p class="font-ui text-sm text-red-500">{form.error}</p>
		</div>
	{/if}

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
	>
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 space-y-6 bg-background px-6 py-8 md:px-12 lg:col-span-8">
				<!-- Title -->
				<div>
					<label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">TITLE *</label>
					<input
						type="text"
						id="title"
						name="title"
						bind:value={title}
						oninput={generateSlug}
						required
						class="font-ui mt-2 w-full border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
						placeholder="How to get started with projects"
					/>
				</div>

				<!-- Slug -->
				<div>
					<label for="slug" class="font-mono text-[10px] tracking-widest text-muted-foreground">SLUG *</label>
					<div class="relative mt-2">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">/help/</span>
						<input
							type="text"
							id="slug"
							name="slug"
							bind:value={slug}
							required
							class="font-ui w-full border border-border bg-card py-3 pl-16 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
							placeholder="getting-started-with-projects"
						/>
					</div>
				</div>

				<!-- Excerpt -->
				<div>
					<label for="excerpt" class="font-mono text-[10px] tracking-widest text-muted-foreground">EXCERPT</label>
					<p class="font-body mt-1 text-xs text-muted-foreground">Short description shown in article listings</p>
					<textarea
						id="excerpt"
						name="excerpt"
						bind:value={excerpt}
						rows="2"
						class="font-ui mt-2 w-full border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
						placeholder="A brief overview of how to request and manage projects..."
					></textarea>
				</div>

				<!-- Content -->
				<div>
					<label for="content" class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENT *</label>
					<div class="mt-2">
						<RichTextEditor
							bind:value={content}
							name="content"
							id="content"
							placeholder="Write your article content here using Markdown..."
							rows={20}
							required
						/>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-card lg:col-span-4">
				<!-- Publish Settings -->
				<div class="border-b border-border px-6 py-4 md:px-8">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PUBLISH SETTINGS</span>
				</div>
				<div class="space-y-4 px-6 py-6 md:px-8">
					<!-- Audience -->
					<fieldset>
						<legend class="font-mono text-[10px] tracking-widest text-muted-foreground">AUDIENCE *</legend>
						<div class="mt-2 grid gap-2">
							<label class="flex cursor-pointer items-center gap-3 border border-border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10">
								<input type="radio" name="audience" value="user" bind:group={audience} class="sr-only" />
								<Users class="h-4 w-4 {audience === 'user' ? 'text-primary' : 'text-muted-foreground'}" />
								<div class="flex-1">
									<span class="font-ui text-sm font-medium">Users</span>
									<p class="font-body text-xs text-muted-foreground">Visible in user help center</p>
								</div>
							</label>
							<label class="flex cursor-pointer items-center gap-3 border border-border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10">
								<input type="radio" name="audience" value="admin" bind:group={audience} class="sr-only" />
								<Shield class="h-4 w-4 {audience === 'admin' ? 'text-primary' : 'text-muted-foreground'}" />
								<div class="flex-1">
									<span class="font-ui text-sm font-medium">Admin</span>
									<p class="font-body text-xs text-muted-foreground">Internal documentation only</p>
								</div>
							</label>
							<label class="flex cursor-pointer items-center gap-3 border border-border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10">
								<input type="radio" name="audience" value="all" bind:group={audience} class="sr-only" />
								<Globe class="h-4 w-4 {audience === 'all' ? 'text-primary' : 'text-muted-foreground'}" />
								<div class="flex-1">
									<span class="font-ui text-sm font-medium">Everyone</span>
									<p class="font-body text-xs text-muted-foreground">Visible to users and admins</p>
								</div>
							</label>
						</div>
					</fieldset>

					<!-- Category -->
					<div>
						<label for="category" class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORY *</label>
						<select
							id="category"
							name="category"
							bind:value={category}
							required
							class="font-ui mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
						>
							<option value="">Select a category</option>
							{#each allCategories() as cat}
								<option value={cat}>{cat.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</option>
							{/each}
						</select>
					</div>

					<!-- Tags -->
					<div>
						<label for="tags" class="font-mono text-[10px] tracking-widest text-muted-foreground">TAGS</label>
						<p class="font-body mt-1 text-xs text-muted-foreground">Comma-separated</p>
						<input
							type="text"
							id="tags"
							name="tags"
							bind:value={tags}
							class="font-ui mt-2 w-full border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
							placeholder="setup, tutorial, beginner"
						/>
					</div>

					<!-- Publish Toggle -->
					<label class="flex cursor-pointer items-center gap-3 border border-border p-3 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10">
						<input type="checkbox" name="isPublished" bind:checked={isPublished} class="sr-only" />
						<Eye class="h-4 w-4 {isPublished ? 'text-green-500' : 'text-muted-foreground'}" />
						<div class="flex-1">
							<span class="font-ui text-sm font-medium">Publish</span>
							<p class="font-body text-xs text-muted-foreground">Make article visible</p>
						</div>
					</label>

					<!-- Featured Toggle -->
					<label class="flex cursor-pointer items-center gap-3 border border-border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10">
						<input type="checkbox" name="isFeatured" bind:checked={isFeatured} class="sr-only" />
						<span class="text-lg {isFeatured ? '' : 'grayscale opacity-50'}">⭐</span>
						<div class="flex-1">
							<span class="font-ui text-sm font-medium">Featured</span>
							<p class="font-body text-xs text-muted-foreground">Show in featured section</p>
						</div>
					</label>
				</div>

				<!-- Actions -->
				<div class="border-t border-border px-6 py-6 md:px-8">
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-4 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Save class="h-4 w-4" />
						<span class="font-mono text-xs tracking-wider">
							{isSubmitting ? 'SAVING...' : 'SAVE ARTICLE'}
						</span>
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
