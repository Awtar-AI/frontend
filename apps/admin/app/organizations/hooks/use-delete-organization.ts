"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { adminOrganizationsApi } from "../api/organizations.api";
import { ADMIN_ORGANIZATION_DETAIL_QUERY_KEY } from "./use-organization-detail";
import { ADMIN_ORGANIZATIONS_QUERY_KEY } from "./use-organizations";

export function useDeleteOrganization(organizationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => adminOrganizationsApi.deleteOrganization(organizationId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [...ADMIN_ORGANIZATIONS_QUERY_KEY] }),
                queryClient.removeQueries({
                    queryKey: [...ADMIN_ORGANIZATION_DETAIL_QUERY_KEY, organizationId],
                }),
            ]);
        },
    });
}

export function getDeleteOrganizationErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
