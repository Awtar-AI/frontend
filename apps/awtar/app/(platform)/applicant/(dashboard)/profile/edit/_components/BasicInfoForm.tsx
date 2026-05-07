"use client";

import { Mail, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateUserPayload } from "../../schemas/profile.schema";

type Props = {
    form: UseFormReturn<UpdateUserPayload>;
    onSubmit: () => void;
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-0.5"
        >
            {children}
        </label>
    );
}

function FieldInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-gray-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all ${className ?? ""}`}
        />
    );
}

export function BasicInfoForm({ form, onSubmit }: Props) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
        >
            <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                </span>
                <h3 className="text-base font-black text-gray-950 tracking-tight">
                    Basic Information
                </h3>
            </div>

            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                        <FieldInput
                            id="first_name"
                            type="text"
                            placeholder="John"
                            {...register("first_name")}
                        />
                        {errors.first_name && (
                            <p className="mt-1.5 text-xs font-bold text-red-500">
                                {errors.first_name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                        <FieldInput
                            id="last_name"
                            type="text"
                            placeholder="Doe"
                            {...register("last_name")}
                        />
                        {errors.last_name && (
                            <p className="mt-1.5 text-xs font-bold text-red-500">
                                {errors.last_name.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <FieldInput
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-11"
                            {...register("email")}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1.5 text-xs font-bold text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}
