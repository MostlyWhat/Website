import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

interface Position {
	slug: string;
	title: string;
	type: string;
	location: string;
	department: string;
	summary: string;
	content: string;
}

// Import all markdown files from the careers folder
const positionFiles = import.meta.glob('/src/content/careers/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontmatter(content: string): { metadata: Record<string, string>; content: string } {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);
	
	if (!match) {
		return { metadata: {}, content };
	}
	
	const frontmatter = match[1];
	const body = match[2];
	
	const metadata: Record<string, string> = {};
	frontmatter.split('\n').forEach(line => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length) {
			metadata[key.trim()] = valueParts.join(':').trim();
		}
	});
	
	return { metadata, content: body };
}

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	
	// Find the matching position file
	const filePath = `/src/content/careers/${slug}.md`;
	const content = positionFiles[filePath] as string | undefined;
	
	if (!content) {
		throw error(404, 'Position not found');
	}
	
	const { metadata, content: markdownContent } = parseFrontmatter(content);
	
	// Parse markdown to HTML
	const htmlContent = await marked(markdownContent);
	
	const position: Position = {
		slug: metadata.slug || slug,
		title: metadata.title || '',
		type: metadata.type || 'FULL-TIME',
		location: metadata.location || 'REMOTE',
		department: metadata.department || 'GENERAL',
		summary: metadata.summary || '',
		content: htmlContent
	};
	
	return {
		position
	};
};
