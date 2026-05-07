"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { adminUsersApi } from "../api/users.api";
import type { CreateUserPayload } from "../schemas/users.schema";
import { ADMIN_USERS_QUERY_KEY } from "./use-users";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateUserPayload) => adminUsersApi.createUser(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [...ADMIN_USERS_QUERY_KEY],
            });
        },
    });
}

export function getCreateUserErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
