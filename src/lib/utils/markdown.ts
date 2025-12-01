// Centralized markdown rendering utilities
import { marked } from 'marked';

// Configure marked for consistent rendering
marked.setOptions({
    gfm: true,
    breaks: true
});

export interface ContentSection {
    id: string;
    number: string;
    title: string;
}

export interface RenderOptions {
    /** Strip the main title (# heading) - useful when showing title separately */
    stripTitle?: boolean;
    /** Add // prefix to h2 headings */
    prefixH2?: boolean;
}

/**
 * Extract sections from markdown for TOC/navigation
 */
export function extractSections(markdown: string): ContentSection[] {
    const sections: ContentSection[] = [];

    // First try to match numbered format: "## 01 — Title" or "## 1 — Title"
    const numberedRegex = /^##\s+0?(\d+)\s*[—–-]\s*(.+)$/gm;
    let match;
    let hasNumberedSections = false;

    while ((match = numberedRegex.exec(markdown)) !== null) {
        hasNumberedSections = true;
        const number = match[1].padStart(2, '0');
        const title = match[2].trim().toUpperCase();
        const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        sections.push({ id, number, title });
    }

    // If no numbered sections found, extract regular ## headings
    if (!hasNumberedSections) {
        const regularRegex = /^##\s+(?!#)(.+)$/gm;
        let counter = 1;

        while ((match = regularRegex.exec(markdown)) !== null) {
            const title = match[1].trim().toUpperCase();
            const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const number = String(counter).padStart(2, '0');
            sections.push({ id, number, title });
            counter++;
        }
    }

    return sections;
}

/**
 * Render markdown to styled HTML
 * This function parses markdown FIRST, then applies styling to the HTML output
 * to avoid breaking markdown parsing (e.g., bold text in lists)
 */
