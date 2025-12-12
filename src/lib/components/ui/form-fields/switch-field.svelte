<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';

	/**
	 * SwitchField - Simple switch/toggle field
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

<div class="flex items-center justify-between {className}">
	<Label for={name} class="text-sm font-normal">
		{label}
	</Label>
	<Switch id={name} {name} bind:checked {disabled} />
</div>
