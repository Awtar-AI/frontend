"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { postJobApi } from "../api/post-job.api";
import { type CreateJobFormData, toCreateJobPayload } from "../schemas/post-job.schema";
import { RECRUITER_JOBS_QUERY_KEY } from "./use-recruiter-jobs";

export function useCreateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: CreateJobFormData) =>
            postJobApi.create(toCreateJobPayload(formData)),
        onSuccess: () => {
            toastService.success("Job posted successfully.");
            void queryClient.invalidateQueries({ queryKey: [...RECRUITER_JOBS_QUERY_KEY] });
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
