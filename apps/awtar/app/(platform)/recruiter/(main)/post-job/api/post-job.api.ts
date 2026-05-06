import http from "@/lib/http";
import {
    parseJobPostList,
    parseJobPostResponse,
    type CreateJobPayload,
    type JobPostResponse,
    type UpdateJobPayload,
} from "../schemas/post-job.schema";

export const postJobApi = {
    async create(payload: CreateJobPayload): Promise<JobPostResponse> {
        const { data } = await http.post("/api/v1/jobs", payload);
        return parseJobPostResponse(data);
    },

    async list(): Promise<JobPostResponse[]> {
        const { data } = await http.get("/api/v1/jobs");
        return parseJobPostList(data);
    },

    async getOne(jobId: string): Promise<JobPostResponse> {
        const { data } = await http.get(`/api/v1/jobs/${jobId}`);
        return parseJobPostResponse(data);
    },

    async update(jobId: string, payload: UpdateJobPayload): Promise<JobPostResponse> {
        const { data } = await http.patch(`/api/v1/jobs/${jobId}`, payload);
        return parseJobPostResponse(data);
    },

    async remove(jobId: string): Promise<void> {
        await http.delete(`/api/v1/jobs/${jobId}`);
    },
};
