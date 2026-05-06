"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { isTerminalRefreshError, refreshAuthSessionSingleFlight } from "./refresh-session";
import { WrongRoleAccess } from "./wrong-role-access";
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
    allowedRoles?: Array<"candidate" | "hr" | "admin">;
    expectedAreaLabel?: string;
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

export function AuthGuard({
    children,
    loginPath,
    isPublicPath,
    allowedRoles,
    expectedAreaLabel = "this area",
}: AuthGuardProps) {
    const pathname = usePathname() ?? "";
    const router = useRouter();
    const token = useAuthStore((s) => s.accessToken);
    const refreshToken = useAuthStore((s) => s.refreshToken);
    const role = useAuthStore((s) => s.role);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const [recoveringSession, setRecoveringSession] = useState(false);

    const mounted = useIsClient();
    const hydrated = useHasHydrated();

    const isPublic = isPublicPath(pathname);
    const sessionInvalid = !token || isAccessTokenExpired(token);
    const wrongRole =
        !isPublic &&
        !sessionInvalid &&
        !!allowedRoles?.length &&
        (!role || !allowedRoles.includes(role));

    useEffect(() => {
        if (!mounted || !hydrated || isPublic) return;
        let cancelled = false;

        const recover = async () => {
            if (!sessionInvalid) return;
            if (refreshToken) {
                setRecoveringSession(true);
                try {
                    await refreshAuthSessionSingleFlight();
                    if (!cancelled) setRecoveringSession(false);
                    return;
                } catch (error) {
                    if (isTerminalRefreshError(error)) {
                        clearAuth();
                    }
                } finally {
                    if (!cancelled) setRecoveringSession(false);
                }
            }

            clearAuth();
            router.replace(loginPath);
        };

        void recover();

        return () => {
            cancelled = true;
        };
    }, [mounted, hydrated, isPublic, sessionInvalid, refreshToken, clearAuth, router, loginPath]);

    if (!mounted || !hydrated) {
        if (isPublic) return <>{children}</>;
        return <AuthGateLoading />;
    }

    if (isPublic) return <>{children}</>;
    if (sessionInvalid || recoveringSession) return <AuthGateLoading />;
    if (wrongRole) {
        return (
            <WrongRoleAccess
                role={role}
                expectedAreaLabel={expectedAreaLabel}
                loginPath={loginPath}
            />
        );
    }

    return <>{children}</>;
}
