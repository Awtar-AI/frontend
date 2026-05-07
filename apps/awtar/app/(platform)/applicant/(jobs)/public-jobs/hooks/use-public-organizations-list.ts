"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { organizationsPublicApi } from "../api/organizations-public.api";
import { publicJobsApi } from "../api/public-jobs.api";
import type { OrganizationPublic } from "../schemas/organizations-public.schema";

export type OrganizationWithJobCount = OrganizationPublic & { job_count: number };

export function usePublicOrganizationsList() {
    const jobsQuery = useQuery({
        queryKey: ["applicant", "public-jobs-for-orgs"],
        queryFn: () => publicJobsApi.list({ limit: 200, status: "active" }),
        staleTime: 300_000,
    });

    const { orgIds, jobCountMap } = useMemo(() => {
        const map = new Map<string, number>();
        for (const job of jobsQuery.data?.jobs ?? []) {
            map.set(job.organization_id, (map.get(job.organization_id) ?? 0) + 1);
        }
        return { orgIds: Array.from(map.keys()), jobCountMap: map };
    }, [jobsQuery.data]);

    const orgQueries = useQueries({
        queries: orgIds.map((id) => ({
            queryKey: ["applicant", "organizations", "public", id],
            queryFn: () => organizationsPublicApi.getPublic(id),
            staleTime: 300_000,
        })),
    });

    const organizations = useMemo<OrganizationWithJobCount[]>(() => {
        return orgQueries
            .map((q, i) =>
                q.data ? { ...q.data, job_count: jobCountMap.get(orgIds[i]) ?? 0 } : null,
            )
            .filter((o): o is OrganizationWithJobCount => o !== null);
    }, [orgQueries, orgIds, jobCountMap]);

    const isLoading =
        jobsQuery.isLoading || (orgIds.length > 0 && orgQueries.some((q) => q.isPending));
    const isError = jobsQuery.isError || orgQueries.some((q) => q.isError);

    return { organizations, isLoading, isError };
}
