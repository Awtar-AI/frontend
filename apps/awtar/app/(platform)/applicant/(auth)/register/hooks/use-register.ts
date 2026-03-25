"use client";

import { useMutation } from "@tanstack/react-query";
import type { RegisterApplicantParams, RegisterApplicantPayload } from "../schemas/register.schema";
import { registerService } from "../services/register.service";

export function useRegister(params?: RegisterApplicantParams) {
    return useMutation({
        mutationFn: (payload: RegisterApplicantPayload) =>
            registerService.register(payload, params),
    });
}
