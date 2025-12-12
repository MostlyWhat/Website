/**
 * GDPR Compliance Utilities
 * 
 * Provides functionality for GDPR compliance including data export, deletion, and consent management.
 * 
 * Note: This is a simplified implementation. For full GDPR compliance, the schema needs additional fields:
 * - activityLog.userId field
 * - consents table for storing consent records
 * - Additional relationship tracking
 */

import { createDb } from '$lib/server/db';
import { 
	profiles,
	activityLog, 
	contactSubmissions
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

interface UserData {
	profile: any;
	organizations: any[];
	projects: any[];
	tickets: any[];
	invoices: any[];
	activityLogs: any[];
	contactSubmissions: any[];
}

interface ConsentRecord {
	userId: string;
	consentType: 'marketing' | 'analytics' | 'functional' | 'necessary';
	granted: boolean;
	timestamp: Date;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Export all user data in GDPR-compliant format
 */
export async function exportUserData(userId: string): Promise<UserData> {
	const db = createDb();
	
	try {
		// Get user profile
		const [userProfile] = await db.select().from(profiles).where(eq(profiles.id, userId));
		
		if (!userProfile) {
			throw new Error('User profile not found');
		}
		
		// Get contact form submissions by email
		const userContacts = await db.select()
			.from(contactSubmissions)
			.where(eq(contactSubmissions.email, userProfile.email))
			.limit(100);
		
		// Return structured data
		return {
			profile: {
				id: userProfile.id,
				email: userProfile.email,
				firstName: userProfile.firstName,
				lastName: userProfile.lastName,
				displayName: userProfile.displayName,
				phone: userProfile.phone,
				avatarUrl: userProfile.avatarUrl,
				role: userProfile.role,
				createdAt: userProfile.createdAt,
				updatedAt: userProfile.updatedAt
			},
			organizations: [], // TODO: Add when relationships are defined
			projects: [], // TODO: Add when relationships are defined
			tickets: [], // TODO: Add when relationships are defined
			invoices: [], // TODO: Add when relationships are defined
			activityLogs: [], // TODO: Add when userId field is added to schema
			contactSubmissions: userContacts
		};
	} catch (error) {
		console.error('Error exporting user data:', error);
		throw new Error('Failed to export user data');
	}
}

/**
 * Delete all user data (Right to be Forgotten)
 */
export async function deleteUserData(userId: string): Promise<{
	success: boolean;
	deletedRecords: Record<string, number>;
	anonymizedRecords: Record<string, number>;
}> {
	const db = createDb();
	
	try {
		const deletedRecords: Record<string, number> = {};
		const anonymizedRecords: Record<string, number> = {};
		
		// Get user profile first
		const [userProfile] = await db.select().from(profiles).where(eq(profiles.id, userId));
		
		if (!userProfile) {
			throw new Error('User profile not found');
		}
		
		// Delete user's contact submissions
		const deletedContacts = await db.delete(contactSubmissions)
			.where(eq(contactSubmissions.email, userProfile.email))
			.returning({ id: contactSubmissions.id });
		deletedRecords.contactSubmissions = deletedContacts.length;
		
		// Delete user profile (this should cascade to related records with ON DELETE CASCADE)
		await db.delete(profiles).where(eq(profiles.id, userId));
		deletedRecords.userProfile = 1;
		
		return {
			success: true,
			deletedRecords,
			anonymizedRecords
		};
	} catch (error) {
		console.error('Error deleting user data:', error);
		throw new Error('Failed to delete user data');
	}
}

/**
 * Log user consent for GDPR compliance
 * 
 * Note: Currently stores in activity_log. Should use dedicated consents table in production.
 */
export async function logConsent(record: ConsentRecord): Promise<void> {
	const db = createDb();
	
	try {
		// Store consent in activity log
		await db.insert(activityLog).values({
			entityType: 'user',
			entityId: record.userId,
			activityType: 'created', // Using 'created' since 'consent_updated' is not in schema
			description: `Consent for ${record.consentType}: ${record.granted ? 'granted' : 'revoked'}`,
			newValues: {
				consentType: record.consentType,
				granted: record.granted,
				timestamp: record.timestamp.toISOString()
			},
			ipAddress: record.ipAddress || null,
			userAgent: record.userAgent || null
		});
	} catch (error) {
		console.error('Error logging consent:', error);
		// Don't throw error - consent is already stored in cookie
	}
}

/**
 * Get user's current consent preferences
 */
export async function getUserConsents(userId: string): Promise<Record<string, boolean>> {
	// Return safe defaults since we don't have a consents table yet
	// In production, this should query the consents table
	return {
		necessary: true,
		functional: false,
		analytics: false,
		marketing: false
	};
}

/**
 * Check if user has consented to a specific type
 */
export async function hasConsent(userId: string, consentType: string): Promise<boolean> {
	const consents = await getUserConsents(userId);
	return consents[consentType] ?? false;
}

/**
 * Generate GDPR-compliant data export file
 */
export function formatDataExport(userData: UserData): string {
	const exportData = {
		exportDate: new Date().toISOString(),
		dataSubject: {
			email: userData.profile.email,
			name: `${userData.profile.firstName} ${userData.profile.lastName}`
		},
		data: userData,
		format: 'JSON',
		gdprCompliance: {
			rightToAccess: true,
			rightToDataPortability: true,
			regulation: 'GDPR Article 15 & 20'
		}
	};
	
	return JSON.stringify(exportData, null, 2);
}
