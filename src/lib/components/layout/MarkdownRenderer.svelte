<script lang="ts">
	import { marked } from 'marked';
	import { scrollAnimate } from '$lib/actions/scroll-animate';

	interface Props {
		/** Raw markdown content to render */
		content: string;
		/** Additional CSS classes for the wrapper */
		class?: string;
		/** Enable scroll animations */
		animated?: boolean;
		/** Strip the first H1 heading (useful when title is shown separately) */
		stripTitle?: boolean;
	}

	let { content, class: className = '', animated = true, stripTitle = true }: Props = $props();

	// Strip the first H1 heading if requested (handles leading whitespace/newlines)
	const processedContent = $derived(
		stripTitle ? content.replace(/^\s*#\s+.+\n*/, '') : content
	);

	// Configure marked to add IDs to headings for anchor links
	const renderer = new marked.Renderer();
	renderer.heading = ({ text, depth }) => {
		// Check for numbered heading format: "01 — Title"
		const numberedMatch = text.match(/^(\d+)\s*[—–-]\s*(.+)$/);
		let id: string;
		if (numberedMatch) {
			const number = numberedMatch[1].padStart(2, '0');
			const title = numberedMatch[2].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
			id = `${number}--${title}`;
		} else {
			id = text
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-');
		}
		return `<h${depth} id="${id}"><a href="#${id}" class="heading-anchor">${text}</a></h${depth}>`;
	};
	
	// Custom blockquote with callout support
	renderer.blockquote = ({ text }) => {
		// Check for callout syntax like [!NOTE] or [!WARNING]
		const calloutMatch = text.match(/^\s*<p>\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]\s*/i);
		if (calloutMatch) {
			const type = calloutMatch[1].toLowerCase();
			const content = text.replace(calloutMatch[0], '<p>');
			return `<blockquote class="callout callout-${type}">${content}</blockquote>`;
		}
		return `<blockquote>${text}</blockquote>`;
	};
	
	marked.use({ renderer });

	// Render markdown to HTML
	const renderedContent = $derived(marked(processedContent) as string);
</script>

{#if animated}
	<div 
		class="prose-custom max-w-3xl {className}"
		use:scrollAnimate={{ animation: 'fade' }}
	>
		{@html renderedContent}
	</div>
{:else}
	<div class="prose-custom max-w-3xl {className}">
		{@html renderedContent}
	</div>
{/if}

<style>
	/* Heading anchor links */
	:global(.prose-custom .heading-anchor) {
		color: inherit;
		text-decoration: none;
		position: relative;
	}

	:global(.prose-custom .heading-anchor:hover::before) {
		content: "#";
		position: absolute;
		left: -1.25em;
		color: var(--primary);
		font-family: var(--font-mono);
		font-weight: normal;
		opacity: 0.6;
	}

	/* Callout styles */
	:global(.prose-custom .callout) {
		border-left-width: 4px;
		padding: 1rem 1.25rem;
		margin: 1.5rem 0;
		background: var(--card);
	}

	:global(.prose-custom .callout-note) {
		border-left-color: var(--primary);
	}

	:global(.prose-custom .callout-tip) {
		border-left-color: #22c55e;
	}

	:global(.prose-custom .callout-warning) {
		border-left-color: #f59e0b;
	}

	:global(.prose-custom .callout-caution) {
		border-left-color: #ef4444;
	}

	:global(.prose-custom .callout-important) {
		border-left-color: #8b5cf6;
	}
</style>
