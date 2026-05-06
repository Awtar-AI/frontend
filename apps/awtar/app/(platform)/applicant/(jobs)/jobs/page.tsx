"use client";

import { ArrowRight, Bookmark, ChevronDown, Loader2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMyApplications } from "../applications/hooks/use-my-applications";
import { usePublicJobs } from "../public-jobs/hooks/use-public-jobs";
import {
    formatEmploymentTypeLabel,
    formatExperienceLevelLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../public-jobs/lib/format-job";
import type { PublicJobsQuery } from "../public-jobs/schemas/public-jobs.schema";

const JOBS_PER_PAGE = 9;

const EMPLOYMENT_TYPES = [
    { value: "", label: "All types" },
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
] as const;

const EXPERIENCE_LEVELS = [
    { value: "", label: "All levels" },
    { value: "entry", label: "Entry" },
    { value: "mid", label: "Mid" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
] as const;

const REMOTE_FILTER = [
    { value: "" as const, label: "All" },
    { value: "remote" as const, label: "Remote only" },
    { value: "onsite" as const, label: "On-site only" },
];

function formatDeadlineLabel(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function isJobClosed(status: string, deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    const pastDeadline =
        Number.isFinite(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now();
    return status !== "active" || pastDeadline;
}

export default function JobsPage() {
    const [page, setPage] = useState(1);
    const [titleInput, setTitleInput] = useState("");
    const [titleQuery, setTitleQuery] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [remoteFilter, setRemoteFilter] = useState<(typeof REMOTE_FILTER)[number]["value"]>("");

    useEffect(() => {
        const t = setTimeout(() => setTitleQuery(titleInput.trim()), 400);
        return () => clearTimeout(t);
    }, [titleInput]);

    const query: PublicJobsQuery = useMemo(() => {
        const q: PublicJobsQuery = {
            page,
            limit: JOBS_PER_PAGE,
            status: "active",
        };
        if (titleQuery.length >= 2) q.title = titleQuery;
        if (employmentType) q.employment_type = employmentType;
        if (experienceLevel) q.experience_level = experienceLevel;
        if (remoteFilter === "remote") q.is_remote = true;
        if (remoteFilter === "onsite") q.is_remote = false;
        return q;
    }, [page, titleQuery, employmentType, experienceLevel, remoteFilter]);

    const jobsQuery = usePublicJobs(query);
    const myApplicationsQuery = useMyApplications();
    const jobs = jobsQuery.data?.jobs ?? [];
    const total = jobsQuery.data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE));

    const showingFrom = total === 0 ? 0 : (page - 1) * JOBS_PER_PAGE + 1;
    const showingTo = Math.min(page * JOBS_PER_PAGE, total);

    return (
        <div className="p-4 lg:p-6 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="bg-[#EBF1FA] rounded-[32px] overflow-hidden flex items-center justify-center p-10 relative min-h-[200px]">
                <div className="text-center space-y-2 max-w-xl">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Find your next role
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Browse open positions from organizations on Awtar (`GET /jobs/public`).
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Search by title
                            </h4>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={titleInput}
                                    onChange={(e) => {
                                        setTitleInput(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Job title (min 2 characters)"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Work location
                            </h4>
                            <div className="relative">
                                <select
                                    value={remoteFilter}
                                    onChange={(e) => {
                                        setRemoteFilter(e.target.value as typeof remoteFilter);
                                        setPage(1);
                                    }}
                                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 appearance-none focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                                >
                                    {REMOTE_FILTER.map((o) => (
                                        <option key={o.value || "all"} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Employment type
                            </h4>
                            <select
                                value={employmentType}
                                onChange={(e) => {
                                    setEmploymentType(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none"
                            >
                                {EMPLOYMENT_TYPES.map((o) => (
                                    <option key={o.value || "all-emp"} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Experience level
                            </h4>
                            <select
                                value={experienceLevel}
                                onChange={(e) => {
                                    setExperienceLevel(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none"
                            >
                                {EXPERIENCE_LEVELS.map((o) => (
                                    <option key={o.value || "all-exp"} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setTitleInput("");
                                setEmploymentType("");
                                setExperienceLevel("");
                                setRemoteFilter("");
                                setPage(1);
                            }}
                            className="w-full py-2.5 border border-gray-200 text-gray-700 text-xs font-black rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>

                <div className="xl:col-span-9 space-y-6">
                    <div className="flex items-center justify-between px-2 flex-wrap gap-3">
                        <p className="text-sm font-bold text-gray-500 tracking-tight">
                            {jobsQuery.isLoading ? (
                                "Loading…"
                            ) : (
                                <>
                                    Showing {showingFrom}-{showingTo} of {total} results
                                </>
                            )}
                        </p>
                    </div>

                    {jobsQuery.isError && (
                        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Could not load jobs. Check your API URL and try again.
                        </div>
                    )}

                    <div className="space-y-6 min-h-[400px]">
                        {jobsQuery.isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="text-sm font-semibold">Loading listings…</span>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => {
                                const application = (myApplicationsQuery.data ?? []).find(
                                    (item) => item.job_id === job.id,
                                );
                                const closed = isJobClosed(job.status, job.deadline);
                                return (
                                    <div
                                        key={job.id}
                                        className="w-full rounded-[22px] border border-gray-200 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
                                            {closed ? "Closed" : "Active now"}
                                        </div>

                                        <div className="mb-3 flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Link href={`/applicant/jobs/${job.id}`}>
                                                    <h3 className="truncate text-[30px]/[1.15] font-black tracking-tight text-gray-900 hover:text-blue-600">
                                                        {job.title}
                                                    </h3>
                                                </Link>
                                                <div className="rounded-lg bg-orange-100 px-2.5 py-1 text-[10px] font-black text-orange-700 shrink-0">
                                                    Best fit
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded-xl bg-gray-50 p-2.5 transition-colors hover:bg-gray-100"
                                                    aria-label="Save (coming soon)"
                                                >
                                                    <Bookmark className="h-5 w-5 text-gray-400" />
                                                </button>
                                                {application ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase text-blue-700">
                                                            {application.status}
                                                        </span>
                                                        <Link
                                                            href={`/applicant/applications/${job.id}`}
                                                            className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:bg-black"
                                                        >
                                                            View application
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href={
                                                            closed
                                                                ? "#"
                                                                : `/applicant/apply/${job.id}`
                                                        }
                                                        aria-disabled={closed}
                                                        onClick={(e) => {
                                                            if (closed) e.preventDefault();
                                                        }}
                                                        className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-black shadow-lg transition-all ${
                                                            closed
                                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                                                                : "bg-gray-900 text-white hover:bg-black"
                                                        }`}
                                                    >
                                                        {closed ? "Closed" : "Apply"}
                                                        {!closed && (
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        )}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-5 flex flex-wrap items-center gap-2.5 text-xs font-bold text-gray-500">
                                            <span>{formatPublicJobSalary(job)}</span>
                                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                                            <span>
                                                {formatEmploymentTypeLabel(job.employment_type)}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                                            <span>{job.is_remote ? "Remote" : "On-site"}</span>
                                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                                            <span>{formatExperienceLevelLabel(job)}</span>
                                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                                            <span>
                                                Deadline {formatDeadlineLabel(job.deadline)}
                                            </span>
                                        </div>

                                        <p className="mb-6 line-clamp-2 text-sm font-medium text-gray-600">
                                            {job.description}
                                        </p>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-700">
                                                    {formatEmploymentTypeLabel(job.employment_type)}
                                                </span>
                                                <span className="rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-700">
                                                    {job.is_resume_required
                                                        ? "Resume required"
                                                        : "Quick apply"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                {formatPublicJobLocation(job)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-[32px] p-16 flex flex-col items-center justify-center text-center border border-gray-100 border-dashed">
                                <Search className="w-10 h-10 text-gray-300 mb-4" />
                                <h3 className="text-xl font-black text-gray-900">No jobs found</h3>
                                <p className="text-sm text-gray-400 font-medium max-w-xs mt-2">
                                    Try broadening your search or clearing filters.
                                </p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && !jobsQuery.isLoading && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="w-10 h-10 rounded-full text-sm font-black transition-all hover:bg-gray-100 disabled:opacity-40"
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPage(num)}
                                    className={`w-10 h-10 rounded-full text-sm font-black transition-all ${
                                        num === page
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "hover:bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="w-10 h-10 rounded-full text-sm font-black transition-all hover:bg-gray-100 disabled:opacity-40"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
