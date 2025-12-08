/**
 * Vitest Test Setup
 * 
 * Sets up mocks and environment for testing Cloudflare Workers-compatible code.
 */

import { vi } from 'vitest';

// Mock the Drizzle ORM
vi.mock('drizzle-orm/postgres-js', () => ({
	drizzle: vi.fn(() => ({
		query: {},
		select: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		returning: vi.fn().mockResolvedValue([])
	}))
}));

// Mock postgres
vi.mock('postgres', () => ({
	default: vi.fn(() => ({}))
}));

// Mock $env/dynamic/private
vi.mock('$env/dynamic/private', () => ({
	env: {
		DATABASE_URL: 'postgres://test:test@localhost:5432/test'
	}
}));

// Reset mocks between tests
beforeEach(() => {
	vi.clearAllMocks();
});
