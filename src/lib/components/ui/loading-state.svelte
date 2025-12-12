<script lang="ts">
	import { Loader2 } from '@lucide/svelte';

	interface Props {
		/** Loading message */
		message?: string;
		/** Size of the spinner (sm, md, lg) */
		size?: 'sm' | 'md' | 'lg';
		/** Custom class for container */
		class?: string;
		/** Whether to show full screen overlay */
		fullScreen?: boolean;
	}

	let {
		message = 'Loading...',
		size = 'md',
		class: className = '',
		fullScreen = false
	}: Props = $props();

	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-8 w-8',
		lg: 'h-12 w-12'
	};

	const iconSize = sizeClasses[size];
</script>

{#if fullScreen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
		<div class="flex flex-col items-center gap-4">
			<Loader2 class="{iconSize} animate-spin text-primary" />
			{#if message}
				<p class="font-ui text-sm text-muted-foreground">{message}</p>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center py-12 {className}">
		<div class="flex flex-col items-center gap-4">
			<Loader2 class="{iconSize} animate-spin text-primary" />
			{#if message}
				<p class="font-ui text-sm text-muted-foreground">{message}</p>
			{/if}
		</div>
	</div>
{/if}
