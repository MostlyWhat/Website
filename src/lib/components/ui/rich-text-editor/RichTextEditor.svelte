<script lang="ts">
	/**
	 * Rich Text Editor Component
	 * 
	 * A markdown-based rich text editor with toolbar for common formatting operations.
	 * Uses textarea with markdown syntax but provides visual toolbar buttons.
	 */
	import {
		Bold,
		Italic,
		Strikethrough,
		List,
		ListOrdered,
		Heading1,
		Heading2,
		Heading3,
		Link,
		Image,
		Code,
		Quote,
		Minus,
		Eye,
		Pencil
	} from '@lucide/svelte';
	import { marked } from 'marked';

	interface Props {
		value?: string;
		name?: string;
		placeholder?: string;
		rows?: number;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		id?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		name = '',
		placeholder = 'Write your content here...',
		rows = 12,
		required = false,
		disabled = false,
		class: className = '',
		id = '',
		onchange
	}: Props = $props();

	let textarea = $state<HTMLTextAreaElement | null>(null);
	let showPreview = $state(false);

	// Parse markdown to HTML for preview
	const previewHtml = $derived.by(() => {
		if (!value) return '<p class="text-muted-foreground">Nothing to preview</p>';
		try {
			return marked.parse(value) as string;
		} catch {
			return '<p class="text-destructive">Error parsing markdown</p>';
		}
	});

	function insertAtCursor(before: string, after: string = '', placeholder: string = '') {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = value.substring(start, end);
		const textToInsert = selectedText || placeholder;
		
		const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
		value = newText;
		onchange?.(value);

		// Restore cursor position
		setTimeout(() => {
			if (!textarea) return;
			textarea.focus();
			const newCursorPos = start + before.length + textToInsert.length;
			textarea.setSelectionRange(
				start + before.length,
				start + before.length + textToInsert.length
			);
		}, 0);
	}

	function insertAtLineStart(prefix: string) {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const lineStart = value.lastIndexOf('\n', start - 1) + 1;
		
		const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
		value = newText;
		onchange?.(value);

		setTimeout(() => {
			if (!textarea) return;
			textarea.focus();
			textarea.setSelectionRange(start + prefix.length, start + prefix.length);
		}, 0);
	}

	function handleBold() {
		insertAtCursor('**', '**', 'bold text');
	}

	function handleItalic() {
		insertAtCursor('*', '*', 'italic text');
	}

	function handleStrikethrough() {
		insertAtCursor('~~', '~~', 'strikethrough');
	}

	function handleHeading1() {
		insertAtLineStart('# ');
	}

	function handleHeading2() {
		insertAtLineStart('## ');
	}

	function handleHeading3() {
		insertAtLineStart('### ');
	}

	function handleBulletList() {
		insertAtLineStart('- ');
	}

	function handleNumberedList() {
		insertAtLineStart('1. ');
	}

	function handleLink() {
		insertAtCursor('[', '](url)', 'link text');
	}

	function handleImage() {
		insertAtCursor('![', '](image-url)', 'alt text');
	}

	function handleCode() {
		const start = textarea?.selectionStart ?? 0;
		const end = textarea?.selectionEnd ?? 0;
		const selectedText = value.substring(start, end);
		
		if (selectedText.includes('\n')) {
			insertAtCursor('```\n', '\n```', 'code block');
		} else {
			insertAtCursor('`', '`', 'code');
		}
	}

	function handleQuote() {
		insertAtLineStart('> ');
	}

	function handleHorizontalRule() {
		const start = textarea?.selectionStart ?? 0;
		const needsNewline = start > 0 && value[start - 1] !== '\n';
		insertAtCursor(needsNewline ? '\n---\n' : '---\n', '');
	}

	const toolbarButtons = [
		{ icon: Bold, action: handleBold, title: 'Bold (Ctrl+B)' },
		{ icon: Italic, action: handleItalic, title: 'Italic (Ctrl+I)' },
		{ icon: Strikethrough, action: handleStrikethrough, title: 'Strikethrough' },
		{ divider: true },
		{ icon: Heading1, action: handleHeading1, title: 'Heading 1' },
		{ icon: Heading2, action: handleHeading2, title: 'Heading 2' },
		{ icon: Heading3, action: handleHeading3, title: 'Heading 3' },
		{ divider: true },
		{ icon: List, action: handleBulletList, title: 'Bullet List' },
		{ icon: ListOrdered, action: handleNumberedList, title: 'Numbered List' },
		{ divider: true },
		{ icon: Link, action: handleLink, title: 'Link' },
		{ icon: Image, action: handleImage, title: 'Image' },
		{ icon: Code, action: handleCode, title: 'Code' },
		{ icon: Quote, action: handleQuote, title: 'Quote' },
		{ icon: Minus, action: handleHorizontalRule, title: 'Horizontal Rule' }
	];

	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) {
			switch (e.key.toLowerCase()) {
				case 'b':
					e.preventDefault();
					handleBold();
					break;
				case 'i':
					e.preventDefault();
					handleItalic();
					break;
			}
		}
	}
