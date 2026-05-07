"use client";

import type { LucideIcon } from "lucide-react";
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Building2,
    Calendar,
    ExternalLink,
    Globe,
    Loader2,
    UserRound,
    Users,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import { useOrganizationPublic } from "../../../(jobs)/public-jobs/hooks/use-organization-public";
import { usePublicJobs } from "../../../(jobs)/public-jobs/hooks/use-public-jobs";
import {
    formatEmploymentTypeLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../../../(jobs)/public-jobs/lib/format-job";

const JOB_SKELETON_KEYS = ["job-skeleton-1", "job-skeleton-2", "job-skeleton-3"];

function DetailItem({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-white text-blue-600 shadow-sm">
                <Icon className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
        </div>
    );
}

function formatMemberSince(value?: string): string {
    if (!value) return "Not available";

    try {
        return new Intl.DateTimeFormat(undefined, {
            month: "long",
            year: "numeric",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function formatOwnerName(firstName?: string, lastName?: string): string {
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    return name || "Not available";
}

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const orgQuery = useOrganizationPublic(id);
    const org = orgQuery.data;

    const jobsQuery = usePublicJobs(
        useMemo(() => ({ organization_id: id, limit: 20, status: "active" as const }), [id]),
        { enabled: Boolean(id) },
    );
    const activeJobs = jobsQuery.data?.jobs ?? [];

    if (orgQuery.isLoading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-sm font-semibold text-slate-500">Loading company...</span>
            </div>
        );
    }

    if (orgQuery.isError || !org) {
        return (
            <div className="mx-auto mt-10 max-w-lg rounded-xl border border-red-100 bg-red-50 p-8 text-center">
                <h1 className="mb-2 text-lg font-black text-slate-950">Company not found</h1>
                <Link href="/applicant/companies" className="text-sm font-bold text-blue-600">
                    Back to companies
                </Link>
            </div>
        );
    }

    const initials = org.organization_name.slice(0, 2).toUpperCase();
    const ownerName = formatOwnerName(org.owner_first_name, org.owner_last_name);
    const memberSince = formatMemberSince(org.member_since);
    const activeJobsCount = org.active_jobs_count ?? activeJobs.length;
    const totalJobsPosted = org.total_jobs_posted ?? activeJobs.length;

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center">
                <Link
                    href="/applicant/companies"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    aria-label="Back to companies"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-2xl font-black text-blue-700">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                    Actively hiring
                                </span>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-500">
                                    {activeJobsCount} open{" "}
                                    {activeJobsCount === 1 ? "role" : "roles"}
                                </span>
                            </div>
                            <h1 className="truncate text-3xl font-black tracking-tight text-slate-950">
                                {org.organization_name}
                            </h1>
                            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    {org.industry}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-slate-400" />
                                    {org.organization_size.toLocaleString()} employees
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    Member since {memberSince}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
                        {org.website_url && (
                            <a
                                href={org.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-black text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                <Globe className="h-4 w-4" />
                                Website
                            </a>
                        )}
                        {org.linkedin_url && (
                            <a
                                href={org.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-xs font-black text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700"
                            >
                                <ExternalLink className="h-4 w-4" />
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-950">
                                    Open positions
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Active roles currently published by this employer.
                                </p>
                            </div>
                            {jobsQuery.isLoading && (
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            )}
                        </div>

                        {jobsQuery.isLoading ? (
                            <div className="space-y-3">
                                {JOB_SKELETON_KEYS.map((key) => (
                                    <div
                                        key={key}
                                        className="h-[76px] rounded-lg border border-slate-100 bg-slate-50 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : activeJobs.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                                <Briefcase className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                                <p className="text-sm font-black text-slate-950">
                                    No open positions
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-500">
                                    This company has no active job listings right now.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {activeJobs.map((job) => (
                                    <Link
                                        key={job.id}
                                        href={`/applicant/jobs/${job.id}`}
                                        className="group flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-black text-slate-950 transition-colors group-hover:text-blue-600">
                                                {job.title}
                                            </h3>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">
                                                    {formatEmploymentTypeLabel(job.employment_type)}
                                                </span>
                                                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                                                    {formatPublicJobSalary(job)}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {formatPublicJobLocation(job)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition-colors group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                                            View role <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="space-y-6 xl:col-span-4">
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]">
                        <div className="border-b border-gray-100 p-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Company owner
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50 text-blue-700">
                                    <UserRound className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-base font-black text-slate-950">
                                        {ownerName}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        Organization representative
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-black tracking-tight text-slate-950">
                                    Overview
                                </h2>
                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                    Active
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                                <DetailItem
                                    icon={Building2}
                                    label="Industry"
                                    value={org.industry}
                                />
                                <DetailItem
                                    icon={Users}
                                    label="Company size"
                                    value={`${org.organization_size.toLocaleString()} employees`}
                                />
                                <DetailItem
                                    icon={Briefcase}
                                    label="Active jobs"
                                    value={String(activeJobsCount)}
                                />
                                <DetailItem
                                    icon={Briefcase}
                                    label="Total posted"
                                    value={String(totalJobsPosted)}
                                />
                            </div>

                            <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-blue-600 shadow-sm">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Member since
                                        </p>
                                        <p className="mt-1 text-sm font-black text-slate-950">
                                            {memberSince}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {(org.website_url || org.linkedin_url) && (
                        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-2 text-sm font-black tracking-tight text-slate-950">
                                External links
                            </h2>
                            <p className="mb-4 text-xs font-medium leading-5 text-slate-500">
                                Visit the employer&apos;s official channels for more company
                                context.
                            </p>
                            <div className="space-y-2">
                                {org.website_url && (
                                    <a
                                        href={org.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        Website <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                )}
                                {org.linkedin_url && (
                                    <a
                                        href={org.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
}
