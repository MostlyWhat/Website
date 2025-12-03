import { loadLegalDocs } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const docs = loadLegalDocs();

    return {
        docs
    };
};
