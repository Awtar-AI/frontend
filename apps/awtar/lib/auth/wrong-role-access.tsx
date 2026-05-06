"use client";

import { AlertTriangle, ArrowRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignOut } from "@/lib/hooks/use-signout";

function roleDashboard(role: "candidate" | "hr" | "admin" | null): string {
    if (role === "candidate") return "/applicant/dashboard";
    if (role === "hr" || role === "admin") return "/recruiter/dashboard";
    return "/";
}

type WrongRoleAccessProps = {
    role: "candidate" | "hr" | "admin" | null;
    expectedAreaLabel: string;
    loginPath: string;
};

export function WrongRoleAccess({ role, expectedAreaLabel, loginPath }: WrongRoleAccessProps) {
    const router = useRouter();
    const signOut = useSignOut();

    const targetDashboard = roleDashboard(role);
    const roleLabel =
        role === "candidate"
            ? "Applicant"
            : role === "hr"
              ? "Recruiter"
              : role === "admin"
                ? "Admin"
                : "Unknown";

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
            <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                </div>

                <h1 className="text-2xl font-bold text-red-700">Wrong Role For This Area</h1>
                <p className="mt-2 text-sm text-red-700/90">
                    You are signed in as <span className="font-semibold">{roleLabel}</span>, but
                    this page is for <span className="font-semibold">{expectedAreaLabel}</span>.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => router.push(targetDashboard)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                    >
                        Go To My Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => void signOut({ redirectTo: loginPath })}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
