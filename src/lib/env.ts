/**
 * Environment variable validation and access
 * Validates required environment variables at runtime
 */

interface EnvConfig {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    // Google AI
    GOOGLE_GENERATIVE_AI_API_KEY: string;

    // App
    NEXT_PUBLIC_SITE_URL?: string;
}

function getEnvVar(key: string, required: boolean = true): string {
    const value = process.env[key];

    if (required && !value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value || "";
}

/**
 * Get validated environment configuration
 * Call this in server-side code to ensure all required env vars are present
 */
export function getEnvConfig(): EnvConfig {
    return {
        NEXT_PUBLIC_SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        GOOGLE_GENERATIVE_AI_API_KEY: getEnvVar("GOOGLE_GENERATIVE_AI_API_KEY"),
        NEXT_PUBLIC_SITE_URL: getEnvVar("NEXT_PUBLIC_SITE_URL", false),
    };
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

/**
 * Get the base URL for the application
 */
export function getBaseUrl(): string {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
