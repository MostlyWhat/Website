import { loadDocPage } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const doc = loadDocPage('api', params.slug);

    if (!doc) {
        throw error(404, {
            message: 'Documentation page not found'
        });
    }

    return {
        doc
    };
};
