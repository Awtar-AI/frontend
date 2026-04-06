"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { isAccessTokenExpired } from "./jwt";

function subscribeToNothing() {
    return () => {};
}

/** Avoids `useEffect` + `setState` for mount detection (eslint react-hooks/set-state-in-effect). */
function useIsClient() {
    return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

export type AuthGuardProps = {
    children: React.ReactNode;
    /** Where to send unauthenticated or expired users (e.g. `/applicant/login`). */
    loginPath: string;
    /** Return true when the current path must stay public (landing is outside this guard). */
    isPublicPath: (pathname: string) => boolean;
};

function AuthGateLoading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-[#F8F9FA] text-gray-600 text-sm">
            <div
                className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                aria-hidden
            />
            <span>Checking your session…</span>
        </div>
    );
}

/**
 * Client-side route guard: blocks children until a valid, non-expired access token
 * and user exist. Reuse with a different `loginPath` + `isPublicPath` for HR later.
 */
export function AuthGuard({ children, loginPath, isPublicPath }: AuthGuardProps) {
    const pathname = usePathname() ?? "";
    const router = useRouter();
    const token = useAuthStore((s) => s.token);
    const user = useAuthStore((s) => s.user);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const mounted = useIsClient();

    const isPublic = isPublicPath(pathname);
    const sessionInvalid = !token || !user || (token ? isAccessTokenExpired(token) : true);

    useEffect(() => {
        if (!mounted || isPublic) return;
        if (sessionInvalid) {
            clearAuth();
            router.replace(loginPath);
        }
    }, [mounted, isPublic, sessionInvalid, clearAuth, router, loginPath]);

    if (!mounted) {
        if (isPublic) return <>{children}</>;
        return <AuthGateLoading />;
    }

    if (isPublic) {
        return <>{children}</>;
    }

    if (sessionInvalid) {
        return <AuthGateLoading />;
    }

    return <>{children}</>;
}
