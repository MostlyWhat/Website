<script lang="ts">
	import { Label } from '$lib/components/ui/label';

	/**
	 * SelectField - Simple native select field
	 */
	interface Option {
		label: string;
		value: string | number;
	}

	interface Props {
		/** Field name */
		name: string;
		/** Field label */
		label: string;
		/** Field value */
		value?: string;
		/** Available options */
		options: Option[];
		/** Placeholder option */
		placeholder?: string;
		/** Required field */
		required?: boolean;
		/** Disabled state */
		disabled?: boolean;
		/** Custom class */
		class?: string;
	}

	let {
		name,
		label,
		value = $bindable(''),
		options,
		placeholder = 'Select an option',
		required = false,
		disabled = false,
		class: className = ''
	}: Props = $props();
</script>

<div class="space-y-2">
	<Label for={name}>{label}</Label>
	<select 
		id={name} 
		{name} 
		bind:value 
		{required}
		{disabled}
		class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {className}"
	>
		{#if placeholder}
			<option value="" disabled selected={!value}>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={String(option.value)}>
				{option.label}
			</option>
		{/each}
	</select>
</div>
