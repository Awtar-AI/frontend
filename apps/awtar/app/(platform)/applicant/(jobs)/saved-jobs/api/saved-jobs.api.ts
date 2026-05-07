import { z } from "zod";
import http from "@/lib/http";

export const savedJobSchema = z.object({
    saved_at: z.string(),
    job_id: z.string(),
    title: z.string(),
    organization_id: z.string(),
    location: z.string(),
    is_remote: z.boolean(),
    employment_type: z.string(),
    experience_level: z.string(),
    status: z.string(),
    deadline: z.string(),
    salary_type: z.string(),
    salary_min: z.number().nullable().optional(),
    salary_max: z.number().nullable().optional(),
    salary_currency: z.string().nullable().optional(),
});

const savedJobsResponseSchema = z.object({
    data: z.array(savedJobSchema),
    pagination: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        has_next: z.boolean(),
    }),
});

export type SavedJob = z.infer<typeof savedJobSchema>;
export type SavedJobsResponse = z.infer<typeof savedJobsResponseSchema>;

export const savedJobsApi = {
    async saveJob(jobId: string): Promise<{ message: string }> {
        const { data } = await http.post(`/api/v1/saved-jobs/${jobId}`, null);
        return data as { message: string };
    },

    async unsaveJob(jobId: string): Promise<{ message: string }> {
        const { data } = await http.delete(`/api/v1/saved-jobs/${jobId}`);
        return data as { message: string };
    },

    async listSavedJobs(params?: { page?: number; limit?: number }): Promise<SavedJobsResponse> {
        const { data } = await http.get("/api/v1/saved-jobs", { params });
        return savedJobsResponseSchema.parse(data);
    },
};
