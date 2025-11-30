import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

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

// Render styled markdown content with consistent styling
function renderStyledContent(markdown: string): string {
    // Convert ## headings to styled versions
    let processed = markdown.replace(
        /^##\s+(.+)$/gm,
        (_, title) => {
            const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return `<h2 id="${id}" class="font-ui mt-10 mb-4 text-base font-bold tracking-wider text-primary scroll-mt-24">${title.trim().toUpperCase()}</h2>`;
        }
    );

    // Convert ### headings
    processed = processed.replace(
        /^###\s+(.+)$/gm,
        (_, title) => `<h3 class="font-ui mt-6 mb-3 text-sm font-semibold tracking-wider text-foreground">${title.trim()}</h3>`
    );

    // Parse with marked
    const html = marked.parse(processed) as string;

    // Add styling to elements - also remove leading empty paragraph
    return html
        .replace(/^<p class="[^"]*"><\/p>\n?/, '') // Remove empty leading paragraph
        .replace(/<p>/g, '<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4">')
        .replace(/<ul>/g, '<ul class="font-body list-disc space-y-2 text-sm text-muted-foreground mt-4 ml-6">')
        .replace(/<ol>/g, '<ol class="font-body list-decimal space-y-2 text-sm text-muted-foreground mt-4 ml-6">')
        .replace(/<li>/g, '<li class="leading-relaxed pl-1">')
        .replace(/<strong>/g, '<strong class="font-semibold text-foreground">')
        .replace(/<em>/g, '<em class="italic">')
        .replace(/<a /g, '<a class="text-primary hover:underline" ');
}

// Extract sections from markdown for TOC
function extractSections(markdown: string): ContentSection[] {
    const sections: ContentSection[] = [];
    const regex = /^##\s+(.+)$/gm;
    let match;
    let counter = 1;

    while ((match = regex.exec(markdown)) !== null) {
        const title = match[1].trim().toUpperCase();
        const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const number = String(counter).padStart(2, '0');
        sections.push({ id, number, title });
        counter++;
    }

    return sections;
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

    // Extract sections for TOC
    const sections = extractSections(markdownContent);

    // Parse markdown to styled HTML
    const htmlContent = renderStyledContent(markdownContent);

    const position: Position = {
        slug: metadata.slug || slug,
        title: metadata.title || '',
        type: metadata.type || 'FULL-TIME',
        location: metadata.location || 'REMOTE',
        department: metadata.department || 'GENERAL',
        summary: metadata.summary || '',
        content: htmlContent,
        sections
    };

    return {
        position
    };
};
