<script lang="ts">
	/**
	 * File Uploader Component
	 * 
	 * A reusable component for uploading files to the server.
	 * Supports drag & drop, file preview, and progress indication.
	 */
	import { Paperclip, X, Upload, File, Image, FileText, Loader2, AlertCircle } from '@lucide/svelte';

	interface FileItem {
		id?: string;
		name: string;
		type: string;
		size: number;
		url?: string;
		createdAt?: string;
		uploadedBy?: string;
		status?: 'pending' | 'uploading' | 'complete' | 'error';
		error?: string;
	}

	let {
		entityType,
		entityId,
		files = $bindable<FileItem[]>([]),
		maxFiles = 10,
		accept = '*',
		disabled = false,
		onUpload,
		onDelete
	}: {
		entityType: string;
		entityId: string;
		files?: FileItem[];
		maxFiles?: number;
		accept?: string;
		disabled?: boolean;
		onUpload?: (file: FileItem) => void;
		onDelete?: (file: FileItem) => void;
	} = $props();

	let dragActive = $state(false);
	let inputRef: HTMLInputElement;
	let error = $state<string | null>(null);

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function getFileIcon(type: string) {
		if (type.startsWith('image/')) return Image;
		if (type.includes('pdf') || type.includes('document')) return FileText;
		return File;
	}

	async function uploadFile(file: File) {
		// Create pending file item
		const pendingFile: FileItem = {
			name: file.name,
			type: file.type,
			size: file.size,
			status: 'uploading'
		};
		files = [...files, pendingFile];

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('entityType', entityType);
			formData.append('entityId', entityId);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Upload failed');
			}

			// Update file with server data
			const index = files.findIndex(f => f.name === file.name && f.status === 'uploading');
			if (index !== -1) {
				files[index] = {
					...files[index],
					id: result.file.id,
					url: result.file.url,
					status: 'complete'
				};
				files = [...files];
				onUpload?.(files[index]);
			}
		} catch (err) {
			// Mark file as error
			const index = files.findIndex(f => f.name === file.name && f.status === 'uploading');
			if (index !== -1) {
				files[index] = {
					...files[index],
					status: 'error',
					error: err instanceof Error ? err.message : 'Upload failed'
				};
				files = [...files];
			}
		}
	}

	function handleFiles(fileList: FileList | null) {
		if (!fileList || disabled) return;
		error = null;

		const newFiles = Array.from(fileList);
		
		// Check max files
		if (files.length + newFiles.length > maxFiles) {
			error = `Maximum ${maxFiles} files allowed`;
			return;
		}

		// Upload each file
		newFiles.forEach(file => uploadFile(file));
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}

	async function removeFile(file: FileItem, index: number) {
		if (file.id) {
			try {
				const response = await fetch('/api/upload', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ fileId: file.id })
				});

				if (!response.ok) {
					throw new Error('Failed to delete file');
				}

				onDelete?.(file);
			} catch (err) {
				console.error('Delete error:', err);
				return;
			}
		}
		
		files = files.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-4">
	<!-- Drop Zone -->
	<div
		role="button"
		tabindex="0"
		class="relative border-2 border-dashed transition-colors cursor-pointer
			{dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
			{disabled ? 'opacity-50 cursor-not-allowed' : ''}"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={() => !disabled && inputRef?.click()}
		onkeydown={(e) => e.key === 'Enter' && !disabled && inputRef?.click()}
	>
		<input
			bind:this={inputRef}
			type="file"
			{accept}
			multiple
			class="hidden"
			onchange={(e) => handleFiles(e.currentTarget.files)}
			{disabled}
		/>
		<div class="flex flex-col items-center justify-center p-8">
			<Upload class="h-8 w-8 text-muted-foreground/50" />
			<p class="mt-2 text-sm text-muted-foreground">
				Drag and drop files here or <span class="text-primary underline">browse</span>
			</p>
			<p class="mt-1 text-[10px] font-mono tracking-wider text-muted-foreground/70">
				Max 10MB per file · Images, PDFs, Documents, ZIP
			</p>
		</div>
	</div>

	<!-- Error Message -->
	{#if error}
		<div class="flex items-center gap-2 text-sm text-destructive">
			<AlertCircle class="h-4 w-4" />
			{error}
		</div>
	{/if}

	<!-- File List -->
	{#if files.length > 0}
		<div class="space-y-2">
			{#each files as file, index}
				{@const FileIcon = getFileIcon(file.type)}
				<div class="flex items-center gap-3 border border-border p-3 bg-background
					{file.status === 'error' ? 'border-destructive/50 bg-destructive/5' : ''}">
					<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-muted">
						{#if file.status === 'uploading'}
							<Loader2 class="h-5 w-5 animate-spin text-primary" />
						{:else}
							<FileIcon class="h-5 w-5 text-muted-foreground" />
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">{file.name}</p>
						<p class="text-xs text-muted-foreground">
							{formatFileSize(file.size)}
							{#if file.status === 'error'}
								<span class="text-destructive"> · {file.error}</span>
							{:else if file.uploadedBy}
								<span> · Uploaded by {file.uploadedBy}</span>
							{/if}
						</p>
					</div>
					<div class="flex items-center gap-2">
						{#if file.url}
							<a
								href={file.url}
								target="_blank"
								rel="noopener noreferrer"
								class="p-1.5 text-muted-foreground hover:text-primary transition-colors"
								title="View file"
							>
								<Paperclip class="h-4 w-4" />
							</a>
						{/if}
						<button
							type="button"
							onclick={() => removeFile(file, index)}
							class="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
							title="Remove file"
							disabled={file.status === 'uploading'}
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
