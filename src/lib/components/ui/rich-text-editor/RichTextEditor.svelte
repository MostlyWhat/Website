<script lang="ts">
	/**
	 * Rich Text Editor Component
	 *
	 * A markdown-based rich text editor with toolbar for common formatting operations.
	 * Uses textarea with markdown syntax but provides visual toolbar buttons.
	 * Supports drag-and-drop image uploads.
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
		Pencil,
		Upload,
		Table,
		CheckSquare,
		AlertCircle,
		Info,
		Lightbulb,
		Undo,
		Redo
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
	let isDragging = $state(false);
	let isUploading = $state(false);

	// History for undo/redo
	let history = $state<string[]>([]);
	let historyIndex = $state(-1);
	let isHistoryChange = $state(false);

	// Initialize history
	$effect(() => {
		if (!isHistoryChange && value !== history[historyIndex]) {
			// Trim future history when making new changes
			history = history.slice(0, historyIndex + 1);
			history.push(value);
			historyIndex = history.length - 1;

			// Keep history manageable
			if (history.length > 50) {
				history = history.slice(-50);
				historyIndex = history.length - 1;
			}
		}
		isHistoryChange = false;
	});

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
			textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
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

	function handleTaskList() {
		insertAtLineStart('- [ ] ');
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

	function handleTable() {
		const table = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
		insertAtCursor(table, '');
	}

	function handleInfoBlock() {
		insertAtCursor('\n> ℹ️ **Info**: ', '\n', 'Your information here');
	}

	function handleWarningBlock() {
		insertAtCursor('\n> ⚠️ **Warning**: ', '\n', 'Your warning here');
	}

	function handleTipBlock() {
		insertAtCursor('\n> 💡 **Tip**: ', '\n', 'Your tip here');
	}

	function handleUndo() {
		if (historyIndex > 0) {
			isHistoryChange = true;
			historyIndex--;
			value = history[historyIndex];
			onchange?.(value);
		}
	}

	function handleRedo() {
		if (historyIndex < history.length - 1) {
			isHistoryChange = true;
			historyIndex++;
			value = history[historyIndex];
			onchange?.(value);
		}
	}

	const toolbarButtons = [
		{ icon: Undo, action: handleUndo, title: 'Undo (Ctrl+Z)', disabled: () => historyIndex <= 0 },
		{ icon: Redo, action: handleRedo, title: 'Redo (Ctrl+Y)', disabled: () => historyIndex >= history.length - 1 },
		{ divider: true },
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
		{ icon: CheckSquare, action: handleTaskList, title: 'Task List' },
		{ divider: true },
		{ icon: Link, action: handleLink, title: 'Link' },
		{ icon: Image, action: handleImage, title: 'Image' },
		{ icon: Code, action: handleCode, title: 'Code' },
		{ icon: Quote, action: handleQuote, title: 'Quote' },
		{ icon: Table, action: handleTable, title: 'Table' },
		{ icon: Minus, action: handleHorizontalRule, title: 'Horizontal Rule' },
		{ divider: true },
		{ icon: Info, action: handleInfoBlock, title: 'Info Block' },
		{ icon: AlertCircle, action: handleWarningBlock, title: 'Warning Block' },
		{ icon: Lightbulb, action: handleTipBlock, title: 'Tip Block' }
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
				case 'z':
					e.preventDefault();
					handleUndo();
					break;
				case 'y':
					e.preventDefault();
					handleRedo();
					break;
			}
		}
	}

	// Drag and drop handlers
	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (!files || files.length === 0) return;

		for (const file of files) {
			if (file.type.startsWith('image/')) {
				await uploadImage(file);
			}
		}
	}

	async function uploadImage(file: File) {
		isUploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = (await response.json()) as { url?: string };
			if (data.url) {
				insertAtCursor(`![${file.name}](${data.url})`, '\n');
			}
		} catch (error) {
			console.error('Failed to upload image:', error);
			// Fall back to placeholder
			insertAtCursor(`![${file.name}](`, ')', 'paste-url-here');
		} finally {
			isUploading = false;
		}
	}

	function handlePaste(e: ClipboardEvent) {
		const items = e.clipboardData?.items;
		if (!items) return;

		for (const item of items) {
			if (item.type.startsWith('image/')) {
				e.preventDefault();
				const file = item.getAsFile();
				if (file) {
					uploadImage(file);
				}
				break;
			}
		}
	}
</script>

<div
	class="border border-border bg-background {className} relative"
	class:border-primary={isDragging}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	role="application"
	aria-label="Rich text editor with drag and drop support"
>
	<!-- Drag Overlay -->
	{#if isDragging}
		<div
			class="absolute inset-0 z-10 flex items-center justify-center bg-background/90 backdrop-blur-sm"
		>
			<div class="flex flex-col items-center gap-2 text-primary">
				<Upload class="h-8 w-8" />
				<span class="font-mono text-sm tracking-wider">DROP IMAGE TO UPLOAD</span>
			</div>
		</div>
	{/if}

	<!-- Upload Progress -->
	{#if isUploading}
		<div
			class="absolute inset-0 z-10 flex items-center justify-center bg-background/90 backdrop-blur-sm"
		>
			<div class="flex flex-col items-center gap-2 text-muted-foreground">
				<div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
				></div>
				<span class="font-mono text-sm tracking-wider">UPLOADING...</span>
			</div>
		</div>
	{/if}

	<!-- Toolbar -->
	<div class="flex items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5 flex-wrap">
		{#each toolbarButtons as button}
			{#if 'divider' in button && button.divider}
				<div class="h-5 w-px bg-border mx-0.5"></div>
			{:else if 'icon' in button}
				<button
					type="button"
					onclick={button.action}
					title={button.title}
					disabled={disabled || showPreview || ('disabled' in button && button.disabled?.())}
					class="flex h-7 w-7 items-center justify-center rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<button.icon class="h-3.5 w-3.5" />
				</button>
			{/if}
		{/each}

		<div class="flex-1"></div>

		<!-- Image Upload Button -->
		<label
			class="flex h-7 items-center gap-1.5 rounded px-2 hover:bg-muted transition-colors cursor-pointer {disabled || showPreview ? 'opacity-50 cursor-not-allowed' : ''}"
			title="Upload Image"
		>
			<Upload class="h-3.5 w-3.5" />
			<span class="font-mono text-[10px] tracking-wider hidden sm:inline">UPLOAD</span>
			<input
				type="file"
				accept="image/*"
				class="sr-only"
				disabled={disabled || showPreview}
				onchange={(e) => {
					const file = e.currentTarget.files?.[0];
					if (file) uploadImage(file);
				}}
			/>
		</label>

		<!-- Preview Toggle -->
		<button
			type="button"
			onclick={() => (showPreview = !showPreview)}
			title={showPreview ? 'Edit' : 'Preview'}
			class="flex h-7 items-center gap-1.5 rounded px-2 hover:bg-muted transition-colors {showPreview
				? 'bg-primary/10 text-primary'
				: ''}"
		>
			{#if showPreview}
				<Pencil class="h-3.5 w-3.5" />
				<span class="font-mono text-[10px] tracking-wider">EDIT</span>
			{:else}
				<Eye class="h-3.5 w-3.5" />
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
			onpaste={handlePaste}
			oninput={() => onchange?.(value)}
			class="font-mono w-full resize-y bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		></textarea>
	{/if}

	<!-- Helper text -->
	<div
		class="flex items-center justify-between border-t border-border bg-muted/20 px-3 py-1.5 text-[10px] text-muted-foreground"
	>
		<span class="font-mono">Markdown supported • Drag & drop images</span>
		<span class="font-mono">{value.length} characters</span>
	</div>
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
	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose th),
	:global(.prose td) {
		border: 1px solid hsl(var(--border));
		padding: 0.5rem;
		text-align: left;
	}
	:global(.prose th) {
		background-color: hsl(var(--muted));
		font-weight: 600;
	}
	:global(.prose input[type='checkbox']) {
		margin-right: 0.5rem;
	}
	:global(.prose img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.25rem;
	}
</style>
