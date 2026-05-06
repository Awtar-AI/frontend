/**
 * Client-side JWT helpers for UX only (expiry). Do not trust payload for security;
 * the API remains the source of truth.
 */

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const segment = parts[1];
        if (!segment) return null;
        const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
        const pad = (4 - (base64.length % 4)) % 4;
        const padded = base64 + "=".repeat(pad);
        const json = atob(padded);
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
}

/** `true` if missing `exp`, unparsable token, or `exp` is in the past (with skew). */
export function isAccessTokenExpired(token: string | null | undefined, clockSkewSec = 30): boolean {
    if (!token?.trim()) return true;
    const payload = decodeJwtPayload(token);
    const exp = payload?.exp;
    if (typeof exp !== "number") return true;
    const now = Math.floor(Date.now() / 1000);
    return exp <= now + clockSkewSec;
}

function readJwtStringClaim(token: string | null | undefined, claim: string): string | null {
    if (!token?.trim()) return null;
    const payload = decodeJwtPayload(token);
    const value = payload?.[claim];
    if (typeof value !== "string") return null;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
}

/**
 * Organization context used by recruiter/admin tenant-scoped routes (e.g. /jobs).
 * Backend resolves this from JWT claim `organization_id`.
 */
export function getOrganizationIdFromToken(token: string | null | undefined): string | null {
    return readJwtStringClaim(token, "organization_id");
}
