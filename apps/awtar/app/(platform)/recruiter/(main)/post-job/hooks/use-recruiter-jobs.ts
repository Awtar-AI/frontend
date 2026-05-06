"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthOrganizationId } from "@/lib/hooks/use-auth";
import { postJobApi } from "../api/post-job.api";

export const RECRUITER_JOBS_QUERY_KEY = ["recruiter", "jobs", "list"] as const;

export function useRecruiterJobs() {
    const organizationId = useAuthOrganizationId();

    return useQuery({
        queryKey: [...RECRUITER_JOBS_QUERY_KEY],
        queryFn: () => postJobApi.list(),
        enabled: Boolean(organizationId),
        staleTime: 30_000,
    });
}
