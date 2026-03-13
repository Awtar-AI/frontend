import Link from "next/link";
import type { ReactNode } from "react";

const RECRUITER_NAV = [
    { label: "Dashboard", href: "/recruiter/dashboard" },
    { label: "Jobs", href: "/recruiter/jobs" },
    { label: "Candidates", href: "/recruiter/candidates" },
    { label: "Messages", href: "/recruiter/messages" },
] as const;

export default function RecruiterLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-awtar-navy text-awtar-white">
            <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-awtar-navy-light p-6 lg:block">
                <Link
                    href="/recruiter/dashboard"
                    className="mb-8 flex items-center gap-2 text-lg font-bold"
                >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-awtar-blue text-sm font-black text-white">
                        A
                    </span>
                    Recruiter
                </Link>

                <nav className="flex flex-col gap-1">
                    {RECRUITER_NAV.map((item) => (
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
