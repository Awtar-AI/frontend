"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { candidateApplicationsApi } from "../api/candidate-applications.api";
import { APPLICANT_MY_APPLICATIONS_QUERY_KEY } from "./applications-query-keys";

export function useMyApplications(status?: "Applied" | "Pending" | "Accepted" | "Rejected") {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: [...APPLICANT_MY_APPLICATIONS_QUERY_KEY, status ?? "all"] as const,
        queryFn: () => candidateApplicationsApi.listMine(status),
        enabled: Boolean(accessToken),
        staleTime: 60_000,
    });
}
