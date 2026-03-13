/**
 * Centralized environment configuration for Awtar Frontend.
 *
 * Why this file?
 * - Single source of truth for all env vars the app needs
 * - Type-safe access (no typos like "NEXT_PUBLIC_AP_URL")
 * - Fails fast if required vars are missing in production
 * - Easy to mock in tests
 *
 * Note: Only NEXT_PUBLIC_* vars are available in the browser.
 * Server-only vars (API keys, secrets) stay in process.env and
 * are never exposed to the client.
 */

function getEnvVar(key: string, required = true): string {
    const value = process.env[key];
    if (required && (value === undefined || value === "")) {
        throw new Error(
            `Missing required environment variable: ${key}.` +
                `Copy .env.example to .env.local and set it`,
        );
    }
    return value ?? "";
}

/**
 * Backend API base URL. Used by fetch, API clients, etc.
 * No trailing slash — append paths like: \`\${API_URL}/api/jobs\`
 */
export const API_URL = getEnvVar("NEXT_PUBLIC_API_URL");
