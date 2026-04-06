"use client";

import { RotateCw, UserPlus } from "lucide-react";
import { useState } from "react";

type Invitation = {
    id: number;
    email: string;
    role: string;
    sentDate: string;
    status: "Pending" | "Expired";
};

const INITIAL_INVITATIONS: Invitation[] = [
    {
        id: 1,
        email: "michael.ross@design.co",
        role: "Recruiter",
        sentDate: "Oct 12, 2023",
        status: "Pending",
    },
    {
        id: 2,
        email: "lisa.vogel@tech.io",
        role: "Admin",
        sentDate: "Oct 08, 2023",
        status: "Pending",
    },
    {
        id: 3,
        email: "david.wu@global.net",
        role: "Reviewer",
        sentDate: "Sep 24, 2023",
        status: "Expired",
    },
];

const ROLES = ["Recruiter", "Admin", "Reviewer", "Viewer"];

export default function TeamMembersPage() {
    const [invitations, setInvitations] = useState<Invitation[]>(INITIAL_INVITATIONS);
    const [form, setForm] = useState({ name: "", email: "", role: "Recruiter" });
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const [successMsg, setSuccessMsg] = useState("");

    const validate = () => {
        const errs: typeof errors = {};
        if (!form.name.trim()) errs.name = "Full name is required.";
        if (!form.email.trim()) errs.email = "Work email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = "Enter a valid email address.";
        return errs;
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        const newInvite: Invitation = {
            id: Date.now(),
            email: form.email.trim(),
            role: form.role,
            sentDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
            status: "Pending",
        };
        setInvitations([newInvite, ...invitations]);
        setForm({ name: "", email: "", role: "Recruiter" });
        setErrors({});
        setSuccessMsg(`Invitation sent to ${newInvite.email}!`);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const resendInvite = (id: number) => {
        setInvitations(
            invitations.map((inv) =>
                inv.id === id
                    ? {
                          ...inv,
                          status: "Pending",
                          sentDate: new Date().toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                          }),
                      }
                    : inv,
            ),
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and invite recruiters to your talent acquisition team.
                    </p>
                </div>
                <button
                    onClick={() =>
                        document
                            .getElementById("invite-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <UserPlus className="w-4 h-4" /> Invite New Recruiter
                </button>
            </div>

            {/* Invite Form */}
            <div
                id="invite-form"
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
                <h2 className="text-base font-bold text-gray-900 mb-1">Invite New Recruiter</h2>
                <p className="text-xs text-gray-500 mb-5">
                    New members will receive an email invitation to join your workspace.
                </p>

                {successMsg && (
                    <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-lg">
                        ✓ {successMsg}
                    </div>
                )}

                <form onSubmit={handleSend}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sarah Jenkins"
                                value={form.name}
                                onChange={(e) => {
                                    setForm({ ...form, name: e.target.value });
                                    setErrors({ ...errors, name: undefined });
                                }}
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-300 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                            />
                            {errors.name && (
                                <p className="text-[11px] text-red-500 mt-1 font-medium">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Work Email
                            </label>
                            <input
                                type="email"
                                placeholder="sarah@company.com"
                                value={form.email}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    setErrors({ ...errors, email: undefined });
                                }}
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-300 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                            />
                            {errors.email && (
                                <p className="text-[11px] text-red-500 mt-1 font-medium">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Role
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {ROLES.map((r) => (
                                    <option key={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" /> Send Invitation
                        </button>
                    </div>
                </form>
            </div>

            {/* Pending Invitations Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Pending Invitations</h2>
                    <span className="text-xs font-bold text-gray-500">
                        {invitations.length} Total
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Email Address", "Role", "Sent Date", "Status", "Action"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
                                        >
                                            {h}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invitations.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                        {inv.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{inv.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {inv.sentDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                inv.status === "Pending"
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-red-50 text-red-500"
                                            }`}
                                        >
                                            • {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => resendInvite(inv.id)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Resend Invite"
                                        >
                                            <RotateCw className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {invitations.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-sm text-gray-400"
                                    >
                                        No pending invitations. Send one above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
