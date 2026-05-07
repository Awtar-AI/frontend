"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { dashboardStatsApi } from "../api/dashboard-stats.api";

export const DASHBOARD_STATS_QUERY_KEY = ["applicant", "dashboard", "stats"] as const;

export function useDashboardStats() {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: DASHBOARD_STATS_QUERY_KEY,
        queryFn: () => dashboardStatsApi.getStats(),
        enabled: Boolean(accessToken),
        staleTime: 60_000,
    });
}
