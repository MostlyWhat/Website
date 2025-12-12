<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		name: string;
		label: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'tel' | 'url';
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
	}

	let {
		name,
		label,
		value = $bindable(''),
		type = 'text',
		placeholder,
		required = false,
		disabled = false,
		class: className = ''
	}: Props = $props();
</script>

<div class="space-y-2">
	<Label for={name}>{label}</Label>
	<Input 
		id={name} 
		{name} 
		{type}
		bind:value 
		{placeholder}
		{required}
		{disabled}
		class={className} 
	/>
</div>
