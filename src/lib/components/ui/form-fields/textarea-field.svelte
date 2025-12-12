<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	/**
	 * TextareaField - Simple textarea field
	 */
	interface Props {
		/** Field name */
		name: string;
		/** Field label */
		label: string;
		/** Field value */
		value?: string;
		/** Placeholder text */
		placeholder?: string;
		/** Number of rows */
		rows?: number;
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
		placeholder,
		rows = 4,
		required = false,
		disabled = false,
		class: className = ''
	}: Props = $props();
</script>

<div class="space-y-2">
	<Label for={name}>{label}</Label>
	<Textarea 
		id={name} 
		{name} 
		bind:value 
		{placeholder}
		{rows}
		{required}
		{disabled}
		class={className} 
	/>
</div>
