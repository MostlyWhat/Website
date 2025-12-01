import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseFrontmatter, extractSlugFromPath, generateExcerpt } from '$lib/utils/markdown';

// Content index - built at startup
interface ContentItem {
    title: string;
    slug: string;
    url: string;
    category: string;
    excerpt: string;
    content: string;
    type: 'support' | 'blog' | 'project' | 'service' | 'career' | 'legal';
    keywords: string[];
}

// Import all markdown files at build time
const supportFiles = import.meta.glob('/src/lib/content/support/*.md', { query: '?raw', import: 'default', eager: true });
const blogFiles = import.meta.glob('/src/lib/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
const projectFiles = import.meta.glob('/src/lib/content/projects/*.md', { query: '?raw', import: 'default', eager: true });
const serviceFiles = import.meta.glob('/src/lib/content/services/*.md', { query: '?raw', import: 'default', eager: true });
const careerFiles = import.meta.glob('/src/lib/content/careers/*.md', { query: '?raw', import: 'default', eager: true });
const legalFiles = import.meta.glob('/src/lib/content/legal/*.md', { query: '?raw', import: 'default', eager: true });

function parseMarkdownFiles(
    files: Record<string, unknown>,
    type: ContentItem['type'],
    baseUrl: string
): ContentItem[] {
    return Object.entries(files).map(([path, raw]) => {
        const content = raw as string;
        const { frontmatter, body } = parseFrontmatter(content);

        // Extract slug from path or frontmatter
        const pathSlug = extractSlugFromPath(path);
        const slug = (frontmatter.slug as string) || pathSlug;

        // Generate excerpt from content using shared utility
        const plainContent = generateExcerpt(body, 10000); // Get full plain text for searching
        const excerpt = (frontmatter.excerpt as string) || (frontmatter.summary as string) || generateExcerpt(body, 200);

        // Extract keywords from tags, category, and title
        const tags = (frontmatter.tags as string[]) || [];
        const title = (frontmatter.title as string) || '';
        const category = (frontmatter.category as string) || '';

        const keywords: string[] = [
            ...tags,
            category,
            ...title.toLowerCase().split(/\s+/)
        ].filter(Boolean);

        return {
            title: title || slug,
            slug,
            url: `${baseUrl}/${slug}`,
            category: category || type,
            excerpt,
            content: plainContent.toLowerCase(),
            type,
            keywords: keywords.map(k => k.toLowerCase())
        };
    });
}

// Build the content index
function buildIndex(): ContentItem[] {
    const items: ContentItem[] = [
        ...parseMarkdownFiles(supportFiles, 'support', '/support'),
        ...parseMarkdownFiles(blogFiles, 'blog', '/blog'),
        ...parseMarkdownFiles(projectFiles, 'project', '/projects'),
        ...parseMarkdownFiles(serviceFiles, 'service', '/services'),
        ...parseMarkdownFiles(careerFiles, 'career', '/careers'),
        ...parseMarkdownFiles(legalFiles, 'legal', '/legal'),
    ];

    return items;
}

const contentIndex = buildIndex();

// Search function
function search(query: string, filter?: string, limit = 20): Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
    score: number;
}> {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    const results = contentIndex
        .map(item => {
            let score = 0;

            // Title match (highest weight)
            const titleLower = item.title.toLowerCase();
            for (const term of searchTerms) {
                if (titleLower.includes(term)) score += 10;
                if (titleLower === term) score += 20;
            }

            // Keyword match
            for (const term of searchTerms) {
                if (item.keywords.some(k => k.includes(term))) score += 5;
            }

            // Content match
            for (const term of searchTerms) {
                const regex = new RegExp(term, 'gi');
                const matches = item.content.match(regex);
                if (matches) score += matches.length;
            }

            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .filter(item => {
            if (!filter || filter === 'all') return true;
            if (filter === 'support') return item.type === 'support';
            if (filter === 'projects') return item.type === 'project';
            if (filter === 'blog') return ['blog', 'service', 'legal'].includes(item.type);
            return true;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    // Generate excerpt with highlighted search terms
    return results.map(item => {
        let excerpt = item.excerpt;

        // Try to find a snippet around the search term
        for (const term of searchTerms) {
            const idx = item.content.indexOf(term);
            if (idx !== -1) {
                const start = Math.max(0, idx - 50);
                const end = Math.min(item.content.length, idx + 100);
                let snippet = item.content.slice(start, end);

                // Add ellipsis if not at start/end
                if (start > 0) snippet = '...' + snippet;
                if (end < item.content.length) snippet = snippet + '...';

                // Highlight the term
                snippet = snippet.replace(
                    new RegExp(`(${term})`, 'gi'),
                    '<mark>$1</mark>'
                );

                excerpt = snippet;
                break;
            }
        }

        return {
            title: item.title,
            excerpt,
            url: item.url,
            type: item.type,
            score: item.score
        };
    });
}

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get('q') || '';
    const filter = url.searchParams.get('filter') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    const results = search(query, filter, limit);

    return json({
        query,
        results,
        total: results.length
    });
};
