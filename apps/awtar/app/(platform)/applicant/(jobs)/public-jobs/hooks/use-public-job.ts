"use client";

import { useQuery } from "@tanstack/react-query";
import { publicJobsApi } from "../api/public-jobs.api";

export const APPLICANT_PUBLIC_JOB_QUERY_KEY = ["applicant", "jobs", "public", "one"] as const;

export function usePublicJob(jobId: string | null) {
    return useQuery({
        queryKey: [...APPLICANT_PUBLIC_JOB_QUERY_KEY, jobId],
        queryFn: () => publicJobsApi.getOne(jobId!),
        enabled: Boolean(jobId?.trim()),
        staleTime: 60_000,
    });
}
