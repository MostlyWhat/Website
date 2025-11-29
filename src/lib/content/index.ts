// Content loader utilities for blog posts, services, legal docs, and projects
import { marked } from 'marked';

// Configure marked for better rendering
marked.setOptions({
    gfm: true,
    breaks: true
});

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
}

export interface Service {
    slug: string;
    title: string;
    number: string;
    tagline: string;
    description: string;
    features: string[];
    content: string;
}

export interface LegalDoc {
    slug: string;
    title: string;
    lastUpdated: string;
    content: string;
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
}

// Parse frontmatter from markdown and convert body to HTML
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
    // Handle different line endings (Windows vs Unix)
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const match = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!match) {
        return { frontmatter: {}, body: marked.parse(normalizedContent) as string };
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

    return { frontmatter, body: marked.parse(body) as string };
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
        const { frontmatter, body } = parseFrontmatter(content);
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
            content: body
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

    const { frontmatter, body } = parseFrontmatter(content);

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
        content: body
    };
}

// Load all legal docs
export function loadLegalDocs(): LegalDoc[] {
    const docs: LegalDoc[] = [];

    for (const [path, content] of Object.entries(legalModules)) {
        const { frontmatter, body } = parseFrontmatter(content);
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        docs.push({
            slug,
            title: (frontmatter.title as string) || '',
            lastUpdated: (frontmatter.lastUpdated as string) || '',
            content: body
        });
    }

    return docs;
}

// Load a single legal doc
export function loadLegalDoc(slug: string): LegalDoc | null {
    const path = `/src/lib/content/legal/${slug}.md`;
    const content = legalModules[path];
    
    if (!content) return null;

    const { frontmatter, body } = parseFrontmatter(content);

    return {
        slug,
        title: (frontmatter.title as string) || '',
        lastUpdated: (frontmatter.lastUpdated as string) || '',
        content: body
    };
}

// Load all projects
export function loadProjects(): Project[] {
    const projects: Project[] = [];

    for (const [path, content] of Object.entries(projectModules)) {
        const { frontmatter, body } = parseFrontmatter(content);
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
            content: body
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

    const { frontmatter, body } = parseFrontmatter(content);

    return {
        slug,
        title: (frontmatter.title as string) || '',
        client: (frontmatter.client as string) || '',
        category: (frontmatter.category as string) || '',
        year: String(frontmatter.year || ''),
        description: (frontmatter.description as string) || '',
        tags: (frontmatter.tags as string[]) || [],
        featured: frontmatter.featured as boolean,
        content: body
    };
}

// Load all services
export function loadServices(): Service[] {
    const services: Service[] = [];

    for (const [path, content] of Object.entries(serviceModules)) {
        const { frontmatter, body } = parseFrontmatter(content);
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        services.push({
            slug,
            title: (frontmatter.title as string) || '',
            number: (frontmatter.number as string) || '',
            tagline: (frontmatter.tagline as string) || '',
            description: (frontmatter.description as string) || '',
            features: (frontmatter.features as string[]) || [],
            content: body
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

    const { frontmatter, body } = parseFrontmatter(content);

    return {
        slug,
        title: (frontmatter.title as string) || '',
        number: (frontmatter.number as string) || '',
        tagline: (frontmatter.tagline as string) || '',
        description: (frontmatter.description as string) || '',
        features: (frontmatter.features as string[]) || [],
        content: body
    };
}
