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
