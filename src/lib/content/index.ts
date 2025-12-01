// Content loader utilities for blog posts, services, legal docs, and projects
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

// Use eager imports for reliability
const blogModules = import.meta.glob('/src/lib/content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const legalModules = import.meta.glob('/src/lib/content/legal/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const projectModules = import.meta.glob('/src/lib/content/projects/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const serviceModules = import.meta.glob('/src/lib/content/services/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Load all blog posts
export function loadBlogPosts(): BlogPost[] {
    const posts: BlogPost[] = [];

    for (const [path, content] of Object.entries(blogModules)) {
        const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        const slug = extractSlugFromPath(path);

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
            content: rawBody,
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

    const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

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
        content: rawBody,
        sections
    };
}

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

// Load all projects
export function loadProjects(): Project[] {
    const projects: Project[] = [];

    for (const [path, content] of Object.entries(projectModules)) {
        const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });
        const slug = extractSlugFromPath(path);

        projects.push({
            slug,
            title: (frontmatter.title as string) || '',
            client: (frontmatter.client as string) || '',
            category: (frontmatter.category as string) || '',
            year: String(frontmatter.year || ''),
            description: (frontmatter.description as string) || '',
            tags: (frontmatter.tags as string[]) || [],
            featured: frontmatter.featured as boolean,
            content: rawBody,
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

    const { frontmatter, rawBody, sections } = parseFrontmatter(content, { styled: true, stripTitle: true });

    return {
        slug,
        title: (frontmatter.title as string) || '',
        client: (frontmatter.client as string) || '',
        category: (frontmatter.category as string) || '',
        year: String(frontmatter.year || ''),
        description: (frontmatter.description as string) || '',
        tags: (frontmatter.tags as string[]) || [],
        featured: frontmatter.featured as boolean,
        content: rawBody,
        sections
    };
}

// Load all services
export function loadServices(): Service[] {
    const services: Service[] = [];

    for (const [path, content] of Object.entries(serviceModules)) {
        const { frontmatter, body, sections } = parseFrontmatter(content, { styled: true });
        const slug = extractSlugFromPath(path);

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
