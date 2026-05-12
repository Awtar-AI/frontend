"use client";

import { useQuery } from "@tanstack/react-query";
import { candidateApplicationsApi } from "../api/candidate-applications.api";

export const APPLICANT_APPLICATION_BY_ID_KEY = ["applicant", "application", "detail"] as const;

export function useApplicationById(applicationId: string | null, opts?: { refetchInterval?: number }) {
    return useQuery({
        queryKey: [...APPLICANT_APPLICATION_BY_ID_KEY, applicationId] as const,
        queryFn: () => candidateApplicationsApi.getById(applicationId!),
        enabled: Boolean(applicationId),
        staleTime: 5000,
        refetchInterval: opts?.refetchInterval,
    });
}
