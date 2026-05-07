"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { adminUsersApi } from "../api/users.api";
import type { ChangeUserStatusInput } from "../schemas/users.schema";
import { ADMIN_USER_DETAIL_QUERY_KEY } from "./use-user-detail";
import { ADMIN_USERS_QUERY_KEY } from "./use-users";

export function useUpdateUserStatus(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ChangeUserStatusInput) => adminUsersApi.updateStatus(userId, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [...ADMIN_USERS_QUERY_KEY] }),
                queryClient.invalidateQueries({
                    queryKey: [...ADMIN_USER_DETAIL_QUERY_KEY, userId],
                }),
            ]);
        },
    });
}

export function getUserStatusErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
