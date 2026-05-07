"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { savedJobsApi } from "../api/saved-jobs.api";
import { SAVED_JOBS_QUERY_KEY } from "./saved-jobs-query-keys";

export function useSaveJob() {
    const queryClient = useQueryClient();

    const save = useMutation({
        mutationFn: (jobId: string) => savedJobsApi.saveJob(jobId),
        onSuccess: (data) => {
            toastService.success(data.message ?? "Job saved.");
            void queryClient.invalidateQueries({ queryKey: [...SAVED_JOBS_QUERY_KEY] });
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    const unsave = useMutation({
        mutationFn: (jobId: string) => savedJobsApi.unsaveJob(jobId),
        onSuccess: (data) => {
            toastService.success(data.message ?? "Job removed from saved.");
            void queryClient.invalidateQueries({ queryKey: [...SAVED_JOBS_QUERY_KEY] });
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    const isPending = save.isPending || unsave.isPending;

    function toggle(jobId: string, isSaved: boolean) {
        if (isPending) return;
        if (isSaved) {
            unsave.mutate(jobId);
        } else {
            save.mutate(jobId);
        }
    }

    return { save, unsave, toggle, isPending };
}
