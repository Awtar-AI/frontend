"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { useLogin } from "./hooks/use-login";
import { type LoginFormData, loginFormSchema } from "./schemas/login.schema";

export default function LoginPage() {
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
        <AuthSplitLayout>
            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                <p className="text-gray-500 mb-8">
                    Please enter your details to sign in to your account.
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
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password.message}</p>
                        )}
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
                            href="/applicant/forgot-password"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-70"
                    >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-10 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
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
