"use client";

import { Building2 } from "lucide-react";
import { useMemo } from "react";
import { useAuthOrganizationId, useAuthRole, useKnownOrganizations } from "@/lib/hooks/use-auth";
import { useRecruiterOrganization } from "../(main)/organization/hooks/use-recruiter-organization";

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
    const currentLabel = useMemo(
        () =>
            orgQuery.data?.organization_name ??
            known.find((o) => o.id === organizationId)?.organization_name ??
            (organizationId
                ? `Organization ${organizationId.slice(0, 8)}...`
                : "No active organization"),
        [orgQuery.data?.organization_name, known, organizationId],
    );

    if (role !== "hr") return null;

    return (
        <div className="flex max-w-[min(280px,32vw)] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <Building2 className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="min-w-0 truncate text-sm font-semibold text-gray-800">
                {orgQuery.isLoading ? "Loading organization..." : currentLabel}
            </span>
        </div>
    );
}
