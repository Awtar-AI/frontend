"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../../_components/admin-shell";
import { useCreateUser } from "../hooks/use-create-user";
import { type CreateUserPayload, createUserSchema, type UserRole } from "../schemas/users.schema";

// Components for different role forms

function AdminUserForm({
    form,
    isDark,
}: {
    form: UseFormReturn<CreateUserPayload>;
    isDark: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-4">
            <div>
                <label
                    htmlFor="admin-email"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="admin-email"
                    {...form.register("email")}
                    type="email"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="admin@example.com"
                />
                {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="admin-first-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    First Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="admin-first-name"
                    {...form.register("first_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="John"
                />
                {form.formState.errors.first_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.first_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="admin-last-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Last Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="admin-last-name"
                    {...form.register("last_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Doe"
                />
                {form.formState.errors.last_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.last_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="admin-password"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="admin-password"
                        {...form.register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`w-full rounded-xl border px-4 py-3 pr-12 placeholder-awtar-slate focus:outline-none transition-colors ${
                            isDark
                                ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                                : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                        }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                            isDark
                                ? "text-awtar-slate hover:text-white"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
                {form.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>
        </div>
    );
}

function HrUserForm({ form, isDark }: { form: UseFormReturn<CreateUserPayload>; isDark: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const documents = form.watch("business_documents") || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const current = [...documents];
        for (const file of Array.from(files)) {
            if (current.length >= 3) break;
            if (!current.some((f: File) => f.name === file.name && f.size === file.size)) {
                current.push(file);
            }
        }
        form.setValue("business_documents", current, { shouldValidate: true });
        e.target.value = ""; // Reset input
    };

    const removeFile = (index: number) => {
        const current = [...documents];
        current.splice(index, 1);
        form.setValue("business_documents", current, { shouldValidate: true });
    };

    return (
        <div className="space-y-4">
            <div>
                <label
                    htmlFor="hr-email"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-email"
                    {...form.register("email")}
                    type="email"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="hr@company.com"
                />
                {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-first-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    First Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-first-name"
                    {...form.register("first_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Jane"
                />
                {form.formState.errors.first_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.first_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-last-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Last Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-last-name"
                    {...form.register("last_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Smith"
                />
                {form.formState.errors.last_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.last_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-password"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="hr-password"
                        {...form.register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`w-full rounded-xl border px-4 py-3 pr-12 placeholder-awtar-slate focus:outline-none transition-colors ${
                            isDark
                                ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                                : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                        }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                            isDark
                                ? "text-awtar-slate hover:text-white"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
                {form.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-phone"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Phone <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-phone"
                    {...form.register("phone")}
                    type="tel"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="+1234567890"
                />
                {form.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.phone.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-org-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-org-name"
                    {...form.register("organization_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Acme Corp"
                />
                {form.formState.errors.organization_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.organization_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-website-url"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Website URL <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-website-url"
                    {...form.register("website_url")}
                    type="url"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="https://acme.com"
                />
                {form.formState.errors.website_url && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.website_url.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-industry"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Industry <span className="text-red-500">*</span>
                </label>
                <select
                    id="hr-industry"
                    {...form.register("industry")}
                    className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                >
                    <option value="">Select industry</option>
                    <option value="Tech">Technology</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                </select>
                {form.formState.errors.industry && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.industry.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-org-size"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Organization Size <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-org-size"
                    {...form.register("organization_size", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="50"
                />
                {form.formState.errors.organization_size && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.organization_size.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-linkedin-url"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    LinkedIn URL
                </label>
                <input
                    id="hr-linkedin-url"
                    {...form.register("linkedin_url")}
                    type="url"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="https://linkedin.com/company/acme"
                />
                {form.formState.errors.linkedin_url && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.linkedin_url.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="hr-business-docs"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Business Documents <span className="text-red-500">*</span>
                </label>
                <input
                    id="hr-business-docs"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className={`w-full rounded-xl border px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-sm file:text-white focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white file:bg-awtar-blue focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 file:bg-awtar-blue focus:border-awtar-blue"
                    }`}
                />
                {documents.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {documents.map((file: File) => (
                            <div
                                key={`${file.name}-${file.size}`}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                                    isDark ? "bg-white/5" : "bg-gray-100"
                                }`}
                            >
                                <span
                                    className={`text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                    {file.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-400 hover:text-red-300 ml-2"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {form.formState.errors.business_documents && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.business_documents.message}
                    </p>
                )}
            </div>
        </div>
    );
}

function ApplicantUserForm({
    form,
    isDark,
}: {
    form: UseFormReturn<CreateUserPayload>;
    isDark: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-4">
            <div>
                <label
                    htmlFor="candidate-email"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="candidate-email"
                    {...form.register("email")}
                    type="email"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="candidate@example.com"
                />
                {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-first-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    First Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="candidate-first-name"
                    {...form.register("first_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="John"
                />
                {form.formState.errors.first_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.first_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-last-name"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Last Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="candidate-last-name"
                    {...form.register("last_name")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Doe"
                />
                {form.formState.errors.last_name && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.last_name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-password"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="candidate-password"
                        {...form.register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`w-full rounded-xl border px-4 py-3 pr-12 placeholder-awtar-slate focus:outline-none transition-colors ${
                            isDark
                                ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                                : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                        }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                            isDark
                                ? "text-awtar-slate hover:text-white"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
                {form.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-job-title"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Current Job Title
                </label>
                <input
                    id="candidate-job-title"
                    {...form.register("current_job_title")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Software Engineer"
                />
                {form.formState.errors.current_job_title && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.current_job_title.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-years-exp"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Years of Experience
                </label>
                <input
                    id="candidate-years-exp"
                    {...form.register("years_of_experience", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="3"
                />
                {form.formState.errors.years_of_experience && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.years_of_experience.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-education"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Education Level
                </label>
                <select
                    id="candidate-education"
                    {...form.register("education_level")}
                    className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                >
                    <option value="">Select education level</option>
                    <option value="high_school">High School</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="self_taught">Self-Taught</option>
                    <option value="other">Other</option>
                </select>
                {form.formState.errors.education_level && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.education_level.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-skills"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Primary Skills (comma-separated)
                </label>
                <input
                    id="candidate-skills"
                    {...form.register("primary_skills")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="JavaScript, React, Node.js"
                />
                {form.formState.errors.primary_skills && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.primary_skills.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-linkedin"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    LinkedIn URL
                </label>
                <input
                    id="candidate-linkedin"
                    {...form.register("linkedin_url")}
                    type="url"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="https://linkedin.com/in/username"
                />
                {form.formState.errors.linkedin_url && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.linkedin_url.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-location"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Location
                </label>
                <input
                    id="candidate-location"
                    {...form.register("location")}
                    type="text"
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="New York, NY"
                />
                {form.formState.errors.location && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.location.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-summary"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Professional Summary
                </label>
                <textarea
                    id="candidate-summary"
                    {...form.register("professional_summary")}
                    rows={3}
                    className={`w-full rounded-xl border px-4 py-3 placeholder-awtar-slate focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-awtar-blue"
                    }`}
                    placeholder="Brief summary of professional background..."
                />
                {form.formState.errors.professional_summary && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.professional_summary.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="candidate-resume"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                    Resume
                </label>
                <input
                    id="candidate-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => form.setValue("resume", e.target.files?.[0] ?? null)}
                    className={`w-full rounded-xl border px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-sm file:text-white focus:outline-none transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white file:bg-awtar-blue focus:border-awtar-blue"
                            : "border-gray-200 bg-gray-50 text-gray-900 file:bg-awtar-blue focus:border-awtar-blue"
                    }`}
                />
                {form.formState.errors.resume && (
                    <p className="mt-1 text-sm text-red-400">
                        {form.formState.errors.resume.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function CreateUserPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const createUserMutation = useCreateUser();
    const [selectedRole, setSelectedRole] = useState<UserRole | "">("");

    const form = useForm<CreateUserPayload>({
        resolver: zodResolver(createUserSchema),
        mode: "onTouched",
    });

    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role);
        form.reset();
        form.setValue("role", role);
    };

    const onSubmit = form.handleSubmit(async (data) => {
        try {
            await createUserMutation.mutateAsync(data);
            router.push("/users");
        } catch (error) {
            console.error("Failed to create user:", error);
        }
    });

    const renderRoleForm = () => {
        switch (selectedRole) {
            case "admin":
                return <AdminUserForm form={form} isDark={isDark} />;
            case "hr":
                return <HrUserForm form={form} isDark={isDark} />;
            case "candidate":
                return <ApplicantUserForm form={form} isDark={isDark} />;
            default:
                return null;
        }
    };

    return (
        <AdminShell>
            <div
                className={`max-w-2xl mx-auto transition-colors ${
                    isDark ? "bg-black/20" : "bg-gray-50"
                }`}
            >
                <div className="mb-6">
                    <Link
                        href="/users"
                        className={`inline-flex items-center gap-2 transition-colors ${
                            isDark
                                ? "text-awtar-slate hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Link>
                </div>

                <div
                    className={`rounded-xl border p-6 transition-colors ${
                        isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"
                    }`}
                >
                    <div
                        className={`flex items-center gap-3 mb-6 ${isDark ? "text-awtar-blue" : "text-red-500"}`}
                    >
                        <UserPlus className="h-6 w-6" />
                        <h1
                            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                            Create New User
                        </h1>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="user-role"
                                className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                                User Role <span className="text-red-500">*</span>
                            </label>
                            <fieldset id="user-role" className="grid grid-cols-3 gap-3">
                                {[
                                    { value: "admin", label: "Admin" },
                                    { value: "hr", label: "Recruiter" },
                                    { value: "candidate", label: "Applicant" },
                                ].map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => handleRoleChange(role.value as UserRole)}
                                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                                            selectedRole === role.value
                                                ? isDark
                                                    ? "border-awtar-blue bg-awtar-blue/10 text-awtar-blue"
                                                    : "border-red-500 bg-red-50 text-red-600"
                                                : isDark
                                                  ? "border-white/10 bg-white/5 text-awtar-slate hover:border-white/20 hover:bg-white/10"
                                                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </fieldset>
                        </div>

                        {selectedRole && (
                            <>
                                {renderRoleForm()}

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={createUserMutation.isPending}
                                        className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isDark
                                                ? "bg-awtar-blue text-white hover:bg-awtar-blue-light"
                                                : "bg-red-500 text-white hover:bg-red-600"
                                        }`}
                                    >
                                        {createUserMutation.isPending
                                            ? "Creating..."
                                            : "Create User"}
                                    </button>
                                    <Link
                                        href="/users"
                                        className={`rounded-xl border px-6 py-3 text-sm font-medium transition-colors ${
                                            isDark
                                                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                                : "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                                        }`}
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </AdminShell>
    );
}
