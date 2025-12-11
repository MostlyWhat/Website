<script lang="ts">
	// @ts-ignore - date-fns is installed
	import { format, differenceInDays, addDays, startOfWeek, endOfWeek } from 'date-fns';
	
	interface Milestone {
		id: string;
		title: string;
		status: string;
		dueDate: Date | null;
		completedAt: Date | null;
		weight: number;
	}

	interface Props {
		milestones: Milestone[];
		projectStartDate?: Date;
		projectEndDate?: Date;
	}

	let { milestones = [], projectStartDate, projectEndDate }: Props = $props();

	// Calculate the timeline range
	const timelineRange = $derived.by(() => {
		const dates = milestones
			.map(m => m.dueDate || m.completedAt)
			.filter(d => d !== null) as Date[];

		if (projectStartDate) dates.push(projectStartDate);
		if (projectEndDate) dates.push(projectEndDate);

		if (dates.length === 0) {
			// Default to current month
			const today = new Date();
			return {
				start: startOfWeek(today),
				end: endOfWeek(addDays(today, 30))
			};
		}

		const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
		const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

		return {
			start: startOfWeek(minDate),
			end: endOfWeek(addDays(maxDate, 7))
		};
	});

	const totalDays = $derived(differenceInDays(timelineRange.end, timelineRange.start));

	// Calculate position for a milestone
	function getMilestonePosition(milestone: Milestone) {
		const date = milestone.completedAt || milestone.dueDate;
		if (!date) return { left: 0, width: 2 };

		const daysSinceStart = differenceInDays(date, timelineRange.start);
		const leftPercent = (daysSinceStart / totalDays) * 100;

		return {
			left: leftPercent,
			width: 2 // 2% width for the milestone marker
		};
	}

	// Generate month markers
	const monthMarkers = $derived.by(() => {
		const markers: { label: string; position: number }[] = [];
		let currentDate = new Date(timelineRange.start);
		
		while (currentDate <= timelineRange.end) {
			const daysSinceStart = differenceInDays(currentDate, timelineRange.start);
			const position = (daysSinceStart / totalDays) * 100;
			
			markers.push({
				label: format(currentDate, 'MMM yyyy'),
				position
			});
			
			// Move to next month
			currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
		}
		
		return markers;
	});

	// Status colors
	function getStatusColor(status: string): string {
		switch (status) {
			case 'completed':
				return 'bg-green-500';
			case 'in_progress':
				return 'bg-blue-500';
			case 'on_hold':
				return 'bg-yellow-500';
			case 'cancelled':
				return 'bg-red-500';
			default:
				return 'bg-gray-400';
		}
	}

	function getStatusLabel(status: string): string {
		switch (status) {
			case 'completed':
				return 'Completed';
			case 'in_progress':
				return 'In Progress';
			case 'on_hold':
				return 'On Hold';
			case 'cancelled':
				return 'Cancelled';
			default:
				return 'Pending';
		}
	}
</script>

<div class="project-timeline">
	<!-- Timeline Header with Month Markers -->
	<div class="timeline-header">
		<div class="milestone-labels">
			<span class="text-sm font-semibold text-gray-700">Milestones</span>
		</div>
		<div class="timeline-scale">
			{#each monthMarkers as marker}
				<div class="month-marker" style="left: {marker.position}%">
					<span class="text-xs text-gray-600">{marker.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Milestone Rows -->
	<div class="timeline-body">
		{#each milestones as milestone (milestone.id)}
			{@const position = getMilestonePosition(milestone)}
			<div class="milestone-row">
				<div class="milestone-label">
					<div class="flex items-center gap-2">
						<span class="inline-block w-3 h-3 rounded-full {getStatusColor(milestone.status)}"></span>
						<span class="text-sm font-medium text-gray-900">{milestone.title}</span>
					</div>
					<span class="text-xs text-gray-500">
						{#if milestone.completedAt}
							Completed {format(milestone.completedAt, 'MMM d, yyyy')}
						{:else if milestone.dueDate}
							Due {format(milestone.dueDate, 'MMM d, yyyy')}
						{:else}
							No date set
						{/if}
					</span>
				</div>
				<div class="timeline-track">
					{#if position.left > 0}
						<div
							class="milestone-marker {getStatusColor(milestone.status)}"
							style="left: {position.left}%; width: {position.width}%"
							title="{milestone.title} - {getStatusLabel(milestone.status)}"
						>
							<span class="milestone-tooltip">
								{milestone.title}<br />
								{getStatusLabel(milestone.status)}<br />
								Weight: {milestone.weight}%
							</span>
						</div>
					{/if}
				</div>
			</div>
		{/each}

		{#if milestones.length === 0}
			<div class="text-center py-8 text-gray-500">
				No milestones defined yet
			</div>
		{/if}
	</div>
</div>

<style>
	.project-timeline {
		width: 100%;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.timeline-header {
		display: grid;
		grid-template-columns: 280px 1fr;
		border-bottom: 2px solid #e5e7eb;
		background: #f9fafb;
	}

	.milestone-labels {
		padding: 1rem;
		border-right: 1px solid #e5e7eb;
	}

	.timeline-scale {
		position: relative;
		height: 3rem;
		background: #f9fafb;
	}

	.month-marker {
		position: absolute;
		top: 0;
		transform: translateX(-50%);
		padding: 0.5rem;
		border-left: 1px solid #d1d5db;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.timeline-body {
		max-height: 600px;
		overflow-y: auto;
	}

	.milestone-row {
		display: grid;
		grid-template-columns: 280px 1fr;
		border-bottom: 1px solid #e5e7eb;
		min-height: 60px;
	}

	.milestone-row:hover {
		background: #f9fafb;
	}

	.milestone-label {
		padding: 1rem;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		justify-content: center;
	}

	.timeline-track {
		position: relative;
		background: linear-gradient(to right, #f3f4f6 0%, #f3f4f6 100%);
		background-size: 7.14% 100%; /* 14 columns for 2 weeks */
		background-position: 0 0;
	}

	.milestone-marker {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 24px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.milestone-marker:hover {
		height: 32px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.milestone-tooltip {
		display: none;
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background: #1f2937;
		color: white;
		padding: 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		white-space: nowrap;
		margin-bottom: 0.5rem;
		z-index: 10;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
	}

	.milestone-marker:hover .milestone-tooltip {
		display: block;
	}

	.milestone-tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: #1f2937;
	}
</style>
