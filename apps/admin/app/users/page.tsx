"use client";

import { ChevronLeft, ChevronRight, Search, Shield, UserPlus, Users, UserX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../_components/admin-shell";
import { useUsers } from "./hooks/use-users";
import type { AdminUsersFilters, UserRole, UserStatus } from "./schemas/users.schema";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function statusClasses(status: UserStatus) {
    switch (status) {
        case "active":
            return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
        case "inactive":
            return "bg-red-500/10 text-red-300 border-red-500/20";
        default:
            return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    }
}

function roleLabel(role: UserRole) {
    switch (role) {
        case "admin":
            return "Admin";
        case "hr":
            return "Recruiter";
        case "candidate":
            return "Applicant";
    }
}

export default function UsersPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [filters, setFilters] = useState<AdminUsersFilters>({
        page: 1,
        page_size: 20,
    });

    const [draftFilters, setDraftFilters] = useState({
        search: "",
        role: "",
        status: "",
    });

    const { data: usersData, isLoading } = useUsers(filters);

    const users = usersData?.users || [];
    const total = usersData?.total || 0;
    const currentPage = usersData?.page || 1;
    const pageSize = usersData?.page_size || 20;

    // Calculate metrics
    const metrics = {
        total,
        active: users.filter((u) => u.is_active).length,
        inactive: users.filter((u) => !u.is_active).length,
        admins: users.filter((u) => u.role === "admin").length,
    };

    const handleApplyFilters = () => {
        setFilters({
            page: 1,
            page_size: 20,
            search: draftFilters.search || undefined,
            role: (draftFilters.role as UserRole) || undefined,
            status: draftFilters.status === "" ? "all" : draftFilters.status || undefined,
        });
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <AdminShell title="Admin Panel">
            <div className="space-y-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1
                                className={`text-3xl font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                            >
                                User Management
                            </h1>
                            <p className={isDark ? "text-awtar-slate" : "text-gray-600"}>
                                Monitor user accounts, manage roles, and suspend abusive users
                                across the platform.
                            </p>
                        </div>
                        <Link
                            href="/users/create"
                            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                                isDark
                                    ? "bg-awtar-blue text-white hover:bg-awtar-blue-light"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            <UserPlus className="h-4 w-4" />
                            Create User
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        {
                            label: "Total users",
                            value: metrics.total.toString(),
                            icon: Users,
                        },
                        {
                            label: "Active users",
                            value: metrics.active.toString(),
                            icon: Users,
                        },
                        {
                            label: "Inactive",
                            value: metrics.inactive.toString(),
                            icon: UserX,
                        },
                        { label: "Admins", value: metrics.admins.toString(), icon: Shield },
                    ].map((card) => {
                        const _Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className={`relative overflow-hidden rounded-2xl border p-5 shadow-xl transition-colors ${
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
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
                        <div>
                            <label
                                htmlFor="user-search-filter"
                                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Search by name or email
                            </label>
                            <div className="relative">
                                <Search
                                    className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-awtar-slate" : "text-gray-500"}`}
                                />
                                <input
                                    id="user-search-filter"
                                    value={draftFilters.search}
                                    onChange={(event) =>
                                        setDraftFilters((current) => ({
                                            ...current,
                                            search: event.target.value,
                                        }))
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleApplyFilters();
                                        }
                                    }}
                                    placeholder="e.g. alice@acme.corp"
                                    className={`h-11 w-full rounded-xl border pl-11 pr-11 outline-none transition-colors focus:border-awtar-blue/40 ${
                                        isDark
                                            ? "border-white/10 bg-white/5 text-white"
                                            : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyFilters}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-awtar-slate hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="user-role-filter"
                                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Role
                            </label>
                            <select
                                id="user-role-filter"
                                value={draftFilters.role}
                                onChange={(event) => {
                                    setDraftFilters((current) => ({
                                        ...current,
                                        role: event.target.value,
                                    }));
                                    setFilters((prev) => ({
                                        ...prev,
                                        page: 1,
                                        role: (event.target.value as UserRole) || undefined,
                                    }));
                                }}
                                className={`h-11 w-full rounded-xl border px-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                                    isDark
                                        ? "border-white/10 bg-white/5 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-900"
                                }`}
                            >
                                <option value="">All roles</option>
                                <option
                                    value="admin"
                                    className={
                                        isDark
                                            ? "bg-awtar-navy text-white"
                                            : "bg-white text-gray-900"
                                    }
                                >
                                    Admin
                                </option>
                                <option
                                    value="hr"
                                    className={
                                        isDark
                                            ? "bg-awtar-navy text-white"
                                            : "bg-white text-gray-900"
                                    }
                                >
                                    Recruiter
                                </option>
                                <option
                                    value="candidate"
                                    className={
                                        isDark
                                            ? "bg-awtar-navy text-white"
                                            : "bg-white text-gray-900"
                                    }
                                >
                                    Applicant
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="user-status-filter"
                                className={`mb-2 block text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Status
                            </label>
                            <select
                                id="user-status-filter"
                                value={draftFilters.status}
                                onChange={(event) => {
                                    setDraftFilters((current) => ({
                                        ...current,
                                        status: event.target.value,
                                    }));
                                    setFilters((prev) => ({
                                        ...prev,
                                        page: 1,
                                        status:
                                            event.target.value === ""
                                                ? "all"
                                                : event.target.value || undefined,
                                    }));
                                }}
                                className={`h-11 w-full rounded-xl border px-4 outline-none transition-colors focus:border-awtar-blue/40 ${
                                    isDark
                                        ? "border-white/10 bg-white/5 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-900"
                                }`}
                            >
                                <option value="">All statuses</option>
                                <option
                                    value="active"
                                    className={
                                        isDark
                                            ? "bg-awtar-navy text-white"
                                            : "bg-white text-gray-900"
                                    }
                                >
                                    Active
                                </option>
                                <option
                                    value="inactive"
                                    className={
                                        isDark
                                            ? "bg-awtar-navy text-white"
                                            : "bg-white text-gray-900"
                                    }
                                >
                                    Inactive
                                </option>
                            </select>
                        </div>

                        <div className="flex items-end self-end lg:h-17.5">
                            <button
                                type="button"
                                onClick={handleApplyFilters}
                                className={`flex h-11 items-center justify-center rounded-xl px-8 text-sm font-semibold transition-colors ${
                                    isDark
                                        ? "bg-awtar-blue text-white hover:bg-awtar-blue-light"
                                        : "bg-awtar-blue text-white hover:bg-awtar-blue-light"
                                }`}
                            >
                                Apply filters
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={`overflow-hidden rounded-2xl border shadow-2xl transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/3 shadow-black/10"
                            : "border-gray-200 bg-white shadow-gray-200/50"
                    }`}
                >
                    <div className="overflow-x-auto">
                        <table
                            className={`w-full text-left text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
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
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold">
                                        Job Title
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold">
                                        Years Exp
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold">
                                        Industry
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-gray-200"}`}
                            >
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className={`px-6 py-8 text-center ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className={`px-6 py-8 text-center ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div
                                                    className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                                >
                                                    {user.first_name} {user.last_name}
                                                </div>
                                                <div
                                                    className={`mt-1 text-xs ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                                >
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td
                                                className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                <span>{roleLabel(user.role)}</span>
                                            </td>
                                            <td
                                                className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                {user.candidate_profile?.current_job_title || "N/A"}
                                            </td>
                                            <td
                                                className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                {user.candidate_profile?.years_of_experience ||
                                                    "N/A"}
                                            </td>
                                            <td
                                                className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                {user.candidate_profile?.industry_interest || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClasses(
                                                        user.is_active ? "active" : "suspended",
                                                    )}`}
                                                >
                                                    {user.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td
                                                className={`whitespace-nowrap px-6 py-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <Link
                                                    href={`/users/${user.id}`}
                                                    className={`inline-flex h-8 items-center justify-center rounded-lg border px-4 text-xs font-medium transition-colors ${
                                                        isDark
                                                            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                                            : "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    className={`flex items-center justify-between px-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                >
                    <p className="text-sm">
                        Showing {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                        {Math.min(currentPage * pageSize, total)} of {total} results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:pointer-events-none disabled:opacity-50 ${
                                isDark
                                    ? "border-white/10 text-white hover:bg-white/5"
                                    : "border-gray-200 text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            disabled={currentPage * pageSize >= total}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:pointer-events-none disabled:opacity-50 ${
                                isDark
                                    ? "border-white/10 text-white hover:bg-white/5"
                                    : "border-gray-200 text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
