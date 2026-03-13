import Link from "next/link";

const STATS = [
    { value: "10k+", label: "Active jobs" },
    { value: "500+", label: "Enterprises" },
    { value: "95%", label: "Match accuracy" },
    { value: "3x", label: "Faster hiring" },
] as const;

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-awtar-blue/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-awtar-cyan/5 blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="max-w-3xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-awtar-blue/30 bg-awtar-blue/10 px-4 py-1.5 text-sm text-awtar-blue-light">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-awtar-cyan animate-[pulse-glow_2s_infinite]" />
                        AI-powered recruiting
                    </div>

                    <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
                        Connect with the{" "}
                        <span className="bg-gradient-to-r from-awtar-blue via-awtar-blue-light to-awtar-cyan bg-clip-text text-transparent">
                            future of talent.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-awtar-slate sm:text-xl">
                        Our AI-driven platform bridges the gap between top-tier recruiters and
                        high-potential candidates through intelligent matching — without rigid
                        processes, but with individual precision.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/recruiter/dashboard"
                            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-awtar-blue px-8 py-4 text-base font-semibold text-white transition-all hover:bg-awtar-blue-light hover:shadow-lg hover:shadow-awtar-blue/25"
                        >
                            I&apos;m a Recruiter
                            <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/applicant/dashboard"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
                        >
                            I&apos;m looking for a Job
                            <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
                    {STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm"
                        >
                            <p className="text-3xl font-bold text-white sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-awtar-slate">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
