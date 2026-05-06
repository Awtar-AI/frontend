"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { APPLICANT_PUBLIC_JOBS_QUERY_KEY } from "../../public-jobs/hooks/use-public-jobs";
import { candidateApplicationsApi } from "../api/candidate-applications.api";
import type { ApplyRequestPayload } from "../schemas/candidate-applications.schema";
import { APPLICANT_MY_APPLICATIONS_QUERY_KEY } from "./applications-query-keys";

export function useApplyToJob(jobId: string) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ApplyRequestPayload) =>
            candidateApplicationsApi.apply(jobId, payload),
        onSuccess: () => {
            toastService.success("Application submitted.");
            void queryClient.invalidateQueries({
                queryKey: [...APPLICANT_MY_APPLICATIONS_QUERY_KEY],
            });
            void queryClient.invalidateQueries({ queryKey: [...APPLICANT_PUBLIC_JOBS_QUERY_KEY] });
            router.push("/applicant/applications");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
