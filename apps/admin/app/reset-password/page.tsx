"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getResetPasswordErrorMessage, useResetPassword } from "./hooks/use-reset-password";
import {
    type ResetPasswordFormData,
    resetPasswordFormSchema,
} from "./schemas/reset-password.schema";

function MissingTokenView() {
    return (
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center shadow-2xl shadow-black/20">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                        <ShieldAlert className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Invalid reset link</h1>
                    <p className="mt-4 text-awtar-slate">
                        This password reset link is invalid or has expired. Please request a new
                        one.
                    </p>
                    <div className="mt-8 space-y-3">
                        <Link
                            href="/forgot-password"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                        >
                            Request new link
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-300 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuccessView() {
    return (
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center shadow-2xl shadow-black/20">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
                        <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Password reset!</h1>
                    <p className="mt-4 text-awtar-slate">
                        Your password has been updated successfully. You can now sign in with your
                        new credentials.
                    </p>
                    <Link
                        href="/login"
                        className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AdminResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const mutation = useResetPassword();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    if (!token) return <MissingTokenView />;
    if (mutation.isSuccess) return <SuccessView />;

    const onSubmit = handleSubmit((data) => mutation.mutate({ token, password: data.password }));

    return (
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                <div className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-200">
                        Admin Console
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
                    <p className="mt-3 text-awtar-slate">
                        Choose a strong new password for your admin account.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl shadow-black/20">
                    <form className="grid gap-3" onSubmit={onSubmit}>
                        <label htmlFor="password" className="text-sm text-awtar-slate">
                            New Password
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

                        <label htmlFor="confirmPassword" className="mt-3 text-sm text-awtar-slate">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-awtar-slate" />
                            <input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                {...register("confirmPassword")}
                                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 text-white outline-none transition-colors focus:border-red-500/40"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-awtar-slate transition-colors hover:text-white"
                                aria-label={
                                    showConfirm ? "Hide confirm password" : "Show confirm password"
                                }
                            >
                                {showConfirm ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-300">{errors.confirmPassword.message}</p>
                        )}

                        {mutation.error && (
                            <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{getResetPasswordErrorMessage(mutation.error)}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="mt-4 h-11 rounded-xl bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-70"
                        >
                            {mutation.isPending ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-sm text-awtar-slate">
                    <Link href="/login" className="inline-flex items-center gap-2 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
