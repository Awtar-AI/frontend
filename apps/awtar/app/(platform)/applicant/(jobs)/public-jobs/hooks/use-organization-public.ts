"use client";

import { useQuery } from "@tanstack/react-query";
import { organizationsPublicApi } from "../api/organizations-public.api";

export const APPLICANT_ORG_PUBLIC_QUERY_KEY = ["applicant", "organizations", "public"] as const;

export function useOrganizationPublic(organizationId: string | null) {
    return useQuery({
        queryKey: [...APPLICANT_ORG_PUBLIC_QUERY_KEY, organizationId],
        queryFn: () => organizationsPublicApi.getPublic(organizationId!),
        enabled: Boolean(organizationId?.trim()),
        staleTime: 300_000,
    });
}
