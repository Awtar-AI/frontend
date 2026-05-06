"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterCandidateApi } from "../api/recruiter-candidate.api";

export const RECRUITER_CANDIDATE_PROFILE_QUERY_KEY = [
    "recruiter",
    "candidate",
    "profile",
] as const;

export function useRecruiterCandidateProfile(userId: string | null, enabled = true) {
    return useQuery({
        queryKey: [...RECRUITER_CANDIDATE_PROFILE_QUERY_KEY, userId] as const,
        queryFn: () => recruiterCandidateApi.getById(userId!),
        enabled: enabled && Boolean(userId),
        staleTime: 30_000,
    });
}
