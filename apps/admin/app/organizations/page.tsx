"use client";

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../_components/admin-shell";
import { useOrganizations } from "./hooks/use-organizations";
import type {
  AdminOrganizationsFilters,
  OrganizationStatus,
} from "./schemas/organizations.schema";

const STATUS_OPTIONS: Array<{ value: OrganizationStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const INDUSTRY_OPTIONS = [
  "Tech",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
] as const;

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function statusClasses(status: OrganizationStatus, isDark: boolean) {
  switch (status) {
    case "active":
      return isDark
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "suspended":
      return isDark
        ? "bg-red-500/15 text-red-200 border-red-400/30"
        : "bg-red-50 text-red-700 border-red-200";
    default:
      return isDark
        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
        : "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export default function OrganizationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [filters, setFilters] = useState({
    page: 1,
    page_size: 12,
    name: "",
    status: "",
    industry: "",
  });

  const requestFilters = useMemo<AdminOrganizationsFilters>(
    () => ({
      page: filters.page,
      page_size: filters.page_size,
      name: filters.name.trim() || undefined,
      status: (filters.status || undefined) as OrganizationStatus | undefined,
      industry: filters.industry.trim() || undefined,
    }),
    [filters],
  );

  const query = useOrganizations(requestFilters);

  const metrics = useMemo(() => {
    const organizations = query.data?.organizations ?? [];
    return {
      total: query.data?.total ?? 0,
      pending: organizations.filter((item) => item.status === "pending").length,
      active: organizations.filter((item) => item.status === "active").length,
      suspended: organizations.filter((item) => item.status === "suspended")
        .length,
    };
  }, [query.data]);

  const totalPages = query.data
    ? Math.max(1, Math.ceil(query.data.total / query.data.page_size))
    : 1;

  const currentPage = query.data?.page ?? filters.page;
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <AdminShell title="Awtar AI">
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-gray-900"}`}
          >
            Organization Management
          </h1>
          <p className={isDark ? "text-awtar-slate" : "text-gray-600"}>
            Review pending registrations, inspect organization documents,
            approve or suspend access, and remove organizations when necessary.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            {
              label: "Total organizations",
              value: metrics.total,
              icon: Building2,
              color: "text-blue-500",
              bg: isDark
                ? "bg-blue-500/10 border-blue-500/20"
                : "bg-blue-50 border-blue-100",
            },
            {
              label: "Pending review",
              value: metrics.pending,
              icon: Clock3,
              color: "text-amber-500",
              bg: isDark
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-amber-50 border-amber-100",
            },
            {
              label: "Active",
              value: metrics.active,
              icon: Users,
              color: "text-blue-500",
              bg: isDark
                ? "bg-blue-500/10 border-blue-500/20"
                : "bg-blue-50 border-blue-100",
            },
            {
              label: "Suspended",
              value: metrics.suspended,
              icon: ShieldCheck,
              color: "text-slate-500",
              bg: isDark
                ? "bg-slate-500/10 border-slate-500/20"
                : "bg-slate-50 border-slate-100",
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className={`rounded-3xl p-6 border shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between transition-transform hover:-translate-y-1 ${
                  isDark
                    ? "bg-white/5 border-white/10 shadow-black/10"
                    : "bg-white border-gray-100"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${card.bg} ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p
                  className={`font-bold text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {card.label}
                </p>
                <h3
                  className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {card.value.toLocaleString()}
                </h3>
              </div>
            );
          })}
        </div>

        <div
          className={`rounded-2xl border p-6 shadow-2xl transition-colors ${
            isDark
              ? "border-white/10 bg-white/3 shadow-black/10"
              : "border-gray-200 bg-white shadow-gray-200/50"
          }`}
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr_auto]">
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
                  value={filters.name}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      name: event.target.value,
                      page: 1,
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
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value,
                    page: 1,
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
              <select
                id="org-industry-filter"
                value={filters.industry}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    industry: event.target.value,
                    page: 1,
                  }))
                }
                className={`h-11 w-full rounded-xl border px-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                }`}
              >
                <option value="">All industries</option>
                {INDUSTRY_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className={
                      isDark
                        ? "bg-awtar-navy text-white"
                        : "bg-white text-gray-900"
                    }
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="org-page-size"
                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
              >
                Page size
              </label>
              <select
                id="org-page-size"
                value={filters.page_size}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    page: 1,
                    page_size: Number(event.target.value),
                  }))
                }
                className={`h-11 w-full rounded-xl border px-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900"
                }`}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className={
                      isDark
                        ? "bg-awtar-navy text-white"
                        : "bg-white text-gray-900"
                    }
                  >
                    {option} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p
            className={`mt-4 text-xs ${isDark ? "text-awtar-slate" : "text-gray-500"}`}
          >
            Filters are sent to the backend as you change them.
          </p>
        </div>

        <div
          className={`overflow-hidden rounded-2xl border shadow-2xl transition-colors ${
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
            <div
              className={`flex items-center justify-center gap-2 px-6 py-20 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading organizations...
            </div>
          ) : query.isError ? (
            <div
              className={`px-6 py-20 text-center ${isDark ? "text-blue-300" : "text-blue-700"}`}
            >
              Failed to load organizations. Try adjusting the filters or
              refreshing the page.
            </div>
          ) : query.data && query.data.organizations.length > 0 ? (
            <>
              <div className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain">
                <table
                  className={`min-w-275 w-full text-left text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                >
                  <thead
                    className={`border-b uppercase transition-colors ${
                      isDark
                        ? "border-white/10 bg-white/5 text-xs text-awtar-slate"
                        : "border-gray-200 bg-gray-50 text-xs text-gray-600"
                    }`}
                  >
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Organization
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Industry
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Founder
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right font-semibold"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-gray-200"}`}
                  >
                    {query.data.organizations.map((organization) => (
                      <tr
                        key={organization.id}
                        className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                isDark
                                  ? "bg-blue-500/10 text-blue-300"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div
                                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                              >
                                {organization.organization_name}
                              </div>
                              <div
                                className={`mt-1 text-xs ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                              >
                                {organization.website_url}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                        >
                          {organization.industry}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                        >
                          {organization.organization_size} employees
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                        >
                          {organization.creator
                            ? `${organization.creator.first_name} ${organization.creator.last_name}`
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(
                              organization.status,
                              isDark,
                            )}`}
                          >
                            {organization.status}
                          </span>
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                        >
                          {formatDate(organization.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <Link
                            href={`/organizations/${organization.id}`}
                            className={`inline-flex h-8 items-center justify-center rounded-lg border px-4 text-xs font-medium transition-colors ${
                              isDark
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-white"
                                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            }`}
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className={`flex items-center justify-between border-t px-6 py-4 ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p
                  className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                >
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          page: pageNumber,
                        }))
                      }
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ${
                        pageNumber === currentPage
                          ? isDark
                            ? "bg-blue-500 text-white"
                            : "bg-blue-500 text-white"
                          : isDark
                            ? "text-awtar-white hover:bg-white/5"
                            : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div
              className={`px-6 py-20 text-center ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
            >
              No organizations matched the current filters.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
