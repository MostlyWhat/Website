<script lang="ts">
	/**
	 * Project Request Detail Page
	 * 
	 * Shows the status and details of a submitted project request.
	 */
	import { 
		ArrowLeft, FolderKanban, Clock, CheckCircle, X, Eye, AlertCircle,
		Calendar, User, Globe, Smartphone, Palette, Code, Server, BarChart3,
		DollarSign, Timer, Target, FileText, Link2, ExternalLink
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

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

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string; desc: string } {
		switch (status) {
			case 'pending': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'PENDING REVIEW', desc: 'Your request is waiting to be reviewed by our team.' };
			case 'under_review': return { icon: Eye, class: 'bg-blue-500/10 text-blue-500', label: 'UNDER REVIEW', desc: 'Our team is currently reviewing your request.' };
			case 'approved': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'APPROVED', desc: 'Your request has been approved. We will contact you soon.' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'DECLINED', desc: 'Unfortunately, we are unable to proceed with this request.' };
			case 'converted': return { icon: FolderKanban, class: 'bg-primary/10 text-primary', label: 'CONVERTED TO PROJECT', desc: 'This request has been converted to an active project.' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status.toUpperCase(), desc: '' };
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
	<title>{request.title} | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/app/projects"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO PROJECTS</span>
				</a>
				<div class="mt-6 flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<TypeIcon class="h-5 w-5 text-primary" />
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

	<!-- Success Message -->
	{#if data.showSuccess}
		<div class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<CheckCircle class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-green-500">
					Your project request has been submitted successfully! We'll review it and get back to you soon.
				</p>
			</div>
		</div>
	{/if}

	<!-- Content -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Status Banner -->
				<div class="border border-border bg-card/50 p-6 mb-8">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center {statusConfig.class}">
							<StatusIcon class="h-5 w-5" />
						</div>
						<div>
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS</span>
							<h3 class="font-ui text-sm font-semibold tracking-wider">{statusConfig.label}</h3>
							<p class="font-body mt-1 text-xs text-muted-foreground">{statusConfig.desc}</p>
						</div>
					</div>
				</div>

				<!-- Converted Project Link -->
				{#if project}
					<div class="border border-primary/30 bg-primary/5 p-6 mb-8">
						<span class="font-mono text-[10px] tracking-widest text-primary">PROJECT CREATED</span>
						<div class="mt-4 flex items-center justify-between">
							<div>
								<h3 class="font-ui text-sm font-semibold tracking-wider">{project.name}</h3>
								<p class="font-mono text-xs text-muted-foreground">{project.projectNumber}</p>
							</div>
							<Button href="/app/projects/{project.id}" size="sm" class="font-ui text-xs tracking-wider">
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
					<div class="border border-border p-6">
						<div class="flex items-center gap-2 mb-4">
							<Link2 class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INSPIRATION / REFERENCES</span>
						</div>
						<p class="font-body text-sm text-muted-foreground whitespace-pre-wrap">{request.references}</p>
					</div>
				{/if}

				<!-- Review Notes (if rejected or reviewed) -->
				{#if request.reviewNotes && (request.status === 'rejected' || request.status === 'approved')}
					<div class="mt-8 border {request.status === 'rejected' ? 'border-destructive/30 bg-destructive/5' : 'border-border'} p-6">
						<span class="font-mono text-[10px] tracking-widest {request.status === 'rejected' ? 'text-destructive' : 'text-muted-foreground'}">
							{request.status === 'rejected' ? 'REASON FOR DECLINE' : 'REVIEW NOTES'}
						</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">{request.reviewNotes}</p>
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

				<!-- Request Info -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">REQUEST INFO</span>
					<div class="mt-6 space-y-4">
						<div class="flex items-center gap-3">
							<User class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">REQUESTED BY</p>
								<p class="font-body text-sm">{request.requestedByName}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Calendar class="h-4 w-4 text-muted-foreground" />
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SUBMITTED</p>
								<p class="font-body text-sm">{formatDate(request.createdAt)}</p>
							</div>
						</div>
						{#if request.reviewedAt}
							<div class="flex items-center gap-3">
								<Eye class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">REVIEWED</p>
									<p class="font-body text-sm">{formatDate(request.reviewedAt)}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Actions -->
				{#if request.status === 'pending' || request.status === 'under_review'}
					<div class="mt-6 border border-border bg-card/50 p-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED CHANGES?</span>
						<p class="font-body mt-2 text-xs text-muted-foreground">
							If you need to update your request or have questions, please 
							<a href="/app/tickets/new" class="text-primary hover:underline">submit a support ticket</a>.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</section>
</div>