</script>

<div class="border border-border bg-background {className}">
	<!-- Toolbar -->
	<div class="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5 flex-wrap">
		{#each toolbarButtons as button}
			{#if 'divider' in button && button.divider}
				<div class="h-5 w-px bg-border mx-1"></div>
			{:else if 'icon' in button}
				<button
					type="button"
					onclick={button.action}
					title={button.title}
					disabled={disabled || showPreview}
					class="flex h-8 w-8 items-center justify-center rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<button.icon class="h-4 w-4" />
				</button>
			{/if}
		{/each}

		<div class="flex-1"></div>

		<!-- Preview Toggle -->
		<button
			type="button"
			onclick={() => (showPreview = !showPreview)}
			title={showPreview ? 'Edit' : 'Preview'}
			class="flex h-8 items-center gap-1.5 rounded px-2 hover:bg-muted transition-colors {showPreview ? 'bg-primary/10 text-primary' : ''}"
		>
			{#if showPreview}
				<Pencil class="h-4 w-4" />
				<span class="font-mono text-[10px] tracking-wider">EDIT</span>
			{:else}
				<Eye class="h-4 w-4" />
				<span class="font-mono text-[10px] tracking-wider">PREVIEW</span>
			{/if}
		</button>
	</div>

	<!-- Editor / Preview -->
	{#if showPreview}
		<div 
			class="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] overflow-auto"
			style="min-height: {rows * 1.5}rem"
		>
			{@html previewHtml}
		</div>
	{:else}
		<textarea
			bind:this={textarea}
			bind:value
			{name}
			{id}
			{placeholder}
			{rows}
			{required}
			{disabled}
			onkeydown={handleKeydown}
			oninput={() => onchange?.(value)}
			class="font-mono w-full resize-y bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		></textarea>
	{/if}
</div>

<style>
	:global(.prose h1) {
		font-size: 1.25rem;
		font-weight: 700;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose h2) {
		font-size: 1.125rem;
		font-weight: 700;
		margin-top: 0.75rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose h3) {
		font-size: 1rem;
		font-weight: 600;
		margin-top: 0.5rem;
		margin-bottom: 0.25rem;
	}
	:global(.prose p) {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose ul),
	:global(.prose ol) {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		padding-left: 1.5rem;
	}
	:global(.prose li) {
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
	}
	:global(.prose blockquote) {
		border-left-width: 4px;
		border-color: hsl(var(--muted));
		padding-left: 1rem;
		font-style: italic;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose code) {
		background-color: hsl(var(--muted));
		padding-left: 0.375rem;
		padding-right: 0.375rem;
		padding-top: 0.125rem;
		padding-bottom: 0.125rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	}
	:global(.prose pre) {
		background-color: hsl(var(--muted));
		padding: 1rem;
		border-radius: 0.25rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		overflow-x: auto;
	}
	:global(.prose pre code) {
		background-color: transparent;
		padding: 0;
	}
	:global(.prose a) {
		color: hsl(var(--primary));
		text-decoration: underline;
	}
	:global(.prose hr) {
		border-color: hsl(var(--border));
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