export function renderStyledMarkdown(markdown: string, options: RenderOptions = {}): string {
    let processed = markdown;

    // Strip the main title (# heading) if requested - we show it separately in the UI
    if (options.stripTitle) {
        processed = processed.replace(/^#\s+.+\n+/m, '');

        // Also strip any description/excerpt that immediately follows the title
        // (often the first paragraph before the first ## heading)
        const firstH2Index = processed.search(/^##\s+/m);
        if (firstH2Index > 0) {
            const beforeH2 = processed.slice(0, firstH2Index);
            // Check if there's just a paragraph (no headings)
            if (!beforeH2.match(/^#/m)) {
                // Remove leading paragraph(s) before first section
                processed = processed.slice(firstH2Index);
            }
        }
    }

    // Parse markdown with marked FIRST, before any transformations
    const html = marked.parse(processed) as string;

    // Determine h2 prefix
    const h2Prefix = options.prefixH2 ? '//' : '';

    // Now transform the HTML output
    let styled = html
        // Style ## headings (h2) - numbered format like "01 — Title"
        .replace(
            /<h2>(\d+)\s*[—–-]\s*(.+?)<\/h2>/gi,
            (_, num, title) => {
                const number = num.padStart(2, '0');
                const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return `<h2 id="${id}" class="font-ui mt-12 mb-4 text-base font-bold tracking-wider text-primary scroll-mt-24">${h2Prefix}${number} — ${title.trim().toUpperCase()}</h2>`;
            }
        )
        // Style regular ## headings (h2) without numbers
        .replace(
            /<h2>(.+?)<\/h2>/gi,
            (_, title) => {
                const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return `<h2 id="${id}" class="font-ui mt-12 mb-4 text-base font-bold tracking-wider text-primary scroll-mt-24">${h2Prefix}${title.trim().toUpperCase()}</h2>`;
            }
        )
        // Style ### headings (h3)
        .replace(
            /<h3>(.+?)<\/h3>/gi,
            (_, title) => `<h3 class="font-ui mt-8 mb-3 text-sm font-semibold tracking-wider text-foreground">${title.trim()}</h3>`
        )
        // Style # headings (h1) - only if not stripped
        .replace(
            /<h1>(.+?)<\/h1>/gi,
            (_, title) => options.stripTitle ? '' : `<h1 class="font-display text-2xl font-bold uppercase tracking-tight">${title.trim()}</h1>`
        )
        // Style paragraphs, lists, and other elements
        .replace(/<p>/g, '<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4">')
        .replace(/<ul>/g, '<ul class="font-body list-disc list-inside space-y-2 text-sm text-muted-foreground mt-4 ml-4">')
        .replace(/<ol>/g, '<ol class="font-body list-decimal list-inside space-y-2 text-sm text-muted-foreground mt-4 ml-4">')
        .replace(/<li>/g, '<li class="leading-relaxed">')
        .replace(/<strong>/g, '<strong class="font-semibold text-foreground">')
        .replace(/<em>/g, '<em class="italic">')
        .replace(/<a /g, '<a class="text-primary hover:underline" ')
        .replace(/<blockquote>/g, '<blockquote class="border-l-2 border-primary pl-4 italic text-muted-foreground mt-4">')
        .replace(/<hr>/g, '<hr class="border-border my-8" />')
        .replace(/<hr \/>/g, '<hr class="border-border my-8" />')
        // Table styling
        .replace(/<table>/g, '<div class="mt-6 mb-4 overflow-x-auto border border-border"><table class="w-full text-sm">')
        .replace(/<\/table>/g, '</table></div>')
        .replace(/<thead>/g, '<thead class="bg-card border-b border-border">')
        .replace(/<tbody>/g, '<tbody class="divide-y divide-border">')
        .replace(/<tr>/g, '<tr class="hover:bg-card/50 transition-colors">')
        .replace(/<th>/g, '<th class="font-ui px-4 py-3 text-left text-xs font-semibold tracking-wider text-foreground">')
        .replace(/<th align="left">/g, '<th class="font-ui px-4 py-3 text-left text-xs font-semibold tracking-wider text-foreground">')
        .replace(/<th align="center">/g, '<th class="font-ui px-4 py-3 text-center text-xs font-semibold tracking-wider text-foreground">')
        .replace(/<th align="right">/g, '<th class="font-ui px-4 py-3 text-right text-xs font-semibold tracking-wider text-foreground">')
        .replace(/<td>/g, '<td class="font-body px-4 py-3 text-sm text-muted-foreground">')
        .replace(/<td align="left">/g, '<td class="font-body px-4 py-3 text-left text-sm text-muted-foreground">')
        .replace(/<td align="center">/g, '<td class="font-body px-4 py-3 text-center text-sm text-muted-foreground">')
        .replace(/<td align="right">/g, '<td class="font-body px-4 py-3 text-right text-sm text-muted-foreground">')
        // Code styling
        .replace(/<pre>/g, '<pre class="font-mono mt-6 mb-4 p-4 bg-card border border-border overflow-x-auto text-xs leading-relaxed">')
        .replace(/<code>/g, '<code class="font-mono text-xs text-primary">')
        .replace(/<pre class="font-mono mt-6 mb-4 p-4 bg-card border border-border overflow-x-auto text-xs leading-relaxed"><code class="font-mono text-xs text-primary">/g, '<pre class="font-mono mt-6 mb-4 p-4 bg-card border border-border overflow-x-auto text-xs leading-relaxed"><code class="font-mono text-foreground">')
        .replace(/<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4"><code/g, '<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4"><code class="font-mono text-xs bg-card px-1.5 py-0.5 border border-border text-primary"');

    // Remove top margin from first element to eliminate extra space
    styled = styled.replace(/^(<(?:p|ul|ol|h[1-6]|div)[^>]*class="[^"]*)\bmt-\d+\b/, '$1');

    return styled;
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
    // Handle different line endings (Windows vs Unix)
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const match = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
        return { frontmatter: {}, body: normalizedContent };
    }

    const frontmatterStr = match[1];
    const body = match[2];
    const frontmatter: Record<string, unknown> = {};

    // Simple YAML parser for frontmatter
    frontmatterStr.split('\n').forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        // Parse arrays
        if (value.startsWith('[') && value.endsWith(']')) {
            frontmatter[key] = value
                .slice(1, -1)
                .split(',')
                .map((v) => v.trim().replace(/^["']|["']$/g, ''));
        }
        // Parse booleans
        else if (value === 'true') {
            frontmatter[key] = true;
        } else if (value === 'false') {
            frontmatter[key] = false;
        }
        // Parse numbers
        else if (!isNaN(Number(value)) && value !== '') {
            frontmatter[key] = Number(value);
        }
        // String values
        else {
            frontmatter[key] = value;
        }
    });

    return { frontmatter, body };
}

/**
 * Extract slug from a file path
 * e.g., '/src/lib/content/blog/my-post.md' -> 'my-post'
 */
export function extractSlugFromPath(path: string): string {
    return path.split('/').pop()?.replace('.md', '') || '';
}

/**
 * Parse markdown content with all utilities combined
 * Returns frontmatter, rendered body, and sections
 */
export function parseMarkdownContent(
    content: string,
    options: RenderOptions & { styled?: boolean } = {}
): {
    frontmatter: Record<string, unknown>;
    body: string;
    sections: ContentSection[]
} {
    const { frontmatter, body } = parseFrontmatter(content);
    const sections = extractSections(body);

    const renderedBody = options.styled
        ? renderStyledMarkdown(body, options)
        : marked.parse(body) as string;

    return { frontmatter, body: renderedBody, sections };
}

/**
 * Generate a plain text excerpt from markdown content
 */
export function generateExcerpt(markdown: string, maxLength = 200): string {
    const plainContent = markdown
        .replace(/^#+\s+.*/gm, '') // Remove headings
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
        .replace(/[*_`#]/g, '') // Remove markdown formatting
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();

    if (plainContent.length <= maxLength) return plainContent;
    return plainContent.slice(0, maxLength) + '...';
}

