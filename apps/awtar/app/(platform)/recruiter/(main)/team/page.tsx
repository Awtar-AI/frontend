"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthOrganizationId } from "@/lib/hooks/use-auth";
import { useInviteHr } from "./hooks/use-invite-hr";
import { useOrganizationEmployees } from "./hooks/use-organization-employees";
import { type InviteHrFormData, inviteHrFormSchema } from "./schemas/team.schema";

export default function TeamMembersPage() {
    const organizationId = useAuthOrganizationId();
    const inviteMutation = useInviteHr(organizationId);
    const employeesQuery = useOrganizationEmployees(organizationId);
    const [lastInvitedEmail, setLastInvitedEmail] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteHrFormData>({
        resolver: zodResolver(inviteHrFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const onSubmit = handleSubmit((data) => {
        inviteMutation.mutate(data, {
            onSuccess: () => {
                setLastInvitedEmail(data.email.trim());
                reset();
            },
        });
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Invite HR teammates and manage the people already connected to your
                        organization.
                    </p>
                </div>
            </div>

            {!organizationId && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Your active organization could not be determined from the current session.
                    Please sign out and sign in again before sending invitations.
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Invite a new HR teammate
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                They&apos;ll receive an email with a secure link to complete their
                                account setup.
                            </p>
                        </div>
                    </div>

                    {lastInvitedEmail && (
                        <div className="mb-4 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                            Invitation sent to{" "}
                            <span className="font-semibold">{lastInvitedEmail}</span>. They can
                            finish signup from the email link.
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="invite-first-name"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    First name
                                </label>
                                <input
                                    id="invite-first-name"
                                    type="text"
                                    {...register("firstName")}
                                    placeholder="Sarah"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-red-600">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="invite-last-name"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Last name
                                </label>
                                <input
                                    id="invite-last-name"
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Jenkins"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-red-600">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="invite-email"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Work email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="invite-email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="sarah@company.com"
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
                            The invite email should send them to ` /accept-invitation?token=... ` so
                            they can create their HR account.
                        </div>

                        <button
                            type="submit"
                            disabled={!organizationId || inviteMutation.isPending}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                        >
                            {inviteMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending invite...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Send invitation
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Acceptance workflow
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                What happens after you send the invite.
                            </p>
                        </div>
                    </div>
                    <ol className="space-y-4 text-sm text-gray-600">
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                                1
                            </span>
                            <span>The invited person opens the secure email link.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                                2
                            </span>
                            <span>
                                They complete the public HR acceptance form with their password.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                                3
                            </span>
                            <span>
                                We create the HR user through `POST /users/create?token=...`.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                                4
                            </span>
                            <span>
                                They sign in from the recruiter login page and join the team.
                            </span>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">
                        Current organization members
                    </h2>
                    <span className="text-xs font-bold text-gray-500">
                        {employeesQuery.data?.length ?? 0} Total
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Name", "Email Address", "Role"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employeesQuery.isLoading && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-10 text-center text-sm text-gray-400"
                                    >
                                        <div className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading team members...
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {employeesQuery.isError && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-10 text-center text-sm text-red-500"
                                    >
                                        We couldn&apos;t load your organization members right now.
                                    </td>
                                </tr>
                            )}
                            {employeesQuery.data?.map((member) => (
                                <tr
                                    key={member.user_id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                                {member.first_name[0]}
                                                {member.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {member.first_name} {member.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Organization member
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {member.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                                            {member.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!employeesQuery.isLoading &&
                                !employeesQuery.isError &&
                                !employeesQuery.data?.length && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-12 text-center text-sm text-gray-400"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="h-5 w-5" />
                                                <span>No HR team members found yet.</span>
                                            </div>
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
