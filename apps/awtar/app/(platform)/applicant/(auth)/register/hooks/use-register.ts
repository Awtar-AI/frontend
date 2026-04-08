"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { registerApi } from "../api/register.api";
import type { RegisterApplicantParams, RegisterFormData } from "../schemas/register.schema";
import { toApplicantPayload } from "../schemas/register.schema";

export function useRegister(params?: RegisterApplicantParams) {
    const router = useRouter();

    return useMutation({
        mutationFn: (formData: RegisterFormData) =>
            registerApi.register(toApplicantPayload(formData), params),
        onSuccess: () => {
            toastService.success("Account created successfully. You can now log in.");
            router.push("/applicant/login");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
