"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "../_components/admin-shell";
import { getUsers, updateUserStatus } from "../../lib/api";
import { User } from "../../lib/types";
import { ConfirmModal } from "../_components/confirm-modal";
import { ShieldAlert, ShieldCheck, UserCheck, UserX, Loader2 } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionUser, setActionUser] = useState<User | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        getUsers().then(data => {
            setUsers(data);
            setIsLoading(false);
        });
    }, []);

    const handleToggleStatus = async () => {
        if (!actionUser) return;
        setIsActionLoading(true);
        const newStatus = !actionUser.isActive;
        
        try {
            await updateUserStatus(actionUser.id, newStatus);
            setUsers(users.map(u => u.id === actionUser.id ? { ...u, isActive: newStatus } : u));
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsActionLoading(false);
            setActionUser(null);
        }
    };

    return (
        <AdminShell title="User Management">
            
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                <p className="text-sm text-blue-800 font-medium">
                    <strong className="font-bold">Note:</strong> User access generally follows their Organization bounds. Restrict an organization globally to suspend all of its users at once. Individual user controls here override organization settings.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Name / Email</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Joined</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-blue-50/50">
                                        <td className="px-6 py-4 flex flex-col">
                                            <span className="font-bold text-gray-900">{user.firstName} {user.lastName}</span>
                                            <span className="text-xs text-gray-500 font-medium mt-0.5">{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-md bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-widest">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                                                    <UserCheck className="h-4 w-4" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-red-600 text-xs font-bold uppercase tracking-widest">
                                                    <UserX className="h-4 w-4" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setActionUser(user)}
                                                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors shadow-sm focus:ring-2 ${
                                                    user.isActive 
                                                    ? "border-red-200 bg-white text-red-600 hover:bg-red-50 focus:ring-red-500/20" 
                                                    : "border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500/20"
                                                }`}
                                            >
                                                {user.isActive ? (
                                                    <><ShieldAlert className="h-3 w-3" /> Deactivate</>
                                                ) : (
                                                    <><ShieldCheck className="h-3 w-3" /> Activate</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <ConfirmModal 
                isOpen={actionUser !== null}
                onClose={() => setActionUser(null)}
                onConfirm={handleToggleStatus}
                title={actionUser?.isActive ? "Deactivate User" : "Activate User"}
                description={
                    actionUser?.isActive 
                    ? `Are you sure you want to deactivate ${actionUser.firstName} ${actionUser.lastName}? They will instantly lose access to the system.`
                    : `Activate ${actionUser?.firstName} ${actionUser?.lastName} to grant them full access again?`
                }
                confirmText={actionUser?.isActive ? "Deactivate" : "Activate"}
                isDestructive={actionUser?.isActive}
            />
        </AdminShell>
    );
}
