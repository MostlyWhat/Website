<script lang="ts">
	/**
	 * Admin Job Posting Editor
	 * 
	 * Edit individual job postings.
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { 
		ArrowLeft, 
		Save, 
		Eye, 
		Trash2, 
		Users,
		Calendar,
		MapPin,
		Building2,
		Mail,
		Phone,
		Link2,
		FileText,
		MoreVertical
	} from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let deleteConfirm = $state(false);
	let activeTab = $state<'details' | 'applications'>('details');

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

	// Convert array to newline-separated text
	function arrayToText(arr: string[] | null | undefined): string {
		if (!arr || arr.length === 0) return '';
		return arr.join('\n');
	}

	// Status configs
	const statusConfig: Record<string, { color: string; label: string }> = {
		draft: { color: 'text-muted-foreground border-muted-foreground', label: 'Draft' },
		published: { color: 'text-green-500 border-green-500', label: 'Published' },
		closed: { color: 'text-yellow-500 border-yellow-500', label: 'Closed' },
		archived: { color: 'text-red-500 border-red-500', label: 'Archived' }
	};

	const applicationStatusConfig: Record<string, { color: string; label: string }> = {
		submitted: { color: 'text-blue-500 border-blue-500', label: 'Submitted' },
		reviewing: { color: 'text-purple-500 border-purple-500', label: 'Reviewing' },
		interviewing: { color: 'text-orange-500 border-orange-500', label: 'Interviewing' },
		offered: { color: 'text-green-500 border-green-500', label: 'Offered' },
		hired: { color: 'text-green-600 border-green-600', label: 'Hired' },
		rejected: { color: 'text-red-500 border-red-500', label: 'Rejected' },
		withdrawn: { color: 'text-muted-foreground border-muted-foreground', label: 'Withdrawn' }
	};

	const config = $derived(statusConfig[data.job?.status ?? 'draft']);
</script>

<svelte:head>
	<title>{data.job?.title ?? 'Edit Job'} | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<a href="/admin/careers" class="group mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
					<ArrowLeft class="h-3 w-3" />
					Back to Jobs
				</a>
				<div class="flex flex-wrap items-center gap-3">
					<h1 class="font-display text-2xl font-bold md:text-3xl">
						{data.job?.title ?? 'Untitled Job'}
					</h1>
					<span class="font-mono border px-2 py-0.5 text-[10px] tracking-wider {config.color}">{config.label.toUpperCase()}</span>
				</div>
				<div class="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
					{#if data.job?.department}
						<span class="flex items-center gap-1">
							<Building2 class="h-3 w-3" />
							{data.job.department}
						</span>
					{/if}
					{#if data.job?.location}
						<span class="flex items-center gap-1">
							<MapPin class="h-3 w-3" />
							{data.job.location}
						</span>
					{/if}
					<span class="flex items-center gap-1">
						<Users class="h-3 w-3" />
						{data.applications?.length ?? 0} applications
					</span>
					<span class="flex items-center gap-1">
						<Calendar class="h-3 w-3" />
						Created {formatDate(data.job?.createdAt)}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-3">
				{#if data.job?.status === 'draft'}
					<form method="POST" action="?/publish" use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') invalidateAll();
						};
					}}>
						<Button type="submit">
							<Eye class="mr-2 h-4 w-4" />
							Publish
						</Button>
					</form>
				{/if}
				{#if deleteConfirm}
					<form method="POST" action="?/delete" use:enhance>
						<Button type="submit" variant="destructive">
							<Trash2 class="mr-2 h-4 w-4" />
							Confirm Delete
						</Button>
					</form>
				{:else}
					<Button variant="outline" onclick={() => deleteConfirm = true}>
						<Trash2 class="mr-2 h-4 w-4" />
						Delete
					</Button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Tab Navigation -->
	<section class="border-b border-border bg-card">
		<div class="flex">
			<button
				onclick={() => activeTab = 'details'}
				class="px-6 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<FileText class="mr-2 inline-block h-4 w-4" />
				JOB DETAILS
			</button>
			<button
				onclick={() => activeTab = 'applications'}
				class="px-6 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'applications' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Users class="mr-2 inline-block h-4 w-4" />
				APPLICATIONS ({data.applications?.length ?? 0})
			</button>
		</div>
	</section>

	<!-- Content -->
	{#if activeTab === 'details'}
		<form method="POST" action="?/update" use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') invalidateAll();
			};
		}}>
			<section class="border-b border-border bg-background px-6 py-8 md:px-12">
				<h2 class="font-display mb-6 text-lg font-bold uppercase">Basic Information</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<Label for="title">Job Title</Label>
						<Input id="title" name="title" value={data.job?.title ?? ''} required />
					</div>
					<div>
						<Label for="department">Department</Label>
						<Input id="department" name="department" value={data.job?.department ?? ''} />
					</div>
					<div>
						<Label for="location">Location</Label>
						<Input id="location" name="location" value={data.job?.location ?? ''} />
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label for="locationType">Work Type</Label>
							<select name="locationType" id="locationType" value={data.job?.locationType ?? 'remote'} class="w-full rounded border border-border bg-background px-3 py-2 text-sm">
								<option value="remote">Remote</option>
								<option value="hybrid">Hybrid</option>
								<option value="onsite">On-site</option>
							</select>
						</div>
						<div>
							<Label for="type">Employment</Label>
							<select name="type" id="type" value={data.job?.type ?? 'full_time'} class="w-full rounded border border-border bg-background px-3 py-2 text-sm">
								<option value="full_time">Full-time</option>
								<option value="part_time">Part-time</option>
								<option value="contract">Contract</option>
								<option value="freelance">Freelance</option>
								<option value="internship">Internship</option>
							</select>
						</div>
					</div>
				</div>
			</section>

			<section class="border-b border-border bg-background px-6 py-8 md:px-12">
				<h2 class="font-display mb-6 text-lg font-bold uppercase">Job Description</h2>
				<div class="space-y-6">
					<div>
						<Label for="description">Description</Label>
						<Textarea id="description" name="description" value={data.job?.description ?? ''} rows={6} />
					</div>
					<div>
						<Label for="responsibilities">Responsibilities (one per line)</Label>
						<Textarea id="responsibilities" name="responsibilities" value={arrayToText(data.job?.responsibilities)} rows={6} placeholder="Design and implement scalable systems&#10;Collaborate with cross-functional teams&#10;..." />
					</div>
					<div>
						<Label for="requirements">Requirements (one per line)</Label>
						<Textarea id="requirements" name="requirements" value={arrayToText(data.job?.requirements)} rows={6} placeholder="5+ years of experience&#10;Strong communication skills&#10;..." />
					</div>
					<div>
						<Label for="niceToHave">Nice to Have (one per line)</Label>
						<Textarea id="niceToHave" name="niceToHave" value={arrayToText(data.job?.niceToHave)} rows={4} placeholder="Experience with our tech stack&#10;..." />
					</div>
					<div>
						<Label for="benefits">Benefits (one per line)</Label>
						<Textarea id="benefits" name="benefits" value={arrayToText(data.job?.benefits)} rows={4} placeholder="Competitive salary&#10;Remote work&#10;..." />
					</div>
				</div>
			</section>

			<section class="border-b border-border bg-background px-6 py-8 md:px-12">
				<h2 class="font-display mb-6 text-lg font-bold uppercase">Compensation & Application</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label for="salaryMin">Salary Min</Label>
							<Input id="salaryMin" name="salaryMin" type="number" value={data.job?.salaryMin ?? ''} />
						</div>
						<div>
							<Label for="salaryMax">Salary Max</Label>
							<Input id="salaryMax" name="salaryMax" type="number" value={data.job?.salaryMax ?? ''} />
						</div>
					</div>
					<div>
						<Label for="salaryCurrency">Currency</Label>
						<Input id="salaryCurrency" name="salaryCurrency" value={data.job?.salaryCurrency ?? 'USD'} />
					</div>
					<div>
						<Label for="applicationUrl">Application URL</Label>
						<Input id="applicationUrl" name="applicationUrl" type="url" value={data.job?.applicationUrl ?? ''} placeholder="https://..." />
					</div>
					<div>
						<Label for="applicationEmail">Application Email</Label>
						<Input id="applicationEmail" name="applicationEmail" type="email" value={data.job?.applicationEmail ?? ''} placeholder="careers@..." />
					</div>
				</div>
			</section>

			<section class="bg-card px-6 py-6 md:px-12">
				<div class="flex justify-end">
					<Button type="submit">
						<Save class="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</div>
			</section>
		</form>
	{:else}
		<!-- Applications Tab -->
		<section class="border-b border-border">
			{#if (data.applications ?? []).length === 0}
				<div class="flex flex-col items-center justify-center px-6 py-16">
					<Users class="h-12 w-12 text-muted-foreground/30" />
					<p class="mt-4 text-sm text-muted-foreground">No applications yet.</p>
				</div>
			{:else}
				{#each data.applications as app (app.id)}
					{@const appConfig = applicationStatusConfig[app.status] ?? applicationStatusConfig.submitted}
					<div class="flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-4 last:border-b-0 md:px-12">
						<div class="flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="font-mono border px-2 py-0.5 text-[10px] tracking-wider {appConfig.color}">{appConfig.label.toUpperCase()}</span>
								<span class="font-mono text-[10px] text-muted-foreground">{formatDate(app.createdAt)}</span>
							</div>
							<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">{app.firstName} {app.lastName}</h3>
							<div class="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
								<a href="mailto:{app.email}" class="flex items-center gap-1 hover:text-foreground">
									<Mail class="h-3 w-3" />
									{app.email}
								</a>
								{#if app.phone}
									<span class="flex items-center gap-1">
										<Phone class="h-3 w-3" />
										{app.phone}
									</span>
								{/if}
								{#if app.linkedinUrl}
									<a href={app.linkedinUrl} target="_blank" class="flex items-center gap-1 hover:text-foreground">
										<Link2 class="h-3 w-3" />
										LinkedIn
									</a>
								{/if}
								{#if app.portfolioUrl}
									<a href={app.portfolioUrl} target="_blank" class="flex items-center gap-1 hover:text-foreground">
										<Link2 class="h-3 w-3" />
										Portfolio
									</a>
								{/if}
								{#if app.resumeUrl}
									<a href={app.resumeUrl} target="_blank" class="flex items-center gap-1 hover:text-foreground">
										<FileText class="h-3 w-3" />
										Resume
									</a>
								{/if}
							</div>
						</div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button variant="outline" size="sm">
									<MoreVertical class="h-4 w-4" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								{#each Object.entries(applicationStatusConfig) as [status, conf]}
									<form method="POST" action="?/updateApplicationStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') invalidateAll();
										};
									}}>
										<input type="hidden" name="id" value={app.id} />
										<input type="hidden" name="status" value={status} />
										<DropdownMenu.Item class="cursor-pointer {app.status === status ? 'bg-muted' : ''}" onclick={(e) => e.currentTarget.closest('form')?.requestSubmit()}>
											<span class="mr-2 h-2 w-2 rounded-full {conf.color.replace('text-', 'bg-').replace('border-', '')}"></span>
											{conf.label}
										</DropdownMenu.Item>
									</form>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				{/each}
			{/if}
		</section>
	{/if}
</div>
