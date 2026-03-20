"use client";

import { Bookmark, Briefcase, Building2, Home, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
    { label: "Dashboard", href: "/applicant/dashboard", icon: Home },
    { label: "Find Jobs", href: "/applicant/jobs", icon: Search },
    { label: "My Applications", href: "/applicant/applications", icon: Briefcase },
    { label: "Profile", href: "/applicant/profile/public", icon: User },
    { label: "Saved Jobs", href: "/applicant/saved", icon: Bookmark },
    { label: "Companies", href: "/applicant/companies", icon: Building2 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full shrink-0">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                <Link href="/applicant/dashboard" className="flex items-center gap-2">
                    {/* Mock Logo Icon */}
                    <div className="flex items-center gap-1.5 text-blue-600">
                        <div className="w-5 h-5 rounded-full border-[3px] border-current flex items-center justify-center relative">
                            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-current rounded-full" />
                            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-current rounded-full" />
                        </div>
                    </div>
                    <span className="text-xl font-bold text-blue-700 tracking-tight">Awtar AI</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname?.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-400"}`}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Pro Plan Card */}
            <div className="p-4 shrink-0">
                <div className="bg-[#1a5eb8] rounded-xl p-4 text-white shadow-sm">
                    <p className="text-[10px] font-bold text-blue-200 mb-1 uppercase tracking-wider">
                        PRO PLAN
                    </p>
                    <p className="text-sm font-semibold mb-3 leading-tight">
                        Unlock AI-powered application tailoring
                    </p>
                    <button
                        type="button"
                        className="w-full py-2 bg-white text-[#1a5eb8] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
}
