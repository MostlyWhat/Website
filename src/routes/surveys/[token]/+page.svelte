<script lang="ts">
	import { enhance } from '$app/forms';
	import { Star, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data, form } = $props();

	let rating = $state(0);
	let hoverRating = $state(0);
	let responseTimeRating = $state(0);
	let resolutionQualityRating = $state(0);
	let staffProfessionalismRating = $state(0);
	let feedback = $state('');
	let wouldRecommend = $state<'yes' | 'no' | null>(null);

	function setRating(value: number) {
		rating = value;
	}

	function setOptionalRating(type: 'responseTime' | 'quality' | 'professionalism', value: number) {
		if (type === 'responseTime') responseTimeRating = value;
		else if (type === 'quality') resolutionQualityRating = value;
		else staffProfessionalismRating = value;
	}
</script>

<svelte:head>
	<title>Customer Satisfaction Survey</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
	<div class="mx-auto max-w-2xl px-4">
		{#if form?.success || data.completed}
			<!-- Thank You Message -->
			<div class="border border-border bg-background p-8 shadow-lg">
				<div class="text-center">
					<CheckCircle class="mx-auto h-16 w-16 text-green-500" />
					<h1 class="mt-4 font-display text-3xl font-medium text-foreground">
						Thank You!
					</h1>
					<p class="mt-2 text-muted-foreground">
						Your feedback has been successfully submitted and helps us improve our service.
					</p>
					{#if data.survey?.ticket}
						<p class="mt-4 text-sm text-muted-foreground">
							Regarding ticket <span class="font-mono">#{data.survey.ticket.ticketNumber}</span>
						</p>
					{/if}
				</div>
			</div>
		{:else if data.expired}
			<!-- Expired Message -->
			<div class="border border-border bg-background p-8 shadow-lg">
				<div class="text-center">
					<AlertCircle class="mx-auto h-16 w-16 text-orange-500" />
					<h1 class="mt-4 font-display text-3xl font-medium text-foreground">
						Survey Expired
					</h1>
					<p class="mt-2 text-muted-foreground">
						This survey link has expired. If you still wish to provide feedback, please contact our support team.
					</p>
				</div>
			</div>
		{:else}
			<!-- Survey Form -->
			<div class="border border-border bg-background p-8 shadow-lg">
				<div class="text-center mb-8">
					<h1 class="font-display text-3xl font-medium text-foreground">
						How was your experience?
					</h1>
					{#if data.survey?.ticket}
						<p class="mt-2 text-sm text-muted-foreground">
							Ticket <span class="font-mono">#{data.survey.ticket.ticketNumber}</span>: {data.survey.ticket.subject}
						</p>
					{/if}
					<p class="mt-2 text-muted-foreground">
						We'd love to hear your feedback about the support you received.
					</p>
				</div>

				{#if form?.error}
					<div class="mb-6 flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						<AlertCircle class="h-4 w-4" />
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/submit" use:enhance class="space-y-8">
					<!-- Overall Satisfaction -->
					<div>
						<label class="block font-medium text-foreground mb-3">
							Overall Satisfaction <span class="text-destructive">*</span>
						</label>
						<div class="flex items-center justify-center gap-2">
							{#each [1, 2, 3, 4, 5] as value}
								<button
									type="button"
									onclick={() => setRating(value)}
									onmouseenter={() => hoverRating = value}
									onmouseleave={() => hoverRating = 0}
									class="transition-transform hover:scale-110"
								>
									<Star 
										class={`h-12 w-12 ${
											value <= (hoverRating || rating) 
												? 'fill-yellow-400 text-yellow-400' 
												: 'text-muted-foreground'
										}`}
									/>
								</button>
							{/each}
						</div>
						<input type="hidden" name="rating" value={rating} />
						<p class="mt-2 text-center text-sm text-muted-foreground">
							{#if rating === 0}
								Click to rate
							{:else if rating === 1}
								Very Dissatisfied
							{:else if rating === 2}
								Dissatisfied
							{:else if rating === 3}
								Neutral
							{:else if rating === 4}
								Satisfied
							{:else}
								Very Satisfied
							{/if}
						</p>
					</div>

					<!-- Optional Ratings -->
					<div class="space-y-6 border-t border-border pt-6">
						<p class="text-sm text-muted-foreground text-center">
							Optional: Please rate specific aspects of your experience
						</p>

						<!-- Response Time -->
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">
								Response Time
							</label>
							<div class="flex items-center justify-center gap-1">
								{#each [1, 2, 3, 4, 5] as value}
									<button
										type="button"
										onclick={() => setOptionalRating('responseTime', value)}
										class="transition-transform hover:scale-110"
									>
										<Star 
											class={`h-8 w-8 ${
												value <= responseTimeRating
													? 'fill-yellow-400 text-yellow-400' 
													: 'text-muted-foreground'
											}`}
										/>
									</button>
								{/each}
							</div>
							{#if responseTimeRating > 0}
								<input type="hidden" name="responseTimeRating" value={responseTimeRating} />
							{/if}
						</div>

						<!-- Resolution Quality -->
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">
								Resolution Quality
							</label>
							<div class="flex items-center justify-center gap-1">
								{#each [1, 2, 3, 4, 5] as value}
									<button
										type="button"
										onclick={() => setOptionalRating('quality', value)}
										class="transition-transform hover:scale-110"
									>
										<Star 
											class={`h-8 w-8 ${
												value <= resolutionQualityRating
													? 'fill-yellow-400 text-yellow-400' 
													: 'text-muted-foreground'
											}`}
										/>
									</button>
								{/each}
							</div>
							{#if resolutionQualityRating > 0}
								<input type="hidden" name="resolutionQualityRating" value={resolutionQualityRating} />
							{/if}
						</div>

						<!-- Staff Professionalism -->
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">
								Staff Professionalism
							</label>
							<div class="flex items-center justify-center gap-1">
								{#each [1, 2, 3, 4, 5] as value}
									<button
										type="button"
										onclick={() => setOptionalRating('professionalism', value)}
										class="transition-transform hover:scale-110"
									>
										<Star 
											class={`h-8 w-8 ${
												value <= staffProfessionalismRating
													? 'fill-yellow-400 text-yellow-400' 
													: 'text-muted-foreground'
											}`}
										/>
									</button>
								{/each}
							</div>
							{#if staffProfessionalismRating > 0}
								<input type="hidden" name="staffProfessionalismRating" value={staffProfessionalismRating} />
							{/if}
						</div>
					</div>

					<!-- Would Recommend -->
					<div class="border-t border-border pt-6">
						<label class="block font-medium text-foreground mb-3">
							Would you recommend our service to others?
						</label>
						<div class="flex items-center justify-center gap-4">
							<button
								type="button"
								onclick={() => wouldRecommend = 'yes'}
								class={`flex items-center gap-2 px-6 py-3 border-2 transition-all ${
									wouldRecommend === 'yes'
										? 'border-green-500 bg-green-500/10 text-green-600'
										: 'border-border bg-card text-muted-foreground hover:border-green-500/50'
								}`}
							>
								<ThumbsUp class="h-5 w-5" />
								Yes
							</button>
							<button
								type="button"
								onclick={() => wouldRecommend = 'no'}
								class={`flex items-center gap-2 px-6 py-3 border-2 transition-all ${
									wouldRecommend === 'no'
										? 'border-red-500 bg-red-500/10 text-red-600'
										: 'border-border bg-card text-muted-foreground hover:border-red-500/50'
								}`}
							>
								<ThumbsDown class="h-5 w-5" />
								No
							</button>
						</div>
						{#if wouldRecommend}
							<input type="hidden" name="wouldRecommend" value={wouldRecommend} />
						{/if}
					</div>

					<!-- Feedback -->
					<div class="border-t border-border pt-6">
						<label for="feedback" class="block font-medium text-foreground mb-2">
							Additional Comments
						</label>
						<Textarea
							id="feedback"
							bind:value={feedback}
							name="feedback"
							placeholder="Tell us more about your experience (optional)..."
							rows={5}
							class="w-full resize-none"
						/>
						<p class="mt-1 text-xs text-muted-foreground">
							Your feedback helps us improve our service
						</p>
					</div>

					<!-- Submit Button -->
					<div class="flex justify-center pt-4">
						<Button 
							type="submit" 
							size="lg"
							disabled={rating === 0}
							class="px-8"
						>
							Submit Feedback
						</Button>
					</div>
				</form>
			</div>

			<!-- Privacy Notice -->
			<p class="mt-6 text-center text-xs text-muted-foreground">
				Your feedback is confidential and will only be used to improve our service quality.
			</p>
		{/if}
	</div>
</div>
