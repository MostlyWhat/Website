// Content loader utilities for blog posts, services, legal docs, and projects
import { marked } from 'marked';

// Configure marked for better rendering
marked.setOptions({
    gfm: true,
    breaks: true
});

// Extract sections from markdown for navigation
export interface ContentSection {
    id: string;
    number: string;
    title: string;
}

// Parse markdown and extract sections for TOC
function extractSections(markdown: string): ContentSection[] {
    const sections: ContentSection[] = [];
    const headingRegex = /^##\s+(\d+)\s*[—–-]\s*(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const number = match[1].padStart(2, '0');
        const title = match[2].trim().toUpperCase();
        const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        sections.push({ id, number, title });
    }

    return sections;
}

// Custom renderer for styled headings
function renderStyledContent(markdown: string, options?: { stripTitle?: boolean }): string {
    let processed = markdown;

    // Strip the main title (# heading) if requested - we show it separately in the UI
    if (options?.stripTitle) {
        processed = processed.replace(/^#\s+.+\n+/m, '');
    }

    // Also strip any description/excerpt that immediately follows the title
    // (often the first paragraph before the first ## heading)
    if (options?.stripTitle) {
        // Remove first paragraph if it appears before any ## heading
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

    // Convert ## headings to styled versions
    processed = processed.replace(
        /^##\s+(\d+)\s*[—–-]\s*(.+)$/gm,
        (_, num, title) => {
            const number = num.padStart(2, '0');
            const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return `<h2 id="${id}" class="font-ui mt-12 mb-4 text-base font-bold tracking-wider text-primary scroll-mt-24">${number} — ${title.trim().toUpperCase()}</h2>`;
        }
    );

    // Convert regular ## headings (without numbers)
    processed = processed.replace(
        /^##\s+(.+)$/gm,
        (_, title) => {
            const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return `<h2 id="${id}" class="font-ui mt-12 mb-4 text-base font-bold tracking-wider text-primary scroll-mt-24">${title.trim().toUpperCase()}</h2>`;
        }
    );

    // Convert ### headings
    processed = processed.replace(
        /^###\s+(.+)$/gm,
        (_, title) => `<h3 class="font-ui mt-8 mb-3 text-sm font-semibold tracking-wider text-foreground">${title.trim()}</h3>`
    );

    // Convert # headings (main title - only if not stripped)
    if (!options?.stripTitle) {
        processed = processed.replace(
            /^#\s+(.+)$/gm,
            (_, title) => `<h1 class="font-display text-2xl font-bold uppercase tracking-tight">${title.trim()}</h1>`
        );
    }

    // Parse the rest with marked
    const html = marked.parse(processed) as string;

    // Add styling to paragraphs, lists, and code blocks
    return html
        .replace(/<p>/g, '<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4">')
        .replace(/<ul>/g, '<ul class="font-body list-disc list-inside space-y-2 text-sm text-muted-foreground mt-4 ml-4">')
        .replace(/<ol>/g, '<ol class="font-body list-decimal list-inside space-y-2 text-sm text-muted-foreground mt-4 ml-4">')
        .replace(/<li>/g, '<li class="leading-relaxed">')
        .replace(/<strong>/g, '<strong class="font-semibold text-foreground">')
        .replace(/<a /g, '<a class="text-primary hover:underline" ')
        .replace(/<blockquote>/g, '<blockquote class="border-l-2 border-primary pl-4 italic text-muted-foreground mt-4">')
        .replace(/<pre>/g, '<pre class="font-mono mt-6 mb-4 p-4 bg-card border border-border rounded-lg overflow-x-auto text-xs leading-relaxed">')
        .replace(/<code>/g, '<code class="font-mono text-xs text-primary">')
        .replace(/<pre class="font-mono mt-6 mb-4 p-4 bg-card border border-border rounded-lg overflow-x-auto text-xs leading-relaxed"><code class="font-mono text-xs text-primary">/g, '<pre class="font-mono mt-6 mb-4 p-4 bg-card border border-border rounded-lg overflow-x-auto text-xs leading-relaxed"><code class="font-mono text-foreground">')
        .replace(/<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4"><code/g, '<p class="font-body text-sm leading-relaxed text-muted-foreground mt-4"><code class="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border text-primary"');
}

export interface BlogPost {
    slug: string;
    title: string;
    category: string;
    date: string;
    excerpt: string;
    readTime: string;
    author?: string;
    featured?: boolean;
    tags?: string[];
    content: string;
    sections: ContentSection[];
}

export interface Service {
    slug: string;
    title: string;
    number: string;
    tagline: string;
    description: string;
    features: string[];
    content: string;
    sections: ContentSection[];
}

export interface LegalDoc {
    slug: string;
    title: string;
    lastUpdated: string;
    content: string;
    sections: ContentSection[];
}

export interface Project {
    slug: string;
    title: string;
    client: string;
    category: string;
    year: string;
    description: string;
    tags: string[];
    featured?: boolean;
    content: string;
    sections: ContentSection[];
}

// Parse frontmatter from markdown and convert body to HTML
function parseFrontmatter(content: string, options?: { styled?: boolean; stripTitle?: boolean }): { frontmatter: Record<string, unknown>; body: string; sections: ContentSection[] } {
    // Handle different line endings (Windows vs Unix)
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const match = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
        return {
            frontmatter: {},
            body: options?.styled ? renderStyledContent(normalizedContent, { stripTitle: options?.stripTitle }) : marked.parse(normalizedContent) as string,
            sections: extractSections(normalizedContent)
        };
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

    const sections = extractSections(body);
    const renderedBody = options?.styled ? renderStyledContent(body, { stripTitle: options?.stripTitle }) : marked.parse(body) as string;

    return { frontmatter, body: renderedBody, sections };
}

// Use eager imports for reliability
const blogModules = import.meta.glob('/src/lib/content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const legalModules = import.meta.glob('/src/lib/content/legal/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const projectModules = import.meta.glob('/src/lib/content/projects/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const serviceModules = import.meta.glob('/src/lib/content/services/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Load all blog posts
export function loadBlogPosts(): BlogPost[] {
    const posts: BlogPost[] = [];

    for (const [path, content] of Object.entries(blogModules)) {
        const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        posts.push({
            slug,
            title: (frontmatter.title as string) || '',
            category: (frontmatter.category as string) || '',
            date: (frontmatter.date as string) || '',
            excerpt: (frontmatter.excerpt as string) || '',
            readTime: (frontmatter.readTime as string) || '',
            author: frontmatter.author as string,
            featured: frontmatter.featured as boolean,
            tags: frontmatter.tags as string[],
            content: body,
            sections
        });
    }

    // Sort by date, newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Load a single blog post
export function loadBlogPost(slug: string): BlogPost | null {
    const path = `/src/lib/content/blog/${slug}.md`;
    const content = blogModules[path];

    if (!content) return null;

    const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        category: (frontmatter.category as string) || '',
        date: (frontmatter.date as string) || '',
        excerpt: (frontmatter.excerpt as string) || '',
        readTime: (frontmatter.readTime as string) || '',
        author: frontmatter.author as string,
        featured: frontmatter.featured as boolean,
        tags: frontmatter.tags as string[],
        content: body,
        sections
    };
}

// Load all legal docs
export function loadLegalDocs(): LegalDoc[] {
    const docs: LegalDoc[] = [];

    for (const [path, content] of Object.entries(legalModules)) {
        const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        docs.push({
            slug,
            title: (frontmatter.title as string) || '',
            lastUpdated: (frontmatter.lastUpdated as string) || '',
            content: body,
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

    const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        lastUpdated: (frontmatter.lastUpdated as string) || '',
        content: body,
        sections
    };
}

// Load all projects
export function loadProjects(): Project[] {
    const projects: Project[] = [];

    for (const [path, content] of Object.entries(projectModules)) {
        const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        projects.push({
            slug,
            title: (frontmatter.title as string) || '',
            client: (frontmatter.client as string) || '',
            category: (frontmatter.category as string) || '',
            year: String(frontmatter.year || ''),
            description: (frontmatter.description as string) || '',
            tags: (frontmatter.tags as string[]) || [],
            featured: frontmatter.featured as boolean,
            content: body,
            sections
        });
    }

    // Sort by year, newest first
    return projects.sort((a, b) => b.year.localeCompare(a.year));
}

// Load a single project
export function loadProject(slug: string): Project | null {
    const path = `/src/lib/content/projects/${slug}.md`;
    const content = projectModules[path];

    if (!content) return null;

    const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        client: (frontmatter.client as string) || '',
        category: (frontmatter.category as string) || '',
        year: String(frontmatter.year || ''),
        description: (frontmatter.description as string) || '',
        tags: (frontmatter.tags as string[]) || [],
        featured: frontmatter.featured as boolean,
        content: body,
        sections
    };
}

// Load all services
export function loadServices(): Service[] {
    const services: Service[] = [];

    for (const [path, content] of Object.entries(serviceModules)) {
        const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true });
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        services.push({
            slug,
            title: (frontmatter.title as string) || '',
            number: (frontmatter.number as string) || '',
            tagline: (frontmatter.tagline as string) || '',
            description: (frontmatter.description as string) || '',
            features: (frontmatter.features as string[]) || [],
            content: body,
            sections
        });
    }

    // Sort by number
    return services.sort((a, b) => a.number.localeCompare(b.number));
}

// Load a single service
export function loadService(slug: string): Service | null {
    const path = `/src/lib/content/services/${slug}.md`;
    const content = serviceModules[path];

    if (!content) return null;

    const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        number: (frontmatter.number as string) || '',
        tagline: (frontmatter.tagline as string) || '',
        description: (frontmatter.description as string) || '',
        features: (frontmatter.features as string[]) || [],
        content: body,
        sections
    };
}
