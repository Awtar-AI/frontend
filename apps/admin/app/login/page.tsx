"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../lib/hooks/use-theme";
import { getLoginErrorMessage, useLogin } from "./hooks/use-login";
import { type LoginFormData, loginFormSchema } from "./schemas/login.schema";

export default function AdminLoginPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const loginMutation = useLogin();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = handleSubmit((data) => loginMutation.mutate(data));

    return (
        <div
            className={`min-h-screen transition-colors ${
                isDark ? "bg-awtar-navy text-awtar-white" : "bg-gray-50 text-gray-900"
            }`}
        >
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <div className="mb-8">
                    <div
                        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                            isDark
                                ? "border-red-500/30 bg-red-500/10 text-red-200"
                                : "border-red-300 bg-red-50 text-red-700"
                        }`}
                    >
                        Admin Console
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
                    <p className={`mt-3 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}>
                        Sign in with an admin account to manage organizations, users, and platform
                        operations.
                    </p>
                </div>

                <div
                    className={`rounded-2xl border p-6 shadow-2xl transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/2 shadow-black/20"
                            : "border-gray-200 bg-white shadow-gray-200/50"
                    }`}
                >
                    <form className="grid gap-3" onSubmit={onSubmit}>
                        <label
                            htmlFor="email"
                            className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-700"}`}
                        >
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                                    isDark ? "text-awtar-slate" : "text-gray-400"
                                }`}
                            />
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className={`h-11 w-full rounded-xl border outline-none transition-colors pl-11 pr-4 ${
                                    isDark
                                        ? "border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-red-500/40"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-awtar-blue/40"
                                }`}
                                placeholder="admin@awtar.ai"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-300">{errors.email.message}</p>
                        )}

                        <label
                            htmlFor="password"
                            className={`mt-3 text-sm ${
                                isDark ? "text-awtar-slate" : "text-gray-700"
                            }`}
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                                    isDark ? "text-awtar-slate" : "text-gray-400"
                                }`}
                            />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className={`h-11 w-full rounded-xl border outline-none transition-colors pl-11 pr-11 ${
                                    isDark
                                        ? "border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-red-500/40"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-awtar-blue/40"
                                }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                                    isDark
                                        ? "text-awtar-slate hover:text-white"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-300">{errors.password.message}</p>
                        )}

                        {loginMutation.error && (
                            <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{getLoginErrorMessage(loginMutation.error)}</span>
                            </div>
                        )}

                        <div className="mt-1 flex justify-end">
                            <Link
                                href="/forgot-password"
                                className={`text-sm font-semibold ${
                                    isDark
                                        ? "text-red-300 hover:text-white"
                                        : "text-red-600 hover:text-red-700"
                                }`}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className={`mt-4 h-11 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 ${
                                isDark
                                    ? "bg-red-600 text-white hover:bg-red-500"
                                    : "bg-awtar-blue text-white hover:bg-awtar-blue/90"
                            }`}
                        >
                            {loginMutation.isPending ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                <div className={`mt-6 text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}>
                    <Link href="/" className={isDark ? "hover:text-white" : "hover:text-gray-900"}>
                        Back to admin home
                    </Link>
                </div>
            </div>
        </div>
    );
}
