import { FILE_LIMITS, ANALYSIS, ERROR_MESSAGES } from "./constants";

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates a file for resume upload
 */
export function validateResumeFile(file: File | null): ValidationResult {
    if (!file) {
        return { valid: false, error: "No file provided" };
    }

    if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: ERROR_MESSAGES.INVALID_FILE };
    }

    if (file.size > FILE_LIMITS.MAX_SIZE_BYTES) {
        return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
    }

    return { valid: true };
}

/**
 * Validates job description text
 */
export function validateJobDescription(text: string): ValidationResult {
    if (text.length > ANALYSIS.MAX_JOB_DESC_LENGTH) {
        return {
            valid: false,
            error: `Job description must be less than ${ANALYSIS.MAX_JOB_DESC_LENGTH} characters`,
        };
    }

    return { valid: true };
}

/**
 * Validates extracted resume text
 */
export function validateExtractedText(text: string): ValidationResult {
    if (!text || text.length < ANALYSIS.MIN_TEXT_LENGTH) {
        return { valid: false, error: ERROR_MESSAGES.NO_TEXT_EXTRACTED };
    }

    return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return { valid: false, error: "Email is required" };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, error: "Invalid email format" };
    }

    return { valid: true };
}

/**
 * Validates phone number format
 */
export function validatePhone(phone: string): ValidationResult {
    // Allow various phone formats
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;

    if (!phone) {
        return { valid: true }; // Phone is optional
    }

    if (!phoneRegex.test(phone)) {
        return { valid: false, error: "Invalid phone number format" };
    }

    return { valid: true };
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .trim();
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): ValidationResult {
    if (!url) {
        return { valid: true }; // URL is optional
    }

    try {
        // Add protocol if missing for validation
        const urlToTest = url.startsWith("http") ? url : `https://${url}`;
        new URL(urlToTest);
        return { valid: true };
    } catch {
        return { valid: false, error: "Invalid URL format" };
    }
}
