const STEPS = [
    {
        number: "01",
        title: "Post or Apply",
        description:
            "Recruiters post positions with requirements. Applicants create profiles with skills and preferences.",
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
        ),
    },
    {
        number: "02",
        title: "AI Matches",
        description:
            "Our agentic AI analyzes skills, culture fit, and career trajectory to surface the strongest matches.",
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
        ),
    },
    {
        number: "03",
        title: "Connect & Hire",
        description:
            "Schedule interviews, exchange messages, and close offers — all within one seamless platform.",
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        ),
    },
] as const;

export function HowItWorks() {
    return (
        <section className="relative py-20" id="how-it-works">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
                    <p className="mt-4 text-lg text-awtar-slate">Three steps to smarter hiring.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {STEPS.map((step) => (
                        <div
                            key={step.number}
                            className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-awtar-blue/20 hover:bg-white/[0.04]"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-awtar-blue/20 bg-awtar-blue/10 text-awtar-blue-light transition-colors group-hover:bg-awtar-blue/20">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        {step.icon}
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-awtar-blue/40">
                                    {step.number}
                                </span>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-white">{step.title}</h3>
                            <p className="text-sm leading-relaxed text-awtar-slate">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
