import http from "@/lib/http";

export const logoutApi = {
    async logout(refreshToken: string) {
        const { data } = await http.post<{ message: string }>(
            "/api/v1/auth/logout",
            { refresh_token: refreshToken },
        );
        return data;
    },
};
