export const ADMIN_PUBLIC_EXACT_PATHS = [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
] as const;

export function isAdminPublicRoute(pathname: string | null): boolean {
    if (!pathname) return false;
    return ADMIN_PUBLIC_EXACT_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
}
