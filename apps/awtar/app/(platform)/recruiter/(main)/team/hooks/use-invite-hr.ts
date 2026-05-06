"use client";

import { useMutation } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { recruiterTeamApi } from "../api/team.api";
import { type InviteHrFormData, toInviteHrPayload } from "../schemas/team.schema";

export function useInviteHr(organizationId: string | null) {
    return useMutation({
        mutationFn: (formData: InviteHrFormData) => {
            if (!organizationId) {
                throw new Error("Missing active organization. Please sign in again.");
            }
            return recruiterTeamApi.inviteHr(organizationId, toInviteHrPayload(formData));
        },
        onSuccess: (data) => {
            toastService.success(data.message || "Invitation sent successfully.");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
