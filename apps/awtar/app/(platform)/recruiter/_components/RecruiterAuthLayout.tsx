import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    reversed?: boolean;
}

function BrandingPanel() {
    return (
        <div className="hidden lg:flex flex-1 bg-[#0a1628] flex-col justify-between overflow-hidden relative">
            {/* Glow effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 right-0 w-64 h-64 bg-blue-800/10 rounded-full blur-[80px]" />
            </div>

            {/* Logo */}
            <div className="relative z-10 p-12">
                <Link href="/" className="inline-flex items-center gap-2.5">
                    {/* Star-like icon matching the Figma */}
                    <svg
                        width="24"
                        height="24"
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
                    <span className="text-lg font-bold text-white tracking-tight">Awtar AI</span>
                </Link>
            </div>

            {/* Hero content */}
            <div className="relative z-10 flex-1 flex items-start px-12 pt-14 lg:px-16 lg:pt-20">
                <div className="max-w-sm">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                        Connect with the future of talent.
                    </h2>
                    <p className="text-white/50 text-sm font-light leading-relaxed mb-10">
                        Our AI-driven platform bridges the gap between top-tier recruiters and
                        high-potential candidates through intelligent matching.
                    </p>
                    <div className="flex gap-10">
                        <div>
                            <p className="text-2xl font-bold text-white">10k+</p>
                            <p className="text-xs text-white/40 font-medium mt-0.5">Active Jobs</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">500+</p>
                            <p className="text-xs text-white/40 font-medium mt-0.5">Enterprises</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 p-12 text-[11px] text-white/20 font-medium"> </div>
        </div>
    );
}

export function RecruiterAuthLayout({ children, reversed = false }: Props) {
    const formPanel = (
        <div className="flex-1 flex flex-col bg-white text-gray-900">
            <main className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-14 w-full mx-auto">
                {children}
            </main>
        </div>
    );

    return (
        <div className="flex min-h-screen font-sans">
            {reversed ? (
                <>
                    <BrandingPanel />
                    {formPanel}
                </>
            ) : (
                <>
                    {formPanel}
                    <BrandingPanel />
                </>
            )}
        </div>
    );
}
