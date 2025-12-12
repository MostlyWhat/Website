import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { extractSections, parseFrontmatter } from '$lib/utils/markdown';
import { createDb } from '$lib/server/db';
import { jobPostings } from '$lib/server/db/schema';
import { eq, and, or, isNull, gte } from 'drizzle-orm';

interface ContentSection {
    id: string;
    number: string;
    title: string;
}

interface Position {
    slug: string;
    title: string;
    type: string;
    locationType: string;
    location: string;
    department: string;
    summary: string;
    content: string;
    sections: ContentSection[];
    responsibilities?: string[];
    requirements?: string[];
    niceToHave?: string[];
    benefits?: string[];
    salaryMin?: string | null;
    salaryMax?: string | null;
    salaryCurrency?: string;
    salaryPeriod?: string;
    applicationUrl?: string | null;
    applicationEmail?: string | null;
}

// Import all markdown files from the careers folder
const positionFiles = import.meta.glob('/src/lib/content/careers/*.md', { eager: true, query: '?raw', import: 'default' });

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;
    const db = createDb();

    try {
        // Try to load from database first
        const now = new Date();
        const [job] = await db
            .select()
            .from(jobPostings)
            .where(
                and(
                    eq(jobPostings.slug, slug),
                    eq(jobPostings.status, 'published'),
                    or(
                        isNull(jobPostings.closesAt),
                        gte(jobPostings.closesAt, now)
                    )
                )
            )
            .limit(1);

        if (job) {
            // Build markdown content from database fields
            let content = job.description + '\n\n';
            const sections: ContentSection[] = [];
            let sectionNum = 1;

            if (job.responsibilities && job.responsibilities.length > 0) {
                const sectionTitle = 'Responsibilities';
                const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '-');
                sections.push({ id: sectionId, number: String(sectionNum).padStart(2, '0'), title: sectionTitle });
                content += `## ${sectionTitle}\n\n${job.responsibilities.map(r => `- ${r}`).join('\n')}\n\n`;
                sectionNum++;
            }

            if (job.requirements && job.requirements.length > 0) {
                const sectionTitle = 'Requirements';
                const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '-');
                sections.push({ id: sectionId, number: String(sectionNum).padStart(2, '0'), title: sectionTitle });
                content += `## ${sectionTitle}\n\n${job.requirements.map(r => `- ${r}`).join('\n')}\n\n`;
                sectionNum++;
            }

            if (job.niceToHave && job.niceToHave.length > 0) {
                const sectionTitle = 'Nice to Have';
                const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '-');
                sections.push({ id: sectionId, number: String(sectionNum).padStart(2, '0'), title: sectionTitle });
                content += `## ${sectionTitle}\n\n${job.niceToHave.map(r => `- ${r}`).join('\n')}\n\n`;
                sectionNum++;
            }

            if (job.benefits && job.benefits.length > 0) {
                const sectionTitle = 'Benefits';
                const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '-');
                sections.push({ id: sectionId, number: String(sectionNum).padStart(2, '0'), title: sectionTitle });
                content += `## ${sectionTitle}\n\n${job.benefits.map(r => `- ${r}`).join('\n')}\n\n`;
            }

            const position: Position = {
                slug: job.slug,
                title: job.title,
                type: job.type.replace('_', '-').toUpperCase(),
                locationType: job.locationType.toUpperCase(),
                location: job.location || 'REMOTE',
                department: job.department || 'GENERAL',
                summary: job.description.slice(0, 200) + (job.description.length > 200 ? '...' : ''),
                content,
                sections,
                responsibilities: job.responsibilities || [],
                requirements: job.requirements || [],
                niceToHave: job.niceToHave || [],
                benefits: job.benefits || [],
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                salaryCurrency: job.salaryCurrency || 'USD',
                salaryPeriod: job.salaryPeriod || 'yearly',
                applicationUrl: job.applicationUrl,
                applicationEmail: job.applicationEmail
            };

            return { position, fromDatabase: true };
        }
    } catch (err) {
        console.warn('Job postings table not available, falling back to markdown:', err);
    }

    // Fallback to markdown file
    const filePath = `/src/lib/content/careers/${slug}.md`;
    const content = positionFiles[filePath] as string | undefined;

    if (!content) {
        error(404, 'Position not found');
    }

    const { frontmatter, body } = parseFrontmatter(content);

    // Extract sections for TOC
    const sections = extractSections(body);

    // Return raw markdown - MarkdownRenderer will handle rendering and strip title
    const position: Position = {
        slug: (frontmatter.slug as string) || slug,
        title: (frontmatter.title as string) || '',
        type: (frontmatter.type as string) || 'FULL-TIME',
        locationType: (frontmatter.locationType as string) || 'REMOTE',
        location: (frontmatter.location as string) || 'REMOTE',
        department: (frontmatter.department as string) || 'GENERAL',
        summary: (frontmatter.summary as string) || '',
        content: body,
        sections
    };

    return { position, fromDatabase: false };
};
