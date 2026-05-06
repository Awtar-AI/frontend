"use client";

import { useQuery } from "@tanstack/react-query";
import { adminOrganizationsApi } from "../api/organizations.api";
import type { AdminOrganizationsFilters } from "../schemas/organizations.schema";

export const ADMIN_ORGANIZATIONS_QUERY_KEY = ["admin", "organizations"] as const;

export function useOrganizations(filters: AdminOrganizationsFilters) {
    return useQuery({
        queryKey: [...ADMIN_ORGANIZATIONS_QUERY_KEY, filters],
        queryFn: () => adminOrganizationsApi.list(filters),
        staleTime: 60_000,
    });
}
