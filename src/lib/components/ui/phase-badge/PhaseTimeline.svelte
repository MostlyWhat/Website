<script lang="ts">
	/**
	 * PhaseTimeline - Visual progress bar showing all phases
	 */
	import type { ProjectPhase } from '$lib/server/db/schema';
	import { PHASES_ORDER, getPhaseConfig, isPhaseComplete, isPhaseActive } from './phase-utils';
	import { cn } from '$lib/utils';

	interface Props {
		currentPhase: ProjectPhase;
		compact?: boolean;
		class?: string;
	}

	let {
		currentPhase,
		compact = false,
		class: className = ''
	}: Props = $props();
</script>

{#if compact}
	<!-- Compact: Just dots/numbers -->
	<div class={cn('flex items-center gap-1', className)}>
		{#each PHASES_ORDER as phase, index (phase)}
			{@const config = getPhaseConfig(phase)}
			{@const isComplete = isPhaseComplete(currentPhase, phase)}
			{@const isActive = isPhaseActive(currentPhase, phase)}
			
			<div
				class={cn(
					'flex h-6 w-6 items-center justify-center font-mono text-[10px] font-bold transition-all',
					isComplete && 'bg-green-500/20 text-green-500 border border-green-500/30',
					isActive && cn(config.bgColor, config.color, 'border', config.borderColor),
					!isComplete && !isActive && 'bg-muted text-muted-foreground border border-border'
				)}
				title={config.label}
			>
				{config.number}
			</div>
			
			{#if index < PHASES_ORDER.length - 1}
				<div
					class={cn(
						'h-0.5 w-4 transition-colors',
						isComplete ? 'bg-green-500/50' : 'bg-border'
					)}
				></div>
			{/if}
		{/each}
	</div>
{:else}
	<!-- Full: With labels -->
	<div class={cn('flex items-center', className)}>
		{#each PHASES_ORDER as phase, index (phase)}
			{@const config = getPhaseConfig(phase)}
			{@const PhaseIcon = config.icon}
			{@const isComplete = isPhaseComplete(currentPhase, phase)}
			{@const isActive = isPhaseActive(currentPhase, phase)}
			
			<div class="flex flex-col items-center">
				<!-- Icon/Number Circle -->
				<div
					class={cn(
						'relative flex h-10 w-10 items-center justify-center border-2 transition-all',
						isComplete && 'border-green-500 bg-green-500/10',
						isActive && cn('border-current', config.bgColor, config.color),
						!isComplete && !isActive && 'border-border bg-muted'
					)}
				>
					{#if isComplete}
						<svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					{:else}
						<PhaseIcon
							class={cn(
								'h-4 w-4',
								isActive ? config.color : 'text-muted-foreground'
							)}
						/>
					{/if}
					
					<!-- Phase Number Badge -->
					<span
						class={cn(
							'absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center font-mono text-[8px] font-bold',
							isComplete && 'bg-green-500 text-white',
							isActive && cn(config.color.replace('text-', 'bg-'), 'text-white'),
							!isComplete && !isActive && 'bg-muted-foreground text-background'
						)}
					>
						{config.number}
					</span>
				</div>
				
				<!-- Label -->
				<span
					class={cn(
						'mt-2 font-mono text-[10px] tracking-wider uppercase',
						isComplete && 'text-green-500',
						isActive && config.color,
						!isComplete && !isActive && 'text-muted-foreground'
					)}
				>
					{config.label}
				</span>
			</div>
			
			{#if index < PHASES_ORDER.length - 1}
				<!-- Connector Line -->
				<div
					class={cn(
						'mx-2 mt-[-1.25rem] h-0.5 flex-1 transition-colors',
						isComplete ? 'bg-green-500' : 'bg-border'
					)}
				></div>
			{/if}
		{/each}
	</div>
{/if}
