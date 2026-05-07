import http from "@/lib/http";
import {
    type DashboardStatsResponse,
    parseDashboardStatsResponse,
} from "../schemas/dashboard.schema";

export const adminDashboardApi = {
    async getStats(): Promise<DashboardStatsResponse> {
        const { data } = await http.get("/api/v1/stats/admin");
        return parseDashboardStatsResponse(data);
    },
};
