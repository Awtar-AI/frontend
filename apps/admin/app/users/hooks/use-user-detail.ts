"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../api/users.api";

export const ADMIN_USER_DETAIL_QUERY_KEY = ["admin", "user", "detail"] as const;

export function useUserDetail(userId: string) {
    return useQuery({
        queryKey: [...ADMIN_USER_DETAIL_QUERY_KEY, userId],
        queryFn: () => adminUsersApi.getOne(userId),
        enabled: !!userId,
        staleTime: 60_000,
    });
}
