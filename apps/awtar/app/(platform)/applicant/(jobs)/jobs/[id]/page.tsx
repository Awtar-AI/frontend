"use client";

import {
    ArrowLeft,
    Bookmark,
    Briefcase,
    Calendar,
    ExternalLink,
    Loader2,
    MapPin,
    Share2,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import { useMyApplications } from "../../applications/hooks/use-my-applications";
import { useOrganizationPublic } from "../../public-jobs/hooks/use-organization-public";
import { usePublicJob } from "../../public-jobs/hooks/use-public-job";
import { usePublicJobs } from "../../public-jobs/hooks/use-public-jobs";
import {
    formatEmploymentTypeLabel,
    formatExperienceLevelLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../../public-jobs/lib/format-job";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const jobId = resolvedParams.id;

    const jobQuery = usePublicJob(jobId);
    const job = jobQuery.data;
    const myApplicationsQuery = useMyApplications();
    const orgQuery = useOrganizationPublic(job?.organization_id ?? null);

    const relatedQuery = usePublicJobs(
        useMemo(
            () => ({
                organization_id: job?.organization_id ?? "",
                limit: 8,
                status: "active" as const,
            }),
            [job?.organization_id],
        ),
        { enabled: Boolean(job?.organization_id) },
    );

    const relatedJobs = useMemo(() => {
        const list = relatedQuery.data?.jobs ?? [];
        return list.filter((j) => j.id !== jobId).slice(0, 4);
    }, [relatedQuery.data?.jobs, jobId]);
    const existingApplication = useMemo(
        () => (myApplicationsQuery.data ?? []).find((application) => application.job_id === jobId),
        [myApplicationsQuery.data, jobId],
    );
    const hasApplied = Boolean(existingApplication);
    const deadlinePassed =
        job != null &&
        Number.isFinite(new Date(job.deadline).getTime()) &&
        new Date(job.deadline).getTime() < Date.now();
    const isClosed = Boolean(job && (job.status !== "active" || deadlinePassed));

    if (jobQuery.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-sm font-semibold">Loading job…</span>
            </div>
        );
    }

    if (jobQuery.isError || !job) {
        return (
            <div className="p-8 max-w-lg mx-auto rounded-2xl border border-red-100 bg-red-50 text-center">
                <h1 className="text-lg font-black text-gray-900 mb-2">Job not found</h1>
                <Link href="/applicant/jobs" className="text-blue-600 font-bold">
                    Back to jobs
                </Link>
            </div>
        );
    }

    const companyName = orgQuery.data?.organization_name ?? "Company";
    const deadlineLabel = (() => {
        try {
            return new Intl.DateTimeFormat(undefined, {
                dateStyle: "long",
                timeStyle: "short",
            }).format(new Date(job.deadline));
        } catch {
            return job.deadline;
        }
    })();

    return (
        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between">
                <Link
                    href="/applicant/jobs"
                    className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-blue-600 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Jobs
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                        aria-label="Share"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-orange-500 rounded-xl transition-all shadow-sm"
                        aria-label="Save"
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center p-4 shadow-inner border border-blue-100 shrink-0 text-center font-black text-xs text-gray-700">
                        {companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left space-y-3">
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm font-bold text-gray-500">
                            <span className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                {companyName}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {formatPublicJobLocation(job)}
                            </span>
                            <span>{formatPublicJobSalary(job)}</span>
                        </div>
                    </div>
                </div>
                <Link
                    href={
                        hasApplied
                            ? `/applicant/applications/${job.id}`
                            : isClosed
                              ? "#"
                              : `/applicant/apply/${job.id}`
                    }
                    onClick={(e) => {
                        if (!hasApplied && isClosed) e.preventDefault();
                    }}
                    className={`px-10 py-4 font-black rounded-2xl shadow-lg transition-all text-lg whitespace-nowrap ${
                        hasApplied
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : isClosed
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                    {hasApplied ? "View application" : isClosed ? "Closed" : "Apply now"}
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-8 space-y-10">
                    {hasApplied && (
                        <div className="bg-emerald-50 rounded-[24px] border border-emerald-200 p-6 space-y-3">
                            <h3 className="text-base font-black text-emerald-800">
                                You already applied to this job
                            </h3>
                            <p className="text-sm text-emerald-700">
                                Status:{" "}
                                <span className="font-bold">{existingApplication?.status}</span>
                            </p>
                            <p className="text-sm text-emerald-700">
                                Cover letter:{" "}
                                <span className="text-emerald-900">
                                    {existingApplication?.cover_letter || "Not provided"}
                                </span>
                            </p>
                            <p className="text-sm text-emerald-700">
                                Resume:{" "}
                                {existingApplication?.resume_url ? (
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
                            <Link
                                href={`/applicant/applications/${job.id}`}
                                className="inline-flex text-sm font-bold text-emerald-800 underline"
                            >
                                Open my application
                            </Link>
                        </div>
                    )}
                    {!hasApplied && isClosed && (
                        <div className="bg-amber-50 rounded-[24px] border border-amber-200 p-5">
                            <h3 className="text-base font-black text-amber-800">
                                Applications closed
                            </h3>
                            <p className="text-sm text-amber-700 mt-1">
                                This role is not accepting applications because it is closed or past
                                its deadline.
                            </p>
                        </div>
                    )}
                    <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">
                            Job description
                        </h3>
                        <div className="text-sm text-gray-600 font-medium leading-[1.8] whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {relatedJobs.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                More from this organization
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedJobs.map((rj) => (
                                    <div
                                        key={rj.id}
                                        className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <h4 className="text-lg font-black text-gray-900 mb-2">
                                            {rj.title}
                                        </h4>
                                        <p className="text-xs font-bold text-gray-400 mb-4 line-clamp-2">
                                            {rj.description}
                                        </p>
                                        <Link
                                            href={`/applicant/jobs/${rj.id}`}
                                            className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            View <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Company
                        </h4>
                        {orgQuery.isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        ) : orgQuery.data ? (
                            <>
                                <h4 className="font-black text-gray-900 text-lg">
                                    {orgQuery.data.organization_name}
                                </h4>
                                <p className="text-[13px] text-gray-500 font-medium">
                                    {orgQuery.data.industry} · {orgQuery.data.organization_size}{" "}
                                    employees
                                </p>
                                <Link
                                    href={`/applicant/companies/${orgQuery.data.id}`}
                                    className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Company page <ExternalLink className="w-4 h-4" />
                                </Link>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Company details unavailable.</p>
                        )}
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Job details
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase">
                                        Employment
                                    </p>
                                    <p className="text-sm font-black text-gray-900">
                                        {formatEmploymentTypeLabel(job.employment_type)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase">
                                        Application deadline
                                    </p>
                                    <p className="text-sm font-black text-blue-600">
                                        {deadlineLabel}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">
                                    Experience
                                </p>
                                <p className="text-sm font-black text-gray-900">
                                    {formatExperienceLevelLabel(job)}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={
                                hasApplied
                                    ? `/applicant/applications/${job.id}`
                                    : isClosed
                                      ? "#"
                                      : `/applicant/apply/${job.id}`
                            }
                            onClick={(e) => {
                                if (!hasApplied && isClosed) e.preventDefault();
                            }}
                            className={`block w-full py-3.5 font-black rounded-xl shadow-lg transition-all text-center ${
                                hasApplied
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    : isClosed
                                      ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {hasApplied ? "View application" : isClosed ? "Closed" : "Apply now"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
