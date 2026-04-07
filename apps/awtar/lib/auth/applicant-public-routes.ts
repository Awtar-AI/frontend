/** Applicant routes that stay reachable without a session (see auth guard). */

export const APPLICANT_PUBLIC_EXACT_PATHS = [
    "/applicant/login",
    "/applicant/register",
    "/applicant/forgot-password",
] as const;

export function isApplicantPublicRoute(pathname: string | null): boolean {
    if (!pathname) return false;
    return APPLICANT_PUBLIC_EXACT_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
