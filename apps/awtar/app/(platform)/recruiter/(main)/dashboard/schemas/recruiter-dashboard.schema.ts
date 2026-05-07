import { z } from "zod";

export const recruiterOrgStatsSchema = z.object({
    total_active_jobs: z.number(),
    total_applications: z.number(),
    active_jobs_this_month: z.number(),
    active_jobs_last_month: z.number(),
    active_jobs_diff: z.number(),
    apps_this_month: z.number(),
    apps_last_month: z.number(),
    apps_diff: z.number(),
    active_jobs_change_pct: z.number(),
    apps_change_pct: z.number(),
});

export type RecruiterOrgStats = z.infer<typeof recruiterOrgStatsSchema>;

export const recruiterOrgTrendPointSchema = z.object({
    label: z.string(),
    active_jobs: z.number(),
    applications: z.number(),
});

export const recruiterOrgTrendSchema = z.object({
    period: z.enum(["7d", "1m", "3m", "6m", "1y"]),
    data: z.array(recruiterOrgTrendPointSchema),
});

export type RecruiterOrgTrend = z.infer<typeof recruiterOrgTrendSchema>;
export type RecruiterOrgTrendPoint = z.infer<typeof recruiterOrgTrendPointSchema>;

export function parseRecruiterOrgStats(data: unknown): RecruiterOrgStats {
    return recruiterOrgStatsSchema.parse(data);
}

export function parseRecruiterOrgTrend(data: unknown): RecruiterOrgTrend {
    return recruiterOrgTrendSchema.parse(data);
}
