/**
 * File Security Utilities
 * 
 * Provides file upload security including content validation and sanitization.
 */

// MIME type validation based on magic numbers (file signatures)
const FILE_SIGNATURES: Record<string, number[][]> = {
	// Images
	'image/jpeg': [[0xFF, 0xD8, 0xFF]],
	'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
	'image/gif': [[0x47, 0x49, 0x46, 0x38]],
	'image/webp': [[0x52, 0x49, 0x46, 0x46]], // followed by WEBP
	
	// Documents
	'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
	'text/plain': [], // Text files don't have reliable magic numbers
	
	// Archives
	'application/zip': [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06]],
};

// Allowed file extensions and their corresponding MIME types
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
	images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
	documents: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	archives: ['application/zip', 'application/x-zip-compressed']
};

// Maximum file sizes by category (in bytes)
export const MAX_FILE_SIZES: Record<string, number> = {
	image: 10 * 1024 * 1024, // 10MB
	document: 25 * 1024 * 1024, // 25MB
	archive: 50 * 1024 * 1024 // 50MB
};

/**
 * Validate file content matches declared MIME type
 */
export async function validateFileContent(file: File): Promise<{
	valid: boolean;
	error?: string;
	detectedType?: string;
}> {
	try {
		// Read first 12 bytes for signature detection
		const buffer = await file.slice(0, 12).arrayBuffer();
		const bytes = new Uint8Array(buffer);
		
		// Special case for WebP - check for WEBP marker after RIFF
		if (file.type === 'image/webp') {
			if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
				// Check for WEBP at offset 8
				const webpMarker = new Uint8Array(buffer.slice(8, 12));
				if (webpMarker[0] === 0x57 && webpMarker[1] === 0x45 && 
					webpMarker[2] === 0x42 && webpMarker[3] === 0x50) {
					return { valid: true };
				}
			}
			return {
				valid: false,
				error: 'File content does not match WebP format',
				detectedType: 'unknown'
			};
		}
		
		// Check against known signatures
		const signatures = FILE_SIGNATURES[file.type];
		if (!signatures || signatures.length === 0) {
			// For text files, do basic text validation
			if (file.type === 'text/plain') {
				const text = await file.text();
				// Check if it's valid UTF-8 text
				const isText = /^[\x20-\x7E\r\n\t]*$/.test(text.substring(0, 1000));
				return isText 
					? { valid: true } 
					: { valid: false, error: 'File is not valid text', detectedType: 'binary' };
			}
			
			// Unknown type - reject for security
			return {
				valid: false,
				error: `File type ${file.type} is not supported`,
				detectedType: 'unsupported'
			};
		}
		
		// Check if any signature matches
		const matchesSignature = signatures.some(signature => 
			signature.every((byte, index) => bytes[index] === byte)
		);
		
		if (!matchesSignature) {
			return {
				valid: false,
				error: `File content does not match declared type ${file.type}`,
				detectedType: 'unknown'
			};
		}
		
		return { valid: true };
	} catch (error) {
		return {
			valid: false,
			error: `Failed to validate file: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}

/**
 * Sanitize filename to prevent path traversal and other attacks
 */
export function sanitizeFilename(filename: string): string {
	// Remove path components
	filename = filename.replace(/^.*[\\/]/, '');
	
	// Remove null bytes
	filename = filename.replace(/\0/g, '');
	
	// Replace potentially dangerous characters
	filename = filename.replace(/[<>:"|?*]/g, '_');
	
	// Limit length
	if (filename.length > 255) {
		const ext = filename.split('.').pop();
		filename = filename.substring(0, 255 - (ext?.length || 0) - 1) + '.' + ext;
	}
	
	// Ensure not empty
	if (!filename || filename === '') {
		filename = 'unnamed_file';
	}
	
	return filename;
}

/**
 * Check if file size is within allowed limits
 */
export function validateFileSize(file: File, category: 'image' | 'document' | 'archive'): {
	valid: boolean;
	error?: string;
} {
	const maxSize = MAX_FILE_SIZES[category];
	
	if (file.size > maxSize) {
		const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
		return {
			valid: false,
			error: `File size exceeds ${maxSizeMB}MB limit for ${category} files`
		};
	}
	
	return { valid: true };
}

/**
 * Comprehensive file validation
 */
export async function validateUploadedFile(
	file: File,
	options: {
		allowedTypes: string[];
		category: 'image' | 'document' | 'archive';
	}
): Promise<{
	valid: boolean;
	errors: string[];
}> {
	const errors: string[] = [];
	
	// Check MIME type is allowed
	if (!options.allowedTypes.includes(file.type)) {
		errors.push(`File type ${file.type} is not allowed`);
	}
	
	// Check file size
	const sizeValidation = validateFileSize(file, options.category);
	if (!sizeValidation.valid && sizeValidation.error) {
		errors.push(sizeValidation.error);
	}
	
	// Validate file content matches MIME type
	const contentValidation = await validateFileContent(file);
	if (!contentValidation.valid && contentValidation.error) {
		errors.push(contentValidation.error);
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}
