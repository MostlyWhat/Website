<script lang="ts">
	/**
	 * PhaseBadge - Displays the current project phase with icon and styling
	 */
	import type { ProjectPhase } from '$lib/server/db/schema';
	import { getPhaseConfig } from './phase-utils';
	import { cn } from '$lib/utils';

	interface Props {
		phase: ProjectPhase;
		size?: 'sm' | 'md' | 'lg';
		showNumber?: boolean;
		showLabel?: boolean;
		class?: string;
	}

	let {
		phase,
		size = 'md',
		showNumber = true,
		showLabel = true,
		class: className = ''
	}: Props = $props();

	const config = $derived(getPhaseConfig(phase));
	const PhaseIcon = $derived(config.icon);

	const sizeClasses = {
		sm: {
			container: 'px-2 py-0.5 gap-1',
			number: 'text-[8px]',
			icon: 'h-3 w-3',
			label: 'text-[10px]'
		},
		md: {
			container: 'px-2.5 py-1 gap-1.5',
			number: 'text-[10px]',
			icon: 'h-3.5 w-3.5',
			label: 'text-xs'
		},
		lg: {
			container: 'px-3 py-1.5 gap-2',
			number: 'text-xs',
			icon: 'h-4 w-4',
			label: 'text-sm'
		}
	};

	const sizes = $derived(sizeClasses[size]);
</script>

<span
	class={cn(
		'inline-flex items-center font-mono tracking-wider uppercase border',
		config.bgColor,
		config.borderColor,
		config.color,
		sizes.container,
		className
	)}
>
	{#if showNumber}
		<span class={cn('font-bold', sizes.number)}>{config.number}</span>
	{/if}
	<PhaseIcon class={sizes.icon} />
	{#if showLabel}
		<span class={sizes.label}>{config.label}</span>
	{/if}
</span>
