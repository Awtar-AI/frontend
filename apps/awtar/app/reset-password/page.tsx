"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSplitLayout } from "@/app/(platform)/applicant/_components/AuthSplitLayout";
import { RecruiterAuthLayout } from "@/app/(platform)/recruiter/_components/RecruiterAuthLayout";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { useResetPassword } from "./hooks/use-reset-password";
import {
    type ResetPasswordFormData,
    resetPasswordFormSchema,
} from "./schemas/reset-password.schema";

type ResetAudience = "candidate" | "recruiter" | "unknown";

function getResetAudience(token: string | null): ResetAudience {
    if (!token) return "unknown";
    const role = decodeJwtPayload(token)?.role;
    if (role === "candidate") return "candidate";
    if (role === "hr" || role === "admin") return "recruiter";
    return "unknown";
}

function ResetLayout({ audience, children }: { audience: ResetAudience; children: ReactNode }) {
    if (audience === "recruiter") {
        return <RecruiterAuthLayout reversed>{children}</RecruiterAuthLayout>;
    }
    return <AuthSplitLayout>{children}</AuthSplitLayout>;
}

function LoginLinks({ audience }: { audience: ResetAudience }) {
    if (audience === "recruiter") {
        return (
            <Link
                href="/recruiter/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Sign in to recruiter account
            </Link>
        );
    }

    if (audience === "candidate") {
        return (
            <Link
                href="/applicant/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Sign in to applicant account
            </Link>
        );
    }

    return (
        <div className="w-full space-y-3">
            <Link
                href="/applicant/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Applicant sign in
            </Link>
            <Link
                href="/recruiter/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold rounded-lg transition-colors"
            >
                Recruiter sign in
            </Link>
        </div>
    );
}

function ForgotLinks({ audience }: { audience: ResetAudience }) {
    if (audience === "recruiter") {
        return (
            <Link
                href="/recruiter/forgot-password"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Request new recruiter link
            </Link>
        );
    }

    if (audience === "candidate") {
        return (
            <Link
                href="/applicant/forgot-password"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Request new applicant link
            </Link>
        );
    }

    return (
        <div className="w-full space-y-3">
            <Link
                href="/applicant/forgot-password"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Applicant forgot password
            </Link>
            <Link
                href="/recruiter/forgot-password"
                className="inline-flex items-center justify-center gap-2 w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold rounded-lg transition-colors"
            >
                Recruiter forgot password
            </Link>
        </div>
    );
}

function BackToLoginLink({ audience }: { audience: ResetAudience }) {
    const href = audience === "recruiter" ? "/recruiter/login" : "/applicant/login";
    const label = audience === "recruiter" ? "Back to recruiter login" : "Back to login";

    if (audience === "unknown") return null;

    return (
        <Link
            href={href}
            className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </Link>
    );
}

function MissingTokenView({ audience }: { audience: ResetAudience }) {
    return (
        <ResetLayout audience={audience}>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <ShieldAlert className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid reset link</h1>
                <p className="text-gray-500 mb-8">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <ForgotLinks audience={audience} />
                <BackToLoginLink audience={audience} />
            </div>
        </ResetLayout>
    );
}

function SuccessView({ audience }: { audience: ResetAudience }) {
    return (
        <ResetLayout audience={audience}>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Password reset!</h1>
                <p className="text-gray-500 mb-8">
                    Your password has been successfully updated. You can now sign in with your new
                    password.
                </p>
                <LoginLinks audience={audience} />
            </div>
        </ResetLayout>
    );
}

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const audience = getResetAudience(token);
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

    if (!token) return <MissingTokenView audience={audience} />;
    if (mutation.isSuccess) return <SuccessView audience={audience} />;

    const onSubmit = handleSubmit((data) => mutation.mutate({ token, password: data.password }));

    return (
        <ResetLayout audience={audience}>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Set new password
                </h1>
                <p className="text-gray-500 mb-8 text-center">
                    Choose a strong new password for your account.
                </p>

                <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-70"
                    >
                        {mutation.isPending ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {audience === "recruiter" ? (
                    <Link
                        href="/recruiter/login"
                        className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to recruiter login
                    </Link>
                ) : audience === "candidate" ? (
                    <Link
                        href="/applicant/login"
                        className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                ) : (
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm font-semibold">
                        <Link href="/applicant/login" className="text-blue-600 hover:text-blue-700">
                            Applicant login
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link href="/recruiter/login" className="text-blue-600 hover:text-blue-700">
                            Recruiter login
                        </Link>
                    </div>
                )}
            </div>
        </ResetLayout>
    );
}
