import { createDb } from '$lib/server/db';
import { portfolioProjects, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

export const load: PageServerLoad = async ({ setHeaders }) => {
    const db = createDb();
    
    // Set cache headers for public page (5min cache, 30min stale-while-revalidate)
    setCacheHeaders(setHeaders, CachePresets.DYNAMIC_MEDIUM);

    // Load published portfolio projects from database
    async function loadProjects() {
        try {
            const projects = await db
                .select({
                    id: portfolioProjects.id,
                    slug: portfolioProjects.slug,
                    title: portfolioProjects.title,
                    client: portfolioProjects.client,
                    description: portfolioProjects.description,
                    category: portfolioProjects.category,
                    tags: portfolioProjects.tags,
                    year: portfolioProjects.year,
                    status: portfolioProjects.status,
                    isFeatured: portfolioProjects.isFeatured,
                    publishedAt: portfolioProjects.publishedAt,
                    featuredImage: portfolioProjects.featuredImage
                })
                .from(portfolioProjects)
                .where(eq(portfolioProjects.status, 'published'))
                .orderBy(desc(portfolioProjects.sortOrder), desc(portfolioProjects.publishedAt));

            // Extract unique categories
            const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

            return { projects, categories };
        } catch (error) {
            console.warn('Failed to load portfolio projects from database:', error);
            return { projects: [], categories: ['All'] };
        }
    }

    return {
        streamed: {
            projectData: loadProjects()
        }
    };
};
