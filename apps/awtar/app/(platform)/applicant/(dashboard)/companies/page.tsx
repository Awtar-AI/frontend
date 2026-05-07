"use client";

import {
    ArrowRight,
    ArrowUpDown,
    Briefcase,
    Building2,
    Search,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePublicOrganizationsList } from "../../(jobs)/public-jobs/hooks/use-public-organizations-list";

type SortOption = "name" | "open_roles" | "company_size";

const COMPANY_SKELETON_KEYS = [
    "company-skeleton-1",
    "company-skeleton-2",
    "company-skeleton-3",
    "company-skeleton-4",
    "company-skeleton-5",
    "company-skeleton-6",
];

function CompanySkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
            <div className="mb-5 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-100" />
                <div className="flex-1">
                    <div className="mb-3 h-5 w-2/3 rounded bg-gray-100" />
                    <div className="h-4 w-1/2 rounded bg-gray-100" />
                </div>
            </div>
            <div className="mb-5 h-16 rounded-lg bg-gray-100" />
            <div className="h-9 rounded-lg bg-gray-100" />
        </div>
    );
}

export default function CompaniesPage() {
    const { organizations, isLoading, isError } = usePublicOrganizationsList();
    const [searchQuery, setSearchQuery] = useState("");
    const [industryFilter, setIndustryFilter] = useState("all");
    const [sortBy, setSortBy] = useState<SortOption>("open_roles");

    const industries = useMemo(() => {
        return Array.from(
            new Set(organizations.map((company) => company.industry).filter(Boolean)),
        ).sort((a, b) => a.localeCompare(b));
    }, [organizations]);

    const filteredOrganizations = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        return organizations
            .filter((company) => {
                const matchesSearch =
                    !normalizedSearch ||
                    company.organization_name.toLowerCase().includes(normalizedSearch) ||
                    company.industry.toLowerCase().includes(normalizedSearch);
                const matchesIndustry =
                    industryFilter === "all" || company.industry === industryFilter;
                return matchesSearch && matchesIndustry;
            })
            .sort((a, b) => {
                if (sortBy === "name") {
                    return a.organization_name.localeCompare(b.organization_name);
                }
                if (sortBy === "company_size") {
                    return b.organization_size - a.organization_size;
                }
                return b.job_count - a.job_count;
            });
    }, [industryFilter, organizations, searchQuery, sortBy]);

    const hasFilters =
        searchQuery.trim().length > 0 || industryFilter !== "all" || sortBy !== "open_roles";

    function clearFilters() {
        setSearchQuery("");
        setIndustryFilter("all");
        setSortBy("open_roles");
    }

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <div
                className="relative overflow-hidden rounded-3xl bg-[#475ca3] p-8 lg:p-10 text-white shadow-sm z-0"
                style={{ backgroundColor: "#8fa3c4" }}
            >
                <div className="absolute inset-0 z-[-1] mix-blend-overlay">
                    <Image
                        src="/images/slide-recruiter.jpg"
                        alt="Office background"
                        fill
                        priority
                        className="object-cover opacity-30"
                    />
                </div>
                <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-900/90 to-blue-800/40" />

                <div className="max-w-3xl">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-50 backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5" />
                        Company discovery
                    </span>
                    <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
                        Discover Companies
                    </h1>
                    <p className="max-w-2xl text-sm lg:text-base font-bold text-blue-50 drop-shadow">
                        Browse employers with active roles and review their public hiring profiles.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm font-bold text-slate-500">
                    {isLoading
                        ? "Loading companies..."
                        : `${filteredOrganizations.length} of ${organizations.length} companies`}
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search"
                            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={industryFilter}
                            onChange={(event) => setIndustryFilter(event.target.value)}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                            aria-label="Filter by industry"
                        >
                            <option value="all">All industries</option>
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>

                        <div className="relative">
                            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value as SortOption)}
                                className="h-9 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                aria-label="Sort companies"
                            >
                                <option value="open_roles">Most roles</option>
                                <option value="company_size">Largest team</option>
                                <option value="name">Company name</option>
                            </select>
                        </div>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-black text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    Could not load companies. Check your API URL and try again.
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {isLoading
                    ? COMPANY_SKELETON_KEYS.map((key) => <CompanySkeleton key={key} />)
                    : filteredOrganizations.map((company) => {
                          const initial = company.organization_name.slice(0, 1).toUpperCase();
                          const hiringLabel = `${company.job_count} open ${
                              company.job_count === 1 ? "role" : "roles"
                          }`;
                          return (
                              <Link
                                  key={company.id}
                                  href={`/applicant/companies/${company.id}`}
                                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_36px_-24px_rgba(37,99,235,0.45)] focus:outline-none focus:ring-4 focus:ring-blue-50"
                              >
                                  <div className="mb-5 flex items-start justify-between gap-4">
                                      <div className="flex min-w-0 items-start gap-4">
                                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-white shadow-sm">
                                              <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-700">
                                                  {initial}
                                              </div>
                                          </div>
                                          <div className="min-w-0">
                                              <h2 className="truncate text-base font-black tracking-tight text-slate-950 group-hover:text-blue-600">
                                                  {company.organization_name}
                                              </h2>
                                              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                  {company.industry}
                                              </p>
                                          </div>
                                      </div>
                                      <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                          Hiring
                                      </span>
                                  </div>

                                  <div className="mb-5 grid grid-cols-2 gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                                      <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                              Team size
                                          </p>
                                          <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-slate-950">
                                              <Users className="h-3.5 w-3.5 text-blue-600" />
                                              {company.organization_size.toLocaleString()}
                                          </p>
                                      </div>
                                      <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                              Hiring
                                          </p>
                                          <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-slate-950">
                                              <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                                              {hiringLabel}
                                          </p>
                                      </div>
                                  </div>

                                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                      <span className="text-xs font-black text-slate-600">
                                          Open profile
                                      </span>
                                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                      </span>
                                  </div>
                              </Link>
                          );
                      })}
            </div>

            {!isLoading && filteredOrganizations.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-slate-50 text-slate-300">
                        <Building2 className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-black text-slate-950">No companies found</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        {organizations.length === 0
                            ? "No companies have active public roles right now."
                            : "Try adjusting your search, industry, or sorting filters."}
                    </p>
                    {organizations.length > 0 && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors hover:bg-black"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
