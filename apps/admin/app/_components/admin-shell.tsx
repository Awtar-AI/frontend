"use client";

import { Building, LayoutDashboard, Moon, Settings, Sun, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/hooks/use-theme";

const ADMIN_NAV = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Organizations", href: "/organizations", icon: Building },
    { label: "Users", href: "/users", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
] as const;

export function AdminShell({ children, title = "Admin" }: { children: ReactNode; title?: string }) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <div
            className={`flex min-h-screen ${
                isDark ? "bg-awtar-navy text-awtar-white" : "bg-gray-50 text-gray-900"
            }`}
        >
            <aside
                className={`hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:flex w-64 flex-col p-6 shadow-lg ${
                    isDark
                        ? "border-r border-white/10 bg-linear-to-b from-awtar-navy-light to-awtar-navy"
                        : "border-r border-gray-200 bg-white"
                }`}
            >
                <Link
                    href="/dashboard"
                    className={`mb-8 flex items-center gap-3 text-xl font-bold transition-colors hover:text-awtar-cyan ${
                        isDark ? "text-awtar-white" : "text-gray-900"
                    }`}
                >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-red-700 text-white shadow-md">
                        A
                    </div>
                    {title}
                </Link>

                <nav className="flex flex-col gap-2">
                    {ADMIN_NAV.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-awtar-blue text-white shadow-md border-l-4 border-awtar-cyan"
                                        : isDark
                                          ? "text-awtar-slate hover:bg-white/10 hover:text-white hover:shadow-sm"
                                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div
                    className={`mt-auto border-t pt-4 ${
                        isDark ? "border-white/10" : "border-gray-200"
                    }`}
                >
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                            isDark
                                ? "bg-white/10 text-awtar-white hover:bg-white/20"
                                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                    >
                        {isDark ? (
                            <>
                                <Sun className="h-4 w-4" />
                                Light
                            </>
                        ) : (
                            <>
                                <Moon className="h-4 w-4" />
                                Dark
                            </>
                        )}
                    </button>
                </div>
            </aside>

            <main
                className={`flex-1 p-6 lg:p-10 lg:ml-64 transition-colors ${
                    isDark ? "bg-slate-950 text-awtar-white" : "bg-gray-50 text-gray-900"
                }`}
            >
                {children}
            </main>
        </div>
    );
}
