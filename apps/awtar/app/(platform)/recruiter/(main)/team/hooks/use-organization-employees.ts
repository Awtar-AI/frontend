"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterTeamApi } from "../api/team.api";

export const ORGANIZATION_EMPLOYEES_QUERY_KEY = ["recruiter", "organization", "employees"] as const;

export function useOrganizationEmployees(organizationId: string | null) {
    return useQuery({
        queryKey: [...ORGANIZATION_EMPLOYEES_QUERY_KEY, organizationId],
        queryFn: () => recruiterTeamApi.listEmployees(organizationId!),
        enabled: Boolean(organizationId),
        staleTime: 60_000,
    });
}
