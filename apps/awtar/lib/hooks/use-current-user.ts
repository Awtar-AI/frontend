"use client";

import { useQuery } from "@tanstack/react-query";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import {
    appUserFromMeResponse,
    type UserMeResponse,
} from "@/applicant/user-me/schemas/user-me.schema";
import http from "@/lib/http";
import { useAuthStore } from "@/lib/store/auth";

export const USER_QUERY_KEY = ["users", "me"] as const;

export function useCurrentUser() {
    const userId = useAuthStore((s) => s.userId);
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery<AppUser>({
        queryKey: [...USER_QUERY_KEY],
        queryFn: async () => {
            const { data } = await http.get<UserMeResponse>(`/api/v1/users/${userId}/single`);
            return appUserFromMeResponse(data);
        },
        enabled: !!userId && !!accessToken,
        staleTime: 5 * 60_000,
    });
}
