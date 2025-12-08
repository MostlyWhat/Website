import { createDb } from '$lib/server/db';
import { portfolioProjects, profiles } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const db = createDb();

	try {
		const [project] = await db
			.select({
				id: portfolioProjects.id,
				slug: portfolioProjects.slug,
				title: portfolioProjects.title,
				client: portfolioProjects.client,
				description: portfolioProjects.description,
				content: portfolioProjects.content,
				category: portfolioProjects.category,
				tags: portfolioProjects.tags,
				year: portfolioProjects.year,
				status: portfolioProjects.status,
				publishedAt: portfolioProjects.publishedAt,
				featuredImage: portfolioProjects.featuredImage,
				gallery: portfolioProjects.gallery,
				liveUrl: portfolioProjects.liveUrl,
				caseStudyUrl: portfolioProjects.caseStudyUrl,
				metaTitle: portfolioProjects.metaTitle,
				metaDescription: portfolioProjects.metaDescription
			})
			.from(portfolioProjects)
			.where(
				and(
					eq(portfolioProjects.slug, params.slug),
					eq(portfolioProjects.status, 'published')
				)
			)
			.limit(1);

		if (!project) {
			error(404, 'Project not found');
		}

		// Extract sections from markdown content
		const sections = extractSections(project.content);

		return {
			project: {
				...project,
				sections
			}
		};
	} catch (err) {
		if ((err as { status?: number }).status === 404) {
			throw err;
		}
		console.error('Failed to load project:', err);
		error(500, 'Failed to load project');
	}
};

// Simple section extraction from markdown
function extractSections(content: string): Array<{ id: string; title: string }> {
	const sections: Array<{ id: string; title: string }> = [];
	const lines = content.split('\n');
	
	for (const line of lines) {
		const match = line.match(/^##\s+(.+)$/);
		if (match) {
			const title = match[1].trim();
			const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
			sections.push({ id, title });
		}
	}
	
	return sections;
}
