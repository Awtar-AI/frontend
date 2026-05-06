import type { LoginResponse } from "@/app/login/schemas/login.schema";

export type RefreshSessionPayload = {
    refresh_token: string;
};

export type RefreshSessionResponse = LoginResponse;
