"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "About", href: "#about" },
] as const;

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-awtar-navy/80 backdrop-blur-xl">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-blue-400"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                        <circle cx="12" cy="4" r="2" fill="currentColor" opacity="0.7" />
                        <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.7" />
                        <circle cx="4" cy="12" r="2" fill="currentColor" opacity="0.7" />
                        <circle cx="20" cy="12" r="2" fill="currentColor" opacity="0.7" />
                        <circle cx="6.34" cy="6.34" r="1.5" fill="currentColor" opacity="0.4" />
                        <circle cx="17.66" cy="17.66" r="1.5" fill="currentColor" opacity="0.4" />
                        <circle cx="17.66" cy="6.34" r="1.5" fill="currentColor" opacity="0.4" />
                        <circle cx="6.34" cy="17.66" r="1.5" fill="currentColor" opacity="0.4" />
                    </svg>
                    Awtar AI
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-awtar-slate transition-colors hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/applicant/dashboard"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-awtar-slate transition-colors hover:text-white"
                    >
                        Find Jobs
                    </Link>
                    <Link
                        href="/recruiter/dashboard"
                        className="rounded-lg bg-awtar-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-awtar-blue-light"
                    >
                        For Recruiters
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-awtar-slate hover:text-white md:hidden"
                    aria-label="Toggle menu"
                >
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {mobileOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </nav>

            {mobileOpen && (
                <div className="border-t border-white/5 px-6 pb-4 md:hidden">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="block py-3 text-sm text-awtar-slate hover:text-white"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="mt-3 flex flex-col gap-2">
                        <Link
                            href="/applicant/dashboard"
                            className="rounded-lg border border-white/10 px-4 py-2 text-center text-sm font-medium text-awtar-slate hover:text-white"
                        >
                            Find Jobs
                        </Link>
                        <Link
                            href="/recruiter/dashboard"
                            className="rounded-lg bg-awtar-blue px-4 py-2 text-center text-sm font-medium text-white hover:bg-awtar-blue-light"
                        >
                            For Recruiters
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
