<script lang="ts">
	/**
	 * DatePicker - A date picker component with a nice calendar popover
	 */
	import { cn } from '$lib/utils';
	import { Calendar as CalendarIcon } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { CalendarDate as CalDate, type DateValue } from '@internationalized/date';

	interface Props {
		value: string;
		onchange: (date: string) => void;
		placeholder?: string;
		disabled?: boolean;
		min?: string;
		max?: string;
		name?: string;
		class?: string;
	}

	let {
		value = '',
		onchange,
		placeholder = 'Select date',
		disabled = false,
		min,
		max,
		name,
		class: className = ''
	}: Props = $props();

	let open = $state(false);

	// Convert string date to DateValue for calendar
	let calendarValue = $state<DateValue | undefined>(undefined);

	$effect(() => {
		if (!value) {
			calendarValue = undefined;
			return;
		}
		try {
			// Parse ISO date string (YYYY-MM-DD)
			const [year, month, day] = value.split('-').map(Number);
			if (year && month && day) {
				calendarValue = new CalDate(year, month, day);
			}
		} catch {
			calendarValue = undefined;
		}
	});

	// Convert DateValue back to string when selected
	function handleValueChange(date: DateValue | undefined) {
		if (!date) {
			onchange('');
			return;
		}
		// Format as YYYY-MM-DD
		const year = date.year.toString().padStart(4, '0');
		const month = date.month.toString().padStart(2, '0');
		const day = date.day.toString().padStart(2, '0');
		onchange(`${year}-${month}-${day}`);
		open = false;
	}

	// Format date for display
	function formatDisplayDate(dateStr: string): string {
		if (!dateStr) return '';
		try {
			const date = new Date(dateStr + 'T00:00:00');
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}
</script>

<!-- Hidden input for form submission -->
{#if name}
	<input type="hidden" {name} {value} />
{/if}

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class={cn(
					'w-full justify-start text-left font-normal',
					!value && 'text-muted-foreground',
					className
				)}
				{disabled}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{#if value}
					{formatDisplayDate(value)}
				{:else}
					<span class="text-muted-foreground">{placeholder}</span>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar
			type="single"
			bind:value={calendarValue}
			onValueChange={handleValueChange}
			captionLayout="dropdown"
			initialFocus
		/>
	</Popover.Content>
</Popover.Root>
