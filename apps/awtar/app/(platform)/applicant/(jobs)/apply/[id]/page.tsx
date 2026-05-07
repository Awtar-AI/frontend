"use client";

import { ArrowLeft, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import { useMyApplications } from "../../applications/hooks/use-my-applications";
import { usePublicJob } from "../../public-jobs/hooks/use-public-job";
import { ApplyToJobForm } from "./_components/ApplyToJobForm";

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const jobQuery = usePublicJob(id);
    const myApplicationsQuery = useMyApplications();
    const existingApplication = useMemo(
        () => (myApplicationsQuery.data ?? []).find((application) => application.job_id === id),
        [myApplicationsQuery.data, id],
    );
    const deadlinePassed =
        jobQuery.data != null &&
        Number.isFinite(new Date(jobQuery.data.deadline).getTime()) &&
        new Date(jobQuery.data.deadline).getTime() < Date.now();

    if (jobQuery.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-sm font-semibold">Loading job…</span>
            </div>
        );
    }

    if (jobQuery.isError || !jobQuery.data) {
        return (
            <div className="max-w-lg mx-auto rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
                <h1 className="text-lg font-black text-gray-900 mb-2">Job not found</h1>
                <p className="text-sm text-gray-600 mb-6">
                    This listing may have closed or the link is invalid.
                </p>
                <Link
                    href="/applicant/jobs"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl"
                >
                    Browse jobs
                </Link>
            </div>
        );
    }

    if (jobQuery.data.status !== "active" || deadlinePassed) {
        return (
            <div className="max-w-lg mx-auto rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
                <h1 className="text-lg font-black text-gray-900 mb-2">
                    This job is not accepting applications
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    {deadlinePassed ? "Deadline has passed." : `Status: ${jobQuery.data.status}`}
                </p>
                <Link
                    href="/applicant/jobs"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl"
                >
                    Back to jobs
                </Link>
            </div>
        );
    }

    if (existingApplication) {
        return (
            <div className="max-w-2xl mx-auto rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 space-y-4">
                <h1 className="text-lg font-black text-emerald-900">
                    You already applied to this job
                </h1>
                <p className="text-sm text-emerald-800">
                    Status: <span className="font-bold">{existingApplication.status}</span>
                </p>
                <p className="text-sm text-emerald-800">
                    Cover letter: {existingApplication.cover_letter || "Not provided"}
                </p>
                <p className="text-sm text-emerald-800">
                    Resume:{" "}
                    {existingApplication.resume_url ? (
                        <a
                            href={existingApplication.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline"
                        >
                            Open submitted resume
                        </a>
                    ) : (
                        "Not provided"
                    )}
                </p>
                <div className="flex gap-3 pt-2">
                    <Link
                        href={`/applicant/applications/${id}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 text-white font-bold text-sm rounded-xl"
                    >
                        Open my application
                    </Link>
                    <Link
                        href={`/applicant/jobs/${id}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white border border-emerald-200 text-emerald-800 font-bold text-sm rounded-xl"
                    >
                        Back to job
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5 animate-in fade-in duration-500 pb-16">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={`/applicant/jobs/${id}`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        aria-label="Back to job"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="min-w-0">
                        <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
                            <Briefcase className="h-3.5 w-3.5" />
                            Job application
                        </p>
                        <h1 className="truncate text-lg font-black tracking-tight text-slate-950">
                            Submit your application
                        </h1>
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                            Complete your details for {jobQuery.data.title}.
                        </p>
                    </div>
                </div>
            </div>
            <ApplyToJobForm job={jobQuery.data} />
        </div>
    );
}
