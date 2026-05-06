"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getLoginErrorMessage, useLogin } from "./hooks/use-login";
import { type LoginFormData, loginFormSchema } from "./schemas/login.schema";

export default function AdminLoginPage() {
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
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <div className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-200">
                        Admin Console
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
                    <p className="mt-3 text-awtar-slate">
                        Sign in with an admin account to manage organizations, users, and platform
                        operations.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl shadow-black/20">
                    <form className="grid gap-3" onSubmit={onSubmit}>
                        <label htmlFor="email" className="text-sm text-awtar-slate">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-awtar-slate" />
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-white outline-none transition-colors focus:border-red-500/40"
                                placeholder="admin@awtar.ai"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-300">{errors.email.message}</p>
                        )}

                        <label htmlFor="password" className="mt-3 text-sm text-awtar-slate">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-awtar-slate" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 text-white outline-none transition-colors focus:border-red-500/40"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-awtar-slate transition-colors hover:text-white"
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
                                className="text-sm font-semibold text-red-300 hover:text-white"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="mt-4 h-11 rounded-xl bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-70"
                        >
                            {loginMutation.isPending ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
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
