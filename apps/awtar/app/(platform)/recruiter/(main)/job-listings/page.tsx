"use client";

import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
    ArrowUpDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Loader2,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { normalizeError } from "@/lib/errors";
import { useAuthOrganizationId } from "@/lib/hooks/use-auth";
import { toastService } from "@/lib/services/toast.service";
import { postJobApi } from "../post-job/api/post-job.api";
import { useDeleteJob } from "../post-job/hooks/use-delete-job";
import { RECRUITER_JOBS_QUERY_KEY, useRecruiterJobs } from "../post-job/hooks/use-recruiter-jobs";
import type { JobPostResponse } from "../post-job/schemas/post-job.schema";
import { recruiterApplicationsApi } from "./api/recruiter-applications.api";

const ITEMS_PER_PAGE = 5;

type SortKey = "title" | "location" | "status" | "postedOn" | "applicants" | "deadline";

type SortConfig = {
    key: SortKey;
    direction: "asc" | "desc";
} | null;

function formatPostedDate(iso: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function jobLocationLabel(job: JobPostResponse): string {
    if (job.is_remote) return "Remote";
    return job.location?.trim() || "—";
}

function formatDeadline(iso: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function isPastDeadline(iso: string): boolean {
    const deadline = new Date(iso);
    return Number.isFinite(deadline.getTime()) && deadline.getTime() < Date.now();
}

export default function JobListingsPage() {
    const organizationId = useAuthOrganizationId();
    const queryClient = useQueryClient();
    const jobsQuery = useRecruiterJobs();
    const deleteMutation = useDeleteJob();

    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const jobs = jobsQuery.data ?? [];
    const applicantCountsQueries = useQueries({
        queries: jobs.map((job) => ({
            queryKey: ["recruiter", "jobs", "applications", "count", job.id] as const,
            queryFn: () => recruiterApplicationsApi.getCount(job.id),
            enabled: Boolean(organizationId && job.id),
            staleTime: 30_000,
        })),
    });
    const applicantCountMap = useMemo(
        () =>
            jobs.reduce<Record<string, number>>((acc, job, index) => {
                acc[job.id] = applicantCountsQueries[index]?.data ?? 0;
                return acc;
            }, {}),
        [jobs, applicantCountsQueries],
    );

    const sortedJobs = useMemo(() => {
        const sortable = [...jobs];
        if (sortConfig !== null) {
            sortable.sort((a, b) => {
                let va: string | number = "";
                let vb: string | number = "";

                switch (sortConfig.key) {
                    case "title":
                        va = a.title;
                        vb = b.title;
                        break;
                    case "location":
                        va = jobLocationLabel(a);
                        vb = jobLocationLabel(b);
                        break;
                    case "status":
                        va = a.status;
                        vb = b.status;
                        break;
                    case "postedOn":
                        va = new Date(a.created_at).getTime();
                        vb = new Date(b.created_at).getTime();
                        break;
                    case "applicants":
                        va = applicantCountMap[a.id] ?? 0;
                        vb = applicantCountMap[b.id] ?? 0;
                        break;
                    case "deadline":
                        va = new Date(a.deadline).getTime();
                        vb = new Date(b.deadline).getTime();
                        break;
                    default:
                        return 0;
                }

                if (va < vb) return sortConfig.direction === "asc" ? -1 : 1;
                if (va > vb) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [jobs, sortConfig, applicantCountMap]);

    const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE) || 1;
    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentJobs = sortedJobs.slice(indexOfFirst, indexOfLast);

    const toggleRow = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
        );
    };

    const toggleAll = () => {
        if (selectedRows.length === currentJobs.length && currentJobs.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentJobs.map((j) => j.id));
        }
    };

    const handleSort = (key: SortKey) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleFilterButtonClick = (label: string) => {
        const map: Record<string, SortKey> = {
            Location: "location",
            Status: "status",
            Date: "postedOn",
            Applicants: "applicants",
            Deadline: "deadline",
        };
        const key = map[label];
        if (key) handleSort(key);
    };

    const deleteOne = (jobId: string) => {
        deleteMutation.mutate(jobId, {
            onSuccess: () => {
                setSelectedRows((prev) => prev.filter((id) => id !== jobId));
                const newTotal = jobs.length - 1;
                if (currentPage > Math.ceil(newTotal / ITEMS_PER_PAGE) && currentPage > 1) {
                    setCurrentPage(Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE)));
                }
            },
        });
    };

    const [bulkDeleting, setBulkDeleting] = useState(false);

    const deleteBulk = () => {
        const ids = [...selectedRows];
        if (ids.length === 0) return;
        void (async () => {
            setBulkDeleting(true);
            try {
                for (const id of ids) {
                    await postJobApi.remove(id);
                }
                toastService.success(
                    ids.length === 1 ? "Job removed." : `${ids.length} jobs removed.`,
                );
                await queryClient.invalidateQueries({ queryKey: [...RECRUITER_JOBS_QUERY_KEY] });
                setSelectedRows([]);
            } catch (e) {
                toastService.error(normalizeError(e).message);
            } finally {
                setBulkDeleting(false);
            }
        })();
    };

    const getStatusBadge = (status: JobPostResponse["status"]) => {
        if (status === "active") {
            return (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md whitespace-nowrap">
                    Active
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md whitespace-nowrap">
                Closed
            </span>
        );
    };

    const filters = ["Location", "Status", "Date", "Applicants", "Deadline"];

    if (!organizationId) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your session does not have an active organization. Sign in again so the jobs API can
                resolve your tenant from the JWT.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm relative">
            {/* Header / Title */}
            <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                        Job Summary Table
                    </h1>
                </div>

                {selectedRows.length > 0 && (
                    <button
                        type="button"
                        onClick={deleteBulk}
                        disabled={deleteMutation.isPending || bulkDeleting}
                        className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 flex items-center gap-1 disabled:opacity-60"
                    >
                        {bulkDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                        )}{" "}
                        Delete Selected ({selectedRows.length})
                    </button>
                )}
            </div>

            {/* Filters Row */}
            <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => handleFilterButtonClick(filter)}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                        >
                            {filter} <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                    ))}
                </div>
                <div className="text-sm font-semibold text-gray-500">
                    {jobsQuery.isLoading ? "…" : jobs.length} Jobs
                </div>
            </div>

            {jobsQuery.isError && (
                <div className="px-6 pb-4 text-sm text-red-600">
                    Could not load jobs. Please try again.
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                {jobsQuery.isLoading ? (
                    <div className="flex items-center justify-center py-24 text-gray-500 gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading jobs…
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-[#fbfcff] border-y border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12 align-middle">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedRows.length === currentJobs.length &&
                                            currentJobs.length > 0
                                        }
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </th>
                                <th
                                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("title")}
                                >
                                    <div className="flex items-center gap-1 uppercase">
                                        Job Title{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("location")}
                                >
                                    <div className="flex items-center gap-1 uppercase">
                                        Location{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group text-center"
                                    onClick={() => handleSort("applicants")}
                                >
                                    <div className="flex items-center justify-center gap-1 uppercase">
                                        Applicants{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group text-center"
                                    onClick={() => handleSort("status")}
                                >
                                    <div className="flex items-center justify-center gap-1 uppercase">
                                        Status{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("postedOn")}
                                >
                                    <div className="flex items-center gap-1 uppercase">
                                        Posted On{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("deadline")}
                                >
                                    <div className="flex items-center gap-1 uppercase">
                                        Deadline{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 font-semibold text-right uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentJobs.length > 0 ? (
                                currentJobs.map((job) => (
                                    <tr
                                        key={job.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(job.id)}
                                                onChange={() => toggleRow(job.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <Link
                                                href={`/recruiter/job-listings/${job.id}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {job.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                            {jobLocationLabel(job)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600 text-xs font-medium">
                                            {applicantCountsQueries.find(
                                                (q, idx) => jobs[idx]?.id === job.id,
                                            )?.isLoading
                                                ? "..."
                                                : (applicantCountMap[job.id] ?? 0)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(job.status)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                            {formatPostedDate(job.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium">
                                            <span
                                                className={
                                                    isPastDeadline(job.deadline)
                                                        ? "text-red-600"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {formatDeadline(job.deadline)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-blue-500">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOne(job.id)}
                                                    disabled={deleteMutation.isPending}
                                                    className="hover:text-red-600 transition-colors text-red-500 disabled:opacity-50"
                                                    title="Delete job"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/recruiter/job-listings/${job.id}`}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="View applicants"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No jobs yet. Post a job to see it listed here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination block */}
            {!jobsQuery.isLoading && totalPages > 0 && sortedJobs.length > 0 && (
                <div className="flex flex-col items-center justify-center p-6 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                    pageNumber === currentPage
                                        ? "text-white bg-blue-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
