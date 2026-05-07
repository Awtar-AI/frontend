import http from "@/lib/http";
import {
    parseRecruiterOrgStats,
    parseRecruiterOrgTrend,
    type RecruiterOrgStats,
    type RecruiterOrgTrend,
} from "../schemas/recruiter-dashboard.schema";

export type OrgTrendPeriod = "7d" | "1m" | "3m" | "6m" | "1y";

export const recruiterDashboardApi = {
    async getOrganizationStats(): Promise<RecruiterOrgStats> {
        const { data } = await http.get("/api/v1/stats/organization");
        return parseRecruiterOrgStats(data);
    },

    async getOrganizationTrend(period: OrgTrendPeriod): Promise<RecruiterOrgTrend> {
        const { data } = await http.get("/api/v1/stats/organization/trend", {
            params: { period },
        });
        return parseRecruiterOrgTrend(data);
    },
};
