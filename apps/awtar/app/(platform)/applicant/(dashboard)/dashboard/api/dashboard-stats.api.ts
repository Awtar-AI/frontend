import { z } from "zod";
import http from "@/lib/http";

const dashboardStatsSchema = z.object({
    accepted: z.number(),
    accepted_diff: z.number(),
    open: z.number(),
    open_diff: z.number(),
    rejected: z.number(),
    rejected_diff: z.number(),
    saved_jobs: z.number(),
    saved_jobs_diff: z.number(),
    total_sent: z.number(),
    total_sent_diff: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const dashboardStatsApi = {
    async getStats(): Promise<DashboardStats> {
        const { data } = await http.get("/api/v1/stats/me");
        return dashboardStatsSchema.parse(data);
    },
};
