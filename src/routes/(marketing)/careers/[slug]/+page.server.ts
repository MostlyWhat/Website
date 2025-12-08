import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { extractSections, parseFrontmatter } from '$lib/utils/markdown';

interface ContentSection {
    id: string;
    number: string;
    title: string;
}

interface Position {
    slug: string;
    title: string;
    type: string;
    location: string;
    department: string;
    summary: string;
    content: string;
    sections: ContentSection[];
}

// Import all markdown files from the careers folder
const positionFiles = import.meta.glob('/src/lib/content/careers/*.md', { eager: true, query: '?raw', import: 'default' });

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    // Find the matching position file
    const filePath = `/src/lib/content/careers/${slug}.md`;
    const content = positionFiles[filePath] as string | undefined;

    if (!content) {
        error(404, 'Position not found');
    }

    const { frontmatter, body } = parseFrontmatter(content);

    // Extract sections for TOC
    const sections = extractSections(body);

    // Return raw markdown - MarkdownRenderer will handle rendering and strip title
    const position: Position = {
        slug: (frontmatter.slug as string) || slug,
        title: (frontmatter.title as string) || '',
        type: (frontmatter.type as string) || 'FULL-TIME',
        location: (frontmatter.location as string) || 'REMOTE',
        department: (frontmatter.department as string) || 'GENERAL',
        summary: (frontmatter.summary as string) || '',
        content: body,
        sections
    };

    return {
        position
    };
};
