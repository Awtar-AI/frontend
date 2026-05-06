"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { adminOrganizationsApi } from "../api/organizations.api";
import type { ChangeOrganizationStatusInput } from "../schemas/organizations.schema";
import { ADMIN_ORGANIZATION_DETAIL_QUERY_KEY } from "./use-organization-detail";
import { ADMIN_ORGANIZATIONS_QUERY_KEY } from "./use-organizations";

export function useUpdateOrganizationStatus(organizationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ChangeOrganizationStatusInput) =>
            adminOrganizationsApi.updateStatus(organizationId, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [...ADMIN_ORGANIZATIONS_QUERY_KEY] }),
                queryClient.invalidateQueries({
                    queryKey: [...ADMIN_ORGANIZATION_DETAIL_QUERY_KEY, organizationId],
                }),
            ]);
        },
    });
}

export function getOrganizationStatusErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
