"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { getForgotPasswordErrorMessage, useForgotPassword } from "./hooks/use-forgot-password";
import {
    type ForgotPasswordFormData,
    forgotPasswordFormSchema,
} from "./schemas/forgot-password.schema";

export default function AdminForgotPasswordPage() {
    const mutation = useForgotPassword();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = handleSubmit((data) => mutation.mutate(data));

    return (
        <div className="min-h-screen bg-awtar-navy text-awtar-white">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
                {mutation.isSuccess ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center shadow-2xl shadow-black/20">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
                            <MailCheck className="h-8 w-8 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
                        <p className="mt-4 text-awtar-slate">
                            We sent a password reset link to{" "}
                            <span className="font-semibold text-awtar-white">
                                {getValues("email")}
                            </span>
                            .
                        </p>
                        <p className="mt-3 text-sm text-awtar-slate">
                            Didn&apos;t receive it? Check your spam folder or{" "}
                            <button
                                type="button"
                                onClick={() => mutation.reset()}
                                className="font-semibold text-red-300 hover:text-white"
                            >
                                try again
                            </button>
                            .
                        </p>
                        <Link
                            href="/login"
                            className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-300 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-200">
                                Admin Console
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Forgot your password?
                            </h1>
                            <p className="mt-3 text-awtar-slate">
                                Enter your admin email and we&apos;ll send you a reset link.
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

                                {mutation.error && (
                                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{getForgotPasswordErrorMessage(mutation.error)}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="mt-4 h-11 rounded-xl bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-70"
                                >
                                    {mutation.isPending ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 text-sm text-awtar-slate">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
