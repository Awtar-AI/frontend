import http from "@/lib/http";
import type { UserMeResponse } from "../schemas/user-me.schema";

export const usersApi = {
    async getSingle(userId: string) {
        const { data } = await http.get<UserMeResponse>(`/api/v1/users/${userId}/single`);
        return data;
    },
};
