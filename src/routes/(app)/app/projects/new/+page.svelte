<script lang="ts">
	/**
	 * New Project Request Page
	 * 
	 * Allows clients to request new projects.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, FolderKanban, Loader2, Send, Building2,
		Globe, Smartphone, Palette, Code, Server, BarChart3
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { data, form } = $props();

	let loading = $state(false);
	let organizationId = $state('');
	let title = $state('');
	let description = $state('');
	let projectType = $state('');
	let budgetRange = $state('');
	let timeline = $state('');
	let goals = $state('');
	let requirements = $state('');
	let references = $state('');

	const projectTypes = [
		{ value: 'website', label: 'Website', icon: Globe, desc: 'Corporate site, landing page, or blog' },
		{ value: 'web_app', label: 'Web Application', icon: Code, desc: 'Custom web-based software' },
		{ value: 'mobile_app', label: 'Mobile App', icon: Smartphone, desc: 'iOS, Android, or cross-platform' },
		{ value: 'design', label: 'Design & Branding', icon: Palette, desc: 'UI/UX, logos, brand identity' },
		{ value: 'backend', label: 'Backend / API', icon: Server, desc: 'Server, database, integrations' },
		{ value: 'other', label: 'Other', icon: BarChart3, desc: 'Something else entirely' }
	];

	const budgetRanges = [
		{ value: 'under_5k', label: 'Under $5,000' },
		{ value: '5k_15k', label: '$5,000 - $15,000' },
		{ value: '15k_50k', label: '$15,000 - $50,000' },
		{ value: '50k_100k', label: '$50,000 - $100,000' },
		{ value: 'over_100k', label: 'Over $100,000' },
		{ value: 'not_sure', label: 'Not sure yet' }
	];

	const timelines = [
		{ value: 'asap', label: 'As soon as possible' },
		{ value: '1_month', label: 'Within 1 month' },
		{ value: '1_3_months', label: '1-3 months' },
		{ value: '3_6_months', label: '3-6 months' },
		{ value: 'flexible', label: 'Flexible / No rush' }
	];
</script>

<svelte:head>
	<title>New Project Request | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/app/projects"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO PROJECTS</span>
		</a>
		<div class="mt-6 flex items-center gap-4">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<FolderKanban class="h-5 w-5 text-primary" />
			</div>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">REQUEST</span>
				<h1 class="font-display text-2xl font-bold uppercase md:text-3xl">New Project</h1>
			</div>
		</div>
		<p class="font-body mt-4 max-w-2xl text-muted-foreground">
			Tell us about your project idea and we'll get back to you with a detailed proposal.
		</p>
	</section>

	<!-- Error Message -->
	{#if form?.error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				await update();
			};
		}}
	>
		<section class="border-b border-border">
			<div class="grid grid-cols-12 gap-px bg-border">
				<!-- Main Form -->
				<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
					<!-- Organization Selection -->
					<div class="space-y-6">
						{#if data.organizations.length > 1}
							<div>
								<label for="organizationId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									ORGANIZATION <span class="text-destructive">*</span>
								</label>
								<select
									id="organizationId"
									name="organizationId"
									bind:value={organizationId}
									required
									class="font-body mt-2 h-12 w-full border border-border bg-card px-4 text-sm focus:border-primary focus:outline-none"
								>
									<option value="">Select organization...</option>
									{#each data.organizations as org}
										<option value={org.id}>{org.name}</option>
									{/each}
								</select>
							</div>
						{:else if data.organizations.length === 1}
							<input type="hidden" name="organizationId" value={data.organizations[0].id} />
							<div class="flex items-center gap-3 border border-border bg-card/50 p-4">
								<Building2 class="h-5 w-5 text-muted-foreground" />
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">
										ORGANIZATION
									</p>
									<p class="font-body text-sm">{data.organizations[0].name}</p>
								</div>
							</div>
						{:else}
							<div class="border border-amber-500/30 bg-amber-500/5 p-6">
								<p class="font-body text-sm text-amber-600">
									Setting up your organization... Please refresh the page or <a href="/app/organization" class="underline">create an organization</a>.
								</p>
							</div>
						{/if}

						<!-- Project Title -->
						<div>
							<label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PROJECT TITLE <span class="text-destructive">*</span>
							</label>
							<Input
								id="title"
								name="title"
								type="text"
								bind:value={title}
								required
								placeholder="e.g., E-commerce Platform Redesign"
								class="mt-2 h-12 border-border bg-card px-4 font-body"
							/>
						</div>

						<!-- Description -->
						<div>
							<label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PROJECT DESCRIPTION <span class="text-destructive">*</span>
							</label>
							<textarea
								id="description"
								name="description"
								bind:value={description}
								required
								rows="5"
								placeholder="Describe your project idea in detail. What problem does it solve? What are the main features?"
								class="font-body mt-2 w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
							></textarea>
						</div>

						<!-- Project Type -->
						<div>
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PROJECT TYPE <span class="text-destructive">*</span>
							</span>
							<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
								{#each projectTypes as type}
									{@const TypeIcon = type.icon}
									<label
										class="group flex cursor-pointer items-start gap-3 border p-4 transition-colors {projectType === type.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
									>
										<input
											type="radio"
											name="projectType"
											value={type.value}
											bind:group={projectType}
											class="sr-only"
										/>
										<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border {projectType === type.value ? 'border-primary bg-primary/10' : 'border-border bg-card'}">
											<TypeIcon class="h-4 w-4 {projectType === type.value ? 'text-primary' : 'text-muted-foreground'}" />
										</div>
										<div class="flex-1">
											<span class="font-ui text-sm font-semibold tracking-wider">{type.label}</span>
											<p class="font-body mt-1 text-xs text-muted-foreground">{type.desc}</p>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Goals -->
						<div>
							<label for="goals" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PROJECT GOALS
							</label>
							<textarea
								id="goals"
								name="goals"
								bind:value={goals}
								rows="3"
								placeholder="What do you hope to achieve with this project? What does success look like?"
								class="font-body mt-2 w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
							></textarea>
						</div>

						<!-- Requirements -->
						<div>
							<label for="requirements" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								SPECIFIC REQUIREMENTS
							</label>
							<textarea
								id="requirements"
								name="requirements"
								bind:value={requirements}
								rows="3"
								placeholder="Any specific features, integrations, or technical requirements you know you need?"
								class="font-body mt-2 w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
							></textarea>
						</div>

						<!-- References -->
						<div>
							<label for="references" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								INSPIRATION / REFERENCES
							</label>
							<textarea
								id="references"
								name="references"
								bind:value={references}
								rows="2"
								placeholder="Links to websites, apps, or designs that inspire you (optional)"
								class="font-body mt-2 w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
							></textarea>
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
					<!-- Budget Range -->
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET RANGE</span>
						<div class="mt-4 space-y-2">
							{#each budgetRanges as range}
								<label
									class="group flex cursor-pointer items-center gap-3 border p-3 transition-colors {budgetRange === range.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
								>
									<input
										type="radio"
										name="budgetRange"
										value={range.value}
										bind:group={budgetRange}
										class="sr-only"
									/>
									<div class="flex h-5 w-5 flex-shrink-0 items-center justify-center border {budgetRange === range.value ? 'border-primary bg-primary' : 'border-border bg-background'}">
										{#if budgetRange === range.value}
											<div class="h-2 w-2 bg-background"></div>
										{/if}
									</div>
									<span class="font-ui text-xs tracking-wider">{range.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Timeline -->
					<div class="mt-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMELINE</span>
						<div class="mt-4 space-y-2">
							{#each timelines as t}
								<label
									class="group flex cursor-pointer items-center gap-3 border p-3 transition-colors {timeline === t.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
								>
									<input
										type="radio"
										name="timeline"
										value={t.value}
										bind:group={timeline}
										class="sr-only"
									/>
									<div class="flex h-5 w-5 flex-shrink-0 items-center justify-center border {timeline === t.value ? 'border-primary bg-primary' : 'border-border bg-background'}">
										{#if timeline === t.value}
											<div class="h-2 w-2 bg-background"></div>
										{/if}
									</div>
									<span class="font-ui text-xs tracking-wider">{t.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- What Happens Next -->
					<div class="mt-8 border border-border bg-card/50 p-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">WHAT HAPPENS NEXT?</span>
						<ol class="mt-4 space-y-3">
							<li class="flex items-start gap-3">
								<span class="font-mono text-xs text-primary">01</span>
								<p class="font-body text-xs text-muted-foreground">We'll review your request within 1-2 business days</p>
							</li>
							<li class="flex items-start gap-3">
								<span class="font-mono text-xs text-primary">02</span>
								<p class="font-body text-xs text-muted-foreground">Our team may reach out for clarification</p>
							</li>
							<li class="flex items-start gap-3">
								<span class="font-mono text-xs text-primary">03</span>
								<p class="font-body text-xs text-muted-foreground">You'll receive a detailed proposal with timeline & pricing</p>
							</li>
						</ol>
					</div>
				</div>

				<!-- Form Actions -->
				<div class="col-span-12 flex items-center justify-end gap-4 bg-card px-6 py-4 md:px-12 lg:px-16">
					<Button variant="outline" href="/app/projects" class="font-ui text-xs tracking-wider">
						CANCEL
					</Button>
					<Button type="submit" disabled={loading || data.organizations.length === 0} class="font-ui text-xs tracking-wider">
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							SUBMITTING...
						{:else}
							<Send class="mr-2 h-4 w-4" />
							SUBMIT REQUEST
						{/if}
					</Button>
				</div>
			</div>
		</section>
	</form>
</div>
