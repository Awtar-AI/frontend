"use client";

import { useQuery } from "@tanstack/react-query";
import { type OrgTrendPeriod, recruiterDashboardApi } from "../api/recruiter-dashboard.api";

export const RECRUITER_ORG_TREND_QUERY_KEY = ["recruiter", "dashboard", "org-trend"] as const;

export function useRecruiterOrgTrend(period: OrgTrendPeriod) {
    return useQuery({
        queryKey: [...RECRUITER_ORG_TREND_QUERY_KEY, period] as const,
        queryFn: () => recruiterDashboardApi.getOrganizationTrend(period),
        staleTime: 30_000,
    });
}
