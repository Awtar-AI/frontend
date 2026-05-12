"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    recruiterShortlistApi,
    type ApproveStatusInput,
    type RunShortlistInput,
} from "../api/recruiter-shortlist.api";
import { RECRUITER_JOB_APPLICATIONS_QUERY_KEY } from "./use-recruiter-job-applications";

export function useRunShortlist(jobId: string) {
    return useMutation({
        mutationFn: (input: Omit<RunShortlistInput, "jobId">) =>
            recruiterShortlistApi.runShortlist({ ...input, jobId }),
    });
}

export function useApproveStatus(jobId?: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: ApproveStatusInput) =>
            recruiterShortlistApi.approveStatus(input),
        onSuccess: () => {
            if (jobId) {
                qc.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATIONS_QUERY_KEY, jobId] as const,
                });
            }
            qc.invalidateQueries({ queryKey: RECRUITER_JOB_APPLICATIONS_QUERY_KEY });
        },
    });
}
