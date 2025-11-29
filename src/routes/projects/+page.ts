import { loadProjects } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const projects = await loadProjects();

    // Extract unique categories
    const categories = ['All', ...new Set(projects.map(p => p.category))];

    return {
        projects,
        categories
    };
};
