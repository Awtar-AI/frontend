"use client";

import {
    ArrowRight,
    Bookmark,
    Briefcase,
    Check,
    ChevronDown,
    Clock,
    Loader2,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
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
import { useSaveJob } from "../saved-jobs/hooks/use-save-job";
import { useSavedJobs } from "../saved-jobs/hooks/use-saved-jobs";

const JOBS_PER_PAGE = 9;
const SALARY_MIN = 0;
const SALARY_MAX = 200000;
const SALARY_STEP = 5000;

const EMPLOYMENT_TYPES = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
] as const;

const EXPERIENCE_LEVELS = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "lead", label: "Lead" },
] as const;

function formatSalaryRangeValue(value: number): string {
    return `$${value.toLocaleString()}`;
}

function formatDeadlineLabel(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
    } catch {
        return value;
    }
}

function formatPostedAgo(value?: string): string {
    if (!value) return "Recently posted";

    const postedDate = new Date(value);
    const postedTime = postedDate.getTime();
    if (!Number.isFinite(postedTime)) return "Recently posted";

    const diffMs = postedTime - Date.now();
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

function isJobClosed(status: string, deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    const pastDeadline =
        Number.isFinite(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now();
    return status !== "active" || pastDeadline;
}

function FilterSection({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="py-5 border-b border-gray-100 last:border-0">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <span className="text-sm font-black text-gray-900">{title}</span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
                />
            </button>
            {open && <div className="space-y-2.5">{children}</div>}
        </div>
    );
}

function FilterCheckbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <button
                type="button"
                onClick={onChange}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                    checked
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 bg-white group-hover:border-blue-400"
                }`}
                aria-pressed={checked}
            >
                {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />}
            </button>
            <span
                className={`text-sm font-semibold ${checked ? "text-gray-900" : "text-gray-600"}`}
            >
                {label}
            </span>
        </label>
    );
}

export default function JobsPage() {
    const [page, setPage] = useState(1);
    const [titleInput, setTitleInput] = useState("");
    const [titleQuery, setTitleQuery] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [remoteFilter, setRemoteFilter] = useState<"" | "remote" | "onsite">("");
    const [salaryDraft, setSalaryDraft] = useState({ min: SALARY_MIN, max: SALARY_MAX });
    const [salaryRange, setSalaryRange] = useState<{ min?: number; max?: number }>({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setTitleQuery(titleInput.trim()), 400);
        return () => clearTimeout(t);
    }, [titleInput]);

    const query: PublicJobsQuery = useMemo(() => {
        const q: PublicJobsQuery = { page, limit: JOBS_PER_PAGE, status: "active" };
        if (titleQuery.length >= 2) q.title = titleQuery;
        if (employmentType) q.employment_type = employmentType;
        if (experienceLevel) q.experience_level = experienceLevel;
        if (remoteFilter === "remote") q.is_remote = true;
        if (remoteFilter === "onsite") q.is_remote = false;
        if (salaryRange.min != null) q.min_salary = salaryRange.min;
        if (salaryRange.max != null) q.max_salary = salaryRange.max;
        return q;
    }, [page, titleQuery, employmentType, experienceLevel, remoteFilter, salaryRange]);

    const jobsQuery = usePublicJobs(query);
    const myApplicationsQuery = useMyApplications();
    const savedJobsQuery = useSavedJobs({ limit: 100 });
    const { toggle, isPending: isBookmarkPending } = useSaveJob();
    const savedJobIds = useMemo(
        () => new Set((savedJobsQuery.data?.data ?? []).map((j) => j.job_id)),
        [savedJobsQuery.data],
    );

    const jobs = jobsQuery.data?.jobs ?? [];
    const total = jobsQuery.data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE));
    const showingFrom = total === 0 ? 0 : (page - 1) * JOBS_PER_PAGE + 1;
    const showingTo = Math.min(page * JOBS_PER_PAGE, total);

    const hasSalaryFilter = salaryRange.min != null || salaryRange.max != null;
    const hasFilters = !!(
        titleQuery ||
        employmentType ||
        experienceLevel ||
        remoteFilter ||
        hasSalaryFilter
    );

    function clearFilters() {
        setTitleInput("");
        setEmploymentType("");
        setExperienceLevel("");
        setRemoteFilter("");
        setSalaryDraft({ min: SALARY_MIN, max: SALARY_MAX });
        setSalaryRange({});
        setPage(1);
    }

    function applySalaryFilter() {
        setSalaryRange({
            min: salaryDraft.min > SALARY_MIN ? salaryDraft.min : undefined,
            max: salaryDraft.max < SALARY_MAX ? salaryDraft.max : undefined,
        });
        setPage(1);
    }

    const sidebar = (
        <div className="bg-blue-50/70 rounded-[20px] border border-blue-100 shadow-sm overflow-hidden">
            {/* Search */}
            <div className="p-5 border-b border-blue-100">
                <p className="text-xs font-black text-gray-900 mb-3">Search by Job Title</p>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={titleInput}
                        onChange={(e) => {
                            setTitleInput(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Job title or company"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="px-5">
                {/* Work Location */}
                <FilterSection title="Work Location">
                    {[
                        { value: "" as const, label: "All Locations" },
                        { value: "remote" as const, label: "Remote Only" },
                        { value: "onsite" as const, label: "On-site Only" },
                    ].map((o) => (
                        <FilterCheckbox
                            key={o.value || "all-loc"}
                            label={o.label}
                            checked={remoteFilter === o.value}
                            onChange={() => {
                                setRemoteFilter(o.value);
                                setPage(1);
                            }}
                        />
                    ))}
                </FilterSection>

                {/* Job Type */}
                <FilterSection title="Job Type">
                    {EMPLOYMENT_TYPES.map((o) => (
                        <FilterCheckbox
                            key={o.value}
                            label={o.label}
                            checked={employmentType === o.value}
                            onChange={() => {
                                setEmploymentType(employmentType === o.value ? "" : o.value);
                                setPage(1);
                            }}
                        />
                    ))}
                </FilterSection>

                {/* Experience Level */}
                <FilterSection title="Experience Level">
                    {EXPERIENCE_LEVELS.map((o) => (
                        <FilterCheckbox
                            key={o.value}
                            label={o.label}
                            checked={experienceLevel === o.value}
                            onChange={() => {
                                setExperienceLevel(experienceLevel === o.value ? "" : o.value);
                                setPage(1);
                            }}
                        />
                    ))}
                </FilterSection>

                {/* Salary Range */}
                <FilterSection title="Salary Range">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-black text-gray-900">
                            <span>{formatSalaryRangeValue(salaryDraft.min)}</span>
                            <span>{formatSalaryRangeValue(salaryDraft.max)}</span>
                        </div>
                        <div className="relative h-8">
                            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-100" />
                            <div
                                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-600"
                                style={{
                                    left: `${((salaryDraft.min - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100}%`,
                                    right: `${100 - ((salaryDraft.max - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100}%`,
                                }}
                            />
                            <input
                                type="range"
                                min={SALARY_MIN}
                                max={SALARY_MAX}
                                step={SALARY_STEP}
                                value={salaryDraft.min}
                                onChange={(e) => {
                                    const nextMin = Math.min(
                                        Number(e.target.value),
                                        salaryDraft.max - SALARY_STEP,
                                    );
                                    setSalaryDraft((current) => ({ ...current, min: nextMin }));
                                }}
                                aria-label="Minimum salary"
                                className="pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent accent-blue-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600"
                            />
                            <input
                                type="range"
                                min={SALARY_MIN}
                                max={SALARY_MAX}
                                step={SALARY_STEP}
                                value={salaryDraft.max}
                                onChange={(e) => {
                                    const nextMax = Math.max(
                                        Number(e.target.value),
                                        salaryDraft.min + SALARY_STEP,
                                    );
                                    setSalaryDraft((current) => ({ ...current, max: nextMax }));
                                }}
                                aria-label="Maximum salary"
                                className="pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent accent-blue-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600"
                            />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                            <span>{formatSalaryRangeValue(SALARY_MIN)}</span>
                            <span>{formatSalaryRangeValue(SALARY_MAX)}</span>
                        </div>
                        <input
                            type="hidden"
                            value={`${salaryDraft.min}-${salaryDraft.max}`}
                            readOnly
                        />
                    </div>
                    <button
                        type="button"
                        onClick={applySalaryFilter}
                        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-blue-700"
                    >
                        Apply Salary
                    </button>
                </FilterSection>
            </div>

            {/* Clear */}
            {hasFilters && (
                <div className="p-5 pt-0">
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-xl transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div
                className="relative overflow-hidden rounded-3xl bg-[#475ca3] p-8 lg:p-10 text-white shadow-sm z-0"
                style={{ backgroundColor: "#8fa3c4" }}
            >
                <div className="absolute inset-0 z-[-1] mix-blend-overlay">
                    <Image
                        src="/images/slide-interview.jpg"
                        alt="Interview background"
                        fill
                        priority
                        className="object-cover opacity-30"
                    />
                </div>
                <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-900/90 to-blue-800/40" />

                <div className="max-w-2xl">
                    <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
                        Find Jobs
                    </h1>
                    <p className="text-blue-50 font-bold mb-8 text-sm lg:text-base drop-shadow">
                        Browse active openings and focus your search by role, location, experience,
                        and salary.
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white font-bold drop-shadow">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {jobsQuery.isLoading
                                ? "Loading..."
                                : `Showing ${showingFrom}-${showingTo} of ${total} results`}
                        </div>
                    </div>
                </div>
            </div>
            {/* Header bar */}
            <div className="xl:hidden flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm"
                >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                    {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                </button>
            </div>
            {/* Mobile filters */}
            {showMobileFilters && <div className="xl:hidden mb-6">{sidebar}</div>}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Desktop sidebar */}
                <div className="hidden xl:block xl:col-span-3">{sidebar}</div>

                {/* Job list */}
                <div className="xl:col-span-9 space-y-4">
                    {jobsQuery.isError && (
                        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Could not load jobs. Check your API URL and try again.
                        </div>
                    )}

                    <div className="space-y-4 min-h-[400px]">
                        {jobsQuery.isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="text-sm font-semibold">Loading listings...</span>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => {
                                const application = (myApplicationsQuery.data ?? []).find(
                                    (item) => item.job_id === job.id,
                                );
                                const closed = isJobClosed(job.status, job.deadline);
                                const isSaved = savedJobIds.has(job.id);
                                return (
                                    <div
                                        key={job.id}
                                        className="w-full p-6 border border-gray-200 rounded-3xl bg-white shadow-sm hover:border-blue-400 transition-colors group"
                                    >
                                        <div className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                                            <Clock className="h-3 w-3" />
                                            {formatPostedAgo(job.created_at)}
                                        </div>

                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <Link href={`/applicant/jobs/${job.id}`}>
                                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                                                            {job.title}
                                                        </h3>
                                                    </Link>
                                                    <span
                                                        className={`px-2.5 py-1 text-[10px] font-black rounded-lg shrink-0 ${
                                                            closed
                                                                ? "bg-gray-100 text-gray-500"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                    >
                                                        {closed ? "Closed" : "Active"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={isBookmarkPending}
                                                    onClick={() => toggle(job.id, isSaved)}
                                                    className={`p-2.5 rounded-xl transition-colors ${
                                                        isSaved
                                                            ? "bg-orange-50 hover:bg-orange-100"
                                                            : "bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                                    aria-label="Bookmark job"
                                                >
                                                    <Bookmark
                                                        className={`h-5 w-5 transition-colors ${
                                                            isSaved
                                                                ? "fill-orange-500 text-orange-500"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                </button>
                                                {application ? (
                                                    <Link
                                                        href={`/applicant/applications/${job.id}`}
                                                        className="inline-flex items-center gap-1.5 px-6 py-2 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shrink-0 shadow-md"
                                                    >
                                                        View <ArrowRight className="h-3.5 w-3.5" />
                                                    </Link>
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
                                                        className={`inline-flex items-center gap-1.5 px-6 py-2 text-sm font-bold rounded-xl transition-colors shrink-0 shadow-md ${
                                                            closed
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                                                                : "bg-blue-600 text-white hover:bg-blue-700"
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

                                        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-gray-500 mb-5">
                                            <span>{formatPublicJobSalary(job)}</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                            <span>{job.is_remote ? "Remote" : "On-site"}</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                            <span>{formatExperienceLevelLabel(job)}</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                            <span>
                                                Deadline {formatDeadlineLabel(job.deadline)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 font-medium mb-6 line-clamp-1">
                                            {job.description}
                                        </p>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl">
                                                    {formatEmploymentTypeLabel(job.employment_type)}
                                                </span>
                                                {job.is_resume_required && (
                                                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl">
                                                        Resume required
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                <MapPin className="w-4 h-4" />
                                                {formatPublicJobLocation(job)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-[24px] p-16 flex flex-col items-center justify-center text-center border border-gray-100 border-dashed">
                                <Search className="w-10 h-10 text-gray-300 mb-4" />
                                <h3 className="text-xl font-black text-gray-900">No jobs found</h3>
                                <p className="text-sm text-gray-400 font-medium max-w-xs mt-2">
                                    Try broadening your search or clearing filters.
                                </p>
                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && !jobsQuery.isLoading && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="w-9 h-9 rounded-full text-sm font-black transition-all hover:bg-gray-100 disabled:opacity-40"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPage(num)}
                                    className={`w-9 h-9 rounded-full text-sm font-black transition-all ${
                                        num === page
                                            ? "bg-blue-600 text-white shadow-md"
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
                                className="w-9 h-9 rounded-full text-sm font-black transition-all hover:bg-gray-100 disabled:opacity-40"
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
