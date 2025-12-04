<script lang="ts">
	/**
	 * Create New Ticket Page
	 */
	import { ArrowLeft, Send, Loader2, Paperclip, AlertTriangle, AlertCircle, BookOpen, ChevronRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';

	type FormReturn = {
		error?: string;
		subject?: string;
		description?: string;
		priority?: string;
		category?: string;
	} | null;

	type SuggestedArticle = {
		id: string;
		title: string;
		slug: string;
		category: string | null;
	};

	let { data, form }: { data: { organizations: unknown[]; projects: unknown[]; suggestedArticles: SuggestedArticle[] }; form: FormReturn } = $props();
	
	let loading = $state(false);
	let subject = $state(form?.subject || '');
	let description = $state(form?.description || '');
	let priority = $state(form?.priority || 'medium');
	let category = $state(form?.category || 'general');
</script>

<svelte:head>
	<title>New Ticket | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/app/tickets"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO TICKETS</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Submit a Ticket</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Describe your issue and our team will get back to you as soon as possible.
		</p>
	</section>

	<!-- Error Messages -->
	{#if form?.error}
		<div class="border-b border-red-500/20 bg-red-500/5 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-red-500" />
				<p class="font-body text-sm text-red-500">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Form Section -->
	<section class="border-b border-border bg-background">
		<form 
			method="POST" 
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="grid grid-cols-12 gap-px bg-border"
		>
			<!-- Main Form -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — TICKET DETAILS</span>
				
				<div class="mt-6 space-y-6">
					<!-- Subject -->
					<div>
						<label for="subject" class="font-ui text-xs font-medium tracking-wider text-foreground">
							SUBJECT
						</label>
						<input
							type="text"
							id="subject"
							name="subject"
							bind:value={subject}
							placeholder="Brief description of your issue"
							class="font-body mt-2 h-12 w-full border border-border bg-card px-4 text-sm focus:border-primary focus:outline-none"
							required
						/>
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="font-ui text-xs font-medium tracking-wider text-foreground">
							DESCRIPTION
						</label>
						<div class="mt-2">
							<RichTextEditor
								bind:value={description}
								name="description"
								id="description"
								placeholder="Please provide as much detail as possible about your issue..."
								rows={8}
								required
							/>
						</div>
					</div>

					<!-- Attachments -->
					<div>
						<span class="font-ui text-xs font-medium tracking-wider text-foreground">
							ATTACHMENTS <span class="text-muted-foreground">(OPTIONAL)</span>
						</span>
						<div class="mt-2 flex items-center justify-center border border-dashed border-border bg-card p-8 transition-colors hover:border-primary/50">
							<div class="text-center">
								<Paperclip class="mx-auto h-8 w-8 text-muted-foreground/50" />
								<p class="font-body mt-2 text-sm text-muted-foreground">
									Drag and drop files here or <button type="button" class="text-primary underline">browse</button>
								</p>
								<p class="font-mono mt-1 text-[10px] tracking-wider text-muted-foreground/70">
									Max 10MB per file. Supported: PNG, JPG, PDF, ZIP
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar Options -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Category -->
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — CATEGORY</span>
					<div class="mt-4 space-y-2">
						{#each [
							{ value: 'general', label: 'General Support' },
							{ value: 'billing', label: 'Billing & Payments' },
							{ value: 'technical', label: 'Technical Issue' },
							{ value: 'feature', label: 'Feature Request' },
							{ value: 'bug', label: 'Bug Report' }
						] as { value, label }}
							<label
								class="group flex cursor-pointer items-center gap-3 border p-3 transition-colors {category === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
							>
								<input
									type="radio"
									name="category"
									{value}
									bind:group={category}
									class="sr-only"
								/>
								<div class="flex h-5 w-5 flex-shrink-0 items-center justify-center border {category === value ? 'border-primary bg-primary' : 'border-border bg-background'}">
									{#if category === value}
										<div class="h-2 w-2 bg-background"></div>
									{/if}
								</div>
								<span class="font-ui text-xs tracking-wider">{label}</span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Priority -->
				<div class="mt-8">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — PRIORITY</span>
					<div class="mt-4 space-y-2">
						{#each [
							{ value: 'low', label: 'Low', desc: 'General question or minor issue' },
							{ value: 'medium', label: 'Medium', desc: 'Important but not urgent' },
							{ value: 'high', label: 'High', desc: 'Significantly impacting work' },
							{ value: 'urgent', label: 'Urgent', desc: 'Critical - system down', icon: AlertTriangle }
						] as { value, label, desc, icon }}
							<label
								class="group flex cursor-pointer items-start gap-3 border p-3 transition-colors {priority === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
							>
								<input
									type="radio"
									name="priority"
									{value}
									bind:group={priority}
									class="sr-only"
								/>
								<div class="flex h-5 w-5 flex-shrink-0 items-center justify-center border {priority === value ? 'border-primary bg-primary' : 'border-border bg-background'}">
									{#if priority === value}
										<div class="h-2 w-2 bg-background"></div>
									{/if}
								</div>
								<div class="flex-1">
									<div class="flex items-center gap-2">
										{#if icon}
											{@const PriorityIcon = icon}
											<PriorityIcon class="h-3 w-3 text-red-500" />
										{/if}
										<span class="font-ui text-xs font-semibold tracking-wider uppercase">{label}</span>
									</div>
									<p class="font-body mt-0.5 text-xs text-muted-foreground">{desc}</p>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Suggested Articles -->
				{#if data.suggestedArticles && data.suggestedArticles.length > 0}
					<div class="mt-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BEFORE YOU SUBMIT</span>
						<div class="mt-4 border border-blue-500/30 bg-blue-500/5 p-4">
							<div class="flex items-center gap-2">
								<BookOpen class="h-4 w-4 text-blue-500" />
								<span class="font-ui text-xs font-semibold tracking-wider text-blue-500">CHECK OUR HELP CENTER</span>
							</div>
							<p class="font-body mt-2 text-xs text-muted-foreground">
								Your question might already be answered in our help articles.
							</p>
							<div class="mt-3 space-y-1">
								{#each data.suggestedArticles as article}
									<a
										href="/app/help/{article.slug}"
										class="group flex items-center justify-between py-2 text-sm transition-colors hover:text-primary"
									>
										<span class="font-body truncate">{article.title}</span>
										<ChevronRight class="h-3 w-3 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
									</a>
								{/each}
							</div>
							<a href="/app/help" class="font-ui mt-3 inline-block text-xs tracking-wider text-blue-500 hover:underline">
								BROWSE ALL ARTICLES →
							</a>
						</div>
					</div>
				{/if}
			</div>

			<!-- Form Actions -->
			<div class="col-span-12 flex items-center justify-end gap-4 bg-card px-6 py-4 md:px-12 lg:px-16">
				<Button variant="outline" href="/app/tickets" class="font-ui text-xs tracking-wider">
					CANCEL
				</Button>
				<Button type="submit" disabled={loading} class="font-ui text-xs tracking-wider">
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						SUBMITTING...
					{:else}
						<Send class="mr-2 h-4 w-4" />
						SUBMIT TICKET
					{/if}
				</Button>
			</div>
		</form>
	</section>
</div>
