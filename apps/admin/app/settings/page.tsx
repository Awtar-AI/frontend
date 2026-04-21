"use client";

import { AdminShell } from "../_components/admin-shell";
import { User, Mail, Shield, Key } from "lucide-react";

export default function SettingsPage() {
    return (
        <AdminShell title="Account Settings">
            <div className="grid gap-8 lg:grid-cols-3">
                
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Profile</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6">
                        Manage your admin account details and preferences.
                    </p>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-black shadow-sm">
                                SA
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Super Admin</h4>
                                <p className="text-sm font-medium text-gray-500">System Administrator</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        disabled
                                        value="Super Admin"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-bold text-gray-900 opacity-60 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        disabled
                                        value="admin@awtar.ai"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-bold text-gray-900 opacity-60 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Security</h3>
                    <p className="text-sm font-medium text-gray-500 mb-6">
                        Update your password and secure your account.
                    </p>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <h4 className="font-bold text-gray-900">Password</h4>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
