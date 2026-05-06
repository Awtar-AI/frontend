"use client";

import { useQuery } from "@tanstack/react-query";
import { publicJobsApi } from "../api/public-jobs.api";
import type { PublicJobsQuery } from "../schemas/public-jobs.schema";

export const APPLICANT_PUBLIC_JOBS_QUERY_KEY = ["applicant", "jobs", "public"] as const;

export function usePublicJobs(params: PublicJobsQuery, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...APPLICANT_PUBLIC_JOBS_QUERY_KEY, params] as const,
        queryFn: () => publicJobsApi.list(params),
        staleTime: 30_000,
        enabled: options?.enabled ?? true,
    });
}
