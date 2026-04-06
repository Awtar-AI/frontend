"use client";

import { Bell, LogOut, Search, Settings, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserAvatar, userAvatarAlt } from "@/applicant/user-me/_components/UserAvatar";
import { applicantDisplayName } from "@/applicant/user-me/schemas/user-me.schema";
import { useAuthUser } from "@/lib/hooks/use-auth";
import { authService } from "@/lib/services/auth.service";

export function Header() {
    const router = useRouter();
    const user = useAuthUser();
    const [activeMenu, setActiveMenu] = useState<"notifications" | "user" | null>(null);

    const toggleMenu = (menu: "notifications" | "user") => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const displayName = user ? applicantDisplayName(user) : "Account";
    const email = user?.email ?? "";

    const handleSignOut = () => {
        setActiveMenu(null);
        authService.logout();
        router.push("/applicant/login");
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-50 relative">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleMenu("notifications")}
                        className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-50"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {activeMenu === "notifications" && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-black text-gray-900">Notifications</h4>
                                <button
                                    type="button"
                                    className="text-[10px] font-black text-blue-600 cursor-pointer hover:underline"
                                >
                                    Mark all as read
                                </button>
                            </div>
                            <div className="space-y-3">
                                {["notif-1", "notif-2"].map((notifId) => (
                                    <button
                                        type="button"
                                        key={notifId}
                                        className="w-full flex gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group border-none text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                Your application for UI/UX Designer was reviewed.
                                            </p>
                                            <p className="text-[10px] font-medium text-gray-400 mt-1">
                                                2 hours ago
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="w-full mt-4 py-2 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                See all notifications
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-50"
                >
                    <Settings className="w-5 h-5" />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleMenu("user")}
                        className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100"
                    >
                        {user ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 relative flex items-center justify-center">
                                <UserAvatar user={user} sizeClassName="w-full h-full text-xs" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        )}
                    </button>

                    {activeMenu === "user" && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="p-3 border-b border-gray-50 mb-1">
                                <p className="text-xs font-black text-gray-900">{displayName}</p>
                                <p className="text-[10px] font-medium text-gray-400 truncate">
                                    {email || "—"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                {[
                                    {
                                        label: "View Profile",
                                        icon: User,
                                        href: "/applicant/profile/public",
                                    },
                                    { label: "Account Settings", icon: Settings, href: "#" },
                                    { label: "Privacy", icon: Shield, href: "#" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors text-xs font-bold text-gray-600 hover:text-gray-900"
                                        onClick={() => setActiveMenu(null)}
                                    >
                                        <item.icon className="w-4 h-4" /> {item.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-1 pt-1 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold text-red-600"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
