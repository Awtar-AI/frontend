"use client";

import { useQuery } from "@tanstack/react-query";
import { applicantVerificationApi } from "../api/applicant-verification.api";

export const APPLICANT_VERIFICATION_SESSIONS_KEY = ["applicant", "verification", "sessions"] as const;

export function useVerificationSessionsForApplication(applicationId: string | null, enabled = true) {
    return useQuery({
        queryKey: [...APPLICANT_VERIFICATION_SESSIONS_KEY, applicationId] as const,
        queryFn: () => applicantVerificationApi.listForApplication(applicationId!),
        enabled: Boolean(applicationId) && enabled,
        staleTime: 10_000,
    });
}
