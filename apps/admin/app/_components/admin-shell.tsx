import Link from "next/link";
import type { ReactNode } from "react";

const ADMIN_NAV = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users", href: "/users" },
    { label: "Settings", href: "/settings" },
] as const;

export function AdminShell({ children, title = "Admin" }: { children: ReactNode; title?: string }) {
    return (
        <div className="flex min-h-screen bg-awtar-navy text-awtar-white">
            <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-awtar-navy-light p-6 lg:block">
                <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-lg font-bold">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-black text-white">
                        A
                    </span>
                    {title}
                </Link>

                <nav className="flex flex-col gap-1">
                    {ADMIN_NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-3 py-2 text-sm text-awtar-slate transition-colors hover:bg-white/5 hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
    );
}
