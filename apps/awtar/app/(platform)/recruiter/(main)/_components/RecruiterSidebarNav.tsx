"use client";

import { Compass, FilePlus, FileText, Home, MessageSquare, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RecruiterSidebarNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "Dashboard", href: "/recruiter/dashboard", icon: Home },
        { name: "Post a Job", href: "/recruiter/post-job", icon: FilePlus },
        { name: "Job Listings", href: "/recruiter/job-listings", icon: FileText },
        { name: "Explore Talent", href: "/recruiter/talent", icon: Compass },
        { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
        { name: "Profile", href: "/recruiter/profile", icon: User },
        { name: "Team Members", href: "/recruiter/team", icon: Users },
    ];

    return (
        <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                            isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                        {tab.name}
                    </Link>
                );
            })}
        </nav>
    );
}
