import Link from "next/link";

export default function AdminHome() {
    return (
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-200">
                    Admin Console
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Awtar AI Admin</h1>
                <p className="mt-4 max-w-2xl text-lg text-awtar-slate">
                    Manage recruiters, applicants, jobs, and platform settings. Authentication will
                    be wired to the backend next.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <Link
                        href="/login"
                        className="rounded-xl bg-red-600 px-8 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-red-500"
                    >
                        Admin Login
                    </Link>
                    <Link
                        href="/dashboard"
                        className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        Dashboard (placeholder)
                    </Link>
                </div>
            </div>
        </div>
    );
}
