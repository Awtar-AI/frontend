"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { acceptInvitationApi } from "../api/accept-invitation.api";
import type {
    AcceptInvitationFormData,
    AcceptInvitationParams,
} from "../schemas/accept-invitation.schema";
import { toAcceptInvitationPayload } from "../schemas/accept-invitation.schema";

export function useAcceptInvitation(params: AcceptInvitationParams) {
    const router = useRouter();

    return useMutation({
        mutationFn: (formData: AcceptInvitationFormData) =>
            acceptInvitationApi.accept(toAcceptInvitationPayload(formData), params),
        onSuccess: () => {
            toastService.success("Account created successfully. You can now sign in.");
            router.push("/recruiter/login");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
