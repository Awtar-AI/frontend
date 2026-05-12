"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterApplicationsApi } from "../api/recruiter-applications.api";

export const RECRUITER_APPLICATION_VERIFICATIONS_KEY = [
    "recruiter",
    "applications",
    "verifications",
] as const;

export function useRecruiterApplicationVerifications(
    jobId: string,
    applicationId: string | null,
    enabled = true,
) {
    return useQuery({
        queryKey: [...RECRUITER_APPLICATION_VERIFICATIONS_KEY, jobId, applicationId] as const,
        queryFn: () => recruiterApplicationsApi.listVerifications(jobId, applicationId!),
        enabled: enabled && Boolean(jobId && applicationId),
        staleTime: 20_000,
    });
}
