"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/http";
import { toastService } from "@/lib/services/toast.service";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { useLogin } from "./hooks/use-login";
import { type LoginFormData, validateLoginForm } from "./schemas/login.schema";
import { LoginValidationError } from "./services/login.service";

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const validation = validateLoginForm(formData);
        if (!validation.success) {
            setFieldErrors(validation.errors);
            toastService.error("Please fix the highlighted fields.");
            return;
        }

        setFieldErrors({});
        try {
            await loginMutation.mutateAsync(validation.data);
            toastService.success("Logged in successfully.");
            router.push("/applicant/dashboard");
        } catch (error) {
            if (error instanceof LoginValidationError) {
                setFieldErrors(error.fieldErrors);
                toastService.error("Please check your login details.");
                return;
            }
            if (error instanceof ApiError) {
                const message = error.message || "Failed to log in.";
                toastService.error(message);
                setFieldErrors({ _form: message });
                return;
            }
            toastService.error("Something went wrong. Please try again.");
        }
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
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="example@gmail.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                        {fieldErrors.email && (
                            <p className="text-xs text-red-600">{fieldErrors.email}</p>
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
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                placeholder="••••••••"
                                className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
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
                        {fieldErrors.password && (
                            <p className="text-xs text-red-600">{fieldErrors.password}</p>
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
                            href="/forgot-password"
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
                    {/* {fieldErrors._form && (
						<p className="text-xs text-red-600">{fieldErrors._form}</p>
					)} */}
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
