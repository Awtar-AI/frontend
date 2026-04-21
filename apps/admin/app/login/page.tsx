"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { login } from "../../lib/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await login(email, password);
            localStorage.setItem("admin_token", res.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError("Please enter your credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 font-sans text-gray-900 relative overflow-hidden">
            
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[420px] relative z-10">
                <div className="mb-10 flex flex-col items-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Admin Console</h1>
                    <p className="mt-2 text-gray-500 font-medium text-center">
                        Sign in to manage the Awtar AI platform
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        
                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-600 border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                placeholder="admin@awtar.ai"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Sign in securely"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm font-medium text-gray-400">
                    &copy; {new Date().getFullYear()} Awtar AI. All rights reserved.
                </div>
            </div>
        </div>
    );
}
