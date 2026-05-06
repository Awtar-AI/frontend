"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterApplicationsApi } from "../api/recruiter-applications.api";

export const RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY = [
    "recruiter",
    "jobs",
    "applications",
    "detail",
] as const;

export function useRecruiterJobApplicationDetail(
    jobId: string,
    applicationId: string | null,
    enabled = true,
) {
    return useQuery({
        queryKey: [...RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY, jobId, applicationId] as const,
        queryFn: () => recruiterApplicationsApi.getOne(jobId, applicationId!),
        enabled: enabled && Boolean(jobId && applicationId),
        staleTime: 30_000,
    });
}
