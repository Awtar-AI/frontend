"use client";

import { Building2, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useAuthOrganizationId, useAuthRole, useKnownOrganizations } from "@/lib/hooks/use-auth";
import { toastService } from "@/lib/services/toast.service";
import { useAuthStore } from "@/lib/store/auth";
import { useRecruiterOrganization } from "../(main)/organization/hooks/use-recruiter-organization";
import {
    getSwitchOrganizationErrorMessage,
    useSwitchOrganization,
} from "../(main)/organization/hooks/use-switch-organization";
import { toKnownOrganization } from "../(main)/organization/schemas/organization.schema";

/**
 * Multi-org HR: `PATCH /organizations/:id/switch` then refresh so JWT `organization_id` matches
 * (see HR-FRONTEND-API.md). There is no "list my orgs" endpoint in the doc, so we persist orgs
 * the user has loaded/switched into and allow switching by UUID.
 */
export function OrganizationSwitcher() {
    const role = useAuthRole();
    const organizationId = useAuthOrganizationId();
    const known = useKnownOrganizations();
    const orgQuery = useRecruiterOrganization(organizationId);
    const switchMutation = useSwitchOrganization();
    const [open, setOpen] = useState(false);
    const [manualId, setManualId] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const manualInputId = useId();

    useEffect(() => {
        if (orgQuery.data) {
            useAuthStore.getState().addKnownOrganization(toKnownOrganization(orgQuery.data));
        }
    }, [orgQuery.data]);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    if (role !== "hr") return null;

    const currentLabel =
        orgQuery.data?.organization_name ??
        known.find((o) => o.id === organizationId)?.organization_name ??
        (organizationId ? `Organization ${organizationId.slice(0, 8)}…` : "No active organization");

    const busy = switchMutation.isPending || orgQuery.isLoading;

    const handleSwitch = (id: string) => {
        if (!id || id === organizationId) {
            setOpen(false);
            return;
        }
        switchMutation.mutate(id, {
            onSuccess: () => {
                toastService.success("Active organization updated.");
                setOpen(false);
                setManualId("");
            },
            onError: (e) => {
                toastService.error(getSwitchOrganizationErrorMessage(e));
            },
        });
    };

    return (
        <div className="relative shrink-0" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                disabled={busy}
                className="flex max-w-[min(280px,32vw)] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:opacity-60"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <Building2 className="h-4 w-4 shrink-0 text-blue-600" />
                <span className="min-w-0 flex-1 truncate">{currentLabel}</span>
                {busy ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <p className="px-3 pb-2 text-[11px] leading-5 text-gray-500">
                        Switching updates the server, then refreshes your session so job and tenant
                        APIs use the correct organization.
                    </p>
                    <div className="max-h-48 overflow-y-auto border-t border-gray-100">
                        {known.length === 0 && (
                            <p className="px-3 py-3 text-xs text-gray-500">
                                No saved organizations yet. Use &quot;Switch by ID&quot; below, or
                                open Company — we save orgs you load.
                            </p>
                        )}
                        {known.map((org) => (
                            <button
                                key={org.id}
                                type="button"
                                onClick={() => handleSwitch(org.id)}
                                disabled={switchMutation.isPending || org.id === organizationId}
                                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="font-semibold text-gray-900">
                                    {org.organization_name}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                    {org.status && `${org.status} · `}
                                    {org.id}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 px-3 py-3">
                        <label
                            htmlFor={manualInputId}
                            className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-500"
                        >
                            Switch by organization ID
                        </label>
                        <div className="flex gap-2">
                            <input
                                id={manualInputId}
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                placeholder="UUID"
                                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleSwitch(manualId.trim())}
                                disabled={switchMutation.isPending || !manualId.trim()}
                                className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Switch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
