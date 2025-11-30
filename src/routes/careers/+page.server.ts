import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Position {
	slug: string;
	title: string;
	type: string;
	location: string;
	department: string;
	summary: string;
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

export const load: PageServerLoad = async () => {
	const positions: Position[] = [];
	
	for (const [path, content] of Object.entries(positionFiles)) {
		const { metadata } = parseFrontmatter(content as string);
		
		positions.push({
			slug: metadata.slug || path.split('/').pop()?.replace('.md', '') || '',
			title: metadata.title || '',
			type: metadata.type || 'FULL-TIME',
			location: metadata.location || 'REMOTE',
			department: metadata.department || 'GENERAL',
			summary: metadata.summary || ''
		});
	}
	
	// Sort by department then by title
	positions.sort((a, b) => {
		if (a.department !== b.department) {
			return a.department.localeCompare(b.department);
		}
		return a.title.localeCompare(b.title);
	});
	
	return {
		positions
	};
};
