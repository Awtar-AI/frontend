import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { RegisterFormData } from "../schemas/register.schema";

export function Step1AccountDetails({
    formData,
    setFormData,
    onNext,
    errors,
}: {
    formData: RegisterFormData;
    setFormData: (data: RegisterFormData) => void;
    onNext: () => void;
    errors?: Record<string, string>;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const liveConfirmPasswordError = useMemo(() => {
        if (!formData.password || !formData.confirmPassword) {
            return "";
        }
        return formData.password === formData.confirmPassword ? "" : "Passwords do not match";
    }, [formData.password, formData.confirmPassword]);

    return (
        <form
            className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500"
            onSubmit={(e) => {
                e.preventDefault();
                onNext();
            }}
        >
            <div>
                <h3 className="text-2xl font-bold mb-1 text-gray-900 tracking-tight">
                    Let&apos;s get started
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                    Enter your basic information to create your applicant profile.
                </p>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                    Full Name
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                    />
                </div>
                {errors?.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
            </div>

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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                    />
                </div>
                {errors?.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-4">
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
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    {errors?.password && <p className="text-xs text-red-600">{errors.password}</p>}
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
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            placeholder="••••••••"
                            className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors?.confirmPassword ? (
                        <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                    ) : (
                        liveConfirmPasswordError && (
                            <p className="text-xs text-red-600">{liveConfirmPasswordError}</p>
                        )
                    )}
                </div>
            </div>

            <div className="flex items-start gap-3 py-2">
                <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </label>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mt-2 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
                Continue to Next Step &rarr;
            </button>
            {errors?._form && <p className="text-xs text-red-600">{errors._form}</p>}

            <div className="mt-8 flex items-center gap-4 before:flex-1 before:border-t before:border-gray-200 after:flex-1 after:border-t after:border-gray-200">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Or sign up with
                </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                    type="button"
                    className="py-2.5 px-4 rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                    <Image
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                    />{" "}
                    Google
                </button>
                <button
                    type="button"
                    className="py-2.5 px-4 rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                    <div className="w-4 h-4 bg-[#0A66C2] text-white flex items-center justify-center rounded-[2px] text-[10px] font-bold">
                        in
                    </div>{" "}
                    LinkedIn
                </button>
            </div>
        </form>
    );
}
