"use client";

import {
    ArrowLeft,
    Bookmark,
    Briefcase,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    ExternalLink,
    Loader2,
    MapPin,
    Share2,
    TrendingUp,
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
import { useSaveJob } from "../../saved-jobs/hooks/use-save-job";
import { useSavedJobs } from "../../saved-jobs/hooks/use-saved-jobs";

function formatPostedAgo(value?: string): string {
    if (!value) return "Recently posted";
    const t = new Date(value).getTime();
    if (!Number.isFinite(t)) return "Recently posted";
    const diff = Date.now() - t;
    const abs = Math.abs(diff);
    const m = 60_000,
        h = 3_600_000,
        d = 86_400_000,
        mo = 2_592_000_000,
        y = 31_536_000_000;
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (abs < m) return "Just now";
    if (abs < h) return rtf.format(-Math.round(diff / m), "minute");
    if (abs < d) return rtf.format(-Math.round(diff / h), "hour");
    if (abs < mo) return rtf.format(-Math.round(diff / d), "day");
    if (abs < y) return rtf.format(-Math.round(diff / mo), "month");
    return rtf.format(-Math.round(diff / y), "year");
}

function DetailRow({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">
                    {label}
                </p>
                <p
                    className={`text-xs font-black truncate ${accent ? "text-blue-600" : "text-gray-900"}`}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const jobId = resolvedParams.id;

    const jobQuery = usePublicJob(jobId);
    const job = jobQuery.data;
    const myApplicationsQuery = useMyApplications();
    const savedJobsQuery = useSavedJobs({ limit: 100 });
    const { toggle, isPending: isBookmarkPending } = useSaveJob();
    const isSaved = (savedJobsQuery.data?.data ?? []).some((j) => j.job_id === jobId);
    const orgQuery = useOrganizationPublic(job?.organization_id ?? null);

    const relatedQuery = usePublicJobs(
        useMemo(
            () => ({
                organization_id: job?.organization_id ?? "",
                limit: 8,
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
        () => (myApplicationsQuery.data ?? []).find((a) => a.job_id === jobId),
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-sm font-semibold text-gray-500">Loading job…</span>
            </div>
        );
    }

    if (jobQuery.isError || !job) {
        return (
            <div className="p-8 max-w-lg mx-auto mt-10 rounded-2xl border border-red-100 bg-red-50 text-center">
                <h1 className="text-lg font-black text-gray-900 mb-2">Job not found</h1>
                <Link href="/applicant/jobs" className="text-blue-600 font-bold text-sm">
                    ← Back to jobs
                </Link>
            </div>
        );
    }

    const companyName = orgQuery.data?.organization_name ?? "Company";

    const deadlineLabel = (() => {
        try {
            return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                new Date(job.deadline),
            );
        } catch {
            return job.deadline;
        }
    })();

    const postedLabel = job.created_at
        ? (() => {
              try {
                  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                      new Date(job.created_at),
                  );
              } catch {
                  return job.created_at;
              }
          })()
        : null;

    const applyHref = hasApplied
        ? `/applicant/applications/${job.id}`
        : isClosed
          ? "#"
          : `/applicant/apply/${job.id}`;

    const applyLabel = hasApplied
        ? "View Application"
        : isClosed
          ? "Applications Closed"
          : "Apply Now";

    const applyClass = hasApplied
        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
        : isClosed
          ? "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg";

    function handleShare() {
        navigator.clipboard.writeText(window.location.href).catch(() => null);
    }

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Nav row */}
            <div className="flex items-center justify-between">
                <Link
                    href="/applicant/jobs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
                >
                    <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </span>
                    Back to Jobs
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="w-9 h-9 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 rounded-xl transition-all shadow-sm flex items-center justify-center"
                        aria-label="Share"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        disabled={isBookmarkPending}
                        onClick={() => toggle(jobId, isSaved)}
                        className={`w-9 h-9 border rounded-xl transition-all shadow-sm flex items-center justify-center disabled:opacity-50 ${
                            isSaved
                                ? "bg-orange-50 border-orange-200 text-orange-500"
                                : "bg-white border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500"
                        }`}
                        aria-label="Bookmark job"
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-orange-500" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Hero card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]">
                <div className="p-8 lg:p-10">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mb-7">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black rounded-full">
                            <Clock className="h-3 w-3" />
                            {formatPostedAgo(job.created_at)}
                        </span>
                        <span
                            className={`px-3 py-1 text-[10px] font-black rounded-full border ${
                                job.status === "active"
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                    : "bg-gray-100 border-gray-200 text-gray-500"
                            }`}
                        >
                            {job.status === "active" ? "● Active" : "● Closed"}
                        </span>
                    </div>

                    {/* Company + title + apply CTA */}
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl lg:text-[2.25rem] font-black text-gray-950 tracking-tight leading-tight mb-2">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm mb-5">
                                <span className="font-black text-gray-700">{companyName}</span>
                                {orgQuery.data?.website_url && (
                                    <a
                                        href={orgQuery.data.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="flex items-center gap-1 text-gray-500 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    {formatPublicJobLocation(job)}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-black rounded-lg">
                                    {formatEmploymentTypeLabel(job.employment_type)}
                                </span>
                                <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-black rounded-lg flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {formatPublicJobSalary(job)}
                                </span>
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-black rounded-lg">
                                    {job.is_remote ? "Remote" : "On-site"}
                                </span>
                            </div>
                        </div>

                        {/* CTA — desktop */}
                        <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
                            <Link
                                href={applyHref}
                                onClick={(e) => {
                                    if (!hasApplied && isClosed) e.preventDefault();
                                }}
                                className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all whitespace-nowrap ${applyClass}`}
                            >
                                {applyLabel}
                            </Link>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <Share2 className="w-3.5 h-3.5" /> Share this job
                            </button>
                        </div>
                    </div>

                    {/* CTA — mobile */}
                    <div className="md:hidden mt-6">
                        <Link
                            href={applyHref}
                            onClick={(e) => {
                                if (!hasApplied && isClosed) e.preventDefault();
                            }}
                            className={`block w-full py-3.5 rounded-xl font-black text-sm text-center transition-all ${applyClass}`}
                        >
                            {applyLabel}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left: description */}
                <div className="xl:col-span-8 space-y-6">
                    {hasApplied && (
                        <div className="relative overflow-hidden bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400" />
                            <h3 className="text-sm font-black text-emerald-800 mb-3">
                                You already applied to this job
                            </h3>
                            <div className="space-y-1.5 text-sm text-emerald-700">
                                <p>
                                    Status:{" "}
                                    <span className="font-black">
                                        {existingApplication?.status}
                                    </span>
                                </p>
                                <p>
                                    Cover letter:{" "}
                                    <span className="font-medium">
                                        {existingApplication?.cover_letter
                                            ? existingApplication.cover_letter
                                                  .replace(/<[^>]*>/g, " ")
                                                  .replace(/\s+/g, " ")
                                                  .trim()
                                            : "Not provided"}
                                    </span>
                                </p>
                                <p>
                                    Resume:{" "}
                                    {existingApplication?.resume_url ? (
                                        <a
                                            href={existingApplication.resume_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-black underline"
                                        >
                                            Open resume
                                        </a>
                                    ) : (
                                        "Not provided"
                                    )}
                                </p>
                            </div>
                            <Link
                                href={`/applicant/applications/${job.id}`}
                                className="inline-flex mt-4 text-xs font-black text-emerald-800 underline underline-offset-2"
                            >
                                Open my application →
                            </Link>
                        </div>
                    )}

                    {!hasApplied && isClosed && (
                        <div className="relative overflow-hidden bg-amber-50 rounded-2xl border border-amber-200 p-5">
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-amber-400" />
                            <h3 className="text-sm font-black text-amber-800">
                                Applications Closed
                            </h3>
                            <p className="text-xs font-medium text-amber-700 mt-1 leading-5">
                                This role is not accepting new applications.
                            </p>
                        </div>
                    )}

                    {/* Description card */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            </span>
                            <h3 className="text-sm font-black text-gray-950 tracking-tight">
                                Job Description
                            </h3>
                        </div>
                        <div className="px-8 py-7 text-sm text-gray-600 font-medium leading-[1.9] whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Related jobs */}
                    {relatedJobs.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-gray-950 tracking-tight px-1">
                                More from {companyName}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {relatedJobs.map((rj) => (
                                    <div
                                        key={rj.id}
                                        className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <h4 className="text-sm font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                {rj.title}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2 leading-5">
                                            {rj.description}
                                        </p>
                                        <Link
                                            href={`/applicant/jobs/${rj.id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            View opening <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: sidebar */}
                <div className="xl:col-span-4 space-y-5">
                    {/* Company Overview */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-slate-50/70">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">
                                Company Overview
                            </h4>
                        </div>
                        <div className="p-6">
                            {orgQuery.isLoading ? (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                                </div>
                            ) : orgQuery.data ? (
                                <>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                                            <Building2 className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h5 className="font-black text-gray-950 text-sm leading-tight">
                                                {orgQuery.data.organization_name}
                                            </h5>
                                            {orgQuery.data.website_url && (
                                                <a
                                                    href={orgQuery.data.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[11px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-0.5"
                                                >
                                                    Website <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-0 divide-y divide-gray-50 mb-5">
                                        <div className="flex items-center justify-between py-2.5 text-xs">
                                            <span className="text-gray-400 font-bold">
                                                Industry
                                            </span>
                                            <span className="font-black text-gray-900">
                                                {orgQuery.data.industry}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5 text-xs">
                                            <span className="text-gray-400 font-bold">
                                                Company size
                                            </span>
                                            <span className="font-black text-gray-900">
                                                {orgQuery.data.organization_size} employees
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/applicant/companies/${orgQuery.data.id}`}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-black rounded-xl transition-all"
                                    >
                                        View Company Profile <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </>
                            ) : (
                                <p className="text-sm text-gray-400 italic">
                                    Company details unavailable.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-slate-50/70">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">
                                Job Details
                            </h4>
                        </div>
                        <div className="px-6 pt-2 pb-0">
                            <DetailRow
                                icon={Briefcase}
                                label="Job Type"
                                value={formatEmploymentTypeLabel(job.employment_type)}
                            />
                            <DetailRow
                                icon={TrendingUp}
                                label="Experience Level"
                                value={formatExperienceLevelLabel(job)}
                            />
                            <DetailRow
                                icon={Calendar}
                                label="Application Deadline"
                                value={deadlineLabel}
                                accent
                            />
                            {postedLabel && (
                                <DetailRow icon={Clock} label="Date Posted" value={postedLabel} />
                            )}
                        </div>
                        <div className="p-6 space-y-3">
                            <Link
                                href={applyHref}
                                onClick={(e) => {
                                    if (!hasApplied && isClosed) e.preventDefault();
                                }}
                                className={`block w-full py-3.5 font-black rounded-xl text-center text-sm transition-all ${applyClass}`}
                            >
                                {applyLabel}
                            </Link>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 hover:border-slate-300 text-gray-500 hover:text-gray-700 text-xs font-black rounded-xl transition-all"
                            >
                                <Share2 className="w-3.5 h-3.5" /> Share this Job
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
