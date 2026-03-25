"use client";

import { useMutation } from "@tanstack/react-query";
import { loginService } from "../services/login.service";
import type { LoginPayload } from "../schemas/login.schema";

export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginPayload) => loginService.login(payload),
    });
}
