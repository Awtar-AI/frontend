"use client";

import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { RecruiterRegisterFormData } from "../schemas/recruiter-register.schema";

interface Props {
    form: UseFormReturn<RecruiterRegisterFormData>;
    onNext: () => void;
}

export function Step1PersonalDetails({ form, onNext }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onNext();
            }}
            className="flex flex-col gap-4"
        >
            <div className="space-y-1.5">
                <label htmlFor="s1-fullname" className="text-sm font-semibold text-gray-700">
                    Full Name
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="s1-fullname"
                        type="text"
                        placeholder="John Doe"
                        {...register("fullName")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                {errors.fullName && (
                    <p className="text-xs text-red-600">{errors.fullName.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="s1-email" className="text-sm font-semibold text-gray-700">
                    Work Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="s1-email"
                        type="email"
                        placeholder="john@company.com"
                        {...register("email")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="s1-phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="s1-phone"
                        type="tel"
                        placeholder="+251911234567"
                        {...register("phone")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="s1-password" className="text-sm font-semibold text-gray-700">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="s1-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    <p className="text-xs text-gray-500 font-medium ml-1">
                        Min 8 chars with uppercase, lowercase, number, and symbol.
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] mt-2 flex items-center justify-center gap-2"
            >
                Continue to Organization Info <span aria-hidden="true">→</span>
            </button>

            <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/recruiter/login" className="font-bold text-blue-600 hover:underline">
                    Sign In
                </Link>
            </p>

            <p className="text-center text-xs text-gray-500 leading-relaxed mt-4">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-700">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-gray-700">
                    Privacy Policy
                </Link>
                .
            </p>
        </form>
    );
}
