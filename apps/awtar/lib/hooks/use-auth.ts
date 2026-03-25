"use client";

import { useAuthStore } from "../store/auth";

export function useAuthUser() {
    return useAuthStore((state) => state.user);
}

export function useAuthToken() {
    return useAuthStore((state) => state.token);
}

export function useIsAuthenticated() {
    const token = useAuthStore((state) => state.token);
    return Boolean(token);
}
