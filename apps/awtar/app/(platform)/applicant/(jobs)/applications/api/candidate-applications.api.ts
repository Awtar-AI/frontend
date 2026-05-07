import http from "@/lib/http";
import {
    type ApplicationResponse,
    type ApplyRequestPayload,
    parseApplicationList,
    parseApplicationResponse,
} from "../schemas/candidate-applications.schema";

export const candidateApplicationsApi = {
    async apply(jobId: string, payload: ApplyRequestPayload): Promise<ApplicationResponse> {
        const { data } = await http.post(`/api/v1/applications/job/${jobId}`, payload);
        return parseApplicationResponse(data);
    },

    async listMine(status?: "Applied" | "Pending" | "Accepted" | "Rejected"): Promise<ApplicationResponse[]> {
        const { data } = await http.get("/api/v1/applications", {
            params: status ? { status } : undefined,
        });
        return parseApplicationList(data);
    },
};
