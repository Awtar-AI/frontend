"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { candidateApplicationsApi } from "../api/candidate-applications.api";
import type { ApplicationStatus } from "../schemas/candidate-applications.schema";
import { APPLICANT_MY_APPLICATIONS_QUERY_KEY } from "./applications-query-keys";

export function useMyApplications(status?: ApplicationStatus) {
    const userId = useAuthStore((s) => s.userId);
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: [...APPLICANT_MY_APPLICATIONS_QUERY_KEY, status ?? "all"] as const,
        queryFn: () => candidateApplicationsApi.listMine(status),
        enabled: Boolean(userId && accessToken),
        staleTime: 60_000,
    });
}
