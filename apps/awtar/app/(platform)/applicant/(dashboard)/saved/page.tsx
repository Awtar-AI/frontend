"use client";

import { ArrowRight, Bookmark, Clock, Loader2, MapPin, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatEmploymentTypeLabel } from "../../(jobs)/public-jobs/lib/format-job";
import { useSaveJob } from "../../(jobs)/saved-jobs/hooks/use-save-job";
import { useSavedJobs } from "../../(jobs)/saved-jobs/hooks/use-saved-jobs";

const ITEMS_PER_PAGE = 10;
const TABS = ["All Saved", "Full-time", "Remote"] as const;
type Tab = (typeof TABS)[number];

function formatSavedAgo(value: string): string {
    const savedDate = new Date(value);
    const savedTime = savedDate.getTime();
    if (!Number.isFinite(savedTime)) return "Saved";

    const diffMs = savedTime - Date.now();
    const absMs = Math.abs(diffMs);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    if (absMs < minute) return "Just now";
    if (absMs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
    if (absMs < day) return rtf.format(Math.round(diffMs / hour), "hour");
    if (absMs < month) return rtf.format(Math.round(diffMs / day), "day");
    if (absMs < year) return rtf.format(Math.round(diffMs / month), "month");
    return rtf.format(Math.round(diffMs / year), "year");
}

function formatSalary(job: {
    salary_type: string;
    salary_min?: number | null;
    salary_max?: number | null;
    salary_currency?: string | null;
}): string {
    if (job.salary_type === "undisclosed") return "Undisclosed";
    const c = job.salary_currency?.trim() || "";
    if (job.salary_type === "fixed" && job.salary_min != null) {
        return c ? `${c} ${job.salary_min.toLocaleString()}` : String(job.salary_min);
    }
    if (job.salary_type === "range" && job.salary_min != null && job.salary_max != null) {
        return c
            ? `${c} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
            : `${job.salary_min} - ${job.salary_max}`;
    }
    return "-";
}

function formatExperience(value: string): string {
    const map: Record<string, string> = {
        entry: "Entry",
        mid: "Intermediate",
        senior: "Senior",
        lead: "Lead",
    };
    return map[value] ?? value;
}

export default function SavedJobsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("All Saved");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const savedJobsQuery = useSavedJobs({ page, limit: ITEMS_PER_PAGE });
    const { toggle, isPending: isBookmarkPending } = useSaveJob();

    const allJobs = useMemo(() => savedJobsQuery.data?.data ?? [], [savedJobsQuery.data]);
    const pagination = savedJobsQuery.data?.pagination;

    const filteredJobs = useMemo(() => {
        let list = allJobs;
        if (activeTab === "Full-time") {
            list = list.filter((j) => j.employment_type === "full_time");
        } else if (activeTab === "Remote") {
            list = list.filter((j) => j.is_remote);
        }
        if (search.trim().length >= 2) {
            const q = search.trim().toLowerCase();
            list = list.filter((j) => j.title.toLowerCase().includes(q));
        }
        return list;
    }, [allJobs, activeTab, search]);

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab);
                                setPage(1);
                            }}
                            className={`rounded-md px-4 py-2 text-xs font-black transition-all ${
                                activeTab === tab
                                    ? "bg-white text-slate-950 shadow-sm"
                                    : "text-slate-500 hover:text-slate-950"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search saved jobs..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {savedJobsQuery.isLoading && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-24 gap-3 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm font-semibold">Loading saved jobs...</span>
                </div>
            )}

            {savedJobsQuery.isError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    Could not load saved jobs. Please try again.
                </div>
            )}

            {!savedJobsQuery.isLoading && !savedJobsQuery.isError && (
                <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-16 text-center">
                            <Bookmark className="mx-auto mb-4 h-10 w-10 text-slate-300" />
                            <h3 className="text-xl font-black text-slate-950">No saved jobs</h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
                                Bookmark jobs from the job listings page to see them here.
                            </p>
                            <Link
                                href="/applicant/jobs"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-blue-700"
                            >
                                Browse jobs <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <article
                                key={job.job_id}
                                className="w-full p-6 border border-gray-200 rounded-3xl bg-white shadow-sm hover:border-blue-400 transition-colors group"
                            >
                                <div className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                                    <Clock className="h-3 w-3" />
                                    {formatSavedAgo(job.saved_at)}
                                </div>

                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/applicant/jobs/${job.job_id}`}>
                                                <h3 className="text-xl font-black leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
                                                    {job.title}
                                                </h3>
                                            </Link>
                                            <span
                                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg shrink-0 ${
                                                    job.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {job.status === "active" ? "Active" : "Closed"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={isBookmarkPending}
                                            onClick={() => toggle(job.job_id, true)}
                                            className="p-2.5 rounded-xl bg-orange-50 transition-colors hover:bg-orange-100 disabled:opacity-60"
                                            aria-label="Remove from saved"
                                        >
                                            <Bookmark className="h-5 w-5 fill-orange-500 text-orange-500 transition-colors" />
                                        </button>
                                        <Link
                                            href={`/applicant/apply/${job.job_id}`}
                                            className="inline-flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shrink-0 shadow-md"
                                        >
                                            Apply
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-gray-500 mb-5">
                                    <span>{formatSalary(job)}</span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <span>{job.is_remote ? "Remote" : "On-site"}</span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <span>{formatExperience(job.experience_level)}</span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <span>{formatEmploymentTypeLabel(job.employment_type)}</span>
                                </div>

                                <p className="text-sm text-gray-600 font-medium mb-6 line-clamp-1">
                                    Saved role at this organization. Review the job details to
                                    confirm requirements, responsibilities, and application
                                    instructions.
                                </p>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl">
                                            {formatEmploymentTypeLabel(job.employment_type)}
                                        </span>
                                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl">
                                            Saved
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        {job.is_remote ? "Remote" : job.location}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            )}

            {pagination && pagination.total > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="w-9 h-9 rounded-full text-sm font-black transition-all hover:bg-slate-100 disabled:opacity-40"
                    >
                        &lt;
                    </button>
                    {Array.from(
                        { length: Math.ceil(pagination.total / ITEMS_PER_PAGE) },
                        (_, i) => i + 1,
                    ).map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setPage(num)}
                            className={`w-9 h-9 rounded-full text-sm font-black transition-all ${
                                num === page
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-slate-500 hover:bg-slate-100"
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pagination.has_next}
                        className="w-9 h-9 rounded-full text-sm font-black transition-all hover:bg-slate-100 disabled:opacity-40"
                    >
                        &gt;
                    </button>
                </div>
            )}

            <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-950">
                                Cleaning up your list?
                            </h4>
                            <p className="mt-1 max-w-xl text-xs font-medium text-slate-500">
                                Removing jobs you are no longer interested in helps us improve your
                                match recommendations.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/applicant/jobs"
                        className="inline-flex items-center justify-center rounded-lg border border-blue-300 bg-white px-6 py-2.5 text-xs font-black text-blue-600 transition-colors hover:bg-blue-50"
                    >
                        Manage List
                    </Link>
                </div>
            </div>
        </div>
    );
}
