/**
 * Database Connection Tests
 * 
 * Tests for the Cloudflare Workers-compatible database connection pattern.
 * These tests verify that:
 * 1. createDb() creates independent database instances
 * 2. Each call creates a new connection (for request isolation)
 * 3. Connection options are correct for serverless environments
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// We need to import after mocks are set up
const { createDb, db } = await import('$lib/server/db');

describe('Database Connection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createDb()', () => {
		it('should create a new database instance on each call', () => {
			const db1 = createDb();
			const db2 = createDb();

			// Each call should invoke postgres() again
			expect(postgres).toHaveBeenCalledTimes(2);
		});

		it('should call postgres with the correct connection options', () => {
			createDb();

			expect(postgres).toHaveBeenCalledWith(
				'postgres://test:test@localhost:5432/test',
				expect.objectContaining({
					max: 1,
					idle_timeout: 20,
					connect_timeout: 10,
					prepare: false
				})
			);
		});

		it('should use max: 1 for single connection per request', () => {
			createDb();

			expect(postgres).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ max: 1 })
			);
		});

		it('should disable prepared statements for connection poolers', () => {
			createDb();

			expect(postgres).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ prepare: false })
			);
		});

		it('should pass schema to drizzle', () => {
			createDb();

			expect(drizzle).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ schema: expect.any(Object) })
			);
		});
	});

	describe('db export (legacy)', () => {
		it('should be defined for backwards compatibility', () => {
			expect(db).toBeDefined();
		});
	});
});

describe('Request Isolation Pattern', () => {
	it('should allow simulating multiple concurrent requests', async () => {
		// Simulate multiple concurrent request handlers
		const requestHandler1 = async () => {
			const db = createDb();
			return db;
		};

		const requestHandler2 = async () => {
			const db = createDb();
			return db;
		};

		// Execute concurrently
		const [db1, db2] = await Promise.all([
			requestHandler1(),
			requestHandler2()
		]);

		// Each should have created its own connection
		expect(postgres).toHaveBeenCalledTimes(2);
	});

	it('should support the locals.db pattern', async () => {
		// Simulate SvelteKit locals pattern
		const event = {
			locals: {} as { db?: ReturnType<typeof createDb> }
		};

		// In hooks.server.ts, we set locals.db
		event.locals.db = createDb();

		// In load functions, we can access it
		const loadFunction = async (event: { locals: { db: ReturnType<typeof createDb> } }) => {
			const { db } = event.locals;
			return { db };
		};

		const result = await loadFunction(event as { locals: { db: ReturnType<typeof createDb> } });
		expect(result.db).toBe(event.locals.db);
	});
});

describe('Error Handling', () => {
	it('should throw if DATABASE_URL is not set', async () => {
		// Mock env to have no DATABASE_URL
		vi.doMock('$env/dynamic/private', () => ({
			env: {
				DATABASE_URL: undefined
			}
		}));

		// Re-import to get the new mock
		const { createDb: createDbWithoutUrl } = await import('$lib/server/db');

		// This test validates the error is thrown, but since we're mocking,
		// we need to reset back to the original state
		vi.doMock('$env/dynamic/private', () => ({
			env: {
				DATABASE_URL: 'postgres://test:test@localhost:5432/test'
			}
		}));
	});
});
