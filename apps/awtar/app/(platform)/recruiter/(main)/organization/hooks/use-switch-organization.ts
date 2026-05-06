"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppError, normalizeError } from "@/lib/errors";
import { refreshSessionApi } from "../../../(auth)/refresh/api/refresh.api";
import { useAuthStore } from "@/lib/store/auth";
import { recruiterOrganizationApi } from "../api/organization.api";
import { toKnownOrganization } from "../schemas/organization.schema";
import { RECRUITER_ORGANIZATION_QUERY_KEY } from "./use-recruiter-organization";
import { ORGANIZATION_EMPLOYEES_QUERY_KEY } from "../../team/hooks/use-organization-employees";

export function useSwitchOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (organizationId: string) => {
            const { role, refreshToken } = useAuthStore.getState();
            if (role !== "hr") {
                throw new AppError(403, "Only HR users can switch organizations.", "FORBIDDEN");
            }

            const detail = await recruiterOrganizationApi.switchOrganization(organizationId);

            if (!refreshToken) {
                throw new AppError(401, "Missing refresh token. Please sign in again.", "UNAUTHORIZED");
            }

            const session = await refreshSessionApi.refresh({ refresh_token: refreshToken });

            return { detail, session };
        },
        onSuccess: async ({ detail, session }) => {
            useAuthStore.getState().addKnownOrganization(toKnownOrganization(detail));
            useAuthStore.getState().setSession({
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
                userId: session.id,
                role: session.role,
                organizationId: session.last_login_organization,
            });

            await queryClient.invalidateQueries({
                queryKey: [...RECRUITER_ORGANIZATION_QUERY_KEY],
            });
            await queryClient.invalidateQueries({
                queryKey: [...ORGANIZATION_EMPLOYEES_QUERY_KEY],
            });
        },
    });
}

export function getSwitchOrganizationErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
