import type { ReactNode } from "react";
import { RecruiterSidebarNav } from "./_components/RecruiterSidebarNav";
import { RecruiterTopHeader } from "./_components/RecruiterTopHeader";

export default function RecruiterMainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <RecruiterTopHeader />

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
