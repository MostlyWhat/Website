<script lang="ts">
	import { marked } from 'marked';

	interface Props {
		/** Raw markdown content to render */
		content: string;
		/** Additional CSS classes for the wrapper */
		class?: string;
	}

	let { content, class: className = '' }: Props = $props();

	// Configure marked to add IDs to headings for anchor links
	const renderer = new marked.Renderer();
	renderer.heading = ({ text, depth }) => {
		const id = text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
		return `<h${depth} id="${id}">${text}</h${depth}>`;
	};
	marked.use({ renderer });

	// Render markdown to HTML
	const renderedContent = $derived(marked(content) as string);
</script>

<div class="prose-custom max-w-3xl {className}">
	{@html renderedContent}
</div>
