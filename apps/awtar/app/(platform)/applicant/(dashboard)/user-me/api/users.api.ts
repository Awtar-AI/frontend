import { request } from "@/lib/http";
import type { UserMeResponse } from "../schemas/user-me.schema";

export const usersApi = {
    getSingle(userId: string) {
        return request<UserMeResponse>(`/api/v1/users/${userId}/single`, {
            method: "GET",
        });
    },
};
