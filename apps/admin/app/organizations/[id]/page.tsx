"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/admin-shell";
import { getOrganizationById, updateOrganizationStatus } from "../../../lib/api";
import { OrganizationDetail, OrgStatus } from "../../../lib/types";
import { ArrowLeft, CheckCircle2, ShieldBan, Loader2, Building, ExternalLink, Download } from "lucide-react";
import { StatusBadge } from "../../_components/status-badge";
import { ConfirmModal } from "../../_components/confirm-modal";

export default function OrganizationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const resolvedParams = use(params);
    
    const [org, setOrg] = useState<OrganizationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);

    useEffect(() => {
        getOrganizationById(resolvedParams.id).then(data => {
            setOrg(data);
            setIsLoading(false);
        });
    }, [resolvedParams.id]);

    const handleStatusChange = async (newStatus: OrgStatus) => {
        if (!org) return;
        setIsActionLoading(true);
        try {
            await updateOrganizationStatus(org.id, newStatus);
            setOrg({ ...org, status: newStatus });
            router.refresh();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <AdminShell title="Organization Details">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </AdminShell>
        );
    }

    if (!org) return null;

    return (
        <AdminShell title="Organization Details">
            
            <Link href="/organizations" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Organizations
            </Link>

            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-2xl font-black text-gray-900">{org.organizationName}</h2>
                        <StatusBadge status={org.status} />
                    </div>
                    <p className="text-gray-600 font-medium">
                        Registered {new Date(org.createdAt).toLocaleDateString()} • {org.organizationSize} employees
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {org.status !== "active" && (
                        <button 
                            onClick={() => setIsApproveOpen(true)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve Organization
                        </button>
                    )}
                    {org.status !== "suspended" && (
                        <button 
                            onClick={() => setIsSuspendOpen(true)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                            <ShieldBan className="h-4 w-4" />
                            Suspend
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Building className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Company Profile</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-medium text-sm">Industry</span>
                            <span className="col-span-2 text-gray-900 font-bold">{org.industry || "Not provided"}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-medium text-sm">Website</span>
                            <a href={org.websiteUrl} target="_blank" rel="noreferrer" className="col-span-2 text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                                {org.websiteUrl} <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        {org.linkedInUrl && (
                            <div className="grid grid-cols-3">
                                <span className="text-gray-500 font-medium text-sm">LinkedIn</span>
                                <a href={org.linkedInUrl} target="_blank" rel="noreferrer" className="col-span-2 text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                                    Profile Link <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-medium text-sm">Org ID</span>
                            <span className="col-span-2 text-gray-500 font-mono text-xs font-semibold">{org.id}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <div className="h-8 w-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center" />
                        <h3 className="text-lg font-bold text-gray-900">Creator Details</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-medium text-sm">Name</span>
                            <span className="col-span-2 text-gray-900 font-bold">{org.creator.firstName} {org.creator.lastName}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-medium text-sm">Email</span>
                            <span className="col-span-2 text-gray-900 font-bold">{org.creator.email}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-medium text-sm">Phone</span>
                            <span className="col-span-2 text-gray-900 font-bold">{org.creator.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Verification Documents</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Review the submitted business and tax documents</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {org.businessDocuments.map((doc, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100/50 hover:border-blue-200 transition-colors group">
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <Download className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-bold text-gray-900 truncate max-w-full" title={doc.originalName}>
                                    {doc.originalName}
                                </span>
                                <a 
                                    href={doc.documentUrl} 
                                    className="mt-3 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Download File
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <ConfirmModal 
                isOpen={isApproveOpen}
                onClose={() => setIsApproveOpen(false)}
                onConfirm={() => handleStatusChange("active")}
                title="Approve Organization"
                description={`Are you sure you want to approve ${org.organizationName}? They will receive an email letting them know they can access the platform.`}
                confirmText="Yes, Approve"
            />

            <ConfirmModal 
                isOpen={isSuspendOpen}
                onClose={() => setIsSuspendOpen(false)}
                onConfirm={() => handleStatusChange("suspended")}
                title="Suspend Organization"
                description={`Are you sure you want to suspend ${org.organizationName}? Their employees will instantly lose access to the platform.`}
                confirmText="Suspend Organization"
                isDestructive={true}
            />

        </AdminShell>
    );
}
