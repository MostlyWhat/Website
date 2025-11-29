import { loadProject } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const project = loadProject(params.slug);

    if (!project) {
        throw error(404, 'Project not found');
    }

    return { project };
};
