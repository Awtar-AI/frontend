"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useMyApplications } from "../../../(jobs)/applications/hooks/use-my-applications";
import { usePublicJob } from "../../../(jobs)/public-jobs/hooks/use-public-job";
import {
    formatEmploymentTypeLabel,
    formatExperienceLevelLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../../../(jobs)/public-jobs/lib/format-job";

function formatDate(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

export default function ApplicantApplicationDetailPage({
    params,
}: {
    params: Promise<{ jobId: string }>;
}) {
    const { jobId } = use(params);
    const myApplicationsQuery = useMyApplications();
    const jobQuery = usePublicJob(jobId);
    const application = (myApplicationsQuery.data ?? []).find((item) => item.job_id === jobId);

    if (myApplicationsQuery.isLoading || jobQuery.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-gray-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading application...
            </div>
        );
    }

    if (!application || jobQuery.isError || !jobQuery.data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Could not load this application detail.
            </div>
        );
    }

    const job = jobQuery.data;

    return (
        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">My Application</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Submitted {formatDate(application.created_at)} - Status {application.status}
                    </p>
                </div>
                <Link
                    href="/applicant/applications"
                    className="text-sm font-bold text-blue-600 hover:underline"
                >
                    Back to applications
                </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-black text-gray-900">{job.title}</h2>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-500">
                    <span>{formatPublicJobSalary(job)}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300 self-center" />
                    <span>{formatEmploymentTypeLabel(job.employment_type)}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300 self-center" />
                    <span>{formatPublicJobLocation(job)}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300 self-center" />
                    <span>{formatExperienceLevelLabel(job)}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300 self-center" />
                    <span>Deadline {formatDate(job.deadline)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                    {job.description}
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
                    <h3 className="text-base font-black text-gray-900">Submitted Cover Letter</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-7">
                        {application.cover_letter || "No cover letter submitted."}
                    </p>
                </div>

                <div className="xl:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
                    <h3 className="text-base font-black text-gray-900">Submission Summary</h3>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Status:</span> {application.status}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Applied:</span>{" "}
                        {formatDate(application.created_at)}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Resume:</span>{" "}
                        {application.resume_url ? (
                            <a
                                href={application.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-bold underline"
                            >
                                Open submitted resume
                            </a>
                        ) : (
                            "Not provided"
                        )}
                    </p>
                    <Link
                        href={`/applicant/jobs/${jobId}`}
                        className="inline-flex text-sm font-bold text-blue-600 hover:underline"
                    >
                        View job page
                    </Link>
                </div>
            </div>
        </div>
    );
}
