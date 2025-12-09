/**
 * Mobile-Optimized Form Components
 * 
 * Touch-friendly form inputs with proper sizing and spacing
 */

<script lang="ts" context="module">
	export interface FormFieldProps {
		label?: string;
		name: string;
		type?: string;
		value?: string | number;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		class?: string;
	}
</script>

<script lang="ts">
	import type { FormFieldProps } from './MobileForm.svelte';

	let {
		label,
		name,
		type = 'text',
		value = $bindable(''),
		placeholder,
		required = false,
		disabled = false,
		error,
		hint,
		class: className = ''
	}: FormFieldProps = $props();

	const inputId = `field-${name}`;
</script>

<div class="form-field {className}">
	{#if label}
		<label for={inputId} class="form-label">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	{#if type === 'textarea'}
		<textarea
			id={inputId}
			{name}
			bind:value
			{placeholder}
			{required}
			{disabled}
			class="form-textarea"
			class:error
			rows="4"
		></textarea>
	{:else if type === 'select'}
		<select
			id={inputId}
			{name}
			bind:value
			{required}
			{disabled}
			class="form-select"
			class:error
		>
			<slot />
		</select>
	{:else}
		<input
			id={inputId}
			{name}
			{type}
			bind:value
			{placeholder}
			{required}
			{disabled}
			class="form-input"
			class:error
		/>
	{/if}

	{#if hint && !error}
		<p class="form-hint">{hint}</p>
	{/if}

	{#if error}
		<p class="form-error">{error}</p>
	{/if}
</div>

<style>
	.form-field {
		margin-bottom: 1.25rem;
	}

	.form-label {
		display: block;
		font-size: 0.9375rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.form-input,
	.form-textarea,
	.form-select {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		color: #1f2937;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		transition: all 0.2s;
		-webkit-appearance: none;
		appearance: none;
	}

	/* Increase touch target size on mobile */
	@media (max-width: 768px) {
		.form-input,
		.form-textarea,
		.form-select {
			padding: 0.875rem 1rem;
			font-size: 1rem; /* Prevent zoom on iOS */
			min-height: 48px; /* Minimum touch target */
		}
	}

	.form-input:focus,
	.form-textarea:focus,
	.form-select:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.form-input:disabled,
	.form-textarea:disabled,
	.form-select:disabled {
		background: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}

	.form-input.error,
	.form-textarea.error,
	.form-select.error {
		border-color: #ef4444;
	}

	.form-input.error:focus,
	.form-textarea.error:focus,
	.form-select.error:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	.form-select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
		background-position: right 0.75rem center;
		background-repeat: no-repeat;
		background-size: 1.25em 1.25em;
		padding-right: 2.5rem;
	}

	.form-hint {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.form-error {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		color: #ef4444;
		font-weight: 500;
	}

	.form-textarea {
		resize: vertical;
		min-height: 100px;
	}
</style>
