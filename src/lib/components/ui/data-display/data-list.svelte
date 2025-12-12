<script lang="ts">
	/**
	 * DataList - Display key-value pairs in a consistent format
	 * Simple, reusable component for displaying data
	 */
	interface DataItem {
		label: string;
		value: string | number | null | undefined;
		badge?: boolean;
	}

	interface Props {
		/** Array of data items to display */
		items: DataItem[];
		/** Layout orientation */
		orientation?: 'vertical' | 'horizontal';
		/** Custom class */
		class?: string;
	}

	let {
		items,
		orientation = 'vertical',
		class: className = ''
	}: Props = $props();
</script>

{#if orientation === 'vertical'}
	<dl class="space-y-3 {className}">
		{#each items as item}
			<div class="flex flex-col gap-1">
				<dt class="text-sm font-medium text-muted-foreground">{item.label}</dt>
				<dd class="text-sm">
					{#if item.badge}
						<span class="inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-xs">
							{item.value || '—'}
						</span>
					{:else}
						{item.value || '—'}
					{/if}
				</dd>
			</div>
		{/each}
	</dl>
{:else}
	<dl class="grid grid-cols-2 gap-4 {className}">
		{#each items as item}
			<div class="flex flex-col gap-1">
				<dt class="text-sm font-medium text-muted-foreground">{item.label}</dt>
				<dd class="text-sm">
					{#if item.badge}
						<span class="inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-xs">
							{item.value || '—'}
						</span>
					{:else}
						{item.value || '—'}
					{/if}
				</dd>
			</div>
		{/each}
	</dl>
{/if}
