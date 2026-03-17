import Link from "next/link";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
                <p className="mt-3 text-awtar-slate">
                    Placeholder page. We’ll connect this to the shared backend login endpoint next.
                </p>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <div className="grid gap-3">
                        <label htmlFor="email" className="text-sm text-awtar-slate">Email</label>
                        <input
                            id="email"
                            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-red-500/40"
                            placeholder="admin@awtar.ai"
                        />
                        <label htmlFor="password" className="mt-3 text-sm text-awtar-slate">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-red-500/40"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="mt-4 h-11 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-500"
                        >
                            Sign in (stub)
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-sm text-awtar-slate">
                    <Link href="/" className="hover:text-white">
                        Back to admin home
                    </Link>
                </div>
            </div>
        </div>
    );
}
