"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "../_components/admin-shell";
import { StatusBadge } from "../_components/status-badge";
import { getOrganizations } from "../../lib/api";
import { Search, Filter, Loader2 } from "lucide-react";
import { OrganizationSummary } from "../../lib/types";

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10); // 10 items per page
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");

    // Re-fetch data whenever page, search, or status filter changes
    useEffect(() => {
        setIsLoading(true);
        // Add a tiny artificial delay ONLY on search so it doesn't flicker wildly on fast keystrokes
        const timer = setTimeout(() => {
            getOrganizations(page, pageSize, status, q).then((data) => {
                setOrganizations(data.organizations);
                setTotal(data.total);
                setIsLoading(false);
            });
        }, 150);
        return () => clearTimeout(timer);
    }, [page, pageSize, status, q]);

    // Handle search without losing keystrokes
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
        setPage(1); // Reset to page 1 on new search
    };

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setPage(1); // Reset to page 1 on new filter
    };

    const handleNext = () => setPage(p => p + 1);
    const handlePrev = () => setPage(p => Math.max(1, p - 1));

    const totalPages = Math.ceil(total / pageSize);

    return (
        <AdminShell title="Organizations">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or industry..."
                            value={q}
                            onChange={handleSearch}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
                
                <div className="flex shrink-0 items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 select-none">
                        <Filter className="h-4 w-4 text-gray-500" />
                        Filters
                    </div>
                    <select 
                        value={status} 
                        onChange={handleFilter}
                        className="rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-8 text-sm font-semibold text-gray-700 outline-none transition-colors hover:bg-gray-50 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <div className="relative w-full">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        )}
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Organization</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Industry</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Size</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Registered</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {organizations.length > 0 ? (
                                    organizations.map((org) => (
                                        <tr key={org.id} className="transition-colors hover:bg-blue-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{org.organizationName}</span>
                                                    <a 
                                                        href={org.websiteUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="mt-1 text-xs text-blue-600 hover:text-blue-500 font-medium"
                                                    >
                                                        {org.websiteUrl.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">{org.industry || "—"}</td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">{org.organizationSize}</td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">
                                                {new Date(org.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={org.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={"/organizations/" + org.id}
                                                    className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                                            {isLoading ? "Searching organizations..." : "No organizations found matching your filters."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">{Math.min((page - 1) * pageSize + 1, total)}</span> to <span className="font-bold text-gray-900">{Math.min(page * pageSize, total)}</span> of <span className="font-bold text-gray-900">{total}</span> total
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={handlePrev} 
                            disabled={page === 1} 
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={handleNext} 
                            disabled={page >= totalPages || total === 0} 
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
