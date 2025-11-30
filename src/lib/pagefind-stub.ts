/**
 * Pagefind Development Stub
 * 
 * This module provides a mock implementation of Pagefind for development mode.
 * In production, the actual Pagefind library is loaded from /pagefind/pagefind.js
 * which is generated during the build process.
 */

interface PagefindResultData {
	url: string;
	content: string;
	word_count: number;
	excerpt: string;
	meta: {
		title?: string;
		image?: string;
		[key: string]: string | undefined;
	};
}

interface PagefindResult {
	id: string;
	data: () => Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
	results: PagefindResult[];
}

// Sample mock data for development testing
const mockResults: Record<string, PagefindResultData[]> = {
	default: [
		{
			url: '/blog/development-mode',
			content: 'This is a mock blog post for development testing. Pagefind search results will appear here in production.',
			word_count: 150,
			excerpt: 'This is a <mark>mock</mark> blog post for <mark>development</mark> testing...',
			meta: {
				title: '[DEV] Sample Blog Post'
			}
		},
		{
			url: '/support/getting-started',
			content: 'Getting started guide for development testing. This mock article helps test the search UI.',
			word_count: 200,
			excerpt: 'Getting started guide for <mark>development</mark> testing...',
			meta: {
				title: '[DEV] Getting Started Guide'
			}
		},
		{
			url: '/projects/sample-project',
			content: 'Sample project page for testing search functionality in development mode.',
			word_count: 100,
			excerpt: 'Sample project page for testing <mark>search</mark> functionality...',
			meta: {
				title: '[DEV] Sample Project'
			}
		}
	]
};

/**
 * Mock Pagefind implementation for development
 */
export const pagefindStub = {
	async init(): Promise<void> {
		console.log('[Pagefind Stub] Initialized in development mode');
	},

	async search(query: string): Promise<PagefindSearchResponse> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		if (!query.trim()) {
			return { results: [] };
		}

		console.log(`[Pagefind Stub] Searching for: "${query}"`);

		// Return mock results with the query highlighted
		const results = mockResults.default.map((data, index) => ({
			id: `mock-${index}`,
			data: async () => ({
				...data,
				excerpt: data.excerpt.replace(/development|search|mock/gi, (match) => 
					query.toLowerCase().includes(match.toLowerCase()) ? `<mark>${match}</mark>` : match
				)
			})
		}));

		return { results };
	}
};

export type Pagefind = typeof pagefindStub;
