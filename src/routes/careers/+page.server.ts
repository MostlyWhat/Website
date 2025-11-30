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
    // Normalize line endings to LF
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = normalizedContent.match(frontmatterRegex);

    if (!match) {
        return { metadata: {}, content: normalizedContent };
    }

    const frontmatter = match[1];
    const body = match[2];

    const metadata: Record<string, string> = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            if (key && value) {
                metadata[key] = value;
            }
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
