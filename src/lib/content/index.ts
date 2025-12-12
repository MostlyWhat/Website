// Content loader utilities for legal docs and documentation pages
// Blog and projects are now loaded from the database
import { marked } from 'marked';
import {
    extractSections as extractSectionsUtil,
    renderStyledMarkdown,
    parseFrontmatter as parseFrontmatterUtil,
    extractSlugFromPath,
    type ContentSection
} from '$lib/utils/markdown';

// Re-export ContentSection for backward compatibility
export type { ContentSection };

// Configure marked for better rendering (for non-styled usage)
marked.setOptions({
    gfm: true,
    breaks: true
});

// Use the shared utilities
const extractSections = extractSectionsUtil;

// Wrapper for renderStyledContent with prefixH2 enabled by default
function renderStyledContent(markdown: string, options?: { stripTitle?: boolean }): string {
    return renderStyledMarkdown(markdown, {
        stripTitle: options?.stripTitle,
        prefixH2: true
    });
}

// Enhanced parseFrontmatter that uses shared utility but adds styled rendering
function parseFrontmatter(content: string, options?: { styled?: boolean; stripTitle?: boolean }): { frontmatter: Record<string, unknown>; body: string; rawBody: string; sections: ContentSection[] } {
    const { frontmatter, body } = parseFrontmatterUtil(content);
    const sections = extractSections(body);

    // rawBody is raw markdown - MarkdownRenderer will strip title if needed
    const rawBody = body;

    const renderedBody = options?.styled
        ? renderStyledContent(body, { stripTitle: options?.stripTitle })
        : marked.parse(body) as string;

    return { frontmatter, body: renderedBody, rawBody, sections };
}

export interface LegalDoc {
    slug: string;
    title: string;
    lastUpdated: string;
    content: string;
    sections: ContentSection[];
}

// Use eager imports for reliability
const legalModules = import.meta.glob('/src/lib/content/legal/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const docsModules = import.meta.glob('/src/lib/content/docs/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Load all legal docs
export function loadLegalDocs(): LegalDoc[] {
    const docs: LegalDoc[] = [];

    for (const [path, content] of Object.entries(legalModules)) {
        const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        const slug = extractSlugFromPath(path);

        docs.push({
            slug,
            title: (frontmatter.title as string) || '',
            lastUpdated: (frontmatter.lastUpdated as string) || '',
            content: rawBody,
            sections
        });
    }

    return docs;
}

// Load a single legal doc
export function loadLegalDoc(slug: string): LegalDoc | null {
    const path = `/src/lib/content/legal/${slug}.md`;
    const content = legalModules[path];

    if (!content) return null;

    const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        lastUpdated: (frontmatter.lastUpdated as string) || '',
        content: rawBody,
        sections
    };
}

// Documentation types and loaders
export interface DocPage {
    slug: string;
    title: string;
    description: string;
    category: string;
    order: number;
    content: string;
    rawContent: string;
    sections: ContentSection[];
}

// Load all docs pages
export function loadDocPages(): DocPage[] {
    const docs: DocPage[] = [];

    for (const [path, content] of Object.entries(docsModules)) {
        const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        // Use slug from frontmatter if available, otherwise extract from filename
        const fileSlug = path.split('/').pop()?.replace('.md', '') || '';
        const slug = (frontmatter.slug as string) || fileSlug;
        // Extract category from path like /src/lib/content/docs/components/button.md -> components
        const pathParts = path.split('/');
        const category = pathParts[pathParts.length - 2] || '';

        docs.push({
            slug,
            title: (frontmatter.title as string) || '',
            description: (frontmatter.description as string) || '',
            category,
            order: (frontmatter.order as number) || 999,
            content: rawBody,
            rawContent: content,
            sections
        });
    }

    // Sort by order
    return docs.sort((a, b) => a.order - b.order);
}

// Load docs by category
export function loadDocsByCategory(category: string): DocPage[] {
    return loadDocPages().filter(doc => doc.category === category);
}

// Load a single doc page
export function loadDocPage(category: string, slug: string): DocPage | null {
    const path = `/src/lib/content/docs/${category}/${slug}.md`;
    const content = docsModules[path];

    if (!content) return null;

    const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        description: (frontmatter.description as string) || '',
        category,
        order: (frontmatter.order as number) || 999,
        content: rawBody,
        rawContent: content,
        sections
    };
}
