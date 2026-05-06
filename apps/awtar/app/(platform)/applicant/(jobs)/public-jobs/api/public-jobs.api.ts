import http from "@/lib/http";
import {
    type PublicJob,
    type PublicJobListResponse,
    type PublicJobsQuery,
    parsePublicJob,
    parsePublicJobListResponse,
} from "../schemas/public-jobs.schema";

function compactParams(q: PublicJobsQuery): Record<string, string | number | boolean> {
    const out: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(q)) {
        if (v === undefined || v === null || v === "") continue;
        out[k] = v as string | number | boolean;
    }
    return out;
}

export const publicJobsApi = {
    async list(query: PublicJobsQuery = {}): Promise<PublicJobListResponse> {
        const { data } = await http.get("/api/v1/jobs/public", {
            params: compactParams(query),
        });
        return parsePublicJobListResponse(data);
    },

    async getOne(jobId: string): Promise<PublicJob> {
        const { data } = await http.get(`/api/v1/jobs/public/${jobId}`);
        return parsePublicJob(data);
    },
};
