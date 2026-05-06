"use client";

import { Mail, Save, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateUserPayload } from "../../schemas/profile.schema";

type Props = {
    form: UseFormReturn<UpdateUserPayload>;
    onSubmit: () => void;
    isPending: boolean;
};

export function BasicInfoForm({ form, onSubmit, isPending }: Props) {
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
            className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight">
                    <User className="w-5 h-5 text-blue-600" /> Basic Information
                </h3>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-colors disabled:opacity-60"
                >
                    <Save className="w-4 h-4" />
                    {isPending ? "Saving..." : "Save"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="first_name"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        First Name
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        {...register("first_name")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.first_name && (
                        <p className="text-xs text-red-600">{errors.first_name.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label
                        htmlFor="last_name"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Last Name
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        {...register("last_name")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.last_name && (
                        <p className="text-xs text-red-600">{errors.last_name.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="email"
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                >
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
        </form>
    );
}
