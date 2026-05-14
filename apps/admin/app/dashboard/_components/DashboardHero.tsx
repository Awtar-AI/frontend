"use client";

import { Briefcase, Calendar } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "@/lib/hooks/use-theme";

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 z-0 ${
        isDark ? "bg-linear-to-r from-blue-950 to-blue-900" : "bg-[#475ca3]"
      }`}
    >
      <div className="absolute inset-0 z-[-1] mix-blend-overlay">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt="Office Background"
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div
        className={`absolute inset-0 z-[-1] ${
          isDark
            ? "bg-linear-to-r from-blue-950/95 to-blue-900/85"
            : "bg-linear-to-r from-blue-900/90 to-blue-800/40"
        }`}
      ></div>

      <div className="z-10 w-full md:w-auto">
        <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
          {greetingForNow()}!
        </h1>
        <p
          className={`font-bold mb-8 text-sm lg:text-base drop-shadow ${isDark ? "text-blue-100" : "text-blue-50"}`}
        >
          Admin dashboard overview for managing users, organizations, and
          platform operations.
        </p>

        <div
          className={`flex flex-wrap items-center gap-6 text-sm font-bold drop-shadow ${isDark ? "text-blue-100" : "text-white"}`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
        </div>
      </div>

      <div
        className={`relative hidden md:flex items-center justify-center w-32 h-32 rounded-full border-[6px] shrink-0 z-10 ${
          isDark
            ? "border-white/30 bg-blue-800/40"
            : "border-white/30 bg-blue-800/40"
        }`}
      >
        <div className="text-6xl font-black text-white/60">📊</div>
      </div>
    </div>
  );
}
