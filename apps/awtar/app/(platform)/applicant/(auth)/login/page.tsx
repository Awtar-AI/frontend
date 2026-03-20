"use client";

import { Briefcase, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";

export default function LoginPage() {
    const [role, setRole] = useState<"Applicant" | "Recruiter">("Applicant");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/applicant/dashboard");
    };

    return (
        <AuthSplitLayout>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                <p className="text-gray-500 mb-8">
                    Please enter your details to sign in to your account.
                </p>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="rememberMe"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <input
                                id="rememberMe"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 flex items-center gap-4 before:flex-1 before:border-t before:border-gray-200 after:flex-1 after:border-t after:border-gray-200">
                    <span className="text-xs text-gray-400 font-medium">I am a...</span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setRole("Applicant")}
                        className={`py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                            role === "Applicant"
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "border-gray-200 text-gray-400 hover:bg-gray-50 bg-white"
                        }`}
                    >
                        <User className="w-4 h-4" /> Job Seeker
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("Recruiter")}
                        className={`py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                            role === "Recruiter"
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "border-gray-200 text-gray-400 hover:bg-gray-50 bg-white"
                        }`}
                    >
                        <Briefcase className="w-4 h-4" /> Recruiter
                    </button>
                </div>

                <p className="mt-10 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        href="/applicant/register"
                        className="font-bold text-blue-600 hover:underline"
                    >
                        Create an account
                    </Link>
                </p>

                <div className="mt-auto pt-10 flex justify-center gap-6 text-xs text-gray-400 font-medium pb-4">
                    <Link href="/privacy" className="hover:text-gray-600">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-gray-600">
                        Terms of Service
                    </Link>
                    <Link href="/help" className="hover:text-gray-600">
                        Help Center
                    </Link>
                </div>
            </div>
        </AuthSplitLayout>
    );
}
