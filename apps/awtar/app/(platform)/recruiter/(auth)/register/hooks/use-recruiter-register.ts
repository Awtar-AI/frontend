"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { recruiterRegisterApi } from "../api/recruiter-register.api";
import type { RecruiterRegisterFormData } from "../schemas/recruiter-register.schema";
import { toRecruiterPayload } from "../schemas/recruiter-register.schema";

export function useRecruiterRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (formData: RecruiterRegisterFormData) =>
            recruiterRegisterApi.register(toRecruiterPayload(formData)),
        onSuccess: (data) => {
            toastService.success(
                data.message || "Organization registered. Verification takes 24–48 hours.",
            );
            router.push("/recruiter/login");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
