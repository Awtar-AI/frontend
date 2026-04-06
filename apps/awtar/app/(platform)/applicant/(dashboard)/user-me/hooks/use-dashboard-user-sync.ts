"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { fetchAndStoreCurrentUser } from "../services/user-me.service";

/** Fetches `GET /users/:id/single` and updates auth store (dashboard shell). */
export function useDashboardUserSync() {
    const userId = useAuthStore((s) => s.user?.id);
    const token = useAuthStore((s) => s.token);

    useQuery({
        queryKey: ["applicant-current-user", userId],
        queryFn: () => fetchAndStoreCurrentUser(userId!),
        enabled: Boolean(userId && token),
        staleTime: 60_000,
    });
}
