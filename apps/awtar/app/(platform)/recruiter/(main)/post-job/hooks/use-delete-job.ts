"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { postJobApi } from "../api/post-job.api";
import { RECRUITER_JOBS_QUERY_KEY } from "./use-recruiter-jobs";

export function useDeleteJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) => postJobApi.remove(jobId),
        onSuccess: () => {
            toastService.success("Job removed.");
            void queryClient.invalidateQueries({ queryKey: [...RECRUITER_JOBS_QUERY_KEY] });
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
