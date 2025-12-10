/**
 * API Key Management System
 * 
 * Handles creation, validation, and management of API keys for external integrations
 */

import { createDb } from '$lib/server/db';
import { apiKeys } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

export type ApiKeyScope =
	| 'read:tickets'
	| 'write:tickets'
	| 'read:projects'
	| 'write:projects'
	| 'read:invoices'
	| 'write:invoices'
	| 'read:customers'
	| 'write:customers'
	| 'read:analytics'
	| 'admin:all';

interface CreateApiKeyOptions {
	name: string;
	userId: string;
	organizationId: string;
	scopes: ApiKeyScope[];
	expiresAt?: Date;
	rateLimit?: number;
}

interface CreateApiKeyResult {
	success: boolean;
	error?: string;
	apiKey?: string; // The actual key (only shown once)
	keyData?: {
		id: string;
		name: string;
		keyPrefix: string;
		scopes: string[];
		expiresAt: Date | null;
		createdAt: Date;
	};
}

/**
 * Generate a secure API key
 */
function generateApiKey(): { key: string; prefix: string } {
	// Generate random 32-byte key
	const randomBytes = crypto.randomBytes(32);
	const key = `ls_key_${randomBytes.toString('base64url')}`;
	const prefix = key.substring(0, 15) + '...'; // Show first 15 chars

	return { key, prefix };
}

/**
 * Hash an API key for storage
 */
async function hashApiKey(key: string): Promise<string> {
	return await bcrypt.hash(key, 10);
}

/**
 * Verify an API key against a hash
 */
async function verifyApiKey(key: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(key, hash);
}

/**
 * Create a new API key
 */
export async function createApiKey(
	options: CreateApiKeyOptions
): Promise<CreateApiKeyResult> {
	try {
		const { name, userId, organizationId, scopes, expiresAt, rateLimit = 100 } = options;

		// Validate scopes
		if (!scopes || scopes.length === 0) {
			return {
				success: false,
				error: 'At least one scope is required'
			};
		}

		// Generate key
		const { key, prefix } = generateApiKey();
		const hashedKey = await hashApiKey(key);

		const db = createDb();

		// Create API key record
		const [apiKey] = await db
			.insert(apiKeys)
			.values({
				name,
				key: hashedKey,
				keyPrefix: prefix,
				userId,
				organizationId,
				scopes,
				expiresAt,
				rateLimit,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();

		return {
			success: true,
			apiKey: key, // Return the plain key (only time it's shown)
			keyData: {
				id: apiKey.id,
				name: apiKey.name,
				keyPrefix: apiKey.keyPrefix,
				scopes: apiKey.scopes,
				expiresAt: apiKey.expiresAt,
				createdAt: apiKey.createdAt
			}
		};
	} catch (error) {
		console.error('Error creating API key:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Validate an API key and return its data
 */
export async function validateApiKey(
	key: string
): Promise<{
	valid: boolean;
	keyData?: any;
	error?: string;
}> {
	try {
		const db = createDb();

		// Get all active API keys (we need to check each hash)
		const allKeys = await db
			.select()
			.from(apiKeys)
			.where(eq(apiKeys.isActive, true));

		for (const keyRecord of allKeys) {
			const isValid = await verifyApiKey(key, keyRecord.key);

			if (isValid) {
				// Check if expired
				if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
					return {
						valid: false,
						error: 'API key has expired'
					};
				}

				// Update last used timestamp and usage count
				await db
					.update(apiKeys)
					.set({
						lastUsedAt: new Date(),
						usageCount: keyRecord.usageCount + 1
					})
					.where(eq(apiKeys.id, keyRecord.id));

				return {
					valid: true,
					keyData: {
						id: keyRecord.id,
						name: keyRecord.name,
						userId: keyRecord.userId,
						organizationId: keyRecord.organizationId,
						scopes: keyRecord.scopes,
						rateLimit: keyRecord.rateLimit
					}
				};
			}
		}

		return {
			valid: false,
			error: 'Invalid API key'
		};
	} catch (error) {
		console.error('Error validating API key:', error);
		return {
			valid: false,
			error: 'Internal error'
		};
	}
}

/**
 * Check if API key has required scope
 */
export function hasScope(keyData: any, requiredScope: ApiKeyScope): boolean {
	if (!keyData || !keyData.scopes) return false;

	// admin:all has access to everything
	if (keyData.scopes.includes('admin:all')) return true;

	return keyData.scopes.includes(requiredScope);
}

/**
 * List API keys for a user
 */
export async function listApiKeys(userId: string, organizationId: string) {
	const db = createDb();

	return await db
		.select({
			id: apiKeys.id,
			name: apiKeys.name,
			keyPrefix: apiKeys.keyPrefix,
			scopes: apiKeys.scopes,
			isActive: apiKeys.isActive,
			lastUsedAt: apiKeys.lastUsedAt,
			usageCount: apiKeys.usageCount,
			expiresAt: apiKeys.expiresAt,
			createdAt: apiKeys.createdAt
		})
		.from(apiKeys)
		.where(and(eq(apiKeys.userId, userId), eq(apiKeys.organizationId, organizationId)));
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(keyId: string, userId: string) {
	const db = createDb();

	await db
		.update(apiKeys)
		.set({
			isActive: false,
			updatedAt: new Date()
		})
		.where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)));
}

/**
 * Delete an API key
 */
export async function deleteApiKey(keyId: string, userId: string) {
	const db = createDb();

	await db.delete(apiKeys).where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)));
}

/**
 * Update API key
 */
export async function updateApiKey(
	keyId: string,
	userId: string,
	updates: {
		name?: string;
		scopes?: ApiKeyScope[];
		expiresAt?: Date | null;
		rateLimit?: number;
	}
) {
	const db = createDb();

	await db
		.update(apiKeys)
		.set({
			...updates,
			updatedAt: new Date()
		})
		.where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)));
}
