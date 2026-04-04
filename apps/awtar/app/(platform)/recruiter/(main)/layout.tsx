import { Bell, Search, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AwtarLogo } from "../_components/AwtarLogo";
import { RecruiterSidebarNav } from "./_components/RecruiterSidebarNav";

export default function RecruiterMainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top Navigation */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
                {/* Logo */}
                <div className="w-60 shrink-0">
                    <Link href="/recruiter/dashboard">
                        <AwtarLogo />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl px-8 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Talent"
                            className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-500 transition-shadow"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 shrink-0">
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 ml-1">
                        <Image
                            src="https://i.pravatar.cc/150?img=11"
                            alt="Recruiter Profile"
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 overflow-y-auto">
                    <div className="p-4">
                        <RecruiterSidebarNav />
                    </div>

                    <div className="p-4 mt-auto">
                        <div className="bg-[#1a5eb0] rounded-xl p-5 text-white shadow-lg overflow-hidden relative">
                            <h4 className="text-[10px] font-bold tracking-wider opacity-80 uppercase mb-2">
                                PRO PLAN
                            </h4>
                            <p className="text-sm font-bold leading-tight mb-4 pr-4">
                                Unlock AI-powered application tailoring
                            </p>
                            <button className="w-full bg-white text-blue-600 text-xs font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm relative z-10">
                                Upgrade Now
                            </button>

                            {/* Decorative graphics */}
                            <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
