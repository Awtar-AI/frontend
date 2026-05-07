"use client";

import { Building2, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../_components/admin-shell";
import { useOrganizations } from "./hooks/use-organizations";
import type { AdminOrganizationsFilters, OrganizationStatus } from "./schemas/organizations.schema";

const STATUS_OPTIONS: Array<{ value: OrganizationStatus; label: string }> = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
];

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function statusClasses(status: OrganizationStatus) {
    switch (status) {
        case "active":
            return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
        case "suspended":
            return "bg-red-500/10 text-red-300 border-red-500/20";
        default:
            return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    }
}

export default function OrganizationsPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [draftFilters, setDraftFilters] = useState({
        name: "",
        status: "",
        industry: "",
    });
    const [filters, setFilters] = useState<AdminOrganizationsFilters>({
        page: 1,
        page_size: 12,
    });

    const query = useOrganizations(filters);

    const metrics = useMemo(() => {
        const organizations = query.data?.organizations ?? [];
        return {
            total: query.data?.total ?? 0,
            pending: organizations.filter((item) => item.status === "pending").length,
            active: organizations.filter((item) => item.status === "active").length,
            suspended: organizations.filter((item) => item.status === "suspended").length,
        };
    }, [query.data]);

    const handleApplyFilters = () => {
        setFilters({
            page: 1,
            page_size: filters.page_size,
            name: draftFilters.name.trim() || undefined,
            status: (draftFilters.status || undefined) as OrganizationStatus | undefined,
            industry: draftFilters.industry.trim() || undefined,
        });
    };

    const totalPages = query.data
        ? Math.max(1, Math.ceil(query.data.total / query.data.page_size))
        : 1;

    return (
        <AdminShell title="Admin Panel">
            <div className="space-y-8">
                <div className="flex flex-col gap-2">
                    <h1
                        className={`text-3xl font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                    >
                        Organization Management
                    </h1>
                    <p className={isDark ? "text-awtar-slate" : "text-gray-600"}>
                        Review pending registrations, inspect organization documents, approve or
                        suspend access, and remove organizations when necessary.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: "Total organizations", value: metrics.total.toString() },
                        { label: "Pending review", value: metrics.pending.toString() },
                        { label: "Active", value: metrics.active.toString() },
                        { label: "Suspended", value: metrics.suspended.toString() },
                    ].map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-2xl border p-5 shadow-xl transition-colors ${
                                isDark
                                    ? "border-white/10 bg-white/3 shadow-black/10"
                                    : "border-gray-200 bg-white shadow-gray-200/50"
                            }`}
                        >
                            <p
                                className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                {card.label}
                            </p>
                            <p
                                className={`mt-3 text-3xl font-bold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                            >
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    className={`rounded-2xl border p-6 shadow-2xl transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/3 shadow-black/10"
                            : "border-gray-200 bg-white shadow-gray-200/50"
                    }`}
                >
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
                        <div>
                            <label
                                htmlFor="org-name-filter"
                                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Search by name
                            </label>
                            <div className="relative">
                                <Search
                                    className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-awtar-slate" : "text-gray-500"}`}
                                />
                                <input
                                    id="org-name-filter"
                                    value={draftFilters.name}
                                    onChange={(event) =>
                                        setDraftFilters((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="Search organizations"
                                    className={`h-11 w-full rounded-xl border pl-11 pr-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                                        isDark
                                            ? "border-white/10 bg-white/5 text-white"
                                            : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="org-status-filter"
                                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Status
                            </label>
                            <select
                                id="org-status-filter"
                                value={draftFilters.status}
                                onChange={(event) =>
                                    setDraftFilters((current) => ({
                                        ...current,
                                        status: event.target.value,
                                    }))
                                }
                                className={`h-11 w-full rounded-xl border px-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                                    isDark
                                        ? "border-white/10 bg-white/5 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-900"
                                }`}
                            >
                                <option value="">All statuses</option>
                                {STATUS_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        className={
                                            isDark
                                                ? "bg-awtar-navy text-white"
                                                : "bg-white text-gray-900"
                                        }
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="org-industry-filter"
                                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Industry
                            </label>
                            <input
                                id="org-industry-filter"
                                value={draftFilters.industry}
                                onChange={(event) =>
                                    setDraftFilters((current) => ({
                                        ...current,
                                        industry: event.target.value,
                                    }))
                                }
                                placeholder="e.g. Tech"
                                className={`h-11 w-full rounded-xl border px-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                                    isDark
                                        ? "border-white/10 bg-white/5 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                                }`}
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={handleApplyFilters}
                                className={`h-11 rounded-xl px-5 text-sm font-semibold transition-colors ${
                                    isDark
                                        ? "bg-awtar-blue text-white hover:bg-awtar-blue-light"
                                        : "bg-awtar-blue text-white hover:bg-awtar-blue-light"
                                }`}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={`rounded-2xl border shadow-2xl transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/3 shadow-black/10"
                            : "border-gray-200 bg-white shadow-gray-200/50"
                    }`}
                >
                    <div
                        className={`flex items-center justify-between border-b px-6 py-4 ${
                            isDark ? "border-white/10" : "border-gray-200"
                        }`}
                    >
                        <div>
                            <h2
                                className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                            >
                                Organizations
                            </h2>
                            <p
                                className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Moderation queue and active company accounts.
                            </p>
                        </div>
                        {query.isFetching && (
                            <div
                                className={`inline-flex items-center gap-2 text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Refreshing
                            </div>
                        )}
                    </div>

                    {query.isLoading ? (
                        <div className="flex items-center justify-center gap-2 px-6 py-20 text-awtar-slate">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading organizations...
                        </div>
                    ) : query.isError ? (
                        <div className="px-6 py-20 text-center text-red-300">
                            Failed to load organizations. Try adjusting the filters or refreshing
                            the page.
                        </div>
                    ) : query.data && query.data.organizations.length > 0 ? (
                        <>
                            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                                {query.data.organizations.map((organization) => (
                                    <div
                                        key={organization.id}
                                        className="rounded-2xl border border-white/10 bg-awtar-navy-light/70 p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {organization.organization_name}
                                                </h3>
                                                <p className="mt-1 text-sm text-awtar-slate">
                                                    {organization.industry} ·{" "}
                                                    {organization.organization_size} employees
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses(
                                                    organization.status,
                                                )}`}
                                            >
                                                {organization.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-awtar-slate">
                                            <p>
                                                <span className="text-white/80">Website:</span>{" "}
                                                <a
                                                    href={organization.website_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-red-300 hover:text-white"
                                                >
                                                    {organization.website_url}
                                                </a>
                                            </p>
                                            <p>
                                                <span className="text-white/80">Created:</span>{" "}
                                                {formatDate(organization.created_at)}
                                            </p>
                                            {organization.creator && (
                                                <p>
                                                    <span className="text-white/80">Founder:</span>{" "}
                                                    {organization.creator.first_name}{" "}
                                                    {organization.creator.last_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex items-center justify-between gap-3">
                                            <div className="text-xs text-awtar-slate">
                                                {organization.document_url?.length
                                                    ? `${organization.document_url.length} document link(s)`
                                                    : "No document links attached"}
                                            </div>
                                            <Link
                                                href={`/organizations/${organization.id}`}
                                                className="inline-flex items-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 hover:text-white"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                                <p className="text-sm text-awtar-slate">
                                    Page {query.data.page} of {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={filters.page <= 1}
                                        onClick={() =>
                                            setFilters((current) => ({
                                                ...current,
                                                page: Math.max(1, current.page - 1),
                                            }))
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-awtar-white transition-colors hover:bg-white/5 disabled:opacity-40"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        disabled={filters.page >= totalPages}
                                        onClick={() =>
                                            setFilters((current) => ({
                                                ...current,
                                                page: current.page + 1,
                                            }))
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-awtar-white transition-colors hover:bg-white/5 disabled:opacity-40"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-20 text-center text-awtar-slate">
                            No organizations matched the current filters.
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
