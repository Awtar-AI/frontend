"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { CoverLetterViewer } from "../../../../../../_components/CoverLetterViewer";
import { recruiterApplicationsApi } from "../../../api/recruiter-applications.api";
import { useRecruiterCandidateProfile } from "../../../hooks/use-recruiter-candidate-profile";
import {
    RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY,
    useRecruiterJobApplicationDetail,
} from "../../../hooks/use-recruiter-job-application-detail";
import { RECRUITER_JOB_APPLICATIONS_QUERY_KEY } from "../../../hooks/use-recruiter-job-applications";

function formatDateLabel(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function normalizeLifecycleStatus(
    status:
        | "Applied"
        | "Shortlisted"
        | "Interviewed"
        | "Passed"
        | "Rejected"
        | "Pending"
        | "Accepted",
): "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected" {
    if (status === "Pending") return "Applied";
    if (status === "Accepted") return "Passed";
    return status;
}

function statusBadgeClass(
    status: "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected",
): string {
    if (status === "Applied") return "bg-blue-100 text-blue-700";
    if (status === "Shortlisted") return "bg-purple-100 text-purple-700";
    if (status === "Interviewed") return "bg-amber-100 text-amber-700";
    if (status === "Passed") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
}

function stepperStateClass(
    step: "Applied" | "Shortlisted" | "Interviewed" | "Passed",
    current: "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected",
): string {
    if (current === "Rejected")
        return step === "Applied" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500";
    const order = ["Applied", "Shortlisted", "Interviewed", "Passed"] as const;
    const stepIndex = order.indexOf(step);
    const currentIndex = order.indexOf(current);
    if (stepIndex <= currentIndex) return "bg-blue-600 text-white";
    return "bg-gray-200 text-gray-500";
}

export default function RecruiterJobApplicationDetailPage({
    params,
}: {
    params: Promise<{ jobId: string; applicationId: string }>;
}) {
    const { jobId, applicationId } = use(params);
    const applicationQuery = useRecruiterJobApplicationDetail(jobId, applicationId, true);
    const queryClient = useQueryClient();
    const candidateQuery = useRecruiterCandidateProfile(
        applicationQuery.data?.user_id ?? null,
        true,
    );
    const transitionMutation = useMutation({
        mutationFn: async (target: "shortlist" | "interview" | "pass" | "reject") => {
            if (target === "shortlist") return recruiterApplicationsApi.shortlist(applicationId);
            if (target === "interview") return recruiterApplicationsApi.interview(applicationId);
            if (target === "pass") return recruiterApplicationsApi.pass(applicationId);
            return recruiterApplicationsApi.reject(applicationId);
        },
        onSuccess: async () => {
            toastService.success("Application status updated.");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY, jobId, applicationId],
                }),
                queryClient.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATIONS_QUERY_KEY, jobId],
                }),
            ]);
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    if (applicationQuery.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-gray-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading application detail...
            </div>
        );
    }

    if (applicationQuery.isError || !applicationQuery.data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Could not load this application.
            </div>
        );
    }

    const application = applicationQuery.data;
    const candidate = candidateQuery.data;
    const profile = candidate?.candidate_profile;
    const lifecycleStatus = normalizeLifecycleStatus(application.status);

    const workflowActions =
        lifecycleStatus === "Applied"
            ? [
                  {
                      id: "shortlist" as const,
                      label: "Shortlist",
                      className: "bg-purple-600 hover:bg-purple-700",
                  },
                  {
                      id: "reject" as const,
                      label: "Reject",
                      className: "bg-red-600 hover:bg-red-700",
                  },
              ]
            : lifecycleStatus === "Shortlisted"
              ? [
                    {
                        id: "interview" as const,
                        label: "Mark Interviewed",
                        className: "bg-amber-600 hover:bg-amber-700",
                    },
                    {
                        id: "reject" as const,
                        label: "Reject",
                        className: "bg-red-600 hover:bg-red-700",
                    },
                ]
              : lifecycleStatus === "Interviewed"
                ? [
                      {
                          id: "pass" as const,
                          label: "Mark Passed",
                          className: "bg-green-600 hover:bg-green-700",
                      },
                      {
                          id: "reject" as const,
                          label: "Reject",
                          className: "bg-red-600 hover:bg-red-700",
                      },
                  ]
                : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Full submission, status workflow, and profile context.
                    </p>
                </div>
                <Link
                    href={`/recruiter/job-listings/${jobId}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                >
                    Back to applicants list
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </span>
                        <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(
                                lifecycleStatus,
                            )}`}
                        >
                            {lifecycleStatus}
                        </span>
                    </div>
                    {workflowActions.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {workflowActions.map((action) => (
                                <button
                                    key={action.id}
                                    type="button"
                                    disabled={transitionMutation.isPending}
                                    onClick={() => transitionMutation.mutate(action.id)}
                                    className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 ${action.className}`}
                                >
                                    {transitionMutation.isPending ? "Updating..." : action.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs font-semibold text-gray-500">
                            This application is in a terminal stage.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {(["Applied", "Shortlisted", "Interviewed", "Passed"] as const).map((step) => (
                        <div key={step} className="flex items-center gap-2">
                            <span
                                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-bold ${stepperStateClass(
                                    step,
                                    lifecycleStatus,
                                )}`}
                            >
                                {step.slice(0, 1)}
                            </span>
                            <span className="text-xs font-semibold text-gray-600">{step}</span>
                            {step !== "Passed" && <span className="h-px w-4 bg-gray-300" />}
                        </div>
                    ))}
                    {lifecycleStatus === "Rejected" && (
                        <span className="ml-1 inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                            Rejected
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Submitted application</h2>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-2">
                        <p className="text-sm text-gray-900 font-semibold">
                            {application.applicant_first_name} {application.applicant_last_name}
                        </p>
                        <p className="text-xs text-gray-600">{application.applicant_email}</p>
                        <p className="text-xs text-gray-600">
                            Status:{" "}
                            <span className="font-semibold text-blue-700">{lifecycleStatus}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                            Submitted: {formatDateLabel(application.created_at)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Cover Letter
                        </p>
                        {application.cover_letter ? (
                            <div className="mt-2 min-h-[120px] rounded-lg bg-white px-1 py-1">
                                <CoverLetterViewer
                                    html={application.cover_letter}
                                    className="text-gray-800"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic mt-2">Not provided</p>
                        )}
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Resume
                        </p>
                        <p className="text-sm text-gray-800 mt-2">
                            {application.resume_url ? (
                                <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Open submitted resume
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                </div>

                <div className="xl:col-span-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Candidate profile context</h2>
                    {candidateQuery.isLoading && (
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading profile...
                        </div>
                    )}
                    {candidateQuery.isError && (
                        <p className="text-sm text-red-600">
                            Could not load candidate profile details.
                        </p>
                    )}
                    {candidate && (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {candidate.first_name} {candidate.last_name}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Current job title</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.current_job_title || "—"}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Years of experience</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.years_of_experience ??
                                        application.years_of_experience ??
                                        "—"}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Education level</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.education_level || "—"}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Primary skills</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.primary_skills?.join(", ") ||
                                        application.primary_skills?.join(", ") ||
                                        "—"}
                                </p>
                            </div>
                            <Link
                                href={`/recruiter/talent/${application.user_id}`}
                                className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
                            >
                                Open candidate profile page
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
