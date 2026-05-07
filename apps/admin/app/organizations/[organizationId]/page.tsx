"use client";

import { AlertTriangle, ArrowLeft, ExternalLink, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../../_components/admin-shell";
import {
    getDeleteOrganizationErrorMessage,
    useDeleteOrganization,
} from "../hooks/use-delete-organization";
import { useOrganizationDetail } from "../hooks/use-organization-detail";
import {
    getOrganizationStatusErrorMessage,
    useUpdateOrganizationStatus,
} from "../hooks/use-update-organization-status";
import {
    getAllowedStatusTransitions,
    type OrganizationStatus,
} from "../schemas/organizations.schema";

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

export default function OrganizationDetailPage({
    params,
}: {
    params: Promise<{ organizationId: string }>;
}) {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [isDeleteArmed, setIsDeleteArmed] = useState(false);
    const { organizationId } = use(params);

    const detailQuery = useOrganizationDetail(organizationId);
    const updateStatusMutation = useUpdateOrganizationStatus(organizationId);
    const deleteMutation = useDeleteOrganization(organizationId);

    const allowedTransitions = detailQuery.data
        ? getAllowedStatusTransitions(detailQuery.data.status)
        : [];

    const handleDelete = async () => {
        await deleteMutation.mutateAsync();
        router.push("/organizations");
    };

    return (
        <AdminShell title="Admin Panel">
            <div className="space-y-6">
                <div>
                    <Link
                        href="/organizations"
                        className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                            isDark
                                ? "text-red-300 hover:text-white"
                                : "text-red-600 hover:text-red-700"
                        }`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to organizations
                    </Link>
                </div>

                {detailQuery.isLoading ? (
                    <div
                        className={`flex items-center gap-2 rounded-2xl border px-6 py-20 ${
                            isDark
                                ? "border-white/10 bg-white/3 text-awtar-slate"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                    >
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading organization details...
                    </div>
                ) : detailQuery.isError || !detailQuery.data ? (
                    <div
                        className={`rounded-2xl border px-6 py-12 text-center ${
                            isDark
                                ? "border-red-500/20 bg-red-500/6 text-red-300"
                                : "border-red-200 bg-red-50 text-red-700"
                        }`}
                    >
                        Failed to load organization details.
                    </div>
                ) : (
                    <>
                        <div
                            className={`rounded-2xl border p-6 shadow-2xl transition-colors ${
                                isDark
                                    ? "border-white/10 bg-white/3 shadow-black/10"
                                    : "border-gray-200 bg-white shadow-gray-200/50"
                            }`}
                        >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div
                                        className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                            isDark
                                                ? "border-white/10 text-awtar-slate"
                                                : "border-gray-200 text-gray-600"
                                        }`}
                                    >
                                        Organization moderation
                                    </div>
                                    <h1
                                        className={`text-3xl font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                    >
                                        {detailQuery.data.organization_name}
                                    </h1>
                                    <p
                                        className={`mt-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Review registration data, inspect uploaded verification
                                        documents, and manage lifecycle state.
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold capitalize ${statusClasses(
                                        detailQuery.data.status,
                                    )}`}
                                >
                                    {detailQuery.data.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-6">
                                <section
                                    className={`rounded-2xl border p-6 transition-colors ${
                                        isDark
                                            ? "border-white/10 bg-white/3"
                                            : "border-gray-200 bg-white"
                                    }`}
                                >
                                    <h2
                                        className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                    >
                                        Organization details
                                    </h2>
                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        <div>
                                            <p
                                                className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                Industry
                                            </p>
                                            <p
                                                className={`mt-1 ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                            >
                                                {detailQuery.data.industry}
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                Organization size
                                            </p>
                                            <p
                                                className={`mt-1 ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                            >
                                                {detailQuery.data.organization_size} employees
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                Phone
                                            </p>
                                            <p
                                                className={`mt-1 ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                            >
                                                {detailQuery.data.phone || "Not provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-awtar-slate">Created</p>
                                            <p className="mt-1 text-white">
                                                {formatDate(detailQuery.data.created_at)}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-awtar-slate">Website</p>
                                            <a
                                                href={detailQuery.data.website_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 inline-flex items-center gap-2 text-red-300 hover:text-white"
                                            >
                                                {detailQuery.data.website_url}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-awtar-slate">LinkedIn</p>
                                            {detailQuery.data.linkedin_url ? (
                                                <a
                                                    href={detailQuery.data.linkedin_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 inline-flex items-center gap-2 text-red-300 hover:text-white"
                                                >
                                                    {detailQuery.data.linkedin_url}
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-white">Not provided</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <section
                                    className={`rounded-2xl border p-6 transition-colors ${
                                        isDark
                                            ? "border-white/10 bg-white/3"
                                            : "border-gray-200 bg-white"
                                    }`}
                                >
                                    <h2
                                        className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                    >
                                        Founder information
                                    </h2>
                                    {detailQuery.data.creator ? (
                                        <div className="mt-5 space-y-3 text-sm">
                                            <p
                                                className={
                                                    isDark ? "text-awtar-slate" : "text-gray-600"
                                                }
                                            >
                                                Name:{" "}
                                                <span
                                                    className={
                                                        isDark
                                                            ? "text-awtar-white"
                                                            : "text-gray-900"
                                                    }
                                                >
                                                    {detailQuery.data.creator.first_name}{" "}
                                                    {detailQuery.data.creator.last_name}
                                                </span>
                                            </p>
                                            <p
                                                className={
                                                    isDark ? "text-awtar-slate" : "text-gray-600"
                                                }
                                            >
                                                Email:{" "}
                                                <span
                                                    className={
                                                        isDark
                                                            ? "text-awtar-white"
                                                            : "text-gray-900"
                                                    }
                                                >
                                                    {detailQuery.data.creator.email}
                                                </span>
                                            </p>
                                            <p
                                                className={
                                                    isDark ? "text-awtar-slate" : "text-gray-600"
                                                }
                                            >
                                                User ID:{" "}
                                                <span
                                                    className={`font-mono ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                                >
                                                    {detailQuery.data.creator.user_id}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p
                                            className={`mt-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Creator information was not included in the response.
                                        </p>
                                    )}
                                </section>

                                <section
                                    className={`rounded-2xl border p-6 transition-colors ${
                                        isDark
                                            ? "border-white/10 bg-white/3"
                                            : "border-gray-200 bg-white"
                                    }`}
                                >
                                    <h2
                                        className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                    >
                                        Verification documents
                                    </h2>
                                    {detailQuery.data.document_url?.length ? (
                                        <div className="mt-5 space-y-3">
                                            {detailQuery.data.document_url.map((documentUrl) => (
                                                <a
                                                    key={documentUrl}
                                                    href={documentUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                                                        isDark
                                                            ? "border-white/10 bg-awtar-navy-light/60 text-blue-300 hover:border-blue-500/20 hover:text-white"
                                                            : "border-gray-200 bg-gray-50 text-blue-600 hover:border-blue-200 hover:text-blue-700"
                                                    }`}
                                                >
                                                    <span>{documentUrl}</span>
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p
                                            className={
                                                isDark
                                                    ? "mt-4 text-awtar-slate"
                                                    : "mt-4 text-gray-600"
                                            }
                                        >
                                            No document URLs were attached to this organization.
                                        </p>
                                    )}
                                </section>
                            </div>

                            <div className="space-y-6">
                                <section
                                    className={`rounded-2xl border p-6 transition-colors ${
                                        isDark
                                            ? "border-white/10 bg-white/3"
                                            : "border-gray-200 bg-white"
                                    }`}
                                >
                                    <h2
                                        className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                    >
                                        Status actions
                                    </h2>
                                    <p
                                        className={`mt-2 text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Server-side rules only allow specific status transitions
                                        from the current state.
                                    </p>
                                    <div className="mt-5 flex flex-col gap-3">
                                        {allowedTransitions.length > 0 ? (
                                            allowedTransitions.map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    disabled={updateStatusMutation.isPending}
                                                    onClick={() =>
                                                        updateStatusMutation.mutate({ status })
                                                    }
                                                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
                                                >
                                                    {updateStatusMutation.isPending
                                                        ? "Updating..."
                                                        : `Change status to ${status}`}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-awtar-slate">
                                                No further status transitions are available from the
                                                current state.
                                            </p>
                                        )}
                                        {updateStatusMutation.error && (
                                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                                {getOrganizationStatusErrorMessage(
                                                    updateStatusMutation.error,
                                                )}
                                            </div>
                                        )}
                                        {updateStatusMutation.data?.message && (
                                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                                {updateStatusMutation.data.message}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section
                                    className={`rounded-2xl border p-6 transition-colors ${
                                        isDark
                                            ? "border-red-500/20 bg-red-500/6"
                                            : "border-red-200 bg-red-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle
                                            className={`mt-0.5 h-5 w-5 ${isDark ? "text-red-300" : "text-red-600"}`}
                                        />
                                        <div>
                                            <h2
                                                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                            >
                                                Danger zone
                                            </h2>
                                            <p
                                                className={`mt-2 text-sm ${isDark ? "text-red-200/80" : "text-red-700"}`}
                                            >
                                                Deleting an organization soft-deletes it and removes
                                                associated business documents from object storage.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-5 space-y-3">
                                        <label
                                            className={`flex items-center gap-3 text-sm ${isDark ? "text-red-200" : "text-red-700"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isDeleteArmed}
                                                onChange={(event) =>
                                                    setIsDeleteArmed(event.target.checked)
                                                }
                                                className={`h-4 w-4 rounded border ${isDark ? "border-white/20 bg-transparent" : "border-red-200 bg-white"}`}
                                            />
                                            I understand this action is destructive.
                                        </label>
                                        <button
                                            type="button"
                                            disabled={!isDeleteArmed || deleteMutation.isPending}
                                            onClick={handleDelete}
                                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {deleteMutation.isPending
                                                ? "Deleting..."
                                                : "Delete organization"}
                                        </button>
                                        {deleteMutation.error && (
                                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                                {getDeleteOrganizationErrorMessage(
                                                    deleteMutation.error,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminShell>
    );
}
