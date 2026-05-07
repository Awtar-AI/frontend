"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../api/users.api";
import type { AdminUsersFilters } from "../schemas/users.schema";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export function useUsers(filters: AdminUsersFilters) {
    return useQuery({
        queryKey: [...ADMIN_USERS_QUERY_KEY, filters],
        queryFn: () => adminUsersApi.list(filters),
        staleTime: 60_000,
    });
}
