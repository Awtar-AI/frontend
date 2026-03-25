"use client";

import { useMutation } from "@tanstack/react-query";
import { registerService } from "../services/register.service";
import type { RegisterApplicantParams, RegisterApplicantPayload } from "../schemas/register.schema";

export function useRegister(params?: RegisterApplicantParams) {
    return useMutation({
        mutationFn: (payload: RegisterApplicantPayload) =>
            registerService.register(payload, params),
    });
}
