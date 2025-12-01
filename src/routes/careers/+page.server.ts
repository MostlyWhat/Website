import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { parseFrontmatter, extractSlugFromPath } from '$lib/utils/markdown';

interface Position {
    slug: string;
    title: string;
    type: string;
    location: string;
    department: string;
    summary: string;
}

// Import all markdown files from the careers folder
const positionFiles = import.meta.glob('/src/lib/content/careers/*.md', { eager: true, query: '?raw', import: 'default' });

export const load: PageServerLoad = async () => {
    const positions: Position[] = [];

    for (const [path, content] of Object.entries(positionFiles)) {
        const { frontmatter } = parseFrontmatter(content as string);

        positions.push({
            slug: (frontmatter.slug as string) || extractSlugFromPath(path),
            title: (frontmatter.title as string) || '',
            type: (frontmatter.type as string) || 'FULL-TIME',
            location: (frontmatter.location as string) || 'REMOTE',
            department: (frontmatter.department as string) || 'GENERAL',
            summary: (frontmatter.summary as string) || ''
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
