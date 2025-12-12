<script lang="ts">
	/**
	 * Admin Careers Management
	 * 
	 * Manage job postings for the careers page.
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { 
		Plus, 
		Search, 
		Briefcase, 
		Eye, 
		EyeOff, 
		Edit, 
		Trash2, 
		Star,
		StarOff,
		Filter,
		Calendar,
		Users,
		MapPin,
		Building2,
		MoreVertical,
		FileText
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { NativeSelect } from '$lib/components/ui/native-select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedStatus = $state(data.filters?.status ?? 'all');
	let createDialogOpen = $state(false);
	let deleteConfirm = $state<string | null>(null);

	// Filter jobs by search
	const filteredJobs = $derived.by(() => {
		let jobs = data.jobs ?? [];
		
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			jobs = jobs.filter((job: { title: string; department: string | null; location: string | null }) => 
				job.title.toLowerCase().includes(query) ||
				(job.department?.toLowerCase().includes(query)) ||
				(job.location?.toLowerCase().includes(query))
			);
		}

		return jobs;
	});

	// Format date
	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Handle filter changes
	function updateFilters() {
		const url = new URL(window.location.href);
		if (selectedStatus !== 'all') {
			url.searchParams.set('status', selectedStatus);
		} else {
			url.searchParams.delete('status');
		}
		window.location.href = url.toString();
	}

	// Status badge config
	const statusConfig: Record<string, { color: string; label: string }> = {
		draft: { color: 'text-muted-foreground border-muted-foreground', label: 'Draft' },
		published: { color: 'text-green-500 border-green-500', label: 'Published' },
		closed: { color: 'text-yellow-500 border-yellow-500', label: 'Closed' },
		archived: { color: 'text-red-500 border-red-500', label: 'Archived' }
	};

	// Job type labels
	const jobTypeLabels: Record<string, string> = {
		full_time: 'Full-time',
		part_time: 'Part-time',
		contract: 'Contract',
		freelance: 'Freelance',
		internship: 'Internship'
	};

	// Location type labels
	const locationTypeLabels: Record<string, string> = {
		remote: 'Remote',
		onsite: 'On-site',
		hybrid: 'Hybrid'
	};
</script>

<svelte:head>
	<title>Careers | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// CONTENT MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Job Postings
				</h1>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Manage job postings for the careers page.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<Button onclick={() => createDialogOpen = true}>
					<Plus class="mr-2 h-4 w-4" />
					New Job
				</Button>
				<a href="/careers" target="_blank" class="text-xs text-muted-foreground hover:text-foreground">
					View Careers Page →
				</a>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="grid grid-cols-2 gap-px border-b border-border bg-border md:grid-cols-4">
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<Briefcase class="h-5 w-5 text-muted-foreground" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">TOTAL JOBS</p>
				<p class="font-display text-xl font-bold">{data.stats?.total ?? 0}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<Eye class="h-5 w-5 text-green-500" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">PUBLISHED</p>
				<p class="font-display text-xl font-bold text-green-500">{data.stats?.published ?? 0}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<FileText class="h-5 w-5 text-muted-foreground" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">DRAFTS</p>
				<p class="font-display text-xl font-bold">{data.stats?.draft ?? 0}</p>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-background px-6 py-4">
			<Users class="h-5 w-5 text-primary" />
			<div>
				<p class="font-mono text-xs text-muted-foreground">APPLICATIONS</p>
				<p class="font-display text-xl font-bold text-primary">{data.stats?.applications ?? 0}</p>
			</div>
		</div>
	</section>

	<!-- Filters -->
	<section class="border-b border-border bg-card px-6 py-4 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search jobs..."
					bind:value={searchQuery}
					class="w-full rounded border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<div class="flex items-center gap-3">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={selectedStatus}
					onchange={updateFilters}
					class="rounded border border-border bg-background px-3 py-2 text-sm"
				>
					<option value="all">All Status</option>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
					<option value="closed">Closed</option>
					<option value="archived">Archived</option>
				</select>
			</div>
		</div>
	</section>

	<!-- Jobs List -->
	<section class="border-b border-border">
		{#if filteredJobs.length === 0}
			<div class="flex flex-col items-center justify-center px-6 py-16">
				<Briefcase class="h-12 w-12 text-muted-foreground/30" />
				<p class="mt-4 text-sm text-muted-foreground">No job postings found.</p>
				<Button variant="outline" class="mt-4" onclick={() => createDialogOpen = true}>
					<Plus class="mr-2 h-4 w-4" />
					Create First Job
				</Button>
			</div>
		{:else}
			{#each filteredJobs as job (job.id)}
				{@const config = statusConfig[job.status] ?? statusConfig.draft}
				<div class="flex items-center justify-between border-b border-border bg-background px-6 py-4 last:border-b-0 md:px-12">
					<div class="flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<span class="font-mono border px-2 py-0.5 text-[10px] tracking-wider {config.color}">{config.label.toUpperCase()}</span>
							{#if job.isFeatured}
								<span class="font-mono border border-primary bg-primary/10 px-2 py-0.5 text-[10px] tracking-wider text-primary">FEATURED</span>
							{/if}
							<span class="font-mono border border-border px-2 py-0.5 text-[10px] tracking-wider text-muted-foreground">
								{jobTypeLabels[job.type] ?? job.type}
							</span>
							<span class="font-mono border border-border px-2 py-0.5 text-[10px] tracking-wider text-muted-foreground">
								{locationTypeLabels[job.locationType] ?? job.locationType}
							</span>
						</div>
						<a href="/admin/careers/{job.id}" class="font-ui mt-2 block text-sm font-semibold tracking-wider hover:text-primary">
							{job.title}
						</a>
						<div class="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
							{#if job.department}
								<span class="flex items-center gap-1">
									<Building2 class="h-3 w-3" />
									{job.department}
								</span>
							{/if}
							{#if job.location}
								<span class="flex items-center gap-1">
									<MapPin class="h-3 w-3" />
									{job.location}
								</span>
							{/if}
							<span class="flex items-center gap-1">
								<Users class="h-3 w-3" />
								{job.applicationCount} applications
							</span>
							<span class="flex items-center gap-1">
								<Calendar class="h-3 w-3" />
								{formatDate(job.createdAt)}
							</span>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<a href="/admin/careers/{job.id}">
							<Button variant="outline" size="sm">
								<Edit class="mr-2 h-3 w-3" />
								Edit
							</Button>
						</a>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button variant="ghost" size="sm">
									<MoreVertical class="h-4 w-4" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<!-- Status changes -->
								{#if job.status !== 'published'}
									<form method="POST" action="?/updateStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={job.id} />
										<input type="hidden" name="status" value="published" />
										<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<Eye class="mr-2 h-4 w-4 text-green-500" /> Publish
										</DropdownMenu.Item>
									</form>
								{/if}
								{#if job.status === 'published'}
									<form method="POST" action="?/updateStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={job.id} />
										<input type="hidden" name="status" value="closed" />
										<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<EyeOff class="mr-2 h-4 w-4 text-yellow-500" /> Close
										</DropdownMenu.Item>
									</form>
								{/if}
								
								<!-- Featured toggle -->
								<form method="POST" action="?/toggleFeatured" use:enhance={() => {
									return async ({ result }) => {
										if (result.type === 'success') invalidateAll();
									};
								}}>
									<input type="hidden" name="id" value={job.id} />
									<input type="hidden" name="isFeatured" value={job.isFeatured} />
									<DropdownMenu.Item class="cursor-pointer" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
										{#if job.isFeatured}
											<StarOff class="mr-2 h-4 w-4" /> Unfeature
										{:else}
											<Star class="mr-2 h-4 w-4 text-primary" /> Feature
										{/if}
									</DropdownMenu.Item>
								</form>
								
								<DropdownMenu.Separator />
								
								<!-- Delete -->
								{#if deleteConfirm === job.id}
									<form method="POST" action="?/delete" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												deleteConfirm = null;
												invalidateAll();
											}
										};
									}}>
										<input type="hidden" name="id" value={job.id} />
										<DropdownMenu.Item class="cursor-pointer text-destructive" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<Trash2 class="mr-2 h-4 w-4" /> Confirm Delete
										</DropdownMenu.Item>
									</form>
								{:else}
									<DropdownMenu.Item class="cursor-pointer text-destructive" onclick={() => deleteConfirm = job.id}>
										<Trash2 class="mr-2 h-4 w-4" /> Delete
									</DropdownMenu.Item>
								{/if}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			{/each}
		{/if}
	</section>
</div>

<!-- Create Job Dialog -->
<Dialog.Root bind:open={createDialogOpen}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Create Job Posting</Dialog.Title>
			<Dialog.Description>Add a new job posting to the careers page.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					createDialogOpen = false;
					toast.success('Job posting created successfully');
				} else if (result.type === 'failure') {
					const message = (result.data as { message?: string })?.message ?? 'Failed to create job posting';
					toast.error(message);
				}
				await update();
			};
		}}>
			<Dialog.Body class="space-y-4">
				<div>
					<Label for="title">Job Title</Label>
					<Input id="title" name="title" placeholder="e.g., Senior Software Engineer" required />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Label for="department">Department</Label>
						<Input id="department" name="department" placeholder="e.g., Engineering" />
					</div>
					<div>
						<Label for="location">Location</Label>
						<Input id="location" name="location" placeholder="e.g., Bangkok, Thailand" />
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="locationType">Work Type</Label>
					<NativeSelect name="locationType" id="locationType" class="w-full">
						<option value="remote">Remote</option>
						<option value="hybrid">Hybrid</option>
						<option value="onsite">On-site</option>
					</NativeSelect>
				</div>
				<div>
					<Label for="type">Employment Type</Label>
					<NativeSelect name="type" id="type" class="w-full">
						<option value="full_time">Full-time</option>
						<option value="part_time">Part-time</option>
						<option value="contract">Contract</option>
						<option value="freelance">Freelance</option>
						<option value="internship">Internship</option>
					</NativeSelect>
				</div>
				</div>
				<div>
					<Label for="description">Description</Label>
					<Textarea id="description" name="description" placeholder="Job description..." rows={4} />
				</div>
			</Dialog.Body>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => createDialogOpen = false}>Cancel</Button>
				<Button type="submit">Create Job</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
