<script lang="ts">
	/**
	 * Admin Project Request Detail Page
	 * 
	 * View and manage a specific project request.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, FileText, Clock, Eye, CheckCircle, X, FolderKanban,
		Building2, User, Calendar, DollarSign, Timer, Target, Link2,
		ExternalLink, Loader2, Globe, Smartphone, Palette, Code, Server, BarChart3
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { data, form } = $props();

	let loading = $state(false);
	let reviewNotes = $state(data.request.reviewNotes ?? '');
	let projectName = $state(data.request.title);
	let showConvertForm = $state(false);

	const request = data.request;
	const project = data.project;

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', { 
			year: 'numeric',
			month: 'short', 
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'pending': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'PENDING REVIEW' };
			case 'under_review': return { icon: Eye, class: 'bg-blue-500/10 text-blue-500', label: 'UNDER REVIEW' };
			case 'approved': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'APPROVED' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'REJECTED' };
			case 'converted': return { icon: FolderKanban, class: 'bg-primary/10 text-primary', label: 'CONVERTED TO PROJECT' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status.toUpperCase() };
		}
	}

	function getProjectTypeInfo(type: string): { icon: typeof Globe; label: string } {
		switch (type) {
			case 'website': return { icon: Globe, label: 'Website' };
			case 'web_app': return { icon: Code, label: 'Web Application' };
			case 'mobile_app': return { icon: Smartphone, label: 'Mobile App' };
			case 'design': return { icon: Palette, label: 'Design & Branding' };
			case 'backend': return { icon: Server, label: 'Backend / API' };
			default: return { icon: BarChart3, label: 'Other' };
		}
	}

	function getBudgetLabel(budget: string | null): string {
		if (!budget) return 'Not specified';
		const labels: Record<string, string> = {
			'under_5k': 'Under $5,000',
			'5k_15k': '$5,000 - $15,000',
			'15k_50k': '$15,000 - $50,000',
			'50k_100k': '$50,000 - $100,000',
			'over_100k': 'Over $100,000',
			'not_sure': 'Not sure yet'
		};
		return labels[budget] ?? budget;
	}

	function getTimelineLabel(timeline: string | null): string {
		if (!timeline) return 'Not specified';
		const labels: Record<string, string> = {
			'asap': 'As soon as possible',
			'1_month': 'Within 1 month',
			'1_3_months': '1-3 months',
			'3_6_months': '3-6 months',
			'flexible': 'Flexible / No rush'
		};
		return labels[timeline] ?? timeline;
	}

	const statusConfig = getStatusConfig(request.status);
	const typeInfo = getProjectTypeInfo(request.projectType);
	const TypeIcon = typeInfo.icon;
	const StatusIcon = statusConfig.icon;
</script>

<svelte:head>
	<title>{request.title} | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/admin/projects?tab=requests"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO REQUESTS</span>
				</a>
				<div class="mt-6 flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<FileText class="h-5 w-5 text-primary" />
					</div>
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{request.requestNumber}</span>
						<h1 class="font-display text-xl font-bold md:text-2xl">{request.title}</h1>
					</div>
				</div>
			</div>
			<span class="font-mono text-[10px] tracking-widest px-3 py-1 {statusConfig.class}">
				{statusConfig.label}
			</span>
		</div>
	</section>

	<!-- Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-green-500">{form.message ?? 'Action completed successfully'}</p>
		</div>
	{/if}
	{#if form?.error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Content -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Converted Project Link -->
				{#if project}
					<div class="border border-primary/30 bg-primary/5 p-6 mb-8">
						<span class="font-mono text-[10px] tracking-widest text-primary">PROJECT CREATED</span>
						<div class="mt-4 flex items-center justify-between">
							<div>
								<h3 class="font-ui text-sm font-semibold tracking-wider">{project.name}</h3>
								<p class="font-mono text-xs text-muted-foreground">{project.projectNumber}</p>
							</div>
							<Button href="/admin/projects/{project.id}" size="sm" class="font-ui text-xs tracking-wider">
								VIEW PROJECT
								<ExternalLink class="ml-2 h-3 w-3" />
							</Button>
						</div>
					</div>
				{/if}

				<!-- Description -->
				<div class="border border-border p-6 mb-8">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT DESCRIPTION</span>
					<p class="font-body mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
				</div>

				<!-- Goals -->
				{#if request.goals}
					<div class="border border-border p-6 mb-8">
						<div class="flex items-center gap-2 mb-4">
							<Target class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT GOALS</span>
						</div>
						<p class="font-body text-sm text-muted-foreground whitespace-pre-wrap">{request.goals}</p>
					</div>
				{/if}

				<!-- Requirements -->
				{#if request.requirements}
					<div class="border border-border p-6 mb-8">
						<div class="flex items-center gap-2 mb-4">
							<FileText class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SPECIFIC REQUIREMENTS</span>
						</div>
						<p class="font-body text-sm text-muted-foreground whitespace-pre-wrap">{request.requirements}</p>
					</div>
				{/if}

				<!-- References -->
				{#if request.references}
					<div class="border border-border p-6 mb-8">
						<div class="flex items-center gap-2 mb-4">
							<Link2 class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INSPIRATION / REFERENCES</span>
						</div>
						<p class="font-body text-sm text-muted-foreground whitespace-pre-wrap">{request.references}</p>
					</div>
				{/if}

				<!-- Convert to Project Form -->
				{#if showConvertForm && request.status !== 'converted' && request.status !== 'rejected'}
					<div class="border border-primary bg-primary/5 p-6">
						<span class="font-mono text-[10px] tracking-widest text-primary">CONVERT TO PROJECT</span>
						<form 
							method="POST" 
							action="?/convertToProject" 
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									loading = false;
									await update();
								};
							}}
							class="mt-4 space-y-4"
						>
							<div>
								<label for="projectName" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									PROJECT NAME
								</label>
								<Input
									id="projectName"
									name="projectName"
									type="text"
									bind:value={projectName}
									placeholder="Project name"
									class="mt-2 h-10 border-border bg-card px-4 font-body text-sm"
								/>
							</div>
							<div class="flex items-center justify-end gap-2">
								<Button type="button" variant="outline" onclick={() => showConvertForm = false} class="font-ui text-xs tracking-wider">
									CANCEL
								</Button>
								<Button type="submit" disabled={loading} class="font-ui text-xs tracking-wider">
									{#if loading}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
										CREATING...
									{:else}
										<FolderKanban class="mr-2 h-4 w-4" />
										CREATE PROJECT
									{/if}
								</Button>
							</div>
						</form>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Project Type -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT TYPE</span>
					<div class="mt-4 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
							<TypeIcon class="h-4 w-4 text-primary" />
						</div>
						<span class="font-ui text-sm font-semibold tracking-wider">{typeInfo.label}</span>
					</div>
				</div>

				<!-- Budget & Timeline -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET & TIMELINE</span>
					<div class="mt-6 space-y-4">
						<div class="flex items-center gap-3">
							<DollarSign class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET RANGE</p>
								<p class="font-body text-sm">{getBudgetLabel(request.budgetRange)}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Timer class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMELINE</p>
								<p class="font-body text-sm">{getTimelineLabel(request.timeline)}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Organization & Requester -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">REQUEST INFO</span>
					<div class="mt-6 space-y-4">
						<div class="flex items-center gap-3">
							<Building2 class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">ORGANIZATION</p>
								<p class="font-body text-sm">{request.organizationName}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<User class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">REQUESTED BY</p>
								<p class="font-body text-sm">{request.requestedByName}</p>
								<p class="font-mono text-[10px] text-muted-foreground">{request.requestedByEmail}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Calendar class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SUBMITTED</p>
								<p class="font-body text-sm">{formatDate(request.createdAt)}</p>
							</div>
						</div>
						{#if request.reviewedAt && data.reviewer}
							<div class="flex items-center gap-3">
								<Eye class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">REVIEWED BY</p>
									<p class="font-body text-sm">{data.reviewer.name}</p>
									<p class="font-mono text-[10px] text-muted-foreground">{formatDate(request.reviewedAt)}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Review Actions -->
				{#if request.status !== 'converted'}
					<div class="mt-6 border border-border p-6">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACTIONS</span>
						
						<!-- Review Notes -->
						<form 
							method="POST" 
							action="?/updateStatus" 
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									loading = false;
									await update();
								};
							}}
							class="mt-4 space-y-4"
						>
							<div>
								<label for="reviewNotes" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									REVIEW NOTES
								</label>
								<textarea
									id="reviewNotes"
									name="reviewNotes"
									bind:value={reviewNotes}
									rows="3"
									placeholder="Add notes for the client..."
									class="font-body mt-2 w-full resize-none border border-border bg-card p-3 text-sm focus:border-primary focus:outline-none"
								></textarea>
							</div>

							<div class="space-y-2">
								{#if request.status === 'pending'}
									<Button type="submit" name="status" value="under_review" disabled={loading} class="font-ui w-full text-xs tracking-wider">
										<Eye class="mr-2 h-4 w-4" />
										START REVIEW
									</Button>
								{/if}
								
								{#if request.status === 'under_review'}
									<Button type="submit" name="status" value="approved" disabled={loading} class="font-ui w-full text-xs tracking-wider">
										<CheckCircle class="mr-2 h-4 w-4" />
										APPROVE REQUEST
									</Button>
								{/if}
								
								{#if request.status !== 'rejected' && request.status !== 'approved'}
									<Button type="submit" name="status" value="rejected" variant="outline" disabled={loading} class="font-ui w-full border-destructive/50 text-xs tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground">
										<X class="mr-2 h-4 w-4" />
										REJECT REQUEST
									</Button>
								{/if}
							</div>
						</form>

						<!-- Convert to Project -->
						{#if request.status === 'approved' && !showConvertForm}
							<div class="mt-4 pt-4 border-t border-border">
								<Button onclick={() => showConvertForm = true} class="font-ui w-full text-xs tracking-wider">
									<FolderKanban class="mr-2 h-4 w-4" />
									CONVERT TO PROJECT
								</Button>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</section>
</div>
