<script lang="ts">
	/**
	 * New Support Article
	 * 
	 * Create a new knowledge base article.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Save, Users, Shield, Globe, FileText } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { TextField, TextareaField, SelectField, CheckboxField, SwitchField } from '$lib/components/ui/form-fields';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';
	import { toast } from 'svelte-sonner';
	import { CreatePageLayout } from '$lib/components/layout';
	import { ActionButtons } from '$lib/components/ui/layouts';

	let { data, form } = $props<{
		data: { categories?: string[]; defaultCategories?: string[] };
		form?: { error?: string; success?: boolean; message?: string; values?: Record<string, string> } | null;
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

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/knowledge-base'), 1500);
		}
	});
</script>

<svelte:head>
	<title>New Article | Knowledge Base | Admin | MostlyWhat Systems</title>
</svelte:head>

<CreatePageLayout
	title="Create Article"
	description="Add a new article to the knowledge base."
	backHref={localizeHref('/admin/knowledge-base')}
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form 
			method="POST" 
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
			class="space-y-8"
		>
			<!-- Title -->
			<div>
				<Label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">TITLE *</Label>
				<Input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					oninput={generateSlug}
					required
					class="mt-2 h-12 border-border bg-card"
					placeholder="How to get started with projects"
				/>
			</div>

			<!-- Slug -->
			<div>
				<Label for="slug" class="font-mono text-[10px] tracking-widest text-muted-foreground">SLUG *</Label>
				<div class="relative mt-2">
					<span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">/help/</span>
					<Input
						type="text"
						id="slug"
						name="slug"
						bind:value={slug}
						required
						class="pl-16 h-12 border-border bg-card"
						placeholder="getting-started-with-projects"
					/>
				</div>
			</div>

			<!-- Excerpt -->
			<div>
				<Label for="excerpt" class="font-mono text-[10px] tracking-widest text-muted-foreground">EXCERPT</Label>
				<Textarea
					id="excerpt"
					name="excerpt"
					bind:value={excerpt}
					rows={2}
					class="mt-2 border-border bg-card"
					placeholder="Brief summary of the article..."
				/>
			</div>

			<!-- Content -->
			<div>
				<Label for="content" class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENT (MARKDOWN) *</Label>
				<div class="mt-2">
					<RichTextEditor
						bind:value={content}
						name="content"
						id="content"
						placeholder="Write article content using Markdown..."
						rows={20}
						required
					/>
				</div>
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
						{isSubmitting ? 'SAVING...' : 'SAVE ARTICLE'}
					</span>
				</button>
				<a
					href={localizeHref('/admin/knowledge-base')}
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
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PUBLISH SETTINGS</span>
				<div class="mt-3 space-y-4">
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							name="isPublished"
							value="true"
							bind:checked={isPublished}
							class="h-4 w-4 border border-border bg-background text-primary focus:ring-primary"
						/>
						<span class="font-ui text-sm">Published</span>
					</label>

					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							name="isFeatured"
							value="true"
							bind:checked={isFeatured}
							class="h-4 w-4 border border-border bg-background text-primary focus:ring-primary"
						/>
						<span class="font-ui text-sm">Featured article</span>
					</label>
				</div>
			</div>

			<!-- Audience -->
			<div class="border-t border-border pt-6">
				<div class="flex items-center gap-2 mb-3">
					<Users class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">AUDIENCE</span>
				</div>

				<div class="space-y-3">
					<label class="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors hover:border-primary {audience === 'user' ? 'border-primary bg-primary/5' : ''}">
						<input
							type="radio"
							name="audience"
							value="user"
							bind:group={audience}
							class="sr-only"
						/>
						<div class="flex h-5 w-5 items-center justify-center border {audience === 'user' ? 'border-primary bg-primary' : 'border-border'}">
							{#if audience === 'user'}
								<div class="h-2 w-2 bg-background"></div>
							{/if}
						</div>
						<div>
							<div class="font-ui text-xs font-semibold">End Users</div>
							<p class="font-body text-xs text-muted-foreground">Visible to customers & clients</p>
						</div>
					</label>

					<label class="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors hover:border-primary {audience === 'admin' ? 'border-primary bg-primary/5' : ''}">
						<input
							type="radio"
							name="audience"
							value="admin"
							bind:group={audience}
							class="sr-only"
						/>
						<div class="flex h-5 w-5 items-center justify-center border {audience === 'admin' ? 'border-primary bg-primary' : 'border-border'}">
							{#if audience === 'admin'}
								<div class="h-2 w-2 bg-background"></div>
							{/if}
						</div>
						<div>
							<div class="flex items-center gap-1">
								<Shield class="h-3 w-3 text-primary" />
								<span class="font-ui text-xs font-semibold">Admin Only</span>
							</div>
							<p class="font-body text-xs text-muted-foreground">Only visible to admin users</p>
						</div>
					</label>

					<label class="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors hover:border-primary {audience === 'all' ? 'border-primary bg-primary/5' : ''}">
						<input
							type="radio"
							name="audience"
							value="all"
							bind:group={audience}
							class="sr-only"
						/>
						<div class="flex h-5 w-5 items-center justify-center border {audience === 'all' ? 'border-primary bg-primary' : 'border-border'}">
							{#if audience === 'all'}
								<div class="h-2 w-2 bg-background"></div>
							{/if}
						</div>
						<div>
							<div class="flex items-center gap-1">
								<Globe class="h-3 w-3 text-primary" />
								<span class="font-ui text-xs font-semibold">Everyone</span>
							</div>
							<p class="font-body text-xs text-muted-foreground">Visible to all users</p>
						</div>
					</label>
				</div>
			</div>

			<!-- Category & Tags -->
			<div class="border-t border-border pt-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORIZATION</span>
				
				<div class="mt-3 space-y-4">
					<div>
						<Label for="category" class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORY *</Label>
						<select
							id="category"
							name="category"
							bind:value={category}
							required
							class="mt-2 w-full h-10 px-3 border border-border bg-background text-sm focus:border-primary focus:outline-none"
						>
							<option value="">Select a category...</option>
							{#each allCategories() as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>

					<div>
						<Label for="tagsInput" class="font-mono text-[10px] tracking-widest text-muted-foreground">TAGS (comma separated)</Label>
						<Input
							type="text"
							id="tagsInput"
							name="tagsInput"
							bind:value={tags}
							class="mt-2 h-10 border-border bg-background"
							placeholder="getting-started, projects, setup"
						/>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</CreatePageLayout>
