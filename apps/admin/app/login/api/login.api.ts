import http from "@/lib/http";
import {
    type LoginFormData,
    type LoginResponse,
    parseLoginResponse,
} from "../schemas/login.schema";

export const loginApi = {
    async login(payload: LoginFormData): Promise<LoginResponse> {
        const { data } = await http.post("/api/v1/auth/login", payload);
        return parseLoginResponse(data);
    },
};
