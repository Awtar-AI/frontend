/** Applicant routes that stay reachable without a session (see auth guard). */

export const APPLICANT_PUBLIC_EXACT_PATHS = [
    "/applicant/login",
    "/applicant/register",
    "/applicant/forgot-password",
] as const;

/** Public job board (no JWT). `GET /jobs/public` — see APPLICANT-FRONTEND-API.md. Apply flow stays authenticated. */
function isPublicJobBoardPath(pathname: string): boolean {
    return pathname === "/applicant/jobs" || pathname.startsWith("/applicant/jobs/");
}

export function isApplicantPublicRoute(pathname: string | null): boolean {
    if (!pathname) return false;
    if (isPublicJobBoardPath(pathname)) return true;
    return APPLICANT_PUBLIC_EXACT_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
