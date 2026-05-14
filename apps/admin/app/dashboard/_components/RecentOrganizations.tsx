"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/hooks/use-theme";
import { useOrganizations } from "../../organizations/hooks/use-organizations";

export function RecentOrganizations() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const organizationsQuery = useOrganizations({ page: 1, page_size: 6 });
  const organizations = organizationsQuery.data?.organizations ?? [];

  const statusTextClass = (status: "pending" | "active" | "suspended") => {
    switch (status) {
      case "active":
        return isDark ? "text-green-300" : "text-green-600";
      case "suspended":
        return isDark ? "text-red-300" : "text-red-600";
      default:
        return isDark ? "text-amber-300" : "text-amber-600";
    }
  };

  return (
    <div
      className={`rounded-3xl p-8 border shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] ${
        isDark
          ? "bg-white/5 border-white/10 shadow-black/10"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3
            className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Recent organizations
          </h3>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Quick access to the latest moderation queue.
          </p>
        </div>
        <Link
          href="/organizations"
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors ${
            isDark
              ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {organizationsQuery.isLoading ? (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Loading organization activity...
          </p>
        ) : organizations.length > 0 ? (
          organizations.map((organization) => (
            <Link
              key={organization.id}
              href={`/organizations/${organization.id}`}
              className={`block p-6 border rounded-3xl transition-all hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "border-white/10 bg-white/3 hover:bg-white/5"
                  : "border-gray-200 bg-gray-50 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4
                    className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {organization.organization_name}
                  </h4>
                  <div
                    className={`flex items-center gap-2 text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <span className="font-bold">{organization.industry}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className="font-bold">
                      {organization.organization_size} employees
                    </span>
                  </div>
                </div>
                <span
                  className={`text-sm font-black capitalize px-4 py-1.5 rounded-lg ${
                    organization.status === "active"
                      ? isDark
                        ? "bg-green-500/10 text-green-300"
                        : "bg-green-100 text-green-700"
                      : organization.status === "suspended"
                        ? isDark
                          ? "bg-red-500/10 text-red-300"
                          : "bg-red-100 text-red-700"
                        : isDark
                          ? "bg-amber-500/10 text-amber-300"
                          : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {organization.status}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            No organizations available yet.
          </p>
        )}
      </div>
    </div>
  );
}
