"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { 
    LayoutDashboard, 
    Building2, 
    Users, 
    Settings, 
    LogOut, 
    ShieldCheck
} from "lucide-react";

const ADMIN_NAV = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Organizations", href: "/organizations", icon: Building2 },
    { label: "Users", href: "/users", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function AdminShell({ children, title = "Admin Console" }: { children: ReactNode; title?: string }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar matches recruiter sidebar */}
            <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-6 shrink-0 z-20">
                <Link href="/dashboard" className="mb-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-tight tracking-tight text-blue-600">Awtar AI</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Admin</span>
                    </div>
                </Link>

                <nav className="flex flex-1 flex-col gap-2">
                    {ADMIN_NAV.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                                    isActive 
                                    ? "bg-blue-50 text-blue-600" 
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t border-gray-100 pt-6">
                    <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-red-50 hover:text-red-600">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                    
                    <div className="mt-4 flex items-center gap-3 px-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900">Super Admin</span>
                            <span className="text-[10px] text-gray-500">System Access</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden p-8 lg:px-12 lg:py-10">
                <div className="mx-auto max-w-7xl">
                    <header className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                    </header>
                    {children}
                </div>
            </main>
        </div>
    );
}
