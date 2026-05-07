"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterDashboardApi } from "../api/recruiter-dashboard.api";

export const RECRUITER_ORG_STATS_QUERY_KEY = ["recruiter", "dashboard", "org-stats"] as const;

export function useRecruiterOrgStats() {
    return useQuery({
        queryKey: RECRUITER_ORG_STATS_QUERY_KEY,
        queryFn: recruiterDashboardApi.getOrganizationStats,
        staleTime: 30_000,
    });
}
