/**
 * Responsive Table Component
 * 
 * Automatically converts to cards on mobile devices
 */

<script lang="ts">
	interface Column {
		key: string;
		label: string;
		mobileLabel?: string; // Optional different label for mobile
		align?: 'left' | 'center' | 'right';
		width?: string;
		priority?: 'high' | 'medium' | 'low'; // high = always show, medium = hide on small screens, low = hide on mobile
	}

	interface Props {
		columns: Column[];
		data: any[];
		keyField?: string;
		emptyMessage?: string;
		mobileCardMode?: boolean; // If true, show as cards on mobile instead of hiding columns
	}

	let {
		columns = [],
		data = [],
		keyField = 'id',
		emptyMessage = 'No data available',
		mobileCardMode = true
	}: Props = $props();

	const highPriorityColumns = $derived(columns.filter((c) => c.priority === 'high' || !c.priority));
	const mediumPriorityColumns = $derived(columns.filter((c) => c.priority === 'medium'));
	const lowPriorityColumns = $derived(columns.filter((c) => c.priority === 'low'));
</script>

<div class="responsive-table-wrapper">
	{#if mobileCardMode}
		<!-- Mobile Card View -->
		<div class="mobile-cards lg:hidden">
			{#if data.length === 0}
				<div class="empty-state">{emptyMessage}</div>
			{:else}
				{#each data as item (item[keyField])}
					<div class="mobile-card">
						{#each columns as column}
							<div class="card-row">
								<span class="card-label">{column.mobileLabel || column.label}:</span>
								<span class="card-value">
									<slot name="cell" {column} {item}>
										{item[column.key] ?? '-'}
									</slot>
								</span>
							</div>
						{/each}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Desktop Table View -->
		<div class="desktop-table hidden lg:block overflow-x-auto">
			<table class="data-table">
				<thead>
					<tr>
						{#each columns as column}
							<th class="text-{column.align || 'left'}" style:width={column.width}>
								{column.label}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#if data.length === 0}
						<tr>
							<td colspan={columns.length} class="text-center py-8 text-gray-500">
								{emptyMessage}
							</td>
						</tr>
					{:else}
						{#each data as item (item[keyField])}
							<tr>
								{#each columns as column}
									<td class="text-{column.align || 'left'}">
										<slot name="cell" {column} {item}>
											{item[column.key] ?? '-'}
										</slot>
									</td>
								{/each}
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	{:else}
		<!-- Responsive Table with Hidden Columns -->
		<div class="overflow-x-auto">
			<table class="data-table">
				<thead>
					<tr>
						{#each highPriorityColumns as column}
							<th class="text-{column.align || 'left'}" style:width={column.width}>
								{column.label}
							</th>
						{/each}
						{#each mediumPriorityColumns as column}
							<th class="hidden md:table-cell text-{column.align || 'left'}" style:width={column.width}>
								{column.label}
							</th>
						{/each}
						{#each lowPriorityColumns as column}
							<th class="hidden lg:table-cell text-{column.align || 'left'}" style:width={column.width}>
								{column.label}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#if data.length === 0}
						<tr>
							<td colspan={columns.length} class="text-center py-8 text-gray-500">
								{emptyMessage}
							</td>
						</tr>
					{:else}
						{#each data as item (item[keyField])}
							<tr>
								{#each highPriorityColumns as column}
									<td class="text-{column.align || 'left'}">
										<slot name="cell" {column} {item}>
											{item[column.key] ?? '-'}
										</slot>
									</td>
								{/each}
								{#each mediumPriorityColumns as column}
									<td class="hidden md:table-cell text-{column.align || 'left'}">
										<slot name="cell" {column} {item}>
											{item[column.key] ?? '-'}
										</slot>
									</td>
								{/each}
								{#each lowPriorityColumns as column}
									<td class="hidden lg:table-cell text-{column.align || 'left'}">
										<slot name="cell" {column} {item}>
											{item[column.key] ?? '-'}
										</slot>
									</td>
								{/each}
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.responsive-table-wrapper {
		width: 100%;
	}

	.mobile-cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.mobile-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.card-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f3f4f6;
		gap: 1rem;
	}

	.card-row:last-child {
		border-bottom: none;
	}

	.card-label {
		font-weight: 600;
		color: #4b5563;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.card-value {
		color: #1f2937;
		font-size: 0.875rem;
		text-align: right;
		word-break: break-word;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		font-size: 0.875rem;
	}

	.data-table thead {
		background: #f9fafb;
		border-bottom: 2px solid #e5e7eb;
	}

	.data-table th {
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: #374151;
		text-align: left;
		white-space: nowrap;
	}

	.data-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #f3f4f6;
		color: #1f2937;
	}

	.data-table tbody tr:hover {
		background: #f9fafb;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: #6b7280;
		font-size: 0.9375rem;
	}

	/* Ensure table is scrollable on small screens */
	@media (max-width: 640px) {
		.data-table {
			font-size: 0.8125rem;
		}

		.data-table th,
		.data-table td {
			padding: 0.5rem;
		}
	}
</style>
