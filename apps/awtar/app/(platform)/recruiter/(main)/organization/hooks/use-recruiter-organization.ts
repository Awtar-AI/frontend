"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterOrganizationApi } from "../api/organization.api";

export const RECRUITER_ORGANIZATION_QUERY_KEY = ["recruiter", "organization", "detail"] as const;

export function useRecruiterOrganization(organizationId: string | null) {
    return useQuery({
        queryKey: [...RECRUITER_ORGANIZATION_QUERY_KEY, organizationId],
        queryFn: () => recruiterOrganizationApi.getOne(organizationId!),
        enabled: Boolean(organizationId),
        staleTime: 60_000,
    });
}
