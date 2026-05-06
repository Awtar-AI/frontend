"use client";

import { useQuery } from "@tanstack/react-query";
import { adminOrganizationsApi } from "../api/organizations.api";

export const ADMIN_ORGANIZATION_DETAIL_QUERY_KEY = ["admin", "organization", "detail"] as const;

export function useOrganizationDetail(organizationId: string) {
    return useQuery({
        queryKey: [...ADMIN_ORGANIZATION_DETAIL_QUERY_KEY, organizationId],
        queryFn: () => adminOrganizationsApi.getOne(organizationId),
        enabled: Boolean(organizationId),
        staleTime: 60_000,
    });
}
