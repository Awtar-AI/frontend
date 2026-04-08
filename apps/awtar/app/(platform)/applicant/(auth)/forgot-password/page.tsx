"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { useForgotPassword } from "./hooks/use-forgot-password";
import {
    type ForgotPasswordFormData,
    forgotPasswordFormSchema,
} from "./schemas/forgot-password.schema";

export default function ForgotPasswordPage() {
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

    if (mutation.isSuccess) {
        return (
            <AuthSplitLayout>
                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MailCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h1>
                    <p className="text-gray-500 mb-8">
                        We sent a password reset link to{" "}
                        <span className="font-semibold text-gray-700">{getValues("email")}</span>.
                        Click the link in the email to reset your password.
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        Didn&apos;t receive the email? Check your spam folder or{" "}
                        <button
                            type="button"
                            onClick={() => mutation.reset()}
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            try again
                        </button>
                        .
                    </p>
                    <Link
                        href="/applicant/login"
                        className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Forgot your password?
                </h1>
                <p className="text-gray-500 mb-8 text-center">
                    No worries. Enter your email address and we&apos;ll send you a link to reset
                    your password.
                </p>

                <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="example@gmail.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-70"
                    >
                        {mutation.isPending ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <Link
                    href="/applicant/login"
                    className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mx-auto"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </AuthSplitLayout>
    );
}
