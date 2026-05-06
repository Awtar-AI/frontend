/** Recruiter routes that stay reachable without a session (see auth guard). */

export const RECRUITER_PUBLIC_EXACT_PATHS = [
    "/recruiter/login",
    "/recruiter/register",
    "/recruiter/forgot-password",
] as const;

export function isRecruiterPublicRoute(pathname: string | null): boolean {
    if (!pathname) return false;
    return RECRUITER_PUBLIC_EXACT_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
