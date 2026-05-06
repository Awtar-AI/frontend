import type { LoginResponse } from "../../login/schemas/login.schema";

export type RefreshSessionPayload = {
    refresh_token: string;
};

export type RefreshSessionResponse = LoginResponse;
