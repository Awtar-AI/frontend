"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, ShieldAlert, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { RecruiterAuthLayout } from "@/app/(platform)/recruiter/_components/RecruiterAuthLayout";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { useAcceptInvitation } from "./hooks/use-accept-invitation";
import {
    type AcceptInvitationFormData,
    acceptInvitationFormSchema,
} from "./schemas/accept-invitation.schema";

function readStringClaim(payload: Record<string, unknown> | null, keys: string[]): string {
    for (const key of keys) {
        const value = payload?.[key];
        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }
    return "";
}

function MissingTokenView() {
    return (
        <RecruiterAuthLayout reversed>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <ShieldAlert className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid invitation link</h1>
                <p className="text-gray-500 mb-8">
                    This invitation link is invalid or missing the required token. Ask your HR admin
                    to resend the invitation.
                </p>
                <Link
                    href="/recruiter/login"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                >
                    Back to sign in
                </Link>
            </div>
        </RecruiterAuthLayout>
    );
}

function SuccessView() {
    return (
        <RecruiterAuthLayout reversed>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invitation accepted</h1>
                <p className="text-gray-500 mb-8">
                    Your HR account has been created successfully. You can now sign in to access
                    your recruiter workspace.
                </p>
                <Link
                    href="/recruiter/login"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                >
                    Sign in
                </Link>
            </div>
        </RecruiterAuthLayout>
    );
}

export default function AcceptInvitationPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const mutation = useAcceptInvitation({ token: token ?? "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const invitationPrefill = useMemo(() => {
        const payload = token ? decodeJwtPayload(token) : null;
        return {
            firstName: readStringClaim(payload, ["first_name", "FirstName", "firstName"]),
            lastName: readStringClaim(payload, ["last_name", "LastName", "lastName"]),
            email: readStringClaim(payload, ["email", "Email"]),
        };
    }, [token]);
    const isNameLocked = Boolean(invitationPrefill.firstName || invitationPrefill.lastName);
    const isEmailLocked = Boolean(invitationPrefill.email);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AcceptInvitationFormData>({
        resolver: zodResolver(acceptInvitationFormSchema),
        defaultValues: {
            firstName: invitationPrefill.firstName,
            lastName: invitationPrefill.lastName,
            email: invitationPrefill.email,
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        reset({
            firstName: invitationPrefill.firstName,
            lastName: invitationPrefill.lastName,
            email: invitationPrefill.email,
            password: "",
            confirmPassword: "",
        });
    }, [invitationPrefill.email, invitationPrefill.firstName, invitationPrefill.lastName, reset]);

    if (!token) return <MissingTokenView />;
    if (mutation.isSuccess) return <SuccessView />;

    const onSubmit = handleSubmit((data) => mutation.mutate(data));

    return (
        <RecruiterAuthLayout reversed>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Accept your invitation
                </h1>
                <p className="text-gray-500 mb-8 text-center">
                    Complete your HR account setup to join your organization&apos;s recruiter
                    workspace.
                </p>

                <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="firstName"
                                className="text-sm font-semibold text-gray-700"
                            >
                                First Name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                {...register("firstName")}
                                placeholder="Sarah"
                                readOnly={isNameLocked}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all read-only:bg-gray-50 read-only:text-gray-600 read-only:cursor-not-allowed"
                            />
                            {errors.firstName && (
                                <p className="text-xs text-red-600">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="lastName"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                {...register("lastName")}
                                placeholder="Jenkins"
                                readOnly={isNameLocked}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all read-only:bg-gray-50 read-only:text-gray-600 read-only:cursor-not-allowed"
                            />
                            {errors.lastName && (
                                <p className="text-xs text-red-600">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Work Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="sarah@company.com"
                            readOnly={isEmailLocked}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all read-only:bg-gray-50 read-only:text-gray-600 read-only:cursor-not-allowed"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            Password
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
                        {errors.password ? (
                            <p className="text-xs text-red-600">{errors.password.message}</p>
                        ) : (
                            <p className="text-xs text-gray-500">
                                Use at least 8 characters with uppercase, lowercase, number, and
                                symbol.
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Confirm Password
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
                                aria-label={
                                    showConfirm ? "Hide confirm password" : "Show confirm password"
                                }
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
                        {mutation.isPending ? "Creating account..." : "Create HR account"}
                    </button>
                </form>

                <Link
                    href="/recruiter/login"
                    className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mx-auto"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </RecruiterAuthLayout>
    );
}
