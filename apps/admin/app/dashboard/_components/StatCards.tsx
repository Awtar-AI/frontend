"use client";

import {
  Building2,
  Clock3,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "@/lib/hooks/use-theme";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

function DiffBadge({ diff, label }: { diff: number; label: string }) {
  if (diff === 0)
    return (
      <span className="text-[10px] font-bold text-gray-400">No change</span>
    );
  const up = diff > 0;
  const absoluteDiff = Math.abs(diff);
  const changeLabel = absoluteDiff === 1 ? label : `${label}s`;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold ${up ? "text-green-600" : "text-red-500"}`}
    >
      {up ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {up ? "+" : ""}
      {diff} {changeLabel}
    </span>
  );
}

export function StatCards() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data, isLoading } = useDashboardStats();

  const cards = [
    {
      label: "Active organizations",
      value: data?.active_organizations ?? 0,
      diff: data?.active_organizations_diff ?? 0,
      icon: Building2,
      color: "text-blue-500",
      bg: isDark
        ? "bg-blue-500/10 border-blue-500/20"
        : "bg-blue-50 border-blue-100",
      changeLabel: "organization",
    },
    {
      label: "Pending review",
      value: data?.pending_organizations ?? 0,
      diff: data?.pending_organizations_diff ?? 0,
      icon: Clock3,
      color: "text-amber-500",
      bg: isDark
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-amber-50 border-amber-100",
      changeLabel: "pending review",
    },
    {
      label: "Active users",
      value: data?.active_users ?? 0,
      diff: data?.active_users_diff ?? 0,
      icon: Users,
      color: "text-purple-500",
      bg: isDark
        ? "bg-purple-500/10 border-purple-500/20"
        : "bg-purple-50 border-purple-100",
      changeLabel: "active user",
    },
    {
      label: "Total staff",
      value: data?.total_staff ?? 0,
      diff: data?.total_staff_diff ?? 0,
      icon: ShieldCheck,
      color: "text-green-500",
      bg: isDark
        ? "bg-green-500/10 border-green-500/20"
        : "bg-green-50 border-green-100",
      changeLabel: "staff member",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`rounded-3xl p-6 border shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between transition-transform hover:-translate-y-1 ${
              isDark
                ? "bg-white/5 border-white/10 shadow-black/10"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${stat.bg} ${stat.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p
              className={`font-bold text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {stat.label}
            </p>
            <h3
              className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {isLoading ? (
                <span className="inline-block w-10 h-8 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                stat.value.toLocaleString()
              )}
            </h3>
            {isLoading ? (
              <span className="inline-block w-16 h-3 bg-gray-100 rounded animate-pulse" />
            ) : (
              <DiffBadge diff={stat.diff} label={stat.changeLabel} />
            )}
          </div>
        );
      })}
    </div>
  );
}
