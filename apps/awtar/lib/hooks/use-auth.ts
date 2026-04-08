"use client";

import { useAuthStore } from "../store/auth";
import { useCurrentUser } from "./use-current-user";

/** Full user profile from /me (React Query). Returns null while loading. */
export function useAuthUser() {
    const { data } = useCurrentUser();
    return data ?? null;
}

export function useAuthToken() {
    return useAuthStore((s) => s.accessToken);
}

export function useIsAuthenticated() {
    return Boolean(useAuthStore((s) => s.accessToken));
}
