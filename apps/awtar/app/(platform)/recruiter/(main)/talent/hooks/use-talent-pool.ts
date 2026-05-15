"use client";

import { useQuery } from "@tanstack/react-query";
import { talentPoolApi } from "../api/talent-pool.api";

export const TALENT_POOL_QUERY_KEY = ["recruiter", "talent", "pool"] as const;

export function useTalentPool() {
    return useQuery({
        queryKey: TALENT_POOL_QUERY_KEY,
        queryFn: () => talentPoolApi.listCandidates(),
        staleTime: 60_000,
    });
}
