"use client";

import { useMutation } from "@tanstack/react-query";
import type { LoginFormData } from "../schemas/login.schema";
import { loginService } from "../services/login.service";

export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginFormData) => loginService.login(payload),
    });
}
