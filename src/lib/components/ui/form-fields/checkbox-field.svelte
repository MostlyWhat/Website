<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	/**
	 * CheckboxField - Simple checkbox field
	 */
	interface Props {
		/** Field name */
		name: string;
		/** Field label */
		label: string;
		/** Checked state */
		checked?: boolean;
		/** Disabled state */
		disabled?: boolean;
		/** Custom class */
		class?: string;
	}

	let {
		name,
		label,
		checked = $bindable(false),
		disabled = false,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex items-center space-x-2 {className}">
	<Checkbox id={name} {name} bind:checked {disabled} />
	<Label for={name} class="text-sm font-normal cursor-pointer">
		{label}
	</Label>
</div>
