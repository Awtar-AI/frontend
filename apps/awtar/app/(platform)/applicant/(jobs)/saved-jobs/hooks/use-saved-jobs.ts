"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { savedJobsApi } from "../api/saved-jobs.api";
import { SAVED_JOBS_QUERY_KEY } from "./saved-jobs-query-keys";

export function useSavedJobs(params?: { page?: number; limit?: number }) {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: [...SAVED_JOBS_QUERY_KEY, params?.page ?? 1, params?.limit ?? 20] as const,
        queryFn: () => savedJobsApi.listSavedJobs(params),
        enabled: Boolean(accessToken),
        staleTime: 30_000,
    });
}
