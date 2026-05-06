"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterApplicationsApi } from "../api/recruiter-applications.api";

export const RECRUITER_JOB_APPLICATIONS_QUERY_KEY = ["recruiter", "jobs", "applications"] as const;

export function useRecruiterJobApplications(jobId: string, enabled = true) {
    return useQuery({
        queryKey: [...RECRUITER_JOB_APPLICATIONS_QUERY_KEY, jobId] as const,
        queryFn: () => recruiterApplicationsApi.listByJob(jobId),
        enabled: enabled && Boolean(jobId),
        staleTime: 30_000,
    });
}
