"use client";

import { useAuthStore } from "../store/auth";

export function useAuthToken() {
    return useAuthStore((state) => state.accessToken);
}

export function useIsAuthenticated() {
    return Boolean(useAuthStore((state) => state.accessToken));
}
