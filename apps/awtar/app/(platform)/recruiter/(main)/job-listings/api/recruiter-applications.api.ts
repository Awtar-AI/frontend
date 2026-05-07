import http from "@/lib/http";
import {
    parseRecruiterApplication,
    parseRecruiterApplications,
    type RecruiterApplication,
} from "../schemas/recruiter-applications.schema";

export const recruiterApplicationsApi = {
    async listByJob(jobId: string): Promise<RecruiterApplication[]> {
        const { data } = await http.get(`/api/v1/applications/job/${jobId}`);
        return parseRecruiterApplications(data);
    },
    async getOne(jobId: string, applicationId: string): Promise<RecruiterApplication> {
        const { data } = await http.get(
            `/api/v1/applications/job/${jobId}/application/${applicationId}`,
        );
        return parseRecruiterApplication(data);
    },
    async getCount(jobId: string): Promise<number> {
        const { data } = await http.get(`/api/v1/applications/job/${jobId}/count`);
        return typeof data?.count === "number" ? data.count : 0;
    },
    async shortlist(applicationId: string): Promise<void> {
        await http.post(`/api/v1/applications/${applicationId}/shortlist`);
    },
    async interview(applicationId: string): Promise<void> {
        await http.post(`/api/v1/applications/${applicationId}/interview`);
    },
    async pass(applicationId: string): Promise<void> {
        await http.post(`/api/v1/applications/${applicationId}/pass`);
    },
    async reject(applicationId: string): Promise<void> {
        await http.post(`/api/v1/applications/${applicationId}/reject`);
    },
};
