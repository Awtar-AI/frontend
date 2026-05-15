"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getLoginErrorMessage, useLogin } from "../hooks/use-login";
import { type LoginFormData, loginFormSchema } from "../schemas/login.schema";

export function LoginContent() {
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
    <div className="flex min-h-screen font-sans">
      <div className="flex-1 flex flex-col bg-white">
        <main className="flex-1 flex flex-col px-8 py-12 lg:px-16 lg:py-16 max-w-2xl w-full mx-auto">
          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
                Admin Console
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-500 mb-8">
                Please enter your details to sign in to your admin account.
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="admin@company.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginMutation.error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{getLoginErrorMessage(loginMutation.error)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label
                  htmlFor="rememberMe"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
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
            </form>

            <p className="mt-10 text-center text-sm text-gray-600">
              Access is restricted to authorized admins only.
            </p>

            <div className="mt-auto pt-10 flex justify-center gap-6 text-xs text-gray-400 font-medium pb-4">
              <Link href="/" className="hover:text-gray-600">
                Back to home
              </Link>
              <Link href="/forgot-password" className="hover:text-gray-600">
                Forgot password
              </Link>
            </div>
          </div>
        </main>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#091122] relative flex-col overflow-hidden">
        <div className="relative z-10 px-10 pt-8 pb-4 flex items-center justify-end">
          <Link
            href="/"
            className="text-xl font-bold text-white tracking-tight"
          >
            Awtar AI Admin
          </Link>
        </div>

        <div className="flex flex-col flex-1 justify-center px-10 lg:pl-16 -translate-y-10">
          <div className="max-w-xl mb-10 ml-20 -mt-30">
            <div className="relative w-52 h-52 xl:w-56 xl:h-56 mb-6">
              <div className="absolute inset-0 rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(37,99,235,0.2)]">
                <div className="w-40 h-40 rounded-full border border-blue-400/50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/40 blur-xl" />
                </div>
              </div>
              <div className="absolute inset-x-0 h-full rounded-full border border-blue-400/20 rotate-45" />
              <div className="absolute inset-x-0 h-full rounded-full border border-blue-400/20 -rotate-45" />
              <div className="absolute inset-x-0 h-full rounded-full border border-blue-400/20 rotate-90" />
            </div>

            <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              Manage the platform
              <br />
              with confidence.
            </h1>

            <p className="text-base text-blue-100/70 leading-relaxed font-light max-w-md">
              Admin tools for users, organizations, and platform operations in
              one focused workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={`admin-trust-${i}`}
                  className="w-10 h-10 rounded-full bg-gray-300 border-2 border-[#091122] overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400/80 to-blue-700/80" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-blue-100/60">
              Secure admin access for internal teams
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
