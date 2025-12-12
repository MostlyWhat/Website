import { createDb } from '$lib/server/db';
import { jobPostings } from '$lib/server/db/schema';
import { eq, and, desc, or, isNull, gte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { parseFrontmatter, extractSlugFromPath } from '$lib/utils/markdown';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

interface Position {
    id: string;
    slug: string;
    title: string;
    type: string;
    locationType: string;
    location: string;
    department: string;
    summary: string;
    isFeatured: boolean;
}

// Fallback: Import all markdown files from the careers folder
const positionFiles = import.meta.glob('/src/lib/content/careers/*.md', { eager: true, query: '?raw', import: 'default' });

export const load: PageServerLoad = async ({ setHeaders }) => {
    const db = createDb();
    
    // Set cache headers for careers page (5min cache)
    setCacheHeaders(setHeaders, CachePresets.DYNAMIC_MEDIUM);

    try {
        // First, try to load from database
        const now = new Date();
        const jobs = await db
            .select()
            .from(jobPostings)
            .where(
                and(
                    eq(jobPostings.status, 'published'),
                    or(
                        isNull(jobPostings.closesAt),
                        gte(jobPostings.closesAt, now)
                    )
                )
            )
            .orderBy(desc(jobPostings.isFeatured), jobPostings.sortOrder, desc(jobPostings.publishedAt));

        if (jobs.length > 0) {
            const positions: Position[] = jobs.map(job => ({
                id: job.id,
                slug: job.slug,
                title: job.title,
                type: job.type.replace('_', '-').toUpperCase(),
                locationType: job.locationType.toUpperCase(),
                location: job.location || 'REMOTE',
                department: job.department || 'GENERAL',
                summary: job.description.slice(0, 150) + (job.description.length > 150 ? '...' : ''),
                isFeatured: job.isFeatured
            }));

            return { positions, fromDatabase: true };
        }
    } catch (error) {
        console.warn('Job postings table not available, falling back to markdown:', error);
    }

    // Fallback to markdown files
    const positions: Position[] = [];

    for (const [path, content] of Object.entries(positionFiles)) {
        const { frontmatter } = parseFrontmatter(content as string);

        positions.push({
            id: extractSlugFromPath(path),
            slug: (frontmatter.slug as string) || extractSlugFromPath(path),
            title: (frontmatter.title as string) || '',
            type: (frontmatter.type as string) || 'FULL-TIME',
            locationType: (frontmatter.locationType as string) || 'REMOTE',
            location: (frontmatter.location as string) || 'REMOTE',
            department: (frontmatter.department as string) || 'GENERAL',
            summary: (frontmatter.summary as string) || '',
            isFeatured: false
        });
    }

    // Sort by department then by title
    positions.sort((a, b) => {
        if (a.department !== b.department) {
            return a.department.localeCompare(b.department);
        }
        return a.title.localeCompare(b.title);
    });

    return { positions, fromDatabase: false };
};
