"use client";

import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { applicantDisplayName } from "@/applicant/user-me/schemas/user-me.schema";
import { AwtarLogo } from "../../_components/AwtarLogo";
import { OrganizationSwitcher } from "../../_components/OrganizationSwitcher";
import { useAuthUser } from "@/lib/hooks/use-auth";
import { useSignOut } from "@/lib/hooks/use-signout";

export function RecruiterTopHeader() {
    const user = useAuthUser();
    const signOut = useSignOut();
    const [activeMenu, setActiveMenu] = useState<"notifications" | "user" | null>(null);

    const displayName = user ? applicantDisplayName(user) : "Recruiter";
    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="w-60 shrink-0">
                <Link href="/recruiter/dashboard">
                    <AwtarLogo />
                </Link>
            </div>

            <div className="flex-1 max-w-xl px-8 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Talent"
                        className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-500 transition-shadow"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <OrganizationSwitcher />

                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setActiveMenu((prev) => (prev === "notifications" ? null : "notifications"))
                        }
                        className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    {activeMenu === "notifications" && (
                        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-lg z-50">
                            <p className="text-sm font-bold text-gray-900">Notifications</p>
                            <p className="mt-2 text-xs text-gray-500">
                                Notifications UI will be connected here.
                            </p>
                        </div>
                    )}
                </div>

                <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setActiveMenu((prev) => (prev === "user" ? null : "user"))}
                        className="w-8 h-8 rounded-full border border-gray-200 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100"
                    >
                        {initials || "R"}
                    </button>

                    {activeMenu === "user" && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg z-50">
                            <div className="px-3 py-2 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-900">{displayName}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email ?? ""}</p>
                            </div>
                            <div className="py-1">
                                <Link
                                    href="/recruiter/profile"
                                    onClick={() => setActiveMenu(null)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    <User className="w-4 h-4" />
                                    View Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={() =>
                                        void signOut({
                                            redirectTo: "/recruiter/login",
                                        })
                                    }
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
