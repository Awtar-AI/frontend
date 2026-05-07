"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "../api/dashboard.api";

export const ADMIN_DASHBOARD_STATS_QUERY_KEY = ["admin", "dashboard", "stats"] as const;

export function useDashboardStats() {
    return useQuery({
        queryKey: ADMIN_DASHBOARD_STATS_QUERY_KEY,
        queryFn: () => adminDashboardApi.getStats(),
        staleTime: 60_000,
    });
}
