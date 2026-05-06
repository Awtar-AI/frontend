"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { postJobApi } from "../../post-job/api/post-job.api";
import { RECRUITER_JOBS_QUERY_KEY } from "../../post-job/hooks/use-recruiter-jobs";
import type { UpdateJobPayload } from "../../post-job/schemas/post-job.schema";

export function useUpdateRecruiterJob(jobId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateJobPayload) => postJobApi.update(jobId, payload),
        onSuccess: () => {
            toastService.success("Job updated successfully.");
            void queryClient.invalidateQueries({ queryKey: [...RECRUITER_JOBS_QUERY_KEY] });
            void queryClient.invalidateQueries({ queryKey: ["recruiter", "jobs", "detail", jobId] });
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
