<script lang="ts">
	/**
	 * Tutorial Overlay Component
	 * 
	 * Shows a guided walkthrough for new users.
	 */
	import { tutorialStore } from '$lib/stores/tutorial.svelte';
	import { X, ArrowRight, ArrowLeft, Sparkles } from '@lucide/svelte';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';

	let highlightRect = $state<DOMRect | null>(null);
	let tooltipPosition = $state({ top: 0, left: 0 });
	let tooltipAlign = $state<'top' | 'bottom' | 'left' | 'right'>('bottom');

	// Update highlight position when step changes
	$effect(() => {
		if (!browser) return;
		
		const step = tutorialStore.currentStep;
		if (!step) {
			highlightRect = null;
			return;
		}

		tick().then(() => {
			if (step.element) {
				const element = document.querySelector(step.element);
				if (element) {
					const rect = element.getBoundingClientRect();
					highlightRect = rect;
					tooltipAlign = step.position ?? 'bottom';
					calculateTooltipPosition(rect, step.position ?? 'bottom');
				} else {
					highlightRect = null;
					centerTooltip();
				}
			} else {
				highlightRect = null;
				centerTooltip();
			}
		});
	});

	function calculateTooltipPosition(rect: DOMRect, position: 'top' | 'bottom' | 'left' | 'right') {
		const padding = 16;
		const tooltipWidth = 320;
		const tooltipHeight = 180;

		switch (position) {
			case 'top':
				tooltipPosition = {
					top: rect.top - tooltipHeight - padding,
					left: rect.left + rect.width / 2 - tooltipWidth / 2
				};
				break;
			case 'bottom':
				tooltipPosition = {
					top: rect.bottom + padding,
					left: rect.left + rect.width / 2 - tooltipWidth / 2
				};
				break;
			case 'left':
				tooltipPosition = {
					top: rect.top + rect.height / 2 - tooltipHeight / 2,
					left: rect.left - tooltipWidth - padding
				};
				break;
			case 'right':
				tooltipPosition = {
					top: rect.top + rect.height / 2 - tooltipHeight / 2,
					left: rect.right + padding
				};
				break;
		}

		// Keep tooltip within viewport
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		if (tooltipPosition.left < padding) {
			tooltipPosition.left = padding;
		}
		if (tooltipPosition.left + tooltipWidth > viewportWidth - padding) {
			tooltipPosition.left = viewportWidth - tooltipWidth - padding;
		}
		if (tooltipPosition.top < padding) {
			tooltipPosition.top = padding;
		}
		if (tooltipPosition.top + tooltipHeight > viewportHeight - padding) {
			tooltipPosition.top = viewportHeight - tooltipHeight - padding;
		}
	}

	function centerTooltip() {
		const tooltipWidth = 320;
		const tooltipHeight = 180;
		tooltipPosition = {
			top: window.innerHeight / 2 - tooltipHeight / 2,
			left: window.innerWidth / 2 - tooltipWidth / 2
		};
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (!tutorialStore.isActive) return;
		
		if (event.key === 'Escape') {
			tutorialStore.skip();
		} else if (event.key === 'ArrowRight' || event.key === 'Enter') {
			tutorialStore.next();
		} else if (event.key === 'ArrowLeft') {
			tutorialStore.previous();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if tutorialStore.isActive && tutorialStore.currentStep}
	<!-- Overlay backdrop -->
	<div class="fixed inset-0 z-[100] pointer-events-none">
		<!-- Dark overlay with cutout for highlighted element -->
		<svg class="absolute inset-0 h-full w-full">
			<defs>
				<mask id="tutorial-mask">
					<rect x="0" y="0" width="100%" height="100%" fill="white" />
					{#if highlightRect}
						<rect
							x={highlightRect.left - 8}
							y={highlightRect.top - 8}
							width={highlightRect.width + 16}
							height={highlightRect.height + 16}
							rx="4"
							fill="black"
						/>
					{/if}
				</mask>
			</defs>
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<rect
				x="0"
				y="0"
				width="100%"
				height="100%"
				fill="rgba(0, 0, 0, 0.7)"
				mask="url(#tutorial-mask)"
				class="pointer-events-auto cursor-pointer"
				role="button"
				tabindex="-1"
				onclick={() => tutorialStore.skip()}
			/>
		</svg>

		<!-- Highlight ring around element -->
		{#if highlightRect}
			<div
				class="absolute border-2 border-primary rounded shadow-lg shadow-primary/20 pointer-events-none animate-pulse"
				style="
					top: {highlightRect.top - 8}px;
					left: {highlightRect.left - 8}px;
					width: {highlightRect.width + 16}px;
					height: {highlightRect.height + 16}px;
				"
			></div>
		{/if}

		<!-- Tooltip -->
		<div
			class="absolute z-[101] w-80 pointer-events-auto"
			style="top: {tooltipPosition.top}px; left: {tooltipPosition.left}px;"
		>
			<div class="border border-border bg-card shadow-xl">
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-border px-4 py-3">
					<div class="flex items-center gap-2">
						<Sparkles class="h-4 w-4 text-primary" />
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
							STEP {tutorialStore.currentStepIndex + 1} OF {tutorialStore.totalSteps}
						</span>
					</div>
					<button
						onclick={() => tutorialStore.skip()}
						class="flex h-6 w-6 items-center justify-center border border-border bg-background transition-colors hover:bg-card"
						aria-label="Close tutorial"
					>
						<X class="h-3 w-3" />
					</button>
				</div>

				<!-- Content -->
				<div class="px-4 py-4">
					<h3 class="font-ui text-sm font-semibold tracking-wider">
						{tutorialStore.currentStep.title}
					</h3>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						{tutorialStore.currentStep.description}
					</p>
				</div>

				<!-- Progress bar -->
				<div class="mx-4 h-1 bg-border">
					<div 
						class="h-full bg-primary transition-all duration-300" 
						style="width: {tutorialStore.progress}%"
					></div>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-between border-t border-border px-4 py-3">
					<button
						onclick={() => tutorialStore.skip()}
						class="font-mono text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
					>
						SKIP TOUR
					</button>
					<div class="flex items-center gap-2">
						{#if tutorialStore.currentStepIndex > 0}
							<button
								onclick={() => tutorialStore.previous()}
								class="flex h-8 w-8 items-center justify-center border border-border bg-background transition-colors hover:bg-card"
								aria-label="Previous step"
							>
								<ArrowLeft class="h-4 w-4" />
							</button>
						{/if}
						<button
							onclick={() => tutorialStore.next()}
							class="flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
						>
							<span class="font-mono text-[10px] tracking-wider">
								{tutorialStore.currentStepIndex === tutorialStore.totalSteps - 1 ? 'FINISH' : 'NEXT'}
							</span>
							<ArrowRight class="h-3 w-3" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
