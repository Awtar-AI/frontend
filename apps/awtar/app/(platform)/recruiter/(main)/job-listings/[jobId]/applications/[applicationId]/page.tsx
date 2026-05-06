"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useRecruiterCandidateProfile } from "../../../hooks/use-recruiter-candidate-profile";
import { useRecruiterJobApplicationDetail } from "../../../hooks/use-recruiter-job-application-detail";

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

export default function RecruiterJobApplicationDetailPage({
    params,
}: {
    params: Promise<{ jobId: string; applicationId: string }>;
}) {
    const { jobId, applicationId } = use(params);
    const applicationQuery = useRecruiterJobApplicationDetail(jobId, applicationId, true);
    const candidateQuery = useRecruiterCandidateProfile(
        applicationQuery.data?.user_id ?? null,
        true,
    );

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Full submission plus additional profile context.
                    </p>
                </div>
                <Link
                    href={`/recruiter/job-listings/${jobId}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                >
                    Back to applicants list
                </Link>
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
                            <span className="font-semibold text-blue-700">
                                {application.status}
                            </span>
                        </p>
                        <p className="text-xs text-gray-600">
                            Submitted: {formatDateLabel(application.created_at)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Cover Letter
                        </p>
                        <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap">
                            {application.cover_letter || "Not provided"}
                        </p>
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
