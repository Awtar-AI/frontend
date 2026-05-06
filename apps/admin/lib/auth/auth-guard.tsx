"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { isAccessTokenExpired } from "./jwt";

function subscribeToNothing() {
    return () => {};
}

function useIsClient() {
    return useSyncExternalStore(
        subscribeToNothing,
        () => true,
        () => false,
    );
}

function useHasHydrated() {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
        if (useAuthStore.persist.hasHydrated()) setHydrated(true);
        return unsub;
    }, []);
    return hydrated;
}

export type AuthGuardProps = {
    children: React.ReactNode;
    loginPath: string;
    isPublicPath: (pathname: string) => boolean;
};

function AuthGateLoading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-awtar-navy text-awtar-slate text-sm">
            <div
                className="h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"
                aria-hidden
            />
            <span>Checking your admin session...</span>
        </div>
    );
}

export function AuthGuard({ children, loginPath, isPublicPath }: AuthGuardProps) {
    const pathname = usePathname() ?? "";
    const router = useRouter();
    const token = useAuthStore((state) => state.accessToken);
    const role = useAuthStore((state) => state.role);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const mounted = useIsClient();
    const hydrated = useHasHydrated();

    const isPublic = isPublicPath(pathname);
    const sessionInvalid = !token || isAccessTokenExpired(token) || role !== "admin";

    useEffect(() => {
        if (!mounted || !hydrated || isPublic) return;
        if (sessionInvalid) {
            clearAuth();
            router.replace(loginPath);
        }
    }, [mounted, hydrated, isPublic, sessionInvalid, clearAuth, router, loginPath]);

    if (!mounted || !hydrated) {
        if (isPublic) return <>{children}</>;
        return <AuthGateLoading />;
    }

    if (isPublic) return <>{children}</>;
    if (sessionInvalid) return <AuthGateLoading />;

    return <>{children}</>;
}
