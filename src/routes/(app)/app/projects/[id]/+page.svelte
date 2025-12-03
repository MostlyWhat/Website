<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Calendar, Users, FileText, MessageSquare, CheckCircle2, Clock, AlertCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	// Sample project data
	let project = $state({
		id: 'PRJ-2024-0012',
		name: 'E-Commerce Platform',
		status: 'in_progress',
		organization: 'TechCorp Solutions',
		description: 'A comprehensive e-commerce solution with custom product management, shopping cart, secure checkout, and integration with major payment gateways.',
		start_date: '2024-02-01',
		estimated_end_date: '2024-05-15',
		budget: 150000,
		currency: 'THB',
		progress: 45,
		team: [
			{ name: 'Sarah Chen', role: 'Project Manager', avatar: null },
			{ name: 'Mike Johnson', role: 'Lead Developer', avatar: null },
			{ name: 'Anna Lee', role: 'UI/UX Designer', avatar: null }
		],
		milestones: [
			{ name: 'Discovery & Planning', status: 'completed', date: '2024-02-14' },
			{ name: 'Design Approval', status: 'completed', date: '2024-03-01' },
			{ name: 'Frontend Development', status: 'in_progress', date: '2024-04-01' },
			{ name: 'Backend Integration', status: 'pending', date: '2024-04-15' },
			{ name: 'Testing & QA', status: 'pending', date: '2024-05-01' },
			{ name: 'Launch', status: 'pending', date: '2024-05-15' }
		],
		recent_activity: [
			{ action: 'Completed checkout page design', date: '2024-03-10', user: 'Anna Lee' },
			{ action: 'API endpoints documentation updated', date: '2024-03-09', user: 'Mike Johnson' },
			{ action: 'Weekly progress report sent', date: '2024-03-08', user: 'Sarah Chen' },
			{ action: 'Product listing component implemented', date: '2024-03-07', user: 'Mike Johnson' }
		]
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'completed':
				return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'COMPLETED' };
			case 'in_progress':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'IN PROGRESS' };
			case 'on_hold':
				return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'ON HOLD' };
			case 'pending':
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'PENDING' };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase().replace('_', ' ') };
		}
	}

	let status = $derived(getStatusBadge(project.status));
</script>

<svelte:head>
	<title>{project.name} | MostlyWhat Systems</title>
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
				<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">{project.name}</h1>
				<p class="font-mono mt-2 text-xs tracking-widest text-muted-foreground">{project.id}</p>
			</div>

			<span class="font-mono text-[10px] tracking-widest px-3 py-1 {status.bg} {status.text}">
				{status.label}
			</span>
		</div>
	</section>

	<!-- Progress Bar -->
	<section class="border-b border-border bg-card px-6 py-4 md:px-12 lg:px-16">
		<div class="flex items-center justify-between">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT PROGRESS</span>
			<span class="font-mono text-sm font-semibold">{project.progress}%</span>
		</div>
		<div class="mt-2 h-2 w-full bg-border">
			<div class="h-full bg-primary transition-all" style="width: {project.progress}%"></div>
		</div>
	</section>

	<!-- Project Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Description -->
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PROJECT OVERVIEW</span>
					<p class="font-body mt-4 text-base leading-relaxed text-muted-foreground">{project.description}</p>
				</div>

				<!-- Milestones -->
				<div class="mt-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — MILESTONES</span>
					
					<div class="mt-6 space-y-4">
						{#each project.milestones as milestone, index}
							{@const milestoneStatus = getStatusBadge(milestone.status)}
							<div class="flex items-start gap-4">
								<!-- Timeline indicator -->
								<div class="flex flex-col items-center">
									<div class="flex h-8 w-8 items-center justify-center border {milestone.status === 'completed' ? 'border-green-500 bg-green-500/10' : milestone.status === 'in_progress' ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-card'}">
										{#if milestone.status === 'completed'}
											<CheckCircle2 class="h-4 w-4 text-green-500" />
										{:else if milestone.status === 'in_progress'}
											<Clock class="h-4 w-4 text-blue-500" />
										{:else}
											<span class="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
										{/if}
									</div>
									{#if index < project.milestones.length - 1}
										<div class="h-8 w-px {milestone.status === 'completed' ? 'bg-green-500' : 'bg-border'}"></div>
									{/if}
								</div>

								<div class="flex flex-1 items-center justify-between border border-border px-4 py-3 {milestone.status === 'in_progress' ? 'border-blue-500/30 bg-blue-500/5' : ''}">
									<div>
										<span class="font-ui text-sm font-medium">{milestone.name}</span>
										<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">
											{formatDate(milestone.date)}
										</p>
									</div>
									<span class="font-mono text-[10px] tracking-widest px-2 py-0.5 {milestoneStatus.bg} {milestoneStatus.text}">
										{milestoneStatus.label}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Recent Activity -->
				<div class="mt-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — RECENT ACTIVITY</span>
					
					<div class="mt-6 border border-border divide-y divide-border">
						{#each project.recent_activity as activity}
							<div class="flex items-start gap-4 px-4 py-4">
								<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-border bg-card">
									<span class="font-mono text-xs uppercase">{activity.user.split(' ').map(n => n[0]).join('')}</span>
								</div>
								<div class="flex-1">
									<p class="font-body text-sm">{activity.action}</p>
									<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">
										{activity.user} • {formatDate(activity.date)}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Project Details Card -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT DETAILS</span>
					
					<div class="mt-6 space-y-4">
						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Calendar class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMELINE</p>
								<p class="font-body text-sm">{formatDate(project.start_date)} — {formatDate(project.estimated_end_date)}</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<FileText class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET</p>
								<p class="font-display text-lg font-bold">{formatCurrency(project.budget)}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Team -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">YOUR TEAM</span>
					
					<div class="mt-4 space-y-3">
						{#each project.team as member}
							<div class="flex items-center gap-3">
								<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
									<span class="font-mono text-xs uppercase">{member.name.split(' ').map(n => n[0]).join('')}</span>
								</div>
								<div>
									<p class="font-ui text-sm font-medium">{member.name}</p>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">{member.role.toUpperCase()}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="mt-6 space-y-3">
					<Button variant="outline" href="/app/tickets/new" class="font-ui w-full text-xs tracking-wider">
						<MessageSquare class="mr-2 h-4 w-4" />
						ASK A QUESTION
					</Button>
					<Button variant="outline" href="/app/invoices" class="font-ui w-full text-xs tracking-wider">
						<FileText class="mr-2 h-4 w-4" />
						VIEW INVOICES
					</Button>
				</div>

				<!-- Need Help -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED HELP?</span>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						If you have any questions or concerns about your project, our team is here to help.
					</p>
					<Button variant="outline" href="/contact" class="font-ui mt-4 w-full text-xs tracking-wider">
						CONTACT SUPPORT
					</Button>
				</div>
			</div>
		</div>
	</section>
</div>
