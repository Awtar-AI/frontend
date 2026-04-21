import { OrgStatus } from "../../lib/types";

export function StatusBadge({ status }: { status: OrgStatus | string }) {
    let bg = "bg-gray-100";
    let text = "text-gray-700";

    if (status === "pending") {
        bg = "bg-amber-100";
        text = "text-amber-800";
    } else if (status === "active") {
        bg = "bg-emerald-100";
        text = "text-emerald-800";
    } else if (status === "suspended" || status === "rejected") {
        bg = "bg-red-100";
        text = "text-red-800";
    }

    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${bg} ${text}`}
        >
            {status}
        </span>
    );
}
