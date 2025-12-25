// Application constants

export const APP_NAME = "ATSense";
export const APP_DESCRIPTION = "AI-Powered Resume Analyzer & Builder";
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://atsense.com";

// API Rate Limiting
export const RATE_LIMIT = {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 10, // 10 requests per minute
};

// File Upload Limits
export const FILE_LIMITS = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["application/pdf"],
    ALLOWED_EXTENSIONS: [".pdf"],
};

// Resume Analysis
export const ANALYSIS = {
    MIN_TEXT_LENGTH: 50,
    MAX_JOB_DESC_LENGTH: 10000,
};

// Score Thresholds
export const SCORE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
};

// Grade Configuration
export const GRADES = {
    A: { min: 80, color: "text-green-600", label: "Excellent" },
    B: { min: 60, color: "text-blue-600", label: "Good" },
    C: { min: 40, color: "text-orange-600", label: "Fair" },
    D: { min: 0, color: "text-red-600", label: "Needs Work" },
} as const;

// Navigation Links
export const NAV_LINKS = [
    { href: "/analyze", label: "Analyze" },
    { href: "/build-resume", label: "Build Resume" },
    { href: "/how-it-works", label: "How it works" },
] as const;

// Social Links (for footer if needed)
export const SOCIAL_LINKS = {
    github: "https://github.com/atsense",
    twitter: "https://twitter.com/atsense",
    linkedin: "https://linkedin.com/company/atsense",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: "Please sign in to continue",
    INVALID_FILE: "Please upload a valid PDF file",
    FILE_TOO_LARGE: `File size must be less than ${FILE_LIMITS.MAX_SIZE_MB}MB`,
    NO_TEXT_EXTRACTED: "No extractable text found. Please ensure the PDF is text-based (not a scanned image).",
    ANALYSIS_FAILED: "Failed to analyze resume. Please try again.",
    RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
    GENERIC: "Something went wrong. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    ANALYSIS_COMPLETE: "Resume analysis complete!",
    RESUME_SAVED: "Resume data saved successfully",
    PDF_GENERATED: "PDF generated successfully",
} as const;
