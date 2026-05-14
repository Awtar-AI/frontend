"use client";

import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../_components/admin-shell";
import { DashboardHero } from "./_components/DashboardHero";
import { StatCards } from "./_components/StatCards";
import { RecentOrganizations } from "./_components/RecentOrganizations";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AdminShell title="Awtar AI">
      <div className="p-8 lg:p-10 mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <DashboardHero />
        <StatCards />

        <RecentOrganizations />
      </div>
    </AdminShell>
  );
}
